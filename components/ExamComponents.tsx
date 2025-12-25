
import React, { useState, useEffect, useRef } from 'react';
import { ExamConfig, ExamSession, ExamQuestion, AIConfig, QuestionBlueprint } from '../types';
import { generateExamBlueprint, generateExamQuestion, gradeExamQuestion } from '../services/geminiService';
import { Loader2, Play, CheckCircle2, AlertCircle, FileText, ChevronRight, ChevronLeft, Save, X, RotateCcw, BrainCircuit, CheckSquare, Square, PenTool, Cpu, RefreshCw, LayoutGrid } from 'lucide-react';
import { MathFormula } from './MathFormula';

// --- Helper: Content Renderer for Exams ---
// Parses string with $LaTeX$, $$LaTeX$$, \[LaTeX\], \(LaTeX\)
const ContentRenderer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
    if (!content) return null;
    
    // Improved regex to handle \[...\] and \(...\) which Gemini 3.0 often outputs
    // Split by: $$...$$, \[...\], $...$, \(...\)
    const parts = content.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[\s\S]*?\$|\\\([\s\S]*?\\\))/g);
    
    return (
        <span className={`whitespace-pre-wrap ${className}`}>
            {parts.map((part, i) => {
                if ((part.startsWith('$$') && part.endsWith('$$')) || (part.startsWith('\\[') && part.endsWith('\\]'))) {
                    // Block Math
                    const tex = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
                    return <MathFormula key={i} tex={tex} block />;
                }
                if ((part.startsWith('$') && part.endsWith('$')) || (part.startsWith('\\(') && part.endsWith('\\)'))) {
                    // Inline Math
                    const tex = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
                    return <MathFormula key={i} tex={tex} />;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

// --- Exam Generator Block (In Chat) ---

interface ModelOption {
    id: string;
    name: string;
}

interface ExamGeneratorProps {
    config: ExamConfig;
    aiConfig: AIConfig;
    availableModels: { gemini: ModelOption[], openai: ModelOption[] };
    onExamCreated: (exam: ExamSession) => void;
    savedState?: any;
    onUpdateState?: (state: any) => void;
}

export const ExamGeneratorBlock: React.FC<ExamGeneratorProps> = ({ 
    config, 
    aiConfig, 
    availableModels, 
    onExamCreated,
    savedState,
    onUpdateState
}) => {
    const [status, setStatus] = useState<'idle' | 'planning' | 'generating' | 'done' | 'error'>(savedState?.status || 'idle');
    const [progress, setProgress] = useState(savedState?.progress || 0);
    const [generatedExam, setGeneratedExam] = useState<ExamSession | null>(savedState?.generatedExam || null);
    
    // Model Selection State
    const [selectedModelId, setSelectedModelId] = useState<string>(savedState?.selectedModelId || aiConfig.modelId || 'gemini-2.5-flash');

    // Restore state
    useEffect(() => {
        if (savedState) {
            if (savedState.status) setStatus(savedState.status);
            if (savedState.progress) setProgress(savedState.progress);
            if (savedState.generatedExam) setGeneratedExam(savedState.generatedExam);
        }
    }, []); // Run once on mount to sync

    const generateQuestionWithRetry = async (bp: QuestionBlueprint, config: AIConfig, maxRetries = 2): Promise<ExamQuestion> => {
        let attempt = 0;
        
        while (true) {
            try {
                return await generateExamQuestion(bp, config);
            } catch (e: any) {
                attempt++;
                console.warn(`Attempt ${attempt} failed for Q${bp.index + 1}: ${e.message}`);
                if (attempt > maxRetries) {
                     return {
                        id: `err-${bp.index}`,
                        type: bp.type,
                        content: `(题目生成失败: ${e.message})，请重试。`,
                        score: bp.score,
                        difficulty: bp.difficulty,
                        correctAnswer: "",
                        gradingCriteria: "",
                        isGraded: false
                    } as ExamQuestion;
                }
                // Small delay before retry
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    };

    const startGeneration = async () => {
        const generationConfig: AIConfig = {
            ...aiConfig,
            modelId: selectedModelId
        };

        const updateState = (newState: any) => {
            if (newState.status) setStatus(newState.status);
            if (newState.progress !== undefined) setProgress(newState.progress);
            if (newState.generatedExam) setGeneratedExam(newState.generatedExam);
            
            // Persist critical state up to parent
            onUpdateState?.({ 
                status: newState.status || status,
                progress: newState.progress !== undefined ? newState.progress : progress,
                generatedExam: newState.generatedExam || generatedExam,
                selectedModelId: selectedModelId
            });
        };

        updateState({ status: 'planning', progress: 5 });
        
        try {
            // Step 1: Generate Blueprint
            const blueprint = await generateExamBlueprint(config, generationConfig);
            updateState({ status: 'generating', progress: 10 });
            
            const newExam: ExamSession = {
                id: Date.now().toString(),
                config: config,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                status: 'ready',
                questions: [],
                currentQuestionIndex: 0
            };

            // Step 2: Parallel Generation with Retry
            let completedCount = 0;
            const total = blueprint.length;

            const questionPromises = blueprint.map(async (bp) => {
                const q = await generateQuestionWithRetry(bp, generationConfig);
                completedCount++;
                const currentProgress = 10 + (completedCount / total) * 90;
                
                // Update local and persist
                setProgress(currentProgress);
                onUpdateState?.({ 
                    status: 'generating', 
                    progress: currentProgress,
                    selectedModelId: selectedModelId
                });
                
                return q;
            });

            const questions = await Promise.all(questionPromises);
            
            // Sort by index from blueprint to ensure order
            const orderedQuestions = blueprint.map((bp, i) => questions[i]);
            newExam.questions = orderedQuestions;
            
            // Final persistence is handled by onExamCreated which updates the parent state to "done"
            // We just call onExamCreated with the full exam object once.
            
            // Notify parent to save to global exam list
            // This will trigger a state update in parent, which might re-render this block
            onExamCreated(newExam);

        } catch (e: any) {
            updateState({ status: 'error' });
            console.error(e);
        }
    };

    const allModels = [...availableModels.gemini, ...availableModels.openai];

    if (status === 'done' && generatedExam) {
        return (
            <div className="my-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{config.title}</h3>
                <p className="text-sm text-slate-500 mb-4">共 {generatedExam.questions.length} 题 • {config.difficultyDistribution}</p>
                <div className="flex gap-2 justify-center">
                    <button 
                        onClick={() => onExamCreated(generatedExam)}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-sm flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" /> 开始答题
                    </button>
                    <button
                        onClick={() => startGeneration()}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 shadow-sm flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" /> 再生成一份
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="my-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                    <div className="font-bold text-slate-800 flex items-center gap-2">
                        试卷生成器
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">测试版</span>
                    </div>
                    <div className="text-xs text-slate-500">{config.topic}</div>
                </div>
            </div>
            
            <div className="p-5">
                <div className="space-y-4 text-sm mb-6">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">试卷名称</span>
                        <span className="font-medium text-slate-800">{config.title}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">题目数量</span>
                        <span className="font-medium text-slate-800">{config.questionCount}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">难度分布</span>
                        <span className="font-medium text-slate-800">{config.difficultyDistribution}</span>
                    </div>
                    
                    {status === 'idle' && (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <label className="text-xs font-bold text-slate-500 block mb-2 flex items-center gap-1">
                                <Cpu className="w-3 h-3" /> 选择出题模型
                            </label>
                            <select 
                                value={selectedModelId}
                                onChange={(e) => setSelectedModelId(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded text-sm px-2 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {allModels.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <div className="text-[10px] text-slate-400 mt-1">
                                提示：请选择具备<span className="font-bold text-indigo-500">深度思考</span>能力的模型(如 Pro/Plus 版本)，以确保试题逻辑严密、格式规范。
                            </div>
                        </div>
                    )}
                </div>

                {status === 'idle' ? (
                    <>
                        <button 
                            onClick={startGeneration}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
                        >
                            <BrainCircuit className="w-4 h-4" /> 确认并生成
                        </button>
                        <div className="mt-3 flex items-start gap-2 text-[10px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 leading-relaxed">
                            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                            <span>试卷功能正处于测试阶段，AI 生成内容可能存在格式错误或逻辑偏差，建议人工复核。</span>
                        </div>
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>{status === 'planning' ? 'AI 正在规划试卷结构...' : `正在生成题目 (${Math.round(progress)}%)`}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-500 ${status === 'error' ? 'bg-red-500' : (status === 'planning' ? 'bg-amber-400 animate-pulse' : 'bg-indigo-500')}`} 
                                style={{ width: status === 'planning' ? '100%' : `${progress}%` }}
                            />
                        </div>
                        {status === 'error' && (
                            <button 
                                onClick={() => setStatus('idle')} 
                                className="w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                            >
                                生成失败，点击重试
                            </button>
                        )}
                        <div className="flex items-center gap-1.5 text-[10px] text-amber-500 justify-center mt-2">
                             <Loader2 className="w-3 h-3 animate-spin" />
                             <span>生成过程中请勿刷新页面</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Exam Runner (Full Screen Overlay) ---

interface ExamRunnerProps {
    exam: ExamSession;
    aiConfig: AIConfig;
    onClose: () => void;
    onSave: (exam: ExamSession) => void;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ exam: initialExam, aiConfig, onClose, onSave }) => {
    const [exam, setExam] = useState<ExamSession>(initialExam);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradingLoading, setGradingLoading] = useState<Record<string, boolean>>({});
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Auto-save on change
    useEffect(() => {
        onSave(exam);
    }, [exam]);

    // Scroll to top when question changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentIndex]);

    const currentQuestion = exam.questions[currentIndex];

    const handleAnswerChange = (val: any) => {
        if (currentQuestion.isGraded) return;
        
        const newQuestions = [...exam.questions];
        newQuestions[currentIndex] = { ...currentQuestion, userAnswer: val };
        setExam(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleGradeSingle = async (index: number) => {
        const q = exam.questions[index];
        if (q.isGraded || !q.userAnswer) return;

        // --- Hybrid Grading Logic ---
        
        // 1. Proportional Grading for Multiple Choice
        if (q.type === 'multiple_choice') {
            const userAns = Array.isArray(q.userAnswer) ? q.userAnswer : [];
            const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
            
            // Normalize
            const userSet = new Set(userAns.map(s => String(s).trim()));
            const correctSet = new Set(correctAns.map(s => String(s).trim()));
            
            let score = 0;
            let feedback = "";
            
            // Logic: 
            // 1. If any wrong option selected -> 0 points
            // 2. If all correct options selected (and no wrong) -> Full points
            // 3. If subset of correct options selected (and no wrong) -> Proportional points
            
            let hasWrong = false;
            let correctCount = 0;
            
            userSet.forEach(val => {
                if (!correctSet.has(val)) {
                    hasWrong = true;
                } else {
                    correctCount++;
                }
            });
            
            if (hasWrong) {
                score = 0;
                feedback = "回答错误 (包含错误选项)";
            } else if (correctCount === 0) {
                score = 0; // Empty selection (shouldn't happen if validation is on)
                feedback = "未作答";
            } else if (correctCount === correctSet.size) {
                score = q.score;
                feedback = "回答正确";
            } else {
                // Partial credit: (correctCount / totalCorrect) * fullScore
                // Floor to nearest 0.5 to keep scores clean
                const rawScore = (correctCount / correctSet.size) * q.score;
                score = Math.floor(rawScore * 2) / 2;
                // Minimum 0.5 score if at least 1 is right
                if (score < 0.5 && correctCount > 0) score = 0.5;
                feedback = `部分正确 (选对${correctCount}个)`;
            }

            setExam(prev => {
                const newQuestions = [...prev.questions];
                newQuestions[index] = {
                    ...newQuestions[index],
                    isGraded: true,
                    obtainedScore: score,
                    feedback: feedback
                };
                return { ...prev, questions: newQuestions };
            });
            return;
        }

        // 2. Exact Match Grading for Single Choice / True False
        if (q.type === 'single_choice' || q.type === 'true_false') {
            let score = 0;
            let isCorrect = false;
            
            const u = String(q.userAnswer).trim();
            const c = String(q.correctAnswer).trim();
            isCorrect = u === c;

            if (isCorrect) score = q.score;

            setExam(prev => {
                const newQuestions = [...prev.questions];
                newQuestions[index] = {
                    ...newQuestions[index],
                    isGraded: true,
                    obtainedScore: score,
                    feedback: isCorrect ? "回答正确" : "回答错误"
                };
                return { ...prev, questions: newQuestions };
            });
            return;
        }

        // 3. AI Grading for Subjective Questions
        setGradingLoading(prev => ({ ...prev, [q.id]: true }));
        try {
            const result = await gradeExamQuestion(q, q.userAnswer, aiConfig);
            
            setExam(prev => {
                const newQuestions = [...prev.questions];
                newQuestions[index] = {
                    ...newQuestions[index],
                    isGraded: true,
                    obtainedScore: result.score,
                    feedback: result.feedback
                };
                return { ...prev, questions: newQuestions };
            });
        } catch (e) {
            console.error(e);
        } finally {
            setGradingLoading(prev => ({ ...prev, [q.id]: false }));
        }
    };

    const handleSubmitAll = async () => {
        // 1. Identify questions that need grading
        const questionsToGrade = exam.questions.map((q, index) => ({ q, index }))
            .filter(({ q }) => !q.isGraded && q.userAnswer !== undefined && q.userAnswer !== "");

        if (questionsToGrade.length === 0) {
             setExam(prev => ({ ...prev, status: 'submitted' }));
             return;
        }

        // 2. Set loading state for ALL pending questions
        const newLoadingState = { ...gradingLoading };
        questionsToGrade.forEach(({ q }) => {
            newLoadingState[q.id] = true;
        });
        setGradingLoading(newLoadingState);

        try {
            // 3. Perform grading in PARALLEL
            const results = await Promise.all(
                questionsToGrade.map(async ({ q, index }) => {
                    // Re-implement grading logic here to allow pure data transformation
                    // Choice/TrueFalse: Local Grading
                    if (q.type === 'multiple_choice') {
                        const userAns = Array.isArray(q.userAnswer) ? q.userAnswer : [];
                        const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
                        const userSet = new Set(userAns.map(s => String(s).trim()));
                        const correctSet = new Set(correctAns.map(s => String(s).trim()));
                        
                        let score = 0;
                        let feedback = "";
                        let hasWrong = false;
                        let correctCount = 0;
                        
                        userSet.forEach(val => {
                            if (!correctSet.has(val)) hasWrong = true;
                            else correctCount++;
                        });
                        
                        if (hasWrong) {
                            score = 0;
                            feedback = "回答错误 (包含错误选项)";
                        } else if (correctCount === 0) {
                            score = 0; 
                            feedback = "未作答";
                        } else if (correctCount === correctSet.size) {
                            score = q.score;
                            feedback = "回答正确";
                        } else {
                            const rawScore = (correctCount / correctSet.size) * q.score;
                            score = Math.floor(rawScore * 2) / 2;
                            if (score < 0.5 && correctCount > 0) score = 0.5;
                            feedback = `部分正确 (选对${correctCount}个)`;
                        }
                        return { index, score, feedback };
                    } 
                    else if (q.type === 'single_choice' || q.type === 'true_false') {
                        const u = String(q.userAnswer).trim();
                        const c = String(q.correctAnswer).trim();
                        const isCorrect = u === c;
                        return { 
                            index, 
                            score: isCorrect ? q.score : 0, 
                            feedback: isCorrect ? "回答正确" : "回答错误" 
                        };
                    }
                    else {
                        // AI Grading
                        const res = await gradeExamQuestion(q, q.userAnswer, aiConfig);
                        return {
                            index,
                            score: res.score,
                            feedback: res.feedback
                        };
                    }
                })
            );

            // 4. Batch update state
            setExam(prev => {
                const newQuestions = [...prev.questions];
                results.forEach(({ index, score, feedback }) => {
                    newQuestions[index] = {
                        ...newQuestions[index],
                        isGraded: true,
                        obtainedScore: score,
                        feedback: feedback
                    };
                });
                return { ...prev, questions: newQuestions, status: 'submitted' };
            });

        } catch (e) {
            console.error("Batch grading failed", e);
        } finally {
            setGradingLoading({});
        }
    };

    const totalScore = exam.questions.reduce((acc, q) => acc + (q.obtainedScore || 0), 0);
    const maxScore = exam.questions.reduce((acc, q) => acc + q.score, 0);

    const renderQuestionInput = (q: ExamQuestion) => {
        const disabled = q.isGraded; // Lock input if graded
        
        switch (q.type) {
            case 'single_choice':
            case 'true_false': 
                return (
                    <div className="space-y-2 mt-4">
                        {(q.options || ["True", "False"]).map((opt, i) => {
                            const isTrueFalse = q.type === 'true_false';
                            const rawOptText = isTrueFalse ? (i === 0 ? "正确 (True)" : "错误 (False)") : opt;
                            // Clean up option text if it starts with "A. " etc for logic, but display full
                            // SAFETY FIX: Cast to string before splitting to avoid "opt.split is not a function"
                            const val = isTrueFalse ? (i === 0) : String(opt).split('.')[0].trim(); 
                            const isSelected = q.userAnswer === val;
                            
                            let className = "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ";
                            if (isSelected) {
                                className += "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-900";
                            } else {
                                className += "bg-white border-slate-200 hover:bg-slate-50";
                            }
                            
                            if (disabled) className += " opacity-60 cursor-not-allowed";

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => !disabled && handleAnswerChange(val)}
                                    disabled={disabled}
                                    className={className}
                                >
                                    {isSelected ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <div className="w-5 h-5 rounded-full border border-slate-300" />}
                                    <span className="text-sm"><ContentRenderer content={String(rawOptText)} /></span>
                                </button>
                            );
                        })}
                    </div>
                );
            case 'multiple_choice':
                return (
                    <div className="space-y-2 mt-4">
                        {(q.options || []).map((opt, i) => {
                            // SAFETY FIX: Cast to string before splitting
                            const val = String(opt).split('.')[0].trim();
                            const currentAns = (q.userAnswer as string[]) || [];
                            const isSelected = currentAns.includes(val);
                            
                            let className = "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ";
                            if (isSelected) {
                                className += "bg-indigo-50 border-indigo-500 text-indigo-900";
                            } else {
                                className += "bg-white border-slate-200 hover:bg-slate-50";
                            }
                            if (disabled) className += " opacity-60 cursor-not-allowed";

                            return (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        if (disabled) return;
                                        const newAns = isSelected ? currentAns.filter(a => a !== val) : [...currentAns, val];
                                        handleAnswerChange(newAns);
                                    }}
                                    disabled={disabled}
                                    className={className}
                                >
                                    {isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                                    <span className="text-sm"><ContentRenderer content={String(opt)} /></span>
                                </button>
                            );
                        })}
                    </div>
                );
            // Default fallthrough for fill_in, subjective, and ANY UNKNOWN TYPE
            default:
                return (
                    <div className="mt-4">
                        <textarea 
                            value={q.userAnswer as string || ''}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            disabled={disabled}
                            placeholder="请输入你的答案..."
                            className="w-full h-32 p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none disabled:bg-slate-50 disabled:text-slate-500 bg-white text-slate-800 shadow-inner"
                        />
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col md:flex-row h-full">
            {/* Sidebar / Topbar */}
            <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 max-h-[35vh] md:max-h-full">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center md:block">
                    <div className="min-w-0">
                        <h2 className="font-bold text-slate-800 truncate">{exam.config.title}</h2>
                        <div className="flex justify-between text-xs text-slate-500 mt-1 gap-4">
                            <span>总分: {maxScore}</span>
                            <span className={exam.status === 'submitted' ? "text-emerald-600 font-bold" : ""}>
                                {exam.status === 'submitted' ? `得分: ${totalScore}` : "进行中"}
                            </span>
                        </div>
                    </div>
                    {/* Mobile Close Button in Header */}
                    <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Question Navigator - Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="flex-1 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden p-2 scrollbar-hide">
                    <div className="flex md:grid md:grid-cols-4 gap-2 min-w-max md:min-w-0 px-2 md:px-0">
                        {exam.questions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`
                                    w-10 h-10 md:w-auto md:h-10 rounded-lg text-xs font-bold transition-all relative shrink-0 flex items-center justify-center
                                    ${currentIndex === i ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
                                    ${q.isGraded 
                                        ? (q.obtainedScore === q.score ? 'bg-emerald-100 text-emerald-700' : (q.obtainedScore! > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'))
                                        : (q.userAnswer ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400')
                                    }
                                `}
                            >
                                {i + 1}
                                {gradingLoading[q.id] && <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Desktop Footer Actions */}
                <div className="p-4 border-t border-slate-100 space-y-2 hidden md:block">
                    <button onClick={onClose} className="w-full py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50">
                        暂时离开
                    </button>
                    {exam.status !== 'submitted' && (
                        <button onClick={handleSubmitAll} disabled={Object.keys(gradingLoading).length > 0} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {Object.keys(gradingLoading).length > 0 ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                            交卷并评分
                        </button>
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500 uppercase">
                                        {(currentQuestion.type || 'unknown').replace('_', ' ')}
                                    </span>
                                    <span className="px-2 py-1 bg-amber-50 rounded text-xs font-bold text-amber-600 uppercase">
                                        {currentQuestion.score} 分
                                    </span>
                                    {currentQuestion.isGraded && (
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                            currentQuestion.obtainedScore === currentQuestion.score ? 'bg-emerald-500' : 
                                            currentQuestion.obtainedScore! > 0 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}>
                                            得分: {currentQuestion.obtainedScore}
                                        </span>
                                    )}
                                </div>
                                <div className="text-slate-400 text-sm font-mono">
                                    {currentIndex + 1} / {exam.questions.length}
                                </div>
                            </div>

                            <div className="text-lg text-slate-800 leading-relaxed font-medium">
                                {/* Use ContentRenderer to render text mixed with LaTeX correctly */}
                                <ContentRenderer content={currentQuestion.content} />
                            </div>

                            {renderQuestionInput(currentQuestion)}

                            {/* Actions for current question */}
                            {!currentQuestion.isGraded && currentQuestion.userAnswer && (
                                <div className="mt-6 flex justify-end">
                                    <button 
                                        onClick={() => handleGradeSingle(currentIndex)}
                                        disabled={gradingLoading[currentQuestion.id]}
                                        className="flex items-center gap-2 text-indigo-600 text-sm font-medium hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        {gradingLoading[currentQuestion.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                                        提前批改此题
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Analysis / Result Card */}
                        {currentQuestion.isGraded && (
                            <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-6 animate-in slide-in-from-bottom-4">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-indigo-500" /> AI 批改与解析
                                </h4>
                                
                                <div className="space-y-4 text-sm">
                                    <div className="bg-white p-4 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-400 font-bold mb-1 uppercase">AI 点评</div>
                                        <div className="text-slate-700">{currentQuestion.feedback}</div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-400 font-bold mb-1 uppercase">正确答案</div>
                                        <div className="text-emerald-700 font-bold">
                                            <ContentRenderer content={
                                                Array.isArray(currentQuestion.correctAnswer) 
                                                ? currentQuestion.correctAnswer.join(", ") 
                                                : (currentQuestion.correctAnswer === true ? "True" : (currentQuestion.correctAnswer === false ? "False" : String(currentQuestion.correctAnswer)))
                                            } />
                                        </div>
                                    </div>

                                    {currentQuestion.analysis && (
                                        <div className="bg-white p-4 rounded-lg border border-slate-100">
                                            <div className="text-xs text-slate-400 font-bold mb-1 uppercase">详细解析</div>
                                            <div className="text-slate-600 leading-relaxed">
                                                <ContentRenderer content={currentQuestion.analysis} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Nav */}
                <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center shrink-0 z-20">
                    <button 
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                        className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    
                    {/* Mobile Submit Button in Center */}
                    {exam.status !== 'submitted' && (
                        <button onClick={handleSubmitAll} disabled={Object.keys(gradingLoading).length > 0} className="md:hidden px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2">
                            {Object.keys(gradingLoading).length > 0 ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                            交卷
                        </button>
                    )}

                    <span className="text-sm font-bold text-slate-400 hidden md:block">
                        {currentIndex + 1} / {exam.questions.length}
                    </span>
                    <button 
                        onClick={() => setCurrentIndex(Math.min(exam.questions.length - 1, currentIndex + 1))}
                        disabled={currentIndex === exam.questions.length - 1}
                        className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    >
                        <ChevronRight className="w-6 h-6 text-slate-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};
