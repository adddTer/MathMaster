
import { GoogleGenAI } from '@google/genai';
import { AIConfig } from '../types';
import { STRICT_REPAIR_SYS_PROMPT, STRICT_GRADER_SYS_PROMPT } from './prompts';
import { extractJsonFromText, safeJsonParse } from './utils';

// Helper for non-streaming calls
const callSimple = async (config: AIConfig, prompt: string, sysPrompt: string): Promise<string> => {
    if (config.provider === 'openai') {
        const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
            body: JSON.stringify({
                model: config.modelId || 'gpt-4o-mini',
                messages: [{ role: "system", content: sysPrompt }, { role: "user", content: prompt }]
            })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } else {
        const ai = new GoogleGenAI({ apiKey: config.apiKey });
        const result = await ai.models.generateContent({
            model: config.modelId || 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { systemInstruction: sysPrompt }
        });
        return result.text || "";
    }
};

export const repairMalformedJson = async (brokenContent: string, errorDescription: string, config: AIConfig): Promise<string> => {
    const userPayload = `INPUT:\n${brokenContent}\n\nERROR:\n${errorDescription}`;
    try {
        const result = await callSimple(config, userPayload, STRICT_REPAIR_SYS_PROMPT);
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
        const responseText = await callSimple(config, userPayload, STRICT_GRADER_SYS_PROMPT(context));
        const cleanJson = extractJsonFromText(responseText);
        const result = safeJsonParse(cleanJson);
        const finalResult = result.status ? result : (result.grading || result.evaluation || result);
        if (!finalResult.status || !finalResult.feedback) throw new Error("Invalid format");
        return finalResult;
    } catch (e) {
        return { status: 'partial', feedback: 'AI 评分服务响应格式异常，请直接参考下方标准解析。' };
    }
};
