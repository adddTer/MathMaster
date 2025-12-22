
import { GoogleGenAI } from '@google/genai';
import { AIConfig, EssayConfig, EssayAdvisorSuggestion, EditorCard } from '../types';
import { 
    ESSAY_ADVISOR_PROMPT, 
    ESSAY_SUGGESTION_PROMPT, 
    ESSAY_WRITER_SYS_PROMPT,
    ESSAY_BRAINSTORM_PROMPT,
    ESSAY_OUTLINE_PROMPT,
    ESSAY_MATERIALS_PROMPT 
} from './prompts';

// Reuse the basic connection logic, but simplify for non-streaming utility calls
const callAI = async (config: AIConfig, prompt: string, sysPrompt?: string): Promise<string> => {
    if (!config.apiKey) {
        throw new Error("API Key 未配置。请点击右上角设置按钮进行配置。");
    }

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
                config: {
                    systemInstruction: sysPrompt,
                }
            });
            // FIXED: result.text is a property, not a function in the new SDK
            return result.text || "";
        }
    } catch (e: any) {
        console.error("AI Call Failed:", e);
        throw new Error(e.message || "AI Service Error");
    }
};

// Helper to clean JSON string
const parseJSON = (raw: string) => {
    try {
        let clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = clean.indexOf('[');
        const end = clean.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            clean = clean.substring(start, end + 1);
        }
        return JSON.parse(clean);
    } catch (e) {
        console.error("JSON Parse Error", e);
        return [];
    }
};

// 1. Brainstorming
export const fetchBrainstorming = async (config: EssayConfig, aiConfig: AIConfig) => {
    const prompt = ESSAY_BRAINSTORM_PROMPT(config.topic, config.requirements);
    const raw = await callAI(aiConfig, prompt, "You are a JSON generator.");
    return parseJSON(raw);
};

// 2. Outline
export const fetchOutline = async (config: EssayConfig, aiConfig: AIConfig) => {
    const prompt = ESSAY_OUTLINE_PROMPT(config);
    const raw = await callAI(aiConfig, prompt, "You are a JSON generator.");
    return parseJSON(raw);
};

// 3. Materials
export const fetchMaterials = async (config: EssayConfig, aiConfig: AIConfig) => {
    const prompt = ESSAY_MATERIALS_PROMPT(config);
    const raw = await callAI(aiConfig, prompt, "You are a JSON generator.");
    return parseJSON(raw);
};

// 4. Advisors (Existing)
export const fetchAdvisors = async (
    config: EssayConfig, 
    currentText: string, 
    aiConfig: AIConfig
): Promise<EssayAdvisorSuggestion[]> => {
    const prompt = ESSAY_ADVISOR_PROMPT(config, currentText);
    const raw = await callAI(aiConfig, prompt, "You are a JSON generator.");
    
    const data = parseJSON(raw);
    const avatarMap: any = { logic: '📐', rhetoric: '✒️', history: '📜', reality: '🌍' };
    return data.map((item: any) => ({
        ...item,
        avatar: avatarMap[item.role] || '🤖'
    }));
};

// 5. Suggestions (Existing)
export const fetchSuggestions = async (
    config: EssayConfig, 
    currentText: string, 
    advisors: EssayAdvisorSuggestion[],
    aiConfig: AIConfig
): Promise<EditorCard[]> => {
    const prompt = ESSAY_SUGGESTION_PROMPT(config, currentText, JSON.stringify(advisors));
    const raw = await callAI(aiConfig, prompt, "You are a JSON generator.");
    return parseJSON(raw);
};

// 6. Streaming writer (Existing)
export const streamEssayWriter = async (
    config: EssayConfig,
    currentText: string,
    instruction: string,
    aiConfig: AIConfig,
    onChunk: (text: string) => void
): Promise<string> => {
    
    if (!aiConfig.apiKey) {
        throw new Error("API Key 未配置");
    }

    // Construct context
    const userPrompt = `
题目：${config.topic}
立意：${config.selectedAngle || '未指定'}
大纲：${JSON.stringify(config.outline || [])}
参考素材：${JSON.stringify(config.materials || [])}

已写内容：
${currentText}
---
我的指令：${instruction}
请根据指令继续写作。
`;

    try {
        if (aiConfig.provider === 'openai') {
            const response = await fetch(`${aiConfig.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1'}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${aiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: aiConfig.modelId || 'gpt-4o-mini',
                    messages: [
                        { role: "system", content: ESSAY_WRITER_SYS_PROMPT },
                        { role: "user", content: userPrompt }
                    ],
                    stream: true
                })
            });
            
            if (!response.body) throw new Error("No stream");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            while(true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const json = JSON.parse(line.slice(6));
                            const content = json.choices[0]?.delta?.content || "";
                            if (content) {
                                fullText += content;
                                onChunk(content);
                            }
                        } catch(e) {}
                    }
                }
            }
            return fullText;
        } else {
            const ai = new GoogleGenAI({ apiKey: aiConfig.apiKey });
            const model = aiConfig.modelId || 'gemini-2.5-flash';
            const result = await ai.models.generateContentStream({
                model: model,
                contents: { parts: [{ text: userPrompt }] },
                config: {
                    systemInstruction: ESSAY_WRITER_SYS_PROMPT
                }
            });
            let fullText = "";
            for await (const chunk of result) {
                // FIXED: chunk.text is a property, not a function
                const text = chunk.text;
                if (text) {
                    fullText += text;
                    onChunk(text);
                }
            }
            return fullText;
        }
    } catch (e: any) {
        throw new Error("Writer Error: " + e.message);
    }
};
