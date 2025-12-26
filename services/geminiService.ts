
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, AIConfig } from '../types';
import { SYSTEM_PROMPT, STRICT_REPAIR_SYS_PROMPT, STRICT_GRADER_SYS_PROMPT } from './prompts';
import { sanitizeError, extractJsonFromText, safeJsonParse } from './utils';

// Re-export exam functions to maintain compatibility if imported elsewhere (though we should update consumers)
export * from './examService';
// Re-export utils
export { repairMalformedJson, evaluateQuizAnswer } from './geminiServiceUtils'; 

// --- Core Chat Services ---

const callGeminiStream = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, onChunk: (text: string) => void, sysPromptOverride?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: config.apiKey });
    const modelId = config.modelId || 'gemini-2.5-flash'; 

    const chat = ai.chats.create({
        model: modelId,
        config: {
            systemInstruction: sysPromptOverride || SYSTEM_PROMPT(context),
            temperature: 0.85,
        },
        history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }))
    });

    const result = await chat.sendMessageStream({ message: userMessage });

    let fullText = '';
    for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) { onChunk(text); fullText += text; }
    }
    return fullText || "AI 没有返回任何内容。";
  } catch (error: any) {
    let msg = sanitizeError(error);
    if (msg.includes('404') || msg.includes('NOT_FOUND')) msg = `模型 "${config.modelId}" 不存在。`;
    throw new Error(`AI 服务调用失败: ${msg}`);
  }
};

const callOpenAIStream = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, onChunk: (text: string) => void, sysPromptOverride?: string): Promise<string> => {
    try {
      const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
      const messages = [
        { role: "system", content: sysPromptOverride || SYSTEM_PROMPT(context) },
        ...history.map(msg => ({ role: msg.role === 'model' ? 'assistant' : 'user', content: msg.text })),
        { role: "user", content: userMessage }
      ];
      
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
        body: JSON.stringify({
          model: config.modelId || 'gpt-4o-mini',
          messages: messages,
          temperature: 0.85,
          stream: true
        })
      });
  
      if (!response.ok) throw new Error(`${response.status} - ${response.statusText}`);
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
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                try {
                    const content = JSON.parse(line.slice(6)).choices?.[0]?.delta?.content || "";
                    if (content) { onChunk(content); fullText += content; }
                } catch (e) {}
            }
        }
      }
      return fullText || "AI 没有返回任何内容。";
    } catch (error: any) {
      throw new Error(`AI 服务调用失败: ${sanitizeError(error)}`);
    }
};

export const sendMessageToGeminiStream = async (
  history: ChatMessage[], currentContext: string, userMessage: string, config: AIConfig, onChunk: (text: string) => void, sysPromptOverride?: string
): Promise<string> => {
  if (!config || !config.apiKey) throw new Error("请先配置 API Key");
  if (config.provider === 'openai') return callOpenAIStream(config, history, currentContext, userMessage, onChunk, sysPromptOverride);
  return callGeminiStream(config, history, currentContext, userMessage, onChunk, sysPromptOverride);
};

export const testGeminiConnection = async (apiKey: string): Promise<boolean> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: 'Hi' }] },
            config: { maxOutputTokens: 1 }
        });
        return true;
    } catch (error: any) {
        throw new Error(`连接验证失败: ${sanitizeError(error)}`);
    }
};

export const fetchOpenAIModels = async (config: AIConfig): Promise<{id: string, name: string}[]> => {
    try {
        const baseUrl = config.baseUrl?.replace(/\/+$/, '') || 'https://api.openai.com/v1';
        const response = await fetch(`${baseUrl}/models`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data.data)) {
            return data.data.map((m: any) => ({ id: m.id, name: m.id })).sort((a: any, b: any) => a.id.localeCompare(b.id));
        }
        return [];
    } catch (error: any) {
        throw new Error(`获取模型列表失败: ${sanitizeError(error)}`);
    }
};
