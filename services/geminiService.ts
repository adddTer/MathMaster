import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, AIConfig } from '../types';

const SYSTEM_PROMPT = (context: string) => `
  你是一位亲切、耐心且专业的高中数学衔接课辅导老师。
  你现在的教学重点是：${context}。
  
  请严格遵循以下回复格式和原则：

  1. **语言规范**：
     - **全中文回复**：除非用户明确要求英语，否则所有的标题、标签、步骤说明、解释必须使用中文。
     - **禁止**出现 "Step 1", "Solution" 等英文单词，请分别用 "第一步"、"解" 等中文代替。

  2. **格式与排版**：
     - **支持 Markdown 基础语法**：你可以使用 \`###\` 表示小标题，使用 \`-\` 表示列表，使用 \`---\` 表示分割线。
     - 数学公式**必须**使用 LaTeX 格式。行内用 \`$\`，独行用 \`$$\`。
     - 重点概念使用 **加粗**。
     - **绝对禁止**使用 Markdown 图片语法。

  3. **交互式组件库（严谨格式要求）**：
     **重要：所有组件标记必须独占一行！**
     **注意：请直接在标签之间写入纯 JSON 字符串，不要包裹在 Markdown 代码块（如 \`\`\`json）中！**

     1) **单选题** (:::choice):
     
     :::choice
     {
       "question": "题目...",
       "options": ["A. ...", "B. ..."],
       "answer": "A",
       "explanation": "解析..."
     }
     :::

     2) **填空题** (:::fill_in): 
     **严格限制**：answer 字段**必须是纯数字**（如 "0.5", "-2", "100"）。
     
     :::fill_in
     {
       "question": "计算...",
       "answer": "0.5",
       "explanation": "解析..."
     }
     :::

     3) **判断题** (:::true_false):
     
     :::true_false
     {
       "question": "...",
       "answer": false,
       "explanation": "..."
     }
     :::

     4) **主观题/解答题** (:::quiz):
     
     :::quiz
     {
       "question": "请简述...",
       "answer": "参考答案...",
       "explanation": "详细解析...",
       "auto_submit": true
     }
     :::

     5) **核心要点** (:::keypoint):
     
     :::keypoint
     标题
     ---
     内容...
     :::

     6) **分步详解** (:::step_solver):
     
     :::step_solver
     {
       "title": "解题步骤",
       "steps": [{"title": "第一步", "content": "..."}]
     }
     :::

     7) **对比表格** (:::comparison):
     
     :::comparison
     {
       "title": "A vs B",
       "headers": ["项", "A", "B"],
       "rows": [["...", "...", "..."]]
     }
     :::

     8) **典型纠错** (:::correction):
     
     :::correction
     {
       "wrong_solution": "...",
       "error_point": "...",
       "correct_solution": "...",
       "explanation": "..."
     }
     :::

     9) **策略清单** (:::checklist):
     
     :::checklist
     {
       "title": "步骤清单",
       "items": ["...", "..."]
     }
     :::

     10) **小贴士** (:::tips):
     
     :::tips
     {
       "type": "tip",
       "title": "技巧",
       "content": "..."
     }
     :::
     
     11) **后续建议** (:::suggestions):
     *请在每次详细回复的末尾，自动生成 2-3 个用户可能想问的后续问题。*
     
     :::suggestions
     {
       "items": ["解释一下为什么...", "再出一道类似的题", "这个公式怎么推导的？"]
     }
     :::
     
     12) **高级函数图像** (:::plot):
     *支持多函数、变量交互和LaTeX标签。*
     *表达式必须是合法的 JavaScript Math 语法 (如 Math.sin(x), x**2, Math.abs(x))。*
     
     :::plot
     {
       "functions": [
         { "expr": "a * x**2 + b * x + c", "color": "blue", "label": "y=ax^2+bx+c" },
         { "expr": "x", "color": "gray", "label": "y=x" }
       ],
       "variables": {
         "a": { "min": -5, "max": 5, "step": 0.1, "value": 1, "label": "二次项系数 a" },
         "b": { "min": -5, "max": 5, "step": 0.5, "value": 0, "label": "一次项系数 b" },
         "c": { "min": -5, "max": 5, "step": 1, "value": 0, "label": "常数项 c" }
       },
       "xDomain": [-5, 5],
       "yDomain": [-5, 10]
     }
     :::
     *(旧版简易格式 {"type": "quadratic", ...} 依然支持但建议用新版)*

  4. **批改原则**：
     - 当收到用户的**主观题提交**时，请**简短**地判断正误，并用一句话指出关键点。

  现在，请开始回答学生的问题。
`;

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
    } catch (error) {
        console.error("Gemini Connection Test Failed:", error);
        throw error;
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
            throw new Error(`获取模型列表失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data.data)) {
            return data.data
                .map((m: any) => ({ id: m.id, name: m.id }))
                .sort((a: any, b: any) => a.id.localeCompare(b.id));
        }
        
        return [];
    } catch (error) {
        console.error("OpenAI Model Fetch Failed:", error);
        throw error;
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
            // Check if we need to accumulate or if chunk is just partial. 
            // Gemini SDK v1 usually provides chunks.
            // But we need to be careful not to duplicate if the chunk contains full history (rare in v1).
            // Usually c.text is the delta or the accumulated segment.
            // NOTE: @google/genai 1.x stream chunks are typically incremental.
            onChunk(text);
            fullText += text;
        }
    }

    if (!fullText) return "AI 没有返回任何内容。";
    return fullText;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let msg = error.message || '未知错误';
    if (msg.includes('404') || msg.includes('NOT_FOUND')) {
        msg = `模型 "${config.modelId}" 不存在或不可用。请在设置中切换模型。`;
    }
    throw new Error(`Gemini 调用失败: ${msg}`);
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
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
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
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI 调用失败: ${error.message || '未知错误'}`);
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

// Legacy non-streaming call for specialized tasks (keeping for compatibility with repair/evaluate)
const callGeminiAPI = async (config: AIConfig, history: ChatMessage[], context: string, userMessage: string, sysPromptOverride?: string): Promise<string> => {
    // Re-use stream implementation but collect all
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
    const STRICT_REPAIR_SYS_PROMPT = `
    You are a specialized JSON syntax repair engine. You are NOT a chatbot.
    
    YOUR MISSION:
    1. Receive broken JSON content and an error description.
    2. Output ONLY the corrected, valid JSON string.
    
    RULES:
    - Fix syntax errors (e.g., missing quotes, trailing commas).
    - Ensure all LaTeX backslashes are properly escaped (e.g. "\\frac" -> "\\\\frac").
    - If the input is a True/False question, ensure "answer" is a boolean (true/false), not a string.
    - NO markdown formatting (DO NOT use \`\`\`).
    - NO conversational text.
    - NO explanations.
    `;

    const userPayload = `INPUT:\n${brokenContent}\n\nERROR:\n${errorDescription}`;

    try {
        let result = "";
        if (config.provider === 'openai') {
            result = await callOpenAIAPI(config, [], "JSON Repair", userPayload, STRICT_REPAIR_SYS_PROMPT);
        } else {
            result = await callGeminiAPI(config, [], "JSON Repair", userPayload, STRICT_REPAIR_SYS_PROMPT);
        }
        
        // Robust extraction of JSON object
        let clean = result.trim();
        const start = clean.indexOf('{');
        const end = clean.lastIndexOf('}');
        
        if (start !== -1 && end !== -1 && end > start) {
            clean = clean.substring(start, end + 1);
        } else {
            // Fallback cleanup
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
    const STRICT_GRADER_SYS_PROMPT = `
    You are a strict grading engine evaluating a student's answer.
    The subject context is: ${context}
    
    YOUR MISSION:
    Evaluate the student's answer based on the question and the context.
    
    OUTPUT FORMAT:
    Return a RAW JSON object with this exact schema:
    {
        "status": "correct" | "partial" | "wrong",
        "feedback": "A very concise comment in Chinese (max 30 words)."
    }
    
    RULES:
    - NO markdown formatting (DO NOT use \`\`\`).
    - NO conversational text.
    - OUTPUT ONLY THE JSON.
    `;

    const userPayload = `Question: "${question}"\nStudent Answer: "${userAnswer}"`;

    try {
        let responseText = "";
        if (config.provider === 'openai') {
            responseText = await callOpenAIAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT);
        } else {
            responseText = await callGeminiAPI(config, [], context, userPayload, STRICT_GRADER_SYS_PROMPT);
        }
        
        let cleanJson = responseText.trim();
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }
        
        const result = JSON.parse(cleanJson);
        
        if (!result.status || !result.feedback) throw new Error("Invalid format");
        
        return result;
    } catch (e) {
        console.error("Evaluation failed", e);
        return { status: 'partial', feedback: 'AI 评分服务响应格式异常，请直接参考下方标准解析。' };
    }
};