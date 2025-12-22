
import React from 'react';
import { Library, Sparkles } from 'lucide-react';
import { EssayAdvisorSuggestion } from '../../types';

interface EssayAdvisorsProps {
    advisors: EssayAdvisorSuggestion[];
    loading: boolean;
    progress: number;
    messageIndex: number;
    loadingMessages: string[];
    hasApiKey: boolean;
    onOpenSettings: () => void;
}

export const EssayAdvisors: React.FC<EssayAdvisorsProps> = ({ 
    advisors, loading, progress, messageIndex, loadingMessages, hasApiKey, onOpenSettings 
}) => {
    return (
        <section>
            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                <Library className="w-4 h-4" /> 顾问团意见
            </div>
            {loading ? (
                <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-full max-w-xs mb-4">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-orange-500 transition-all duration-300 ease-out" 
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-orange-600 font-medium animate-pulse">
                        <Sparkles className="w-4 h-4" />
                        <span>{loadingMessages[messageIndex]}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                        多智能体协作较慢，请耐心等待 (约10秒)...
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {advisors.map((advisor, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-orange-200 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-full text-sm">
                                    {advisor.avatar}
                                </div>
                                <span className="text-xs font-bold text-slate-700">{advisor.name}</span>
                                <span className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded ml-auto">{advisor.role}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {advisor.content}
                            </p>
                        </div>
                    ))}
                    {advisors.length === 0 && !loading && (
                        <div className="col-span-full text-center py-8 text-sm text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                            {!hasApiKey ? (
                                <button onClick={onOpenSettings} className="text-blue-600 underline hover:text-blue-800">
                                    请先配置 API Key 以激活顾问团
                                </button>
                            ) : (
                                <span className="italic">点击下方“下达指令”以手动激活顾问团，或等待初始化...</span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
