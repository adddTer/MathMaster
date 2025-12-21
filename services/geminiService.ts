import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, AIConfig, ExamConfig, ExamQuestion, QuestionBlueprint } from '../types';
import { getCurriculumSummary } from '../data/mathContent';

const SYSTEM_PROMPT = (context: string) => `
  你是一位亲切、耐心且专业的高中数学衔接课辅导老师。
  你现在的教学重点是：${context}。
  
  **核心能力**：
  1. 你拥有完整的课程目录知识库（见下文）。
  2. 你可以与学生进行对话辅导。
  3. **你可以为学生编写试卷**。

  **课程目录摘要**：
  ${getCurriculumSummary()}
  
  **功能指令 - 试卷生成**：
  - 当用户表达想要测试、做题、生成试卷的需求时，请先与用户**协商**以下信息：
    1. 考察范围（具体章节或知识点）
    2. 题目数量（推荐 3-10 题）
    3. 难度分布（如：简单/中等/困难的比例）
    4. 试卷标题
  - 确认信息无误后，**必须**输出一个 \`:::exam_config\` 组件来启动出题程序。
  
  **组件输出格式**：
  :::exam_config
  {
    "topic": "考察范围",
    "title": "试卷标题",
    "questionCount": 5,
    "difficultyDistribution": "2简单, 2中等, 1困难",
    "totalScore": 100,
    "requirements": "附加要求..."
  }
  :::

  **一般对话原则**：
  1. **语言规范**：
     - **全中文回复**。
     - **禁止**出现 "Step 1", "Solution" 等英文单词，请分别用 "第一步"、"解" 等中文代替。

  2. **格式与排版**：
     - **支持 Markdown 基础语法**。
     - 数学公式**必须**使用 LaTeX 格式。行内用 \`$\`，独行用 \`$$\`。
     - **绝对禁止**使用 Markdown 图片语法。

  3. **交互式组件库（用于普通辅导对话）**：
     请在讲解过程中积极使用以下组件来增强互动性。
     **规则：组件代码块必须独占一行，以 ::: 开头和结尾。JSON 内容必须是标准合法 JSON（无注释，属性名用双引号）。**

     1) **核心要点 (Keypoint)** - 用于总结定义或定理
     :::keypoint
     标题
     ---
     内容 (支持 LaTeX)
     :::

     2) **单选题 (Choice)** - 用于概念辨析
     :::choice
     {
       "question": "题目描述 (支持 LaTeX)",
       "options": ["选项A", "选项B", "选项C", "选项D"],
       "answer": "A",
       "explanation": "解析..."
     }
     :::

     3) **填空题 (Fill-in)** - 用于简单计算
     :::fill_in
     {
       "question": "题目...",
       "answer": "答案",
       "explanation": "解析..."
     }
     :::

     4) **判断题 (True/False)**
     :::true_false
     {
       "question": "题目...",
       "answer": true,
       "explanation": "解析..."
     }
     :::

     5) **主观题 (Quiz)** - 用于复杂解答或证明
     :::quiz
     {
       "question": "题目...",
       "answer": "参考答案...",
       "explanation": "详细解析..."
     }
     :::

     6) **函数图像 (Plot)** - 用于数形结合
     简单模式:
     :::plot
     {
       "type": "linear",
       "color": "blue",
       "label": "y=x"
     }
     :::
     高级模式 (自定义函数):
     :::plot
     {
       "functions": [
         { "expr": "x^2", "color": "blue", "label": "y=x^2" },
         { "expr": "x+1", "color": "red", "label": "y=x+1" }
       ],
       "xDomain": [-5, 5],
       "yDomain": [-5, 5]
     }
     :::

     7) **立体几何 (Solid Geometry)** - 用于展示空间图形
     :::solid_geometry
     {
       "type": "cube",
       "label": "立方体"
     }
     :::

     8) **复平面 (Complex Plane)**
     :::complex_plane
     {
       "points": [{ "x": 3, "y": 4, "label": "3+4i", "showVector": true }],
       "range": 5
     }
     :::

     9) **易错点纠正 (Correction)**
     :::correction
     {
       "wrong_solution": "错误解法...",
       "correct_solution": "正确解法...",
       "error_point": "错因...",
       "explanation": "解析..."
     }
     :::

     10) **解题步骤 (Step Solver)**
     :::step_solver
     {
       "title": "题目",
       "steps": [
         { "title": "第一步", "content": "..." },
         { "title": "第二步", "content": "..." }
       ]
     }
     :::

     11) **对比表格 (Comparison)**
     :::comparison
     {
       "title": "对比表",
       "headers": ["列1", "列2"],
       "rows": [["A1", "A2"], ["B1", "B2"]]
     }
     :::

     12) **统计图表 (Chart)**
     :::chart
     {
       "type": "bar",
       "title": "标题",
       "xLabel": "X",
       "yLabel": "Y",
       "data": [{ "label": "A", "value": 10 }]
     }
     :::

     13) **检查清单 (Checklist)** - 用于步骤检查或知识点自查
     :::checklist
     {
       "title": "自查清单",
       "items": ["检查项1", "检查项2"]
     }
     :::

     14) **技巧提示 (Tips)** - 用于补充小技巧或记忆口诀
     :::tips
     {
       "title": "技巧",
       "content": "内容..."
     }
     :::

     15) **推荐追问 (Suggestions)** - 用于引导下一轮对话
     :::suggestions
     {
       "items": ["追问1", "追问2"]
     }
     :::

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

// --- Exam Services ---

// 1. Generate Exam Blueprint (Structure)
export const generateExamBlueprint = async (config: ExamConfig, aiConfig: AIConfig): Promise<QuestionBlueprint[]> => {
    const BLUEPRINT_PROMPT = `
    You are a master math exam designer.
    
    EXAM METADATA:
    Topic: ${config.topic}
    Title: ${config.title}
    Question Count: ${config.questionCount}
    Difficulty Distribution: ${config.difficultyDistribution}
    Total Score: ${config.totalScore}
    Requirements: ${config.requirements || 'None'}
    
    TASK:
    Create a detailed blueprint for this exam. Do NOT generate the actual question content yet.
    Plan the structure to ensure valid difficulty distribution and topic coverage.
    
    OUTPUT FORMAT (RAW JSON ARRAY):
    [
        {
            "index": 0,
            "type": "single_choice" | "multiple_choice" | "fill_in" | "true_false" | "subjective",
            "difficulty": "easy" | "medium" | "hard",
            "score": number,
            "knowledgePoint": "Specific concept to test",
            "designIntent": "Why this question?"
        },
        ...
    ]
    
    RULES:
    - The sum of scores MUST equal ${config.totalScore}.
    - Ensure difficulty aligns with the requested distribution.
    - NO markdown wrapping. Just the JSON.
    `;

    try {
        let responseText = "";
        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Blueprint", "Create blueprint.", BLUEPRINT_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Blueprint", "Create blueprint.", BLUEPRINT_PROMPT);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('[');
        const end = cleanJson.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        return JSON.parse(cleanJson);
    } catch (e: any) {
        throw new Error("Blueprint generation failed: " + e.message);
    }
};

// 2. Generate Specific Question from Blueprint
export const generateExamQuestion = async (
    blueprint: QuestionBlueprint, 
    aiConfig: AIConfig
): Promise<ExamQuestion> => {
    const GENERATOR_PROMPT = `
    You are a professional exam question generator.
    
    BLUEPRINT FOR THIS QUESTION:
    Type: ${blueprint.type}
    Difficulty: ${blueprint.difficulty}
    Score: ${blueprint.score}
    Knowledge Point: ${blueprint.knowledgePoint}
    Intent: ${blueprint.designIntent}
    
    TASK:
    Generate the content for this specific question based on the blueprint.
    
    CRITICAL FORMATTING RULES:
    1. Output RAW JSON only. No Markdown blocks.
    2. ESCAPE ALL BACKSLASHES in LaTeX. Example: use "\\\\frac" instead of "\\frac".
    3. ESCAPE QUOTES inside strings.
    4. Ensure "correctAnswer" matches the "type" (e.g. string for single_choice, array of strings for multiple_choice).
    
    OUTPUT FORMAT (RAW JSON):
    {
      "type": "${blueprint.type}",
      "content": "Question text with LaTeX like $\\\\sin x$...",
      "options": ["A. Option 1", "B. Option 2"] (required for single_choice/multiple_choice),
      "correctAnswer": "A" (or ["A","B"] for multiple),
      "score": ${blueprint.score},
      "difficulty": "${blueprint.difficulty}",
      "analysis": "Explanation with LaTeX...",
      "gradingCriteria": "Grading rules...",
      "thought_trace": "Design reasoning..."
    }
    `;

    try {
        let responseText = "";
        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Question Gen", "Generate question.", GENERATOR_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Question Gen", "Generate question.", GENERATOR_PROMPT);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        const data = JSON.parse(cleanJson);
        delete data.thought_trace; // Cleanup
        
        return {
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            ...data,
            isGraded: false
        };
    } catch (e: any) {
        throw new Error("Question gen failed: " + e.message);
    }
};

export const gradeExamQuestion = async (
    question: ExamQuestion,
    userAnswer: any,
    aiConfig: AIConfig
): Promise<{ score: number; feedback: string }> => {
    const GRADER_PROMPT = `
    You are a strict math exam grader.
    
    QUESTION:
    ${question.content}
    
    STANDARD ANSWER:
    ${JSON.stringify(question.correctAnswer)}
    
    GRADING CRITERIA:
    ${question.gradingCriteria}
    
    MAX SCORE: ${question.score}
    
    STUDENT ANSWER:
    ${JSON.stringify(userAnswer)}
    
    TASK:
    1. Compare student answer with standard answer.
    2. For subjective questions, apply partial credit based on criteria.
    3. **CRITICAL**: Include a "thought_trace" field with your grading reasoning.
    
    OUTPUT FORMAT (RAW JSON):
    {
        "score": number (0 to ${question.score}),
        "feedback": "Concise feedback in Chinese...",
        "thought_trace": "..."
    }
    `;

    try {
        let responseText = "";
        if (aiConfig.provider === 'openai') {
            responseText = await callOpenAIAPI(aiConfig, [], "Exam Grade", "Grade this.", GRADER_PROMPT);
        } else {
            responseText = await callGeminiAPI(aiConfig, [], "Exam Grade", "Grade this.", GRADER_PROMPT);
        }

        let cleanJson = responseText.trim();
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
        const start = cleanJson.indexOf('{');
        const end = cleanJson.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanJson = cleanJson.substring(start, end + 1);
        }

        const data = JSON.parse(cleanJson);
        return {
            score: data.score,
            feedback: data.feedback
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
        return { score: 0, feedback: "AI 批改失败，请人工核对。" };
    }
};