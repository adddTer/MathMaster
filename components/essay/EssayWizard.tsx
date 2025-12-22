
import React, { useState } from 'react';
import { ArrowRight, Loader2, Check } from 'lucide-react';
import { EssayConfig, AIConfig } from '../../types';
import { fetchBrainstorming, fetchOutline, fetchMaterials } from '../../services/essayService';

interface EssayWizardProps {
    onCancel: () => void;
    onComplete: (config: EssayConfig) => void;
    aiConfig: AIConfig;
}

type WizardPhase = 'setup' | 'brainstorm' | 'structure' | 'materials';

export const EssayWizard: React.FC<EssayWizardProps> = ({ onCancel, onComplete, aiConfig }) => {
    const [phase, setPhase] = useState<WizardPhase>('setup');
    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState<EssayConfig>({
        topic: '',
        requirements: '',
        wordCount: '800',
        style: '议论文'
    });
    
    const [brainstormOptions, setBrainstormOptions] = useState<any[]>([]);
    const [outlineDraft, setOutlineDraft] = useState<string[]>([]);
    const [materialOptions, setMaterialOptions] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<Set<number>>(new Set());

    const handleNext = async () => {
        if (phase === 'setup') {
            if (!config.topic.trim()) return;
            setIsLoading(true);
            try {
                const options = await fetchBrainstorming(config, aiConfig);
                setBrainstormOptions(options);
                setPhase('brainstorm');
            } catch (e) {
                alert("生成立意失败，请检查网络或 API Key");
            } finally { setIsLoading(false); }
        } else if (phase === 'brainstorm') {
            if (!config.selectedAngle) return;
            setIsLoading(true);
            try {
                const outline = await fetchOutline(config, aiConfig);
                setOutlineDraft(outline);
                setConfig(prev => ({ ...prev, outline }));
                setPhase('structure');
            } catch (e) {
                alert("生成大纲失败");
            } finally { setIsLoading(false); }
        } else if (phase === 'structure') {
            setIsLoading(true);
            try {
                const materials = await fetchMaterials(config, aiConfig);
                setMaterialOptions(materials);
                setSelectedMaterials(new Set(materials.map((_, i) => i)));
                setPhase('materials');
            } catch (e) {
                alert("生成素材失败");
            } finally { setIsLoading(false); }
        } else if (phase === 'materials') {
            const chosenMaterials = materialOptions.filter((_, i) => selectedMaterials.has(i));
            const finalConfig = { ...config, materials: chosenMaterials };
            onComplete(finalConfig);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex justify-between mb-8 px-4">
            {['头脑风暴', '确定立意', '构建骨架', '填充血肉'].map((label, i) => {
                const phases = ['setup', 'brainstorm', 'structure', 'materials'];
                const currentIdx = phases.indexOf(phase);
                const isCompleted = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                    <div key={i} className={`flex flex-col items-center gap-2 ${isCurrent ? 'text-orange-600 font-bold' : (isCompleted ? 'text-emerald-600' : 'text-slate-300')}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${isCurrent ? 'border-orange-600 bg-orange-50' : (isCompleted ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white')}`}>
                            {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className="text-xs hidden sm:block">{label}</span>
                    </div>
                )
            })}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
                <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-10">
                    {renderStepIndicator()}
                    <h2 className="text-xl font-bold text-slate-800 text-center">
                        {phase === 'setup' && "第一步：确定主题"}
                        {phase === 'brainstorm' && "第二步：选择立意 (切入点)"}
                        {phase === 'structure' && "第三步：构建大纲"}
                        {phase === 'materials' && "第四步：精选素材"}
                    </h2>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            <span className="animate-pulse">AI 顾问团正在思考中...</span>
                        </div>
                    ) : (
                        <>
                            {phase === 'setup' && (
                                <div className="space-y-6 max-w-lg mx-auto">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">作文题目</label>
                                        <input type="text" value={config.topic} onChange={e => setConfig({...config, topic: e.target.value})} placeholder="例如：论“变与不变”" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">要求/材料</label>
                                        <textarea value={config.requirements} onChange={e => setConfig({...config, requirements: e.target.value})} placeholder="粘贴作文材料..." className="w-full p-3 h-24 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none resize-none bg-white" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">体裁</label>
                                            <select value={config.style} onChange={e => setConfig({...config, style: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white">
                                                <option>议论文</option><option>记叙文</option><option>散文</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">字数</label>
                                            <select value={config.wordCount} onChange={e => setConfig({...config, wordCount: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none bg-white">
                                                <option value="800">800字</option><option value="1000">1000字</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {phase === 'brainstorm' && (
                                <div className="grid gap-4">
                                    {brainstormOptions.map((opt, i) => (
                                        <div key={i} onClick={() => setConfig({...config, selectedAngle: opt.title})} className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${config.selectedAngle === opt.title ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                                            <h3 className="font-bold text-lg text-slate-800 mb-2">{opt.title}</h3>
                                            <p className="text-sm text-slate-600 mb-3">{opt.description}</p>
                                            <div className="flex gap-2">
                                                {opt.tags?.map((t: string, j: number) => <span key={j} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">{t}</span>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {phase === 'structure' && (
                                <div className="space-y-4">
                                    {outlineDraft.map((item, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">{i+1}</div>
                                            <textarea 
                                                value={item} 
                                                onChange={e => {
                                                    const newDraft = [...outlineDraft];
                                                    newDraft[i] = e.target.value;
                                                    setOutlineDraft(newDraft);
                                                    setConfig({...config, outline: newDraft});
                                                }}
                                                className="flex-1 p-3 border border-slate-200 rounded-lg text-sm leading-relaxed focus:border-orange-300 outline-none resize-none h-20 bg-white"
                                            />
                                        </div>
                                    ))}
                                    <button onClick={() => {
                                        const newDraft = [...outlineDraft, "新段落..."];
                                        setOutlineDraft(newDraft);
                                        setConfig({...config, outline: newDraft});
                                    }} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm hover:bg-slate-50">+ 添加段落</button>
                                </div>
                            )}

                            {phase === 'materials' && (
                                <div className="space-y-3">
                                    {materialOptions.map((mat, i) => (
                                        <div key={i} onClick={() => {
                                            const newSet = new Set(selectedMaterials);
                                            if (newSet.has(i)) newSet.delete(i); else newSet.add(i);
                                            setSelectedMaterials(newSet);
                                        }} className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${selectedMaterials.has(i) ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selectedMaterials.has(i) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'}`}>
                                                {selectedMaterials.has(i) && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{mat}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
                    <button onClick={() => {
                        if (phase === 'setup') onCancel();
                        else if (phase === 'brainstorm') setPhase('setup');
                        else if (phase === 'structure') setPhase('brainstorm');
                        else if (phase === 'materials') setPhase('structure');
                    }} className="px-6 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all font-medium">上一步</button>
                    
                    <button onClick={handleNext} disabled={isLoading || (phase === 'setup' && !config.topic.trim())} className="px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-md transition-all font-bold flex items-center gap-2">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (phase === 'materials' ? '开始写作' : '下一步')} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
