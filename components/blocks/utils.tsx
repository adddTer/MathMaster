
import React, { useEffect, useState } from 'react';
import { MathFormula } from '../MathFormula';
import { Loader2, RefreshCcw, ShieldAlert, XCircle, Copy, Check } from 'lucide-react';

export const blockRegex = /(^|\n)(:::(?:quiz|keypoint|choice|multiple_choice|fill_in|true_false|step_solver|comparison|correction|checklist|tips|suggestions|plot|chart|complex_plane|solid_geometry|exam_config|essay_generator|essay_decisions)\s*?\n[\s\S]*?\n:::)(?=\n|$)/g;

export const safeParseJSON = (str: string): { data: any, error: string | null } => {
    try {
        const parsed = JSON.parse(str);
        return { data: parsed, error: null };
    } catch (e: any) {
        try {
            let clean = str.trim();
            clean = clean.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
            const parsedClean = JSON.parse(clean);
            return { data: parsedClean, error: null };
        } catch (e2: any) {
            try {
                const match = str.match(/\{[\s\S]*\}/);
                if (match) {
                    const parsedMatch = JSON.parse(match[0]);
                    return { data: parsedMatch, error: null };
                }
            } catch (e3) {}
            return { data: null, error: e.message || "Invalid JSON" };
        }
    }
};

export const InlineParser: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  // Expanded regex to support \[...\] (block) and \(...\) (inline) in addition to $$ and $
  const parts = content.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[\s\S]*?\$|\\\([\s\S]*?\\\))/g);

  return (
    <>
      {parts.map((part, i) => {
        // Block Math: $$...$$
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const tex = part.slice(2, -2);
          return <MathFormula key={i} tex={tex} block />;
        }
        // Block Math: \[...\]
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          const tex = part.slice(2, -2);
          return <MathFormula key={i} tex={tex} block />;
        }
        
        // Inline Math: $...$
        if (part.startsWith('$') && part.endsWith('$')) {
          const tex = part.slice(1, -1);
          return <MathFormula key={i} tex={tex} />;
        }
        // Inline Math: \(...\)
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          const tex = part.slice(2, -2);
          return <MathFormula key={i} tex={tex} />;
        }
        
        // Markdown Bold: **...**
        const subParts = part.split(/(\*\*[\s\S]*?\*\*)/g);
        return (
          <span key={i}>
            {subParts.map((sub, j) => {
              if (sub.startsWith('**') && sub.endsWith('**')) {
                return <strong key={j} className="font-bold text-slate-900">{sub.slice(2, -2)}</strong>;
              }
              return <span key={j}>{sub}</span>;
            })}
          </span>
        );
      })}
    </>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
    const [copied, setCopied] = React.useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-100 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-mono font-medium">{language || 'code'}</span>
                <button onClick={handleCopy} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-slate-800 bg-white">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export const StandardTextBlock: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;
  
  // Detect code blocks first
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const parts = content.split(codeBlockRegex);
  
  // If no code blocks, split by newlines as before
  if (parts.length === 1) {
      const lines = content.split('\n');
      return (
        <div className="space-y-2">
          {lines.map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} className="h-2"></div>; 

            if (trimmed.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2"><InlineParser content={trimmed.slice(4)} /></h3>;
            }
            if (trimmed.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold text-slate-800 mt-5 mb-2 border-b border-slate-100 pb-1"><InlineParser content={trimmed.slice(3)} /></h2>;
            }
            if (trimmed === '---' || trimmed === '***') {
                return <hr key={i} className="my-4 border-slate-200" />;
            }
            if (trimmed.match(/^[-*]\s+/)) {
                return (
                    <div key={i} className="flex items-start gap-2 ml-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></div>
                        <div><InlineParser content={trimmed.replace(/^[-*]\s+/, '')} /></div>
                    </div>
                );
            }

            return (
                <div key={i} className="min-h-[1em]">
                    <InlineParser content={line} />
                </div>
            );
          })}
        </div>
      );
  }

  // Handle interleaved content and code blocks
  return (
      <div className="space-y-2">
          {parts.map((part, i) => {
              if (i % 3 === 0) {
                  return <StandardTextBlock key={i} content={part} />;
              }
              if (i % 3 === 1) {
                  // Language part, wait for code
                  return null;
              }
              if (i % 3 === 2) {
                  const lang = parts[i-1];
                  return <CodeBlock key={i} language={lang} code={part} />;
              }
              return null;
          })}
      </div>
  );
};

export const StyledBlock: React.FC<{
    title: React.ReactNode;
    icon: React.ElementType;
    color: 'blue' | 'indigo' | 'cyan' | 'emerald' | 'slate' | 'orange' | 'red' | 'teal' | 'amber' | 'violet';
    children: React.ReactNode;
}> = ({ title, icon: Icon, color, children }) => {
    const styles = {
        blue: { border: 'border-blue-500', headerBg: 'bg-blue-50/50', iconColor: 'text-blue-600' },
        indigo: { border: 'border-indigo-500', headerBg: 'bg-indigo-50/50', iconColor: 'text-indigo-600' },
        cyan: { border: 'border-cyan-500', headerBg: 'bg-cyan-50/50', iconColor: 'text-cyan-600' },
        emerald: { border: 'border-emerald-500', headerBg: 'bg-emerald-50/50', iconColor: 'text-emerald-600' },
        slate: { border: 'border-slate-500', headerBg: 'bg-slate-50/50', iconColor: 'text-slate-600' },
        orange: { border: 'border-orange-500', headerBg: 'bg-orange-50/50', iconColor: 'text-orange-600' },
        red: { border: 'border-red-500', headerBg: 'bg-red-50/50', iconColor: 'text-red-600' },
        teal: { border: 'border-teal-500', headerBg: 'bg-teal-50/50', iconColor: 'text-teal-600' },
        amber: { border: 'border-amber-500', headerBg: 'bg-amber-50/50', iconColor: 'text-amber-600' },
        violet: { border: 'border-violet-500', headerBg: 'bg-violet-50/50', iconColor: 'text-violet-600' }
    };

    const s = styles[color];

    return (
        <div className={`my-6 bg-white border-l-4 ${s.border} rounded-r-xl shadow-sm border-y border-r border-slate-200 overflow-hidden`}>
            <div className={`px-5 py-3 border-b border-slate-100 ${s.headerBg} flex items-center gap-2`}>
                <Icon className={`w-4 h-4 ${s.iconColor}`} />
                <h3 className="font-bold text-slate-800 text-sm tracking-wide">{title}</h3>
            </div>
            <div className="p-5 text-slate-700 leading-relaxed bg-white">
                {children}
            </div>
        </div>
    );
};

export const ErrorBlock = ({ 
    content,
    errorMsg,
    onInteract, 
    savedState 
}: { 
    content: string,
    errorMsg: string,
    onInteract?: (a:string, p?:any) => void, 
    savedState?: any 
}) => {
    const retryCount = savedState?.retryCount || 0;
    const isRepairing = savedState?.isRepairing || false;
    // Track if we've initiated auto-repair on mount
    const [hasInitiatedAutoRepair, setHasInitiatedAutoRepair] = useState(false);

    useEffect(() => {
        // Immediate auto-repair on first encounter (retryCount === 0)
        // We only trigger this once per mount if not already repairing
        if (onInteract && retryCount === 0 && !isRepairing && !hasInitiatedAutoRepair) {
            setHasInitiatedAutoRepair(true);
            onInteract('fix_json', { brokenContent: content, error: errorMsg });
        }
    }, [retryCount, isRepairing, hasInitiatedAutoRepair]);

    // Show simplified loading state for the first attempt to avoid jarring "Error" UI
    if (retryCount === 0 || isRepairing) {
        return (
            <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500">正在优化内容展示...</span>
            </div>
        );
    }

    // Only show the red error block if we've failed at least once (retryCount > 0)
    return (
        <div className="my-4 p-4 border rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 bg-red-50 border-red-100">
            <span className="text-xs flex items-center gap-2 text-red-600">
                <ShieldAlert className="w-4 h-4" /> 
                {retryCount >= 3 ? "内容格式修复失败" : `格式错误，请重试 (${retryCount}/3)`}
            </span>
            {onInteract && (
                <button 
                    onClick={() => {
                        onInteract('fix_json', { brokenContent: content, error: errorMsg });
                        onInteract('update_state', { state: { isRepairing: true } });
                    }}
                    className="px-3 py-1 bg-white border border-red-200 text-red-600 text-xs rounded-full hover:bg-red-50 flex items-center gap-1 transition-colors"
                >
                    <RefreshCcw className="w-3 h-3" /> 重试修复
                </button>
            )}
        </div>
    );
};
