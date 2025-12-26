
import { GoogleGenAI } from '@google/genai';
import { AIConfig, ExamConfig, ExamQuestion, QuestionBlueprint } from '../types';
import { 
    EXAM_SYS_PROMPT, 
    BLUEPRINT_PROMPT, 
    GENERATOR_PROMPT, 
    GRADER_PROMPT,
    EXAM_GRADER_SYS_PROMPT,
    EXAM_REPORT_PROMPT
} from './prompts';
import { sanitizeError, extractJsonFromText, safeJsonParse } from './utils';

// Helper to get text from API response (Unified for OpenAI/Gemini)
// Note: This duplicates some logic from geminiService but isolates exam dependencies.
const callAI = async (config: AIConfig, prompt: string, sysPrompt?: string): Promise<string> => {
    try {
        if (config.provider === 'openai') {
            const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.modelId || 'gpt-4o-mini',
                    messages: [
                        ...(sysPrompt ? [{ role: "system", content: sysPrompt }] : []),
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            return data.choices?.[0]?.message?.content || "";
        } else {
            const ai = new GoogleGenAI({ apiKey: config.apiKey });
            const model = config.modelId || 'gemini-2.5-flash';
            const result = await ai.models.generateContent({
                model: model,
                contents: { parts: [{ text: prompt }] },
                config: { systemInstruction: sysPrompt }
            });
            return result.text || "";
        }
    } catch (e: any) {
        throw new Error("AI Service Error: " + sanitizeError(e));
    }
};

const callAIStream = async (config: AIConfig, prompt: string, sysPrompt: string, onChunk: (text: string) => void): Promise<string> => {
    // Simplified stream implementation for reports
    try {
        if (config.provider === 'openai') {
             // Reuse OpenAI stream logic or simplified fetch
             const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
             const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
                body: JSON.stringify({
                    model: config.modelId || 'gpt-4o-mini',
                    messages: [{ role: "system", content: sysPrompt }, { role: "user", content: prompt }],
                    stream: true
                })
            });
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            if(reader) {
                while(true) {
                    const {done, value} = await reader.read();
                    if(done) break;
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    for(const line of lines) {
                        if(line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const content = JSON.parse(line.slice(6)).choices[0]?.delta?.content || "";
                                if(content) { fullText+=content; onChunk(content); }
                            } catch(e){}
                        }
                    }
                }
            }
            return fullText;
        } else {
            const ai = new GoogleGenAI({ apiKey: config.apiKey });
            const model = config.modelId || 'gemini-2.5-flash';
            const result = await ai.models.generateContentStream({
                model: model,
                contents: { parts: [{ text: prompt }] },
                config: { systemInstruction: sysPrompt }
            });
            let fullText = "";
            for await (const chunk of result) {
                const text = chunk.text;
                if (text) { fullText += text; onChunk(text); }
            }
            return fullText;
        }
    } catch(e: any) {
        throw new Error("Stream Error: " + sanitizeError(e));
    }
}

// 1. Generate Exam Blueprint
export const generateExamBlueprint = async (config: ExamConfig, aiConfig: AIConfig): Promise<QuestionBlueprint[]> => {
    try {
        const prompt = BLUEPRINT_PROMPT(config);
        const responseText = await callAI(aiConfig, prompt, EXAM_SYS_PROMPT);
        const cleanJson = extractJsonFromText(responseText);
        const parsed = safeJsonParse(cleanJson);
        
        if (!Array.isArray(parsed)) {
            const potentialArray = Object.values(parsed).find(val => Array.isArray(val));
            if (potentialArray) return potentialArray as QuestionBlueprint[];
            throw new Error("Returned JSON is not an array");
        }

        return parsed.map((item: any, i: number) => ({
            ...item,
            index: item.index !== undefined ? item.index : i
        }));
    } catch (e: any) {
        throw new Error("Blueprint generation failed: " + sanitizeError(e));
    }
};

// 2. Generate Specific Question
export const generateExamQuestion = async (blueprint: QuestionBlueprint, aiConfig: AIConfig): Promise<ExamQuestion> => {
    try {
        const prompt = GENERATOR_PROMPT(blueprint);
        const responseText = await callAI(aiConfig, prompt, EXAM_SYS_PROMPT);
        const cleanJson = extractJsonFromText(responseText);
        const data = safeJsonParse(cleanJson);
        const questionData = data.question || data;

        if (!questionData.content) {
            if (questionData.question) questionData.content = questionData.question;
            else throw new Error("Missing 'content' field.");
        }

        if (Array.isArray(questionData.options)) {
            questionData.options = questionData.options.map((opt: any) => 
                (typeof opt === 'object' && opt !== null) ? (opt.text || JSON.stringify(opt)) : String(opt)
            );
        }

        return {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            type: blueprint.type,
            score: blueprint.score,
            difficulty: blueprint.difficulty,
            knowledgePoint: blueprint.knowledgePoint,
            ...questionData,
            isGraded: false
        };
    } catch (e: any) {
        throw new Error("Question gen failed: " + sanitizeError(e));
    }
};

// 3. Grade Question
export const gradeExamQuestion = async (question: ExamQuestion, userAnswer: any, aiConfig: AIConfig): Promise<{ score: number; feedback: string }> => {
    try {
        const prompt = GRADER_PROMPT(question, userAnswer);
        const responseText = await callAI(aiConfig, prompt, EXAM_GRADER_SYS_PROMPT);
        const cleanJson = extractJsonFromText(responseText);
        const data = safeJsonParse(cleanJson);
        const finalData = data.result || data.grading || data;

        return {
            score: typeof finalData.score === 'number' ? finalData.score : 0,
            feedback: finalData.feedback || "批改完成"
        };
    } catch (e) {
        if (question.type === 'single_choice' || question.type === 'true_false') {
            const isCorrect = String(userAnswer).trim() === String(question.correctAnswer).trim();
            return {
                score: isCorrect ? question.score : 0,
                feedback: isCorrect ? "回答正确" : "回答错误"
            };
        }
        return { score: 0, feedback: "AI 批改失败，请人工复核。" };
    }
};

// 4. Generate Report
export const generateExamReport = async (summary: any, aiConfig: AIConfig, onChunk: (text: string) => void): Promise<string> => {
    try {
        const prompt = EXAM_REPORT_PROMPT(JSON.stringify(summary, null, 2));
        return await callAIStream(aiConfig, prompt, "You are an expert tutor.", onChunk);
    } catch (e: any) {
        throw new Error("Report generation failed: " + sanitizeError(e));
    }
};
