
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, AIConfig, ExamConfig, ExamQuestion, QuestionBlueprint } from '../types';
import { 
    SYSTEM_PROMPT, 
    STRICT_REPAIR_SYS_PROMPT, 
    STRICT_GRADER_SYS_PROMPT,
    EXAM_GRADER_SYS_PROMPT,
    EXAM_SYS_PROMPT, 
    BLUEPRINT_PROMPT, 
    GENERATOR_PROMPT, 
    GRADER_PROMPT,
    EXAM_REPORT_PROMPT 
} from './prompts';

// Helper to sanitize error messages
const sanitizeError = (error: any): string => {
    let msg = String(error?.message || error || '未知错误');
    msg = msg.replace(/OpenAI/gi, 'AI Service');
    msg = msg.replace(/Gemini/gi, 'AI Service');
    msg = msg.replace(/Google/gi, 'Provider');
    return msg;
};

// --- ROBUST JSON EXTRACTION ---

// Advanced JSON sanitizer that fixes common LLM mistakes with LaTeX
const sanitizeJsonString = (str: string): string => {
    let clean = str;
    
    // 1. Remove markdown wrappers
    const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
        clean = codeBlockMatch[1].trim();
    } else {
        clean = clean.trim();
    }

    // 2. Try to recover truncated JSON arrays (Unterminated string)
    // If it starts with [ but doesn't end with ], try to find the last valid object closing
    if (clean.startsWith('[') && !clean.endsWith(']')) {
        const lastCloseObj = clean.lastIndexOf('}');
        if (lastCloseObj !== -1) {
            clean = clean.substring(0, lastCloseObj + 1) + ']';
        }
    }

    // 3. Fix invalid escapes (The "Bad escaped character" error)
    // Look for backslashes that are NOT followed by valid escape chars (" \ / b f n r t u)
    // We want to turn `\a` into `\\a`, `\(` into `\\(`, etc.
    // Regex explanation:
    // \\       matches a literal backslash
    // (?![...]) negative lookahead: NOT followed by valid escape chars
    clean = clean.replace(/\\(?![/\\"'bfnrtu])/g, "\\\\");

    return clean;
};

const extractJsonFromText = (text: string): string => {
    if (!text) return "{}";
    
    // Pre-sanitize specifically for LaTeX/JSON issues
    const sanitized = sanitizeJsonString(text);

    // Standard extraction logic (as backup/refinement)
    let clean = sanitized.trim();
    
    // Fallback: Find the first valid starting character for JSON ( { or [ )
    const firstOpenBrace = clean.indexOf('{');
    const firstOpenBracket = clean.indexOf('[');
    
    const lastCloseBrace = clean.lastIndexOf('}');
    const lastCloseBracket = clean.lastIndexOf(']');

    let start = -1;
    let end = -1;

    if (firstOpenBrace !== -1 && firstOpenBracket !== -1) {
        if (firstOpenBrace < firstOpenBracket) {
            start = firstOpenBrace;
            end = lastCloseBrace;
        } else {
            start = firstOpenBracket;
            end = lastCloseBracket;
        }
    } else if (firstOpenBrace !== -1) {
        start = firstOpenBrace;
        end = lastCloseBrace;
    } else if (firstOpenBracket !== -1) {
        start = firstOpenBracket;
        end = lastCloseBracket;
    }

    if (start !== -1 && end !== -1 && end >= start) {
        return clean.substring(start, end + 1);
    }

    return clean;
};

// Safe JSON Parse with retry logic
const safeJsonParse = (text: string): any => {
    try {
        return JSON.parse(text);
    } catch (e) {
        // Retry with a more aggressive escape fix if first attempt fails
        // This handles cases like `\text` where `\t` is a tab but `ext` remains
        const aggressiveFix = text.replace(/\\/g, "\\\\"); // Double ALL backslashes
        try {
            return JSON.parse(aggressiveFix);
        } catch (e2) {
            throw e; // Throw original error
        }
    }
};

// Test Gemini Connection
export const testGeminiConnection = async (apiKey: string): Promise<boolean> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const model = 'gemini-2.5-flash';
        await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: 'Hi' }] },
            config: { maxOutputTokens: 1 }
        });
        return true;
    } catch (error: any) {
        console.error("Connection Test Failed:", error);
        throw new Error(`连接验证失败: ${sanitizeError(error)}`);
    }
};

// Fetch OpenAI Models
export const fetchOpenAIModels = async (config: AIConfig): Promise<{id: string, name: string}[]> => {
    try {
        const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
        
        const response = await fetch(`${baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const statusMsg = `HTTP ${response.status}`;
            const apiMsg = errorData.error?.message || response.statusText;
            throw new Error(`${statusMsg} - ${apiMsg}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data.data)) {
            return data.data
                .map((m: any) => ({ id: m.id, name: m.id }))
                .sort((a: any, b: any) => a.id.localeCompare(b.id));
        }
        
        return [];
    } catch (error: any) {
        console.error("Model Fetch Failed:", error);
        throw new Error(`获取模型列表失败: ${sanitizeError(error)}`);
    }
};

// Gemini Stream Handler
const callGeminiStream = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, onChunk: (text: string) => void, sysPromptOverride?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const modelId = config.modelId || 'gemini-2.5-flash'; 

    const chat = ai.chats.create({
        model: modelId,
        config: {
            systemInstruction: sysPromptOverride || SYSTEM_PROMPT(context),
            temperature: 0.85, // Increase randomness for less repetitive content
        },
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
    });

    const result = await chat.sendMessageStream({
        message: userMessage
    });

    let fullText = '';
    for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
            onChunk(text);
            fullText += text;
        }
    }

    if (!fullText) return "AI 没有返回任何内容。";
    return fullText;

  } catch (error: any) {
    console.error("AI Service Error:", error);
    let msg = sanitizeError(error);
    if (msg.includes('404') || msg.includes('NOT_FOUND')) {
        msg = `模型 "${config.modelId}" 不存在或不可用。请在设置中切换模型。`;
    }
    throw new Error(`AI 服务调用失败: ${msg}`);
  }
};

// OpenAI Stream Handler
const callOpenAIStream = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, onChunk: (text: string) => void, sysPromptOverride?: string): Promise<string> => {
    try {
      const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
      
      const messages = [
        { role: "system", content: sysPromptOverride || SYSTEM_PROMPT(context) },
        ...history.map(msg => ({ 
          role: msg.role === 'model' ? 'assistant' : 'user', 
          content: msg.text 
        })),
        { role: "user", content: userMessage }
      ];
      
      const modelId = config.modelId || 'gpt-4o-mini';
  
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: messages,
          temperature: 0.85, // Increase randomness
          stream: true
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${response.status} - ${errorData.error?.message || response.statusText}`);
      }
  
      if (!response.body) throw new Error("ReadableStream not supported");
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.slice(6);
                if (jsonStr === '[DONE]') break;
                
                try {
                    const json = JSON.parse(jsonStr);
                    const content = json.choices?.[0]?.delta?.content || "";
                    if (content) {
                        onChunk(content);
                        fullText += content;
                    }
                } catch (e) {
                    // ignore partial json
                }
            }
        }
      }
      return fullText || "AI 没有返回任何内容。";
  
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw new Error(`AI 服务调用失败: ${sanitizeError(error)}`);
    }
  };

// Main Export
export const sendMessageToGeminiStream = async (
  history: ChatMessage[], 
  currentContext: string,
  userMessage: string,
  config: AIConfig,
  onChunk: (text: string) => void,
  sysPromptOverride?: string // Added optional parameter
): Promise<string> => {
  if (!config || !config.apiKey) {
    throw new Error("请先配置 API Key");
  }

  if (config.provider === 'openai') {
    return callOpenAIStream(config, history, currentContext, userMessage, onChunk, sysPromptOverride);
  } else {
    return callGeminiStream(config, history, currentContext, userMessage, onChunk, sysPromptOverride);
  }
};

// Legacy non-streaming call for specialized tasks
const callGeminiAPI = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, sysPromptOverride?: string): Promise<string> => {
    let text = "";
    await callGeminiStream(config, history, context, userMessage, (t) => text += t, sysPromptOverride);
    return text;
};

const callOpenAIAPI = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, sysPromptOverride?: string): Promise<string> => {
    let text = "";
    await callOpenAIStream(config, history, context, userMessage, (t) => text += t, sysPromptOverride);
    return text;
};


// --- Specialized Services ---

export const repairMalformedJson = async (brokenContent: string, errorDescription: string, config: AIConfig): Promise<string> => {
    const userPayload = `INPUT:\n${brokenContent}\n\nERROR:\n${errorDescription}`;

    try {
        let result = "";
        if (config.provider === 'openai') {
            result = await callOpenAIAPI(config, [], "JSON Repair", userPayload, STRICT_REPAIR_SYS_PROMPT);
        } else {
            result = await callGeminiAPI(config, [], "JSON Repair", userPayload, STRICT_REPAIR_SYS_PROMPT);
        }
        return extractJsonFromText(result);
    } catch (e) {
        throw new Error("Repair failed");
    }
};

export interface QuizEvaluation {
    status: 'correct' | 'partial' | 'wrong';
    feedback: string;
}

export const evaluateQuizAnswer = async (question: string, userAnswer: string, context: string, config: AIConfig): Promise<QuizEvaluation> => {
    const userPayload = `Question: "${question}"\nStudent Answer: "${userAnswer}"`;

    try {
        let responseText = "";
        // Use STRICT_GRADER_SYS_PROMPT for grading chat quizzes (status based)
        if (config.provider === 'openai') {
            responseText = await callOpenAIAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT(context));
        } else {
            responseText = await callGeminiAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT(context));
        }
        
        const cleanJson = extractJsonFromText(responseText);
        const result = safeJsonParse(cleanJson);
        
        // Robust check: handle if AI returns wrapper
        const finalResult = result.status ? result : (result.grading || result.evaluation || result);

        if (!finalResult.status || !finalResult.feedback) throw new Error("Invalid format");
        
        return finalResult;
    } catch (e) {
        console.error("Evaluation failed", e);
        return { status: 'partial', feedback: 'AI 评分服务响应格式异常，请直接参考下方标准解析。' };
    }
};

// --- Exam Services ---

// 1. Generate Exam Blueprint (Structure)
export const generateExamBlueprint = async (config: ExamConfig, aiConfig: AIConfig): Promise<QuestionBlueprint[]> => {
    try {
        let responseText = "";
        const prompt = BLUEPRINT_PROMPT(config);
        
        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Blueprint", prompt, EXAM_SYS_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Blueprint", prompt, EXAM_SYS_PROMPT);
        }

        const cleanJson = extractJsonFromText(responseText);
        const parsed = safeJsonParse(cleanJson);
        
        // Smart unwrap if AI wrapped the array in an object
        if (!Array.isArray(parsed)) {
            if (parsed.blueprint && Array.isArray(parsed.blueprint)) return parsed.blueprint;
            if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
            if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
            
            // Generic fallback: Look for any property that is an array
            const potentialArray = Object.values(parsed).find(val => Array.isArray(val));
            if (potentialArray) return potentialArray as QuestionBlueprint[];

            throw new Error("Returned JSON is not an array");
        }

        // Fill missing indices
        return parsed.map((item: any, i: number) => ({
            ...item,
            index: item.index !== undefined ? item.index : i
        }));

    } catch (e: any) {
        throw new Error("Blueprint generation failed: " + sanitizeError(e));
    }
};

// 2. Generate Specific Question from Blueprint
export const generateExamQuestion = async (
    blueprint: QuestionBlueprint, 
    aiConfig: AIConfig
): Promise<ExamQuestion> => {
    try {
        let responseText = "";
        const prompt = GENERATOR_PROMPT(blueprint);

        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Question Gen", prompt, EXAM_SYS_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Question Gen", prompt, EXAM_SYS_PROMPT);
        }

        const cleanJson = extractJsonFromText(responseText);
        const data = safeJsonParse(cleanJson);
        
        // Smart unwrap
        const questionData = data.question || data;

        // --- VALIDATION & SANITIZATION ---
        
        // 1. Ensure content exists
        if (!questionData.content) {
            // Fallback: try to find 'question' field
            if (questionData.question) questionData.content = questionData.question;
            else throw new Error("Missing 'content' field in question data.");
        }

        // 2. Sanitize Options (Ensure they are strings)
        if (Array.isArray(questionData.options)) {
            questionData.options = questionData.options.map((opt: any) => {
                if (typeof opt === 'object' && opt !== null) {
                    // Handle cases where AI returns [{"text": "Option A"}, ...]
                    return opt.text || opt.value || opt.content || JSON.stringify(opt);
                }
                return String(opt);
            });
        }

        // 3. Ensure options exist for choice types
        if (['single_choice', 'multiple_choice'].includes(blueprint.type)) {
            if (!questionData.options || !Array.isArray(questionData.options) || questionData.options.length < 2) {
                throw new Error("Choice question missing valid 'options' array. (Expected at least 2 options)");
            }
        }
        
        // ------------------------

        delete questionData.thought_trace; // Cleanup
        
        // CRITICAL FIX: Merge blueprint metadata (type, score, difficulty) 
        // because AI might not return them or return inconsistent values.
        return {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            type: blueprint.type,           // FORCE blueprint type
            score: blueprint.score,         // FORCE blueprint score
            difficulty: blueprint.difficulty, // FORCE blueprint difficulty
            knowledgePoint: blueprint.knowledgePoint, // PASS KNOWLEDGE POINT for reporting
            ...questionData,                // Spread AI content (overwrites if keys exist, but we trust blueprint for metadata)
            isGraded: false
        };
    } catch (e: any) {
        throw new Error("Question gen failed: " + sanitizeError(e));
    }
};

export const gradeExamQuestion = async (
    question: ExamQuestion,
    userAnswer: any,
    aiConfig: AIConfig
): Promise<{ score: number; feedback: string }> => {
    try {
        let responseText = "";
        const prompt = GRADER_PROMPT(question, userAnswer);

        // USE EXAM_GRADER_SYS_PROMPT specifically to ensure score is returned
        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Grade", prompt, EXAM_GRADER_SYS_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Grade", prompt, EXAM_GRADER_SYS_PROMPT);
        }

        const cleanJson = extractJsonFromText(responseText);
        const data = safeJsonParse(cleanJson);
        
        // Smart unwrap
        const finalData = data.result || data.grading || data;

        return {
            score: typeof finalData.score === 'number' ? finalData.score : 0,
            feedback: finalData.feedback || "批改完成"
        };
    } catch (e) {
        console.error("Grading failed", e);
        // Fallback grading for simple types
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

// 3. Generate Comprehensive Exam Report
export const generateExamReport = async (
    summary: any,
    aiConfig: AIConfig,
    onChunk: (text: string) => void
): Promise<string> => {
    try {
        const prompt = EXAM_REPORT_PROMPT(JSON.stringify(summary, null, 2));
        
        // Re-use streaming logic for real-time report generation
        if (aiConfig.provider === 'openai') {
            return callOpenAIStream(aiConfig, [], "Exam Report", prompt, onChunk, "You are an expert tutor.");
        } else {
            return callGeminiStream(aiConfig, [], "Exam Report", prompt, onChunk, "You are an expert tutor.");
        }
    } catch (e: any) {
        throw new Error("Report generation failed: " + sanitizeError(e));
    }
};
