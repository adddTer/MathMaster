
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, AIConfig, ExamConfig, ExamQuestion, QuestionBlueprint } from '../types';
import { 
    SYSTEM_PROMPT, 
    STRICT_REPAIR_SYS_PROMPT, 
    STRICT_GRADER_SYS_PROMPT, 
    BLUEPRINT_PROMPT, 
    GENERATOR_PROMPT, 
    GRADER_PROMPT 
} from './prompts';

// Helper to sanitize error messages
const sanitizeError = (error: any): string => {
    let msg = error.message || '未知错误';
    // Replace specific provider names with generic terms to avoid confusion
    msg = msg.replace(/OpenAI/gi, 'AI Service');
    msg = msg.replace(/Gemini/gi, 'AI Service');
    msg = msg.replace(/Google/gi, 'Provider');
    return msg;
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
          temperature: 0.7,
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
  onChunk: (text: string) => void
): Promise<string> => {
  if (!config || !config.apiKey) {
    throw new Error("请先配置 API Key");
  }

  if (config.provider === 'openai') {
    return callOpenAIStream(config, history, currentContext, userMessage, onChunk);
  } else {
    return callGeminiStream(config, history, currentContext, userMessage, onChunk);
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
        
        let clean = result.trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        
        if (start !== -1 && end !== -1 && end > start) {
            clean = clean.substring(start, end + 1);
        } else {
            clean = clean.replace(/```json/g, '').replace(/```/g, '').trim();
        }
        
        return clean;
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
        if (config.provider === 'openai') {
            responseText = await callOpenAIAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT(context));
        } else {
            responseText = await callGeminiAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT(context));
        }
        
        let cleanJson = responseText.trim();
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }
        
        const result = JSON.parse(cleanJson);
        
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
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Blueprint", "Create blueprint.", prompt);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Blueprint", "Create blueprint.", prompt);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('[');
        const end = cleanJson.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        const parsed = JSON.parse(cleanJson);
        
        // Smart unwrap if AI wrapped the array in an object
        if (!Array.isArray(parsed)) {
            if (parsed.blueprint && Array.isArray(parsed.blueprint)) return parsed.blueprint;
            if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
            if (parsed.items && Array.isArray(parsed.items)) return parsed.items;
            throw new Error("Returned JSON is not an array");
        }

        return parsed;
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
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Question Gen", "Generate question.", prompt);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Question Gen", "Generate question.", prompt);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        const data = JSON.parse(cleanJson);
        
        // Smart unwrap
        const questionData = data.question || data;

        delete questionData.thought_trace; // Cleanup
        
        return {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            ...questionData,
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

        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Grade", "Grade this.", prompt);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Grade", "Grade this.", prompt);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        const data = JSON.parse(cleanJson);
        
        // Smart unwrap
        const finalData = data.result || data.grading || data;

        return {
            score: finalData.score,
            feedback: finalData.feedback
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
