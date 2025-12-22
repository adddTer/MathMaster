import React from 'react';
import { BookOpen, ListChecks, ArrowRightLeft, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { safeParseJSON, StyledBlock, StandardTextBlock, ErrorBlock, InlineParser } from './utils';

export const KeypointBlock: React.FC<{ content: string }> = ({ content }) => {
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

export const StepSolverBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
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

export const ComparisonBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
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

export const CorrectionBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
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

export const ChecklistBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::checklist\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // Robustly handle if 'items' is an array of objects or strings
    const items = Array.isArray(data.items) ? data.items : [];

    return (
        <StyledBlock title={data.title || "检查清单"} icon={ListChecks} color="teal">
            <div className="space-y-2">
                {items.map((item: any, idx: number) => {
                    const text = typeof item === 'string' ? item : (item.text || item.content || JSON.stringify(item));
                    return (
                        <div key={idx} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded border border-slate-300 bg-white shrink-0 mt-0.5"></div>
                            <span className="text-sm text-slate-700"><InlineParser content={text} /></span>
                        </div>
                    );
                })}
            </div>
        </StyledBlock>
    );
};

export const TipsBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::tips\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    return (
        <StyledBlock title={data.title || "技巧"} icon={Sparkles} color="amber">
            <div className="text-sm opacity-90 leading-relaxed"><InlineParser content={data.content}/></div>
        </StyledBlock>
    );
};

export const SuggestionsBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract }) => {
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
