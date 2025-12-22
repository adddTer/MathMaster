
import React from 'react';
import { PenTool, Loader2, ArrowRight } from 'lucide-react';

interface EssayInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: () => void;
    isWriting: boolean;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const EssayInput: React.FC<EssayInputProps> = ({ value, onChange, onSend, isWriting, inputRef }) => {
    return (
        <section className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden ring-4 ring-orange-50/50">
            <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex justify-between items-center">
                <span className="text-xs font-bold text-orange-800 flex items-center gap-2">
                    <PenTool className="w-3 h-3" /> 主编指令
                </span>
                <span className="text-[10px] text-orange-600/70">
                    点击上方卡片可直接引用，或手动输入指令
                </span>
            </div>
            <div className="p-4">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full min-h-[120px] text-sm text-slate-800 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none resize-none placeholder-slate-400 bg-white"
                    placeholder="在此输入你的决定。例如：'采用方案一，但把开头改得更具诗意一些...'，或者直接点击上方卡片引用内容。"
                />
                <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-slate-400">
                        身份：<span className="font-bold text-slate-600">Decision Maker</span>
                    </span>
                    <button 
                        onClick={onSend}
                        disabled={!value.trim() || isWriting}
                        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-200"
                    >
                        {isWriting ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                        {isWriting ? '执行中...' : '下达指令'}
                    </button>
                </div>
            </div>
        </section>
    );
};
