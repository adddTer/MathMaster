
import React from 'react';
import { Lightbulb, Copy, Loader2 } from 'lucide-react';
import { EditorCard } from '../../types';

interface EssaySuggestionsProps {
    cards: EditorCard[];
    loading: boolean;
    onSelect: (content: string) => void;
}

export const EssaySuggestions: React.FC<EssaySuggestionsProps> = ({ cards, loading, onSelect }) => {
    return (
        <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" /> 主编决策建议
            </div>
            {loading ? (
                <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    正在整合顾问意见，草拟写作方案...
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-4">
                    {cards.map((card, i) => (
                        <div 
                            key={i} 
                            onClick={() => onSelect(card.content)}
                            className="bg-gradient-to-b from-white to-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">{card.title}</h4>
                                <Copy className="w-3 h-3 text-slate-300 group-hover:text-orange-400" />
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {card.tags.map(t => (
                                    <span key={t} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{t}</span>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mb-3 italic border-l-2 border-slate-200 pl-2">
                                "{card.reasoning}"
                            </p>
                            <div className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-100 group-hover:border-orange-100 line-clamp-3">
                                {card.content}
                            </div>
                        </div>
                    ))}
                    {cards.length === 0 && !loading && (
                        <div className="col-span-full text-center py-4 text-sm text-slate-400 italic">
                            暂无建议，请在下方输入您的写作指令。
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
