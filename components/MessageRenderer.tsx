import React, { useState, useEffect } from 'react';
import { MathFormula } from './MathFormula';
import { FunctionPlot } from './FunctionPlot';
import { SolidGeometry } from './SolidGeometry';
import { ComplexPlane } from './ComplexPlane';
import { ChartComponent } from './ChartComponent';
import { ExamGeneratorBlock } from './ExamComponents'; 
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, BookOpen, CheckCircle2, XCircle, MousePointerClick, RefreshCcw, Eye, PenLine, Send, BrainCircuit, Type, ListChecks, ArrowRightLeft, ShieldAlert, Sparkles, CheckSquare, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

interface MessageRendererProps {
  content: string;
  onInteract?: (action: string, payload?: any, blockIndex?: number) => void;
  savedState?: Record<number, any>; 
  aiConfig?: any; 
  availableModels?: any; // Added prop
}

// Relaxed regex to allow for potential missing newlines before the tag if it's the start of the string
// Added: chart, complex_plane, solid_geometry, exam_config
// Fixed: Now captures the preceding newline (^|\n) so it is preserved in split() arrays.
export const blockRegex = /(^|\n)(:::(?:quiz|keypoint|choice|fill_in|true_false|step_solver|comparison|correction|checklist|tips|suggestions|plot|chart|complex_plane|solid_geometry|exam_config)\s*?\n[\s\S]*?\n:::)(?=\n|$)/g;

// --- Helper Functions & Shared Components ---

const safeParseJSON = (str: string): { data: any, error: string | null } => {
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

const InlineParser: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;

  const parts = content.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const tex = part.slice(2, -2);
          return <MathFormula key={i} tex={tex} block />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          const tex = part.slice(1, -1);
          return <MathFormula key={i} tex={tex} />;
        }
        
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

const StandardTextBlock: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;
  
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
};

// Unified Card Component that standardizes style
const StyledBlock: React.FC<{
    title: React.ReactNode;
    icon: React.ElementType;
    color: 'blue' | 'indigo' | 'cyan' | 'emerald' | 'slate' | 'orange' | 'red' | 'teal' | 'amber' | 'violet';
    children: React.ReactNode;
}> = ({ title, icon: Icon, color, children }) => {
    // Map colors to full Tailwind classes to ensure they are included in build
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

const ErrorBlock = ({ 
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

    useEffect(() => {
        if (onInteract && retryCount < 3 && !isRepairing) {
            const timer = setTimeout(() => {
                onInteract('fix_json', { brokenContent: content, error: errorMsg });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [retryCount, isRepairing]);

    if (isRepairing) {
        return (
            <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 animate-pulse">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-500">正在修复题目格式...</span>
            </div>
        );
    }

    return (
        <div className={`my-4 p-4 border rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${retryCount >= 3 ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'}`}>
            <span className={`text-xs flex items-center gap-2 ${retryCount >= 3 ? 'text-slate-500' : 'text-red-600'}`}>
                {retryCount >= 3 ? (
                    <><XCircle className="w-4 h-4" /> 格式修复失败 ({retryCount}次)，已放弃</>
                ) : (
                    <><ShieldAlert className="w-4 h-4" /> 格式错误，准备修复 ({retryCount}/3)...</>
                )}
            </span>
            {retryCount >= 3 && onInteract && (
                <button 
                    onClick={() => {
                        onInteract('fix_json', { brokenContent: content, error: errorMsg });
                        onInteract('update_state', { state: { retryCount: 0, isRepairing: true } });
                    }}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-full hover:bg-slate-100 flex items-center gap-1"
                >
                    <RefreshCcw className="w-3 h-3" /> 手动重试
                </button>
            )}
        </div>
    );
};

const SuggestionsBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract }) => {
    const rawJson = content.replace(/^:::suggestions\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data || !data.items || !Array.isArray(data.items)) return null;
    return (
        <div className="my-4 flex flex-wrap gap-2">
            {data.items.map((item: string, idx: number) => (
                <button 
                    key={idx}
                    onClick={() => onInteract?.('apply_suggestion', { text: item })}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors active:scale-95"
                >
                    <Sparkles className="w-3 h-3" />
                    {item}
                    <ArrowRight className="w-3 h-3 opacity-50" />
                </button>
            ))}
        </div>
    );
};

const KeypointBlock: React.FC<{ content: string }> = ({ content }) => {
  const raw = content.replace(/^:::keypoint\s*/, '').replace(/\s*:::$/, '');
  const splitIndex = raw.indexOf('\n---\n');
  let title = "核心要点";
  let body = raw;
  if (splitIndex !== -1) {
      title = raw.substring(0, splitIndex).trim();
      body = raw.substring(splitIndex + 5).trim();
  } else {
      const firstLineIdx = raw.indexOf('\n');
      if (firstLineIdx !== -1 && firstLineIdx < 20) {
           title = raw.substring(0, firstLineIdx).trim();
           body = raw.substring(firstLineIdx + 1).trim();
      }
  }
  return (
    <StyledBlock title={title} icon={BookOpen} color="blue">
        <StandardTextBlock content={body} />
    </StyledBlock>
  );
};

const ChoiceBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::choice\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [selected, setSelected] = useState<number | null>(savedState?.selected ?? null);
    const [hasSubmitted, setHasSubmitted] = useState(savedState?.hasSubmitted ?? false);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const correctIndex = data.answer ? (data.answer.trim().toUpperCase().charCodeAt(0) - 65) : -1;
    const handleSelect = (idx: number) => {
        if (hasSubmitted) return;
        setSelected(idx);
        setHasSubmitted(true);
        onInteract?.('update_state', { state: { selected: idx, hasSubmitted: true } });
    };
    return (
        <StyledBlock title="单选题" icon={MousePointerClick} color="indigo">
             <StandardTextBlock content={data.question || ""} />
             <div className="mt-4 space-y-2">
                 {(data.options || []).map((opt: string, idx: number) => {
                     let statusClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                     let icon = null;
                     if (hasSubmitted) {
                         if (idx === correctIndex) {
                             statusClass = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500";
                             icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                         } else if (idx === selected && idx !== correctIndex) {
                             statusClass = "bg-red-50 border-red-300";
                             icon = <XCircle className="w-4 h-4 text-red-500" />;
                         } else {
                             statusClass = "opacity-50 border-slate-100";
                         }
                     }
                     return (
                        <button key={idx} onClick={() => handleSelect(idx)} disabled={hasSubmitted}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${statusClass}`}>
                            <span className={`text-sm flex-1 mr-2 ${hasSubmitted && idx === correctIndex ? 'font-bold text-emerald-900' : 'text-slate-700'}`}>
                                <InlineParser content={opt} />
                            </span>
                            {icon}
                        </button>
                     );
                 })}
             </div>
             {hasSubmitted && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${selected === correctIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {selected === correctIndex ? '回答正确' : '回答错误'}
                        </span>
                        <span className="text-xs text-slate-400">正确答案: {String.fromCharCode(65 + correctIndex)}</span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed"><StandardTextBlock content={data.explanation || "暂无解析"} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

const FillInBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::fill_in\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [userVal, setUserVal] = useState(savedState?.userVal ?? "");
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(savedState?.status ?? 'idle');
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const parseNumber = (input: string): number => {
        if (!input) return NaN;
        const clean = String(input).replace(/\s/g, '');
        if (clean.includes('/')) {
            const parts = clean.split('/');
            return parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : NaN;
        }
        return parseFloat(clean);
    };
    const handleSubmit = () => {
        if (!userVal.trim()) return;
        const userNum = parseNumber(userVal);
        const ansNum = parseNumber(data.answer);
        let isCorrect = false;
        if (!isNaN(userNum) && !isNaN(ansNum)) {
             if (Math.abs(userNum - ansNum) < 0.0001) isCorrect = true;
        } else {
            if (userVal.replace(/\s/g, '').toLowerCase() === String(data.answer).replace(/\s/g, '').toLowerCase()) isCorrect = true;
        }
        const newStatus = isCorrect ? 'correct' : 'wrong';
        setStatus(newStatus);
        onInteract?.('update_state', { state: { userVal, status: newStatus } });
    };
    return (
        <StyledBlock title="填空题" icon={Type} color="cyan">
             <StandardTextBlock content={data.question || ""} />
             <div className="mt-4 flex gap-2">
                 <input type="text" value={userVal} onChange={(e) => setUserVal(e.target.value)} disabled={status === 'correct'} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="输入答案 (如 0.5)"
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none transition-all ${status === 'correct' ? 'bg-emerald-50 border-emerald-300' : status === 'wrong' ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`} />
                 <button onClick={handleSubmit} disabled={status === 'correct' || !userVal} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">提交</button>
             </div>
             {status !== 'idle' && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 rounded-lg">
                    <div className="text-sm text-slate-600"><StandardTextBlock content={data.explanation || `参考答案：${data.answer}`} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

const TrueFalseBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::true_false\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [result, setResult] = useState<'correct' | 'wrong' | null>(savedState?.result ?? null);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const getCorrectAnswer = (val: any): boolean => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase().trim() === 'true';
        return !!val;
    };
    const check = (choice: boolean) => {
        if (result) return;
        const ans = getCorrectAnswer(data.answer);
        const newResult = choice === ans ? 'correct' : 'wrong';
        setResult(newResult);
        onInteract?.('update_state', { state: { result: newResult } });
    };
    return (
        <StyledBlock title="判断题" icon={CheckSquare} color="emerald">
            <StandardTextBlock content={data.question || ""} />
            <div className="mt-4 flex gap-3">
                <button onClick={() => check(true)} disabled={!!result} className={`flex-1 py-2 rounded-lg border font-medium transition-all ${result ? (getCorrectAnswer(data.answer) ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'opacity-50') : 'hover:bg-slate-50'}`}>正确</button>
                <button onClick={() => check(false)} disabled={!!result} className={`flex-1 py-2 rounded-lg border font-medium transition-all ${result ? (!getCorrectAnswer(data.answer) ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'opacity-50') : 'hover:bg-slate-50'}`}>错误</button>
            </div>
            {result && (
                <div className={`p-4 border-t mt-4 rounded-lg ${result === 'correct' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                        {result === 'correct' ? <CheckCircle2 className="w-4 h-4 text-emerald-600"/> : <XCircle className="w-4 h-4 text-red-500"/>}
                        <span className={result === 'correct' ? 'text-emerald-700' : 'text-red-700'}>{result === 'correct' ? '回答正确' : '回答错误'}</span>
                    </div>
                    <div className="text-sm text-slate-600"><StandardTextBlock content={data.explanation} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

const StepSolverBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::step_solver\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title={data.title || "解题步骤"} icon={ListChecks} color="slate">
             <div className="space-y-0">
                 {data.steps?.map((step: any, idx: number) => (
                     <div key={idx} className="relative pl-6 pb-6 last:pb-0 border-l border-slate-200 last:border-0">
                         <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-white"></div>
                         <div className="text-xs font-bold text-slate-600 mb-1"><InlineParser content={step.title} /></div>
                         <div className="text-sm text-slate-700"><InlineParser content={step.content} /></div>
                     </div>
                 ))}
             </div>
        </StyledBlock>
    );
};

const ComparisonBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::comparison\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title={data.title || "概念对比"} icon={ArrowRightLeft} color="orange">
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="bg-slate-50 border-b border-slate-100">
                             {data.headers?.map((h: string, i: number) => (
                                 <th key={i} className="p-3 font-semibold text-slate-600"><InlineParser content={h}/></th>
                             ))}
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {data.rows?.map((row: string[], i: number) => (
                             <tr key={i}>
                                 {row.map((cell: string, j: number) => (
                                     <td key={j} className="p-3 text-slate-700"><InlineParser content={cell}/></td>
                                 ))}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </StyledBlock>
    );
};

const CorrectionBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::correction\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title="典型易错点" icon={ShieldAlert} color="red">
             <div className="grid gap-4">
                 <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                     <div className="text-xs font-bold text-red-500 mb-1 uppercase">错误解法</div>
                     <div className="text-sm text-red-900 opacity-90"><InlineParser content={data.wrong_solution}/></div>
                     <div className="mt-2 text-xs text-red-600 bg-white/50 p-2 rounded">
                         <span className="font-bold">错因：</span>{data.error_point}
                     </div>
                 </div>
                 <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                     <div className="text-xs font-bold text-emerald-600 mb-1 uppercase">正解</div>
                     <div className="text-sm text-emerald-900"><InlineParser content={data.correct_solution}/></div>
                 </div>
                 <div className="text-sm text-slate-600 border-t border-slate-100 pt-3">
                     <span className="font-bold text-slate-700">解析：</span><InlineParser content={data.explanation}/>
                 </div>
             </div>
        </StyledBlock>
    );
};

const ChecklistBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::checklist\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title={data.title || "检查清单"} icon={ListChecks} color="teal">
            <div className="space-y-2">
                {data.items?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded border border-slate-300 bg-white shrink-0 mt-0.5"></div>
                        <span className="text-sm text-slate-700"><InlineParser content={item} /></span>
                    </div>
                ))}
            </div>
        </StyledBlock>
    );
};

const TipsBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::tips\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title={data.title || "技巧"} icon={Sparkles} color="amber">
            <div className="text-sm opacity-90 leading-relaxed"><InlineParser content={data.content}/></div>
        </StyledBlock>
    );
};

const PlotBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::plot\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const props: any = {};
    if (data.functions) {
        props.config = data;
    } else if (data.type) {
        props.type = data.type;
        props.color = data.color;
        props.label = data.label;
    }
    return (
        <div className="my-4 w-full">
             <FunctionPlot 
                {...props} 
                onInteract={onInteract} 
                savedState={savedState} 
             />
        </div>
    );
};

const ChartBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::chart\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <ChartComponent {...data} />;
};

const ComplexBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::complex_plane\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <ComplexPlane {...data} />;
};

const GeometryBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::solid_geometry\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return <SolidGeometry {...data} />;
};

const QuizBlock: React.FC<{ content: string; onInteract?: (a: string, p?: any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::quiz\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const question = data.question || ""; 
    let displayQuestion = question;
    let displayAnswer = data.answer;
    let displayExplanation = data.explanation;
    if (!question && !displayAnswer) {
         const parts = rawJson.split(/\n\s*---\s*\n/);
         displayQuestion = parts[0];
         displayAnswer = parts[1];
         displayExplanation = parts[2];
    }
    const isAutoSubmit = data.auto_submit === true;
    const [mode, setMode] = useState<'question' | 'input' | 'result'>(
        savedState?.mode ?? (isAutoSubmit ? 'input' : 'question')
    );
    const [userAnswer, setUserAnswer] = useState(savedState?.userAnswer ?? "");
    const [submitted, setSubmitted] = useState(savedState?.submitted ?? false);
    const evaluation = savedState?.evaluation;
    const isEvaluating = savedState?.isEvaluating || false;
    const updateState = (newPartialState: any) => {
        onInteract?.('update_state', { state: { 
            mode, 
            userAnswer, 
            submitted, 
            ...newPartialState 
        }});
    };
    const handleModeChange = (newMode: 'question' | 'input' | 'result') => {
        setMode(newMode);
        updateState({ mode: newMode });
    };
    const handleUserAnswerChange = (val: string) => {
        setUserAnswer(val);
        updateState({ userAnswer: val });
    };
    const handleSubmitToAI = () => {
        if (!userAnswer.trim()) return;
        onInteract?.('auto_submit_quiz', { question: displayQuestion, userAnswer });
        updateState({ isEvaluating: true });
    };
    return (
        <StyledBlock title="主观题" icon={HelpCircle} color="violet">
            <StandardTextBlock content={displayQuestion || "题目内容解析错误"} />
            {mode === 'question' && !isAutoSubmit && (
                <div className="bg-slate-50 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-200 mt-4 -mx-5 -mb-5">
                    <button onClick={() => handleModeChange('input')} className="py-3 flex items-center justify-center gap-2 text-sm text-violet-600 font-medium hover:bg-violet-50"><PenLine className="w-4 h-4" /><span>我来做做看</span></button>
                    <button onClick={() => handleModeChange('result')} className="py-3 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium hover:bg-slate-100"><Eye className="w-4 h-4" /><span>直接看答案</span></button>
                </div>
            )}
            {mode === 'input' && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 mt-4 -mx-5 -mb-5">
                    <textarea 
                        value={userAnswer} 
                        onChange={(e) => handleUserAnswerChange(e.target.value)} 
                        placeholder="请输入你的解题思路..." 
                        className="w-full h-24 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-violet-100 outline-none mb-3 resize-none bg-white" 
                    />
                    {isEvaluating && (
                        <div className="mb-3 p-3 bg-violet-50 border border-violet-100 rounded-lg flex items-center gap-3 animate-pulse">
                            <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                            <span className="text-xs text-violet-600 font-medium">AI 正在批改你的答案...</span>
                        </div>
                    )}
                    {!isEvaluating && evaluation && (
                        <div className={`mb-3 p-4 rounded-lg border flex gap-3 ${
                            evaluation.status === 'correct' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                            evaluation.status === 'wrong' ? 'bg-red-50 border-red-100 text-red-800' :
                            'bg-amber-50 border-amber-100 text-amber-800'
                        }`}>
                            {evaluation.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : 
                             evaluation.status === 'wrong' ? <XCircle className="w-5 h-5 shrink-0" /> : 
                             <AlertCircle className="w-5 h-5 shrink-0" />}
                            <div>
                                <div className="font-bold text-sm mb-1">
                                    {evaluation.status === 'correct' ? '回答正确' :
                                     evaluation.status === 'wrong' ? '回答有误' :
                                     '思路部分正确'}
                                </div>
                                <div className="text-sm opacity-90">{evaluation.feedback}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {isAutoSubmit ? (
                             <button 
                                onClick={handleSubmitToAI} 
                                disabled={!userAnswer.trim() || submitted || isEvaluating} 
                                className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                             >
                                <BrainCircuit className="w-4 h-4" />
                                <span>{submitted ? '重新提交' : '提交给 AI 批改'}</span>
                             </button>
                        ) : (
                             <>
                                <button 
                                    onClick={handleSubmitToAI}
                                    disabled={!userAnswer.trim() || isEvaluating} 
                                    className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <BrainCircuit className="w-4 h-4" />
                                    <span>AI 批改</span>
                                </button>
                                <button onClick={() => handleModeChange('result')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">参考答案</button>
                             </>
                        )}
                    </div>
                </div>
            )}
            {(mode === 'result' || (submitted && evaluation)) && (
                <div className="bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 -mx-5 -mb-5">
                     <div className="px-5 py-4 border-b border-slate-100 bg-white">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">参考答案</div>
                         <StandardTextBlock content={displayAnswer || "暂无参考答案"} />
                         {displayExplanation && (<div className="mt-4 pt-4 border-t border-slate-50"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">详细解析</div><StandardTextBlock content={displayExplanation} /></div>)}
                    </div>
                    {!isAutoSubmit && (
                        <button onClick={() => handleModeChange('input')} className="w-full py-2 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><span>收起</span><ChevronUp className="w-3 h-3" /></button>
                    )}
                </div>
            )}
        </StyledBlock>
    );
};

// Exam Generator Block Component
const ExamConfigBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any; aiConfig: any; availableModels?: any }> = ({ content, onInteract, savedState, aiConfig, availableModels }) => {
    const rawJson = content.replace(/^:::exam_config\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // We render the interactive generator block here
    return (
        <ExamGeneratorBlock 
            config={data} 
            aiConfig={aiConfig}
            availableModels={availableModels || { gemini: [], openai: [] }}
            onExamCreated={(exam) => onInteract?.('start_exam', { exam })} 
            savedState={savedState} // Passed down to restore view
            onUpdateState={(state) => onInteract?.('update_state', { state })} // Persist progress
        />
    );
};

export const MessageRenderer: React.FC<MessageRendererProps> = ({ content, onInteract, savedState, aiConfig, availableModels }) => {
  if (!content) return null;

  const parts = content.split(blockRegex);

  return (
    <div className="message-content leading-7 text-[15px] md:text-base break-words space-y-4">
      {parts.map((part, index) => {
        const blockState = savedState ? savedState[index] : undefined;
        const compKey = `${index}-${part.length}`; 
        const interact = (action: string, payload?: any) => onInteract?.(action, payload, index);

        if (part.startsWith(':::quiz')) return <QuizBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::keypoint')) return <KeypointBlock key={compKey} content={part} />;
        if (part.startsWith(':::choice')) return <ChoiceBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::fill_in')) return <FillInBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::true_false')) return <TrueFalseBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::step_solver')) return <StepSolverBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::comparison')) return <ComparisonBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::correction')) return <CorrectionBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::checklist')) return <ChecklistBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::tips')) return <TipsBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::suggestions')) return <SuggestionsBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::plot')) return <PlotBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::chart')) return <ChartBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::complex_plane')) return <ComplexBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::solid_geometry')) return <GeometryBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        
        // New Exam Config Block
        if (part.startsWith(':::exam_config')) return <ExamConfigBlock key={compKey} content={part} onInteract={interact} savedState={blockState} aiConfig={aiConfig} availableModels={availableModels} />;
        
        if (part.trim() === '' && part !== '\n') return null;
        return <StandardTextBlock key={compKey} content={part} />;
      })}
    </div>
  );
};