
import React from 'react';
import { ChevronLeft, LayoutList, Quote, BookOpen, User, Bot } from 'lucide-react';
import { EssaySession } from '../../types';

interface EssaySidebarProps {
    session: EssaySession;
    history: {role: 'user'|'model', content: string}[];
    onBack: () => void;
    bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const EssaySidebar: React.FC<EssaySidebarProps> = ({ session, history, onBack, bottomRef }) => {
    return (
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-700">项目蓝图</h3>
                <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-xs">
                    <ChevronLeft className="w-4 h-4" /> 返回列表
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Outline Display */}
                {session.config.outline && session.config.outline.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <LayoutList className="w-3 h-3" /> 结构大纲
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                            {session.config.outline.map((item, i) => (
                                <div key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed">
                                    <span className="font-bold text-slate-400 shrink-0">{i+1}.</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Materials Display */}
                {session.config.materials && session.config.materials.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            <Quote className="w-3 h-3" /> 精选素材
                        </div>
                        <div className="space-y-2">
                            {session.config.materials.map((mat, i) => (
                                <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg p-2 text-xs text-orange-900 leading-relaxed">
                                    {mat}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat History */}
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <BookOpen className="w-3 h-3" /> 编委会记录
                    </div>
                    <div className="space-y-3">
                        {history.slice(1).map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                </div>
                                <div className={`text-xs p-2 rounded-lg ${msg.role === 'user' ? 'bg-orange-50 text-orange-900' : 'bg-slate-50 text-slate-700'}`}>
                                    {msg.content.slice(0, 60)}{msg.content.length > 60 ? '...' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div ref={bottomRef}></div>
            </div>
        </div>
    );
};
