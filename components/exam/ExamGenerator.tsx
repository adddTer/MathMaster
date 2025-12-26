
import React, { useState, useEffect } from 'react';
import { ExamConfig, ExamSession, AIConfig, ExamQuestion } from '../../types';
import { generateExamBlueprint, generateExamQuestion } from '../../services/examService';
import { Loader2, Play, CheckCircle2, AlertCircle, FileText, BrainCircuit, Cpu, RefreshCw } from 'lucide-react';

interface ModelOption { id: string; name: string; }

interface ExamGeneratorProps {
    config: ExamConfig;
    aiConfig: AIConfig;
    availableModels: { gemini: ModelOption[], openai: ModelOption[] };
    onExamCreated: (exam: ExamSession) => void;
    savedState?: any;
    onUpdateState?: (state: any) => void;
}

export const ExamGeneratorBlock: React.FC<ExamGeneratorProps> = ({ 
    config, aiConfig, availableModels, onExamCreated, savedState, onUpdateState
}) => {
    const [status, setStatus] = useState<'idle' | 'planning' | 'generating' | 'done' | 'error'>(savedState?.status || 'idle');
    const [progress, setProgress] = useState(savedState?.progress || 0);
    const [generatedExam, setGeneratedExam] = useState<ExamSession | null>(savedState?.generatedExam || null);
    const [selectedModelId, setSelectedModelId] = useState<string>(savedState?.selectedModelId || aiConfig.modelId || 'gemini-2.5-flash');

    useEffect(() => {
        if (savedState) {
            if (savedState.status === 'generating' || savedState.status === 'planning') {
                 setStatus('error'); // Recovery
            } else {
                if (savedState.status) setStatus(savedState.status);
                if (savedState.progress) setProgress(savedState.progress);
                if (savedState.generatedExam) setGeneratedExam(savedState.generatedExam);
            }
        }
    }, []);

    const startGeneration = async () => {
        const genConfig: AIConfig = { ...aiConfig, modelId: selectedModelId };
        const update = (s: any) => {
            if (s.status) setStatus(s.status);
            if (s.progress !== undefined) setProgress(s.progress);
            if (s.generatedExam) setGeneratedExam(s.generatedExam);
            onUpdateState?.({ 
                status: s.status || status,
                progress: s.progress ?? progress,
                generatedExam: s.generatedExam || generatedExam,
                selectedModelId 
            });
        };

        update({ status: 'planning', progress: 5 });
        
        try {
            const blueprint = await generateExamBlueprint(config, genConfig);
            update({ status: 'generating', progress: 10 });
            
            const newExam: ExamSession = {
                id: Date.now().toString(),
                config: config,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                status: 'ready',
                questions: [],
                currentQuestionIndex: 0
            };

            let completed = 0;
            const questions = await Promise.all(blueprint.map(async (bp) => {
                let q;
                try {
                    q = await generateExamQuestion(bp, genConfig);
                } catch(e) {
                    q = {
                        id: `err-${bp.index}`, type: bp.type, score: bp.score, difficulty: bp.difficulty,
                        content: "(生成失败)", correctAnswer: "", isGraded: false
                    } as ExamQuestion;
                }
                completed++;
                update({ status: 'generating', progress: 10 + (completed/blueprint.length)*90 });
                return q;
            }));

            newExam.questions = questions;
            onExamCreated(newExam); // Let parent handle state persistence for 'done'
        } catch (e) {
            update({ status: 'error' });
        }
    };

    const allModels = [...availableModels.gemini, ...availableModels.openai];

    if (status === 'done' && generatedExam) {
        return (
            <div className="my-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="w-6 h-6" /></div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{config.title}</h3>
                <p className="text-sm text-slate-500 mb-4">共 {generatedExam.questions.length} 题</p>
                <div className="flex gap-2 justify-center">
                    <button onClick={() => onExamCreated(generatedExam)} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2"><Play className="w-4 h-4" /> 开始答题</button>
                    <button onClick={startGeneration} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 shadow-sm flex items-center gap-2"><RefreshCw className="w-4 h-4" /> 再生成一份</button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">试卷生成器 <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">测试版</span></div>
                    <div className="text-xs text-slate-500">{config.topic}</div>
                </div>
            </div>
            <div className="p-5">
                <div className="space-y-4 text-sm mb-6">
                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500">题目数量</span><span className="font-medium text-slate-800">{config.questionCount}</span></div>
                    <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-500">难度分布</span><span className="font-medium text-slate-800">{config.difficultyDistribution}</span></div>
                    {status === 'idle' && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1"><Cpu className="w-3 h-3" /> 选择出题模型</label>
                            <select value={selectedModelId} onChange={(e) => setSelectedModelId(e.target.value)} className="w-full bg-white border border-slate-300 rounded text-sm px-2 py-1.5 outline-none">
                                {allModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>
                {status === 'idle' ? (
                    <>
                        <button onClick={startGeneration} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"><BrainCircuit className="w-4 h-4" /> 确认并生成</button>
                        <div className="mt-3 flex items-start gap-2 text-[10px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100"><AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /><span>建议人工复核生成内容。</span></div>
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{status === 'planning' ? '规划结构...' : `生成题目 (${Math.round(progress)}%)`}</span></div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full transition-all duration-500 ${status === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} /></div>
                        {status === 'error' && <button onClick={() => setStatus('idle')} className="w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs">生成中断，点击重试</button>}
                    </div>
                )}
            </div>
        </div>
    );
};
