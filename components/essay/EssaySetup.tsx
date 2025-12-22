
import React, { useEffect, useRef } from 'react';
import { Feather, Sparkles, Settings } from 'lucide-react';
import { EssayConfig, AIConfig } from '../../types';

interface EssaySetupProps {
    config: EssayConfig;
    setConfig: (c: EssayConfig) => void;
    onStart: () => void;
    onBack: () => void;
    aiConfig: AIConfig;
    availableModels: any[];
    setSelectedModelId: (id: string) => void;
    selectedModelId: string;
}

export const EssaySetup: React.FC<EssaySetupProps> = ({
    config,
    setConfig,
    onStart,
    onBack,
    aiConfig,
    availableModels,
    setSelectedModelId,
    selectedModelId
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize for requirements
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        const handleInput = () => {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 300) + 'px'; // Max height 300px
        };
        el.addEventListener('input', handleInput);
        return () => el.removeEventListener('input', handleInput);
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Feather className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">新建写作项目</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                智能多角色写作辅助系统
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">作文题目 (自拟或给定)</label>
                        <input 
                            type="text" 
                            value={config.topic}
                            onChange={e => setConfig({...config, topic: e.target.value})}
                            placeholder="例如：论“变与不变” / 自拟题目"
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">写作要求 / 材料</label>
                        <textarea 
                            ref={textareaRef}
                            value={config.requirements}
                            onChange={e => setConfig({...config, requirements: e.target.value})}
                            placeholder="粘贴作文材料或具体要求... (输入框会自动伸缩)"
                            className="w-full p-3 min-h-[100px] border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none resize-none transition-all bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">体裁</label>
                            <select 
                                value={config.style}
                                onChange={e => setConfig({...config, style: e.target.value})}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                            >
                                <option>议论文</option>
                                <option>记叙文</option>
                                <option>散文</option>
                                <option>应用文</option>
                                <option>不限</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">字数要求</label>
                            <input
                                type="text"
                                value={config.wordCount}
                                onChange={e => setConfig({...config, wordCount: e.target.value as any})}
                                placeholder="如：800字左右 / 不少于1000字"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                            <Settings className="w-3 h-3" /> 模型配置
                        </label>
                        <select 
                            value={selectedModelId}
                            onChange={e => setSelectedModelId(e.target.value)}
                            className="w-full p-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:border-orange-300 outline-none bg-white"
                        >
                            {availableModels.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <div className="text-[10px] text-slate-400 mt-1">
                            建议使用推理能力较强的模型 (如 Gemini Pro / GPT-4) 以获得最佳的逻辑建议。
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={onBack}
                            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors bg-white"
                        >
                            返回
                        </button>
                        <button 
                            onClick={onStart}
                            disabled={!config.topic.trim()}
                            className="flex-1 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" />
                            启动编委会
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
