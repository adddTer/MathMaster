
import React from 'react';
import { Lightbulb, MousePointerClick, Copy } from 'lucide-react';
import { safeParseJSON, ErrorBlock, InlineParser } from './utils';

export const EssayDecisionBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::essay_decisions\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;

    const items = Array.isArray(data) ? data : (data.items || []);

    return (
        <div className="my-4">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" /> 决策时刻：请主编定夺
            </div>
            <div className="grid gap-3">
                {items.map((card: any, i: number) => (
                    <div 
                        key={i} 
                        onClick={() => onInteract?.('apply_suggestion', { text: card.content })}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group relative"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-orange-700 transition-colors">{card.title}</h4>
                            <div className="p-1.5 rounded-full bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                            {card.tags?.map((t: string, j: number) => (
                                <span key={j} className="text-[10px] bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-500">{t}</span>
                            ))}
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-2 italic pl-2 border-l-2 border-slate-200">
                            "{card.reasoning}"
                        </p>
                        
                        <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 group-hover:bg-orange-50/30 group-hover:border-orange-100 transition-colors">
                            <InlineParser content={card.content} />
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center mt-3 text-xs text-slate-400">
                点击任意卡片采纳建议，或在下方输入框直接修改
            </div>
        </div>
    );
};
