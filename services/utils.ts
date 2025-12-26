
// --- Shared Utilities ---

export const sanitizeError = (error: any): string => {
    let msg = String(error?.message || error || '未知错误');
    msg = msg.replace(/OpenAI/gi, 'AI Service');
    msg = msg.replace(/Gemini/gi, 'AI Service');
    msg = msg.replace(/Google/gi, 'Provider');
    return msg;
};

export const sanitizeJsonString = (str: string): string => {
    let clean = str;
    
    // 1. Remove markdown wrappers
    const codeBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
        clean = codeBlockMatch[1].trim();
    } else {
        clean = clean.trim();
    }

    // 2. Try to recover truncated JSON arrays
    if (clean.startsWith('[') && !clean.endsWith(']')) {
        const lastCloseObj = clean.lastIndexOf('}');
        if (lastCloseObj !== -1) {
            clean = clean.substring(0, lastCloseObj + 1) + ']';
        }
    }

    // 3. Fix invalid escapes
    clean = clean.replace(/\\(?![/\\"'bfnrtu])/g, "\\\\");

    return clean;
};

export const extractJsonFromText = (text: string): string => {
    if (!text) return "{}";
    const sanitized = sanitizeJsonString(text);
    let clean = sanitized.trim();
    
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

export const safeJsonParse = (text: string): any => {
    try {
        return JSON.parse(text);
    } catch (e) {
        const aggressiveFix = text.replace(/\\/g, "\\\\");
        try {
            return JSON.parse(aggressiveFix);
        } catch (e2) {
            throw e;
        }
    }
};
