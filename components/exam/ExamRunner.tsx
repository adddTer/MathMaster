
import React, { useState, useEffect, useRef } from 'react';
import { ExamSession, ExamQuestion, AIConfig } from '../../types';
import { gradeExamQuestion, generateExamReport } from '../../services/examService';
import { Loader2, CheckCircle2, X, BrainCircuit, CheckSquare, Square, PenTool, ChevronLeft, ChevronRight, BarChart2, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, LayoutGrid } from 'lucide-react';
import { InlineParser, StandardTextBlock } from '../blocks/utils';
import { ExamReportModal } from './ExamReportModal';
import { PlanarGeometry } from '../PlanarGeometry';
import { SolidGeometry } from '../SolidGeometry';

// Renderer for Block Content (Question text, Analysis, Feedback) 
// Updated to use whitespace-pre-line to respect double newlines but allow wrapping
const BlockRenderer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => (
    <div className={`whitespace-pre-line leading-relaxed break-words ${className}`}>
        <InlineParser content={content} />
    </div>
);

// Define explicit props and state interfaces for the error boundary
interface VisualErrorBoundaryProps {
    children?: React.ReactNode;
}

interface VisualErrorBoundaryState {
    hasError: boolean;
}

// Simple Error Boundary for Visual Components
class VisualErrorBoundary extends React.Component<VisualErrorBoundaryProps, VisualErrorBoundaryState> {
    state: VisualErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(_: Error): VisualErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div className="p-4 bg-red-50 text-red-500 text-xs rounded border border-red-200 text-center">图示加载失败</div>;
        }
        return this.props.children;
    }
}

// Renderer for Inline Content (Options)
const InlineRenderer: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => (
    <span className={`leading-relaxed ${className}`}>
        <InlineParser content={content} />
    </span>
);

// --- Custom Confirmation Modal (Decoupled from System UI) ---
interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({ isOpen, title, content, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-3 text-amber-600">
                        <AlertTriangle className="w-6 h-6" />
                        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {content}
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button 
                            onClick={onCancel}
                            className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            确认
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ExamRunnerProps {
    exam: ExamSession;
    aiConfig: AIConfig;
    onClose: () => void;
    onSave: (exam: ExamSession) => void;
}

const TYPE_MAP: Record<string, string> = {
    'single_choice': '单选题',
    'multiple_choice': '多选题',
    'true_false': '判断题',
    'fill_in': '填空题',
    'subjective': '简答题',
    'unknown': '未知题型'
};

const getTypeName = (type: string) => {
    const normalized = type?.toLowerCase().trim() || 'unknown';
    return TYPE_MAP[normalized] || type; // Fallback to original if not found
};

export const ExamRunner: React.FC<ExamRunnerProps> = ({ exam: initialExam, aiConfig, onClose, onSave }) => {
    const [exam, setExam] = useState<ExamSession>(initialExam);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gradingLoading, setGradingLoading] = useState<Record<string, boolean>>({});
    
    // UI State
    const [isMobileGridOpen, setIsMobileGridOpen] = useState(false);
    
    // Report State
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        content: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', content: '', onConfirm: () => {} });

    const scrollRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => { onSave(exam); }, [exam]);
    useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentIndex]);

    // Auto resize textarea
    const adjustTextareaHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

    const currentQuestion = exam.questions[currentIndex];

    // Trigger resize when answer changes or question changes
    useEffect(() => {
        adjustTextareaHeight();
    }, [currentQuestion.userAnswer, currentIndex]);

    const handleAnswerChange = (val: any) => {
        // Lock answer if graded OR if there was a grading error (prevent modifying while waiting to retry)
        if (currentQuestion.isGraded || currentQuestion.gradingError) return;
        
        const newQuestions = [...exam.questions];
        newQuestions[currentIndex] = { ...currentQuestion, userAnswer: val };
        setExam(prev => ({ ...prev, questions: newQuestions }));
    };

    const handleGradeSingle = async (index: number) => {
        const q = exam.questions[index];
        if (q.isGraded) return;
        
        // Clear previous error state before retrying
        updateQuestion(index, { gradingError: false });

        // Local Grading Logic for Choices
        if (q.type === 'single_choice' || q.type === 'true_false') {
            const isCorrect = String(q.userAnswer).trim() === String(q.correctAnswer).trim();
            updateQuestion(index, { isGraded: true, obtainedScore: isCorrect ? q.score : 0, feedback: isCorrect ? "回答正确" : "回答错误", gradingError: false });
            return;
        }
        if (q.type === 'multiple_choice') {
            const userAns = Array.isArray(q.userAnswer) ? q.userAnswer : [];
            const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
            const userSet = new Set(userAns.map(s => String(s).trim()));
            const correctSet = new Set(correctAns.map(s => String(s).trim()));
            let score = 0;
            let feedback = "";
            let hasWrong = false;
            let correctCount = 0;
            userSet.forEach(val => { if (!correctSet.has(val)) hasWrong = true; else correctCount++; });
            
            if (hasWrong) { score = 0; feedback = "回答错误"; }
            else if (correctCount === 0) { score = 0; feedback = "未作答"; }
            else if (correctCount === correctSet.size) { score = q.score; feedback = "回答正确"; }
            else { score = Math.floor((correctCount/correctSet.size)*q.score*2)/2; if(score<0.5 && correctCount>0) score=0.5; feedback = `部分正确 (${correctCount}个)`; }
            
            updateQuestion(index, { isGraded: true, obtainedScore: score, feedback, gradingError: false });
            return;
        }

        // AI Grading for Subjective
        setGradingLoading(prev => ({ ...prev, [q.id]: true }));
        try {
            const result = await gradeExamQuestion(q, q.userAnswer, aiConfig);
            updateQuestion(index, { isGraded: true, obtainedScore: result.score, feedback: result.feedback, gradingError: false });
        } catch (e) {
            updateQuestion(index, { isGraded: false, gradingError: true, feedback: "评分服务连接失败，请点击重试。" });
        } finally {
            setGradingLoading(prev => ({ ...prev, [q.id]: false }));
        }
    };

    const updateQuestion = (idx: number, updates: Partial<ExamQuestion>) => {
        setExam(prev => {
            const newQuestions = [...prev.questions];
            newQuestions[idx] = { ...newQuestions[idx], ...updates };
            return { ...prev, questions: newQuestions };
        });
    };

    // Actual submission logic extracted for modal callback
    const executeSubmitAll = async () => {
        // Filter out questions that are ALREADY graded successfully.
        // We DO include questions with gradingError to retry them.
        const questionsToGrade = exam.questions.map((q, index) => ({ q, index }))
            .filter(({ q }) => !q.isGraded); // !isGraded covers both 'ungraded' and 'gradingError=true'

        if (questionsToGrade.length === 0) { setExam(prev => ({ ...prev, status: 'submitted' })); return; }

        const newLoadingState = { ...gradingLoading };
        questionsToGrade.forEach(({ q }) => newLoadingState[q.id] = true);
        setGradingLoading(newLoadingState);

        // Process concurrently using map to handle individual failures
        const promises = questionsToGrade.map(async ({ q, index }) => {
            // 1. Empty Answer -> 0 Score (No API)
            if (!q.userAnswer || (Array.isArray(q.userAnswer) && q.userAnswer.length === 0)) {
                return { index, success: true, score: 0, feedback: "未作答" };
            }

            // 2. Local Grading (No API)
            if (q.type === 'single_choice' || q.type === 'true_false') {
                const isCorrect = String(q.userAnswer).trim() === String(q.correctAnswer).trim();
                return { index, success: true, score: isCorrect ? q.score : 0, feedback: isCorrect ? "回答正确" : "回答错误" };
            } 
            if (q.type === 'multiple_choice') {
                 const userAns = Array.isArray(q.userAnswer) ? q.userAnswer : [];
                 const correctAns = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
                 const userSet = new Set(userAns.map(s => String(s).trim()));
                 const correctSet = new Set(correctAns.map(s => String(s).trim()));
                 let hasWrong = false, correctCount = 0;
                 userSet.forEach(val => { if (!correctSet.has(val)) hasWrong = true; else correctCount++; });
                 
                 let score = 0;
                 let feedback = "";
                 if (hasWrong) { score = 0; feedback = "回答错误"; }
                 else if (correctCount === correctSet.size) { score = q.score; feedback = "回答正确"; }
                 else {
                     score = Math.max(0.5, Math.floor((correctCount/correctSet.size)*q.score*2)/2);
                     feedback = `部分正确 (选对${correctCount}个)`;
                 }
                 return { index, success: true, score, feedback };
            }

            // 3. AI Grading
            try {
                const res = await gradeExamQuestion(q, q.userAnswer, aiConfig);
                return { index, success: true, score: res.score, feedback: res.feedback };
            } catch (e) {
                return { index, success: false, feedback: "批改失败，请重试" };
            }
        });

        // Wait for all to finish (resolve or return error object)
        const results = await Promise.all(promises);

        setExam(prev => {
            const newQuestions = [...prev.questions];
            let hasErrors = false;

            results.forEach((res) => {
                if (res.success) {
                    newQuestions[res.index] = { 
                        ...newQuestions[res.index], 
                        isGraded: true, 
                        obtainedScore: res.score, 
                        feedback: res.feedback,
                        gradingError: false
                    };
                } else {
                    hasErrors = true;
                    newQuestions[res.index] = { 
                        ...newQuestions[res.index], 
                        isGraded: false, 
                        gradingError: true, 
                        feedback: res.feedback 
                    };
                }
            });

            // Only mark exam as 'submitted' if ALL questions are successfully graded
            // If some have errors, we stay in 'ready' (or 'in_progress') so user can retry specific questions
            const allDone = newQuestions.every(q => q.isGraded);
            return { ...prev, questions: newQuestions, status: allDone ? 'submitted' : prev.status };
        });

        setGradingLoading({});
    };

    const handleRequestSubmit = () => {
        const unansweredCount = exam.questions.filter(q => (!q.userAnswer || (Array.isArray(q.userAnswer) && q.userAnswer.length === 0)) && !q.isGraded).length;
        
        if (unansweredCount > 0) {
            setConfirmModal({
                isOpen: true,
                title: '确认交卷？',
                content: `检测到还有 ${unansweredCount} 道题目未作答。未作答的题目将直接记为 0 分，是否确认提交？`,
                onConfirm: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    executeSubmitAll();
                },
                onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } else {
            executeSubmitAll();
        }
    };

    const executeGenerateReport = async (forceRegenerate: boolean) => {
        setIsReportOpen(true);
        if (reportContent && !forceRegenerate) return;
        
        setIsGeneratingReport(true);
        if (forceRegenerate) setReportContent('');
        
        const summary = {
            title: exam.config.title,
            totalScore: `${exam.questions.reduce((a,q)=>a+(q.obtainedScore||0),0)}/${exam.questions.reduce((a,q)=>a+q.score,0)}`,
            questions: exam.questions.map((q, i) => ({
                id: i + 1,
                questionText: q.content.length > 80 ? q.content.slice(0, 80) + '...' : q.content,
                knowledgePoint: q.knowledgePoint || '未标注',
                type: getTypeName(q.type),
                userAnswer: q.userAnswer ? JSON.stringify(q.userAnswer) : "未作答",
                correctAnswer: JSON.stringify(q.correctAnswer),
                score: `${q.obtainedScore || 0}/${q.score}`,
                isCorrect: q.obtainedScore === q.score,
                feedback: q.feedback
            }))
        };
        
        try {
            await generateExamReport(summary, aiConfig, (chunk) => setReportContent(p => p + chunk));
        } catch (e) {
            setReportContent("生成报告失败，请检查网络或配置。");
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const handleRequestReport = (forceRegenerate = false) => {
        if (forceRegenerate && reportContent) {
            setConfirmModal({
                isOpen: true,
                title: '重新生成报告',
                content: '重新生成将覆盖当前的评价报告内容，是否继续？',
                onConfirm: () => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    executeGenerateReport(true);
                },
                onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } else {
            executeGenerateReport(forceRegenerate);
        }
    };

    // Render helpers
    const renderInput = () => {
        const q = currentQuestion;
        // Lock if graded OR if there's a grading error (wait for retry)
        const disabled = q.isGraded || q.gradingError;
        
        if (q.type === 'single_choice' || q.type === 'true_false') {
            return (
                <div className="space-y-2 mt-4">
                    {(q.options || ["True", "False"]).map((opt, i) => {
                        const isTF = q.type === 'true_false';
                        const val = isTF ? (i===0) : String(opt).split('.')[0].trim();
                        const isSelected = q.userAnswer === val;
                        const rawOptText = isTF ? (i === 0 ? "正确 (True)" : "错误 (False)") : opt;
                        
                        let className = "w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ";
                        if (isSelected) {
                            className += "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-900";
                        } else {
                            className += "bg-white border-slate-200 hover:bg-slate-50";
                        }
                        if (disabled) className += " opacity-60 cursor-not-allowed";

                        return (
                            <button key={i} onClick={() => !disabled && handleAnswerChange(val)} disabled={disabled} className={className}>
                                {isSelected ? <CheckCircle2 className="w-5 h-5 text-indigo-600" /> : <div className="w-5 h-5 rounded-full border border-slate-300" />}
                                <InlineRenderer content={String(rawOptText)} className="text-sm w-full" />
                            </button>
                        );
                    })}
                </div>
            );
        }
        if (q.type === 'multiple_choice') {
            return (
                <div className="space-y-2 mt-4">
                    {(q.options || []).map((opt, i) => {
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
                            <button key={i} onClick={() => { if(!disabled) handleAnswerChange(isSelected ? currentAns.filter(a=>a!==val) : [...currentAns, val]); }} disabled={disabled} className={className}>
                                {isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                                <InlineRenderer content={String(opt)} className="text-sm w-full" />
                            </button>
                        );
                    })}
                </div>
            );
        }
        return (
            <textarea 
                ref={textAreaRef}
                value={q.userAnswer as string || ''} 
                onChange={e => handleAnswerChange(e.target.value)} 
                disabled={disabled}
                placeholder="请输入答案..." 
                className="mt-4 w-full min-h-[120px] p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none disabled:bg-slate-50 disabled:text-slate-500 bg-white overflow-hidden" 
            />
        );
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col md:flex-row h-full">
            <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="min-w-0">
                        <h2 className="font-bold text-slate-800 truncate">{exam.config.title}</h2>
                        <div className="flex justify-between text-xs text-slate-500 mt-1 gap-2">
                            <span>总分: {exam.questions.reduce((a,q)=>a+q.score,0)}</span>
                            {exam.status === 'submitted' && (
                                <span className="text-emerald-600 font-bold">得分: {exam.questions.reduce((a,q)=>a+(q.obtainedScore||0),0)}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Mobile: Toggle Grid */}
                        <button onClick={() => setIsMobileGridOpen(!isMobileGridOpen)} className="md:hidden p-2 text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100">
                            {isMobileGridOpen ? <ChevronUp className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
                        </button>
                        {/* Mobile: Close */}
                        <button onClick={onClose} className="md:hidden p-2"><X className="w-5 h-5" /></button>
                    </div>
                </div>
                
                {/* Question Grid: Collapsible on mobile, always visible on desktop */}
                <div className={`overflow-auto p-2 transition-all duration-300 ease-in-out md:flex-1 md:max-h-full ${isMobileGridOpen ? 'max-h-[60vh] border-b border-slate-200 shadow-sm' : 'max-h-0 md:max-h-full'}`}>
                    <div className="grid grid-cols-4 gap-2">
                        {exam.questions.map((q, i) => (
                            <button key={i} onClick={() => { setCurrentIndex(i); setIsMobileGridOpen(false); }} 
                                className={`w-full h-10 rounded-lg text-xs font-bold relative 
                                    ${currentIndex===i?'ring-2 ring-indigo-500':''} 
                                    ${q.gradingError ? 'bg-red-50 text-red-500 border border-red-200' :
                                      q.isGraded ? (q.obtainedScore===q.score?'bg-emerald-100 text-emerald-700':q.obtainedScore!>0?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700') : 
                                      (q.userAnswer?'bg-indigo-50 text-indigo-700':'bg-slate-100 text-slate-400')}`}>
                                {i+1}
                                {gradingLoading[q.id] && <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>}
                                {q.gradingError && <div className="absolute bottom-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t border-slate-100 space-y-2 hidden md:block">
                    <button onClick={onClose} className="w-full py-2 bg-white border rounded-lg text-sm">暂时离开</button>
                    {exam.status === 'submitted' ? (
                        <button onClick={() => handleRequestReport()} className="w-full py-2 bg-violet-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"><BarChart2 className="w-4 h-4"/>评价报告</button>
                    ) : (
                        <button onClick={handleRequestSubmit} disabled={Object.keys(gradingLoading).length>0} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                            {Object.keys(gradingLoading).length>0 ? <Loader2 className="w-4 h-4 animate-spin"/> : "交卷并评分"}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 pb-20">
                    <div className="max-w-3xl mx-auto">
                        <div className={`bg-white rounded-2xl shadow-sm border p-6 md:p-8 ${currentQuestion.gradingError ? 'border-red-200' : 'border-slate-200'}`}>
                            <div className="flex justify-between mb-4">
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase">{getTypeName(currentQuestion.type)}</span>
                                    <span className="px-2 py-1 bg-amber-50 rounded text-xs font-bold text-amber-600">{currentQuestion.score} 分</span>
                                    {currentQuestion.isGraded && (
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                                            currentQuestion.obtainedScore === currentQuestion.score ? 'bg-emerald-500' : 
                                            (currentQuestion.obtainedScore || 0) > 0 ? 'bg-amber-500' : 'bg-red-500'
                                        }`}>
                                            得分: {currentQuestion.obtainedScore || 0}
                                        </span>
                                    )}
                                    {currentQuestion.gradingError && (
                                        <span className="px-2 py-1 rounded text-xs font-bold text-white bg-red-500 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> 评分失败
                                        </span>
                                    )}
                                </div>
                                <div className="text-slate-400 text-sm font-mono">{currentIndex + 1} / {exam.questions.length}</div>
                            </div>
                            
                            <BlockRenderer content={currentQuestion.content} className="text-lg font-medium" />
                            
                            {/* VISUAL COMPONENT RENDERING */}
                            {currentQuestion.visual && (
                                <div className="my-6 flex justify-center w-full">
                                    <VisualErrorBoundary>
                                        {currentQuestion.visual.type === 'planar' && (
                                            <PlanarGeometry {...currentQuestion.visual.data} />
                                        )}
                                        {currentQuestion.visual.type === 'solid' && (
                                            <SolidGeometry {...currentQuestion.visual.data} />
                                        )}
                                    </VisualErrorBoundary>
                                </div>
                            )}

                            {renderInput()}
                            
                            {!currentQuestion.isGraded && currentQuestion.userAnswer && !currentQuestion.gradingError && (
                                <div className="mt-4 flex justify-end">
                                    <button onClick={() => handleGradeSingle(currentIndex)} disabled={gradingLoading[currentQuestion.id]} className="flex items-center gap-2 text-indigo-600 text-sm font-medium px-3 py-1.5 hover:bg-indigo-50 rounded-lg">
                                        {gradingLoading[currentQuestion.id] ? <Loader2 className="w-4 h-4 animate-spin"/> : <PenTool className="w-4 h-4"/>} 提前批改
                                    </button>
                                </div>
                            )}
                            {currentQuestion.gradingError && (
                                <div className="mt-4 flex justify-end">
                                    <button onClick={() => handleGradeSingle(currentIndex)} className="flex items-center gap-2 text-red-600 text-sm font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200">
                                        <RefreshCw className="w-4 h-4" /> 重试评分
                                    </button>
                                </div>
                            )}
                        </div>
                        {(currentQuestion.isGraded || currentQuestion.gradingError) && (
                            <div className={`mt-6 rounded-xl border p-6 animate-in slide-in-from-bottom-4 ${currentQuestion.gradingError ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-bold mb-4 flex items-center gap-2 ${currentQuestion.gradingError ? 'text-red-700' : 'text-slate-800'}`}>
                                    {currentQuestion.gradingError ? <AlertTriangle className="w-5 h-5"/> : <BrainCircuit className="w-5 h-5 text-indigo-500"/>} 
                                    {currentQuestion.gradingError ? "批改服务异常" : "AI 批改与解析"}
                                </h4>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-white p-4 rounded-lg border border-slate-100">
                                        <div className="text-xs text-slate-400 font-bold mb-1">AI 点评</div>
                                        <div className={currentQuestion.gradingError ? "text-red-600" : "text-slate-700"}>
                                            <BlockRenderer content={currentQuestion.feedback || "暂无点评"} />
                                        </div>
                                    </div>
                                    {!currentQuestion.gradingError && (
                                        <>
                                            <div className="bg-white p-4 rounded-lg border border-slate-100">
                                                <div className="text-xs text-slate-400 font-bold mb-1">正确答案</div>
                                                <div className="text-emerald-700 font-bold">
                                                    <InlineRenderer content={
                                                        Array.isArray(currentQuestion.correctAnswer) 
                                                        ? currentQuestion.correctAnswer.join(", ") 
                                                        : (currentQuestion.correctAnswer === true ? "True" : (currentQuestion.correctAnswer === false ? "False" : String(currentQuestion.correctAnswer)))
                                                    } />
                                                </div>
                                            </div>
                                            {currentQuestion.analysis && (
                                                <div className="bg-white p-4 rounded-lg border border-slate-100">
                                                    <div className="text-xs text-slate-400 font-bold mb-1">详细解析</div>
                                                    <BlockRenderer content={currentQuestion.analysis} className="text-slate-600" />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-white border-t border-slate-200 p-4 flex justify-between items-center shrink-0 z-20">
                    <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex===0} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="w-6 h-6 text-slate-600" /></button>
                    {exam.status === 'submitted' ? (
                        <button onClick={() => handleRequestReport()} className="md:hidden px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"><BarChart2 className="w-4 h-4"/> 评价报告</button>
                    ) : (
                        <button onClick={handleRequestSubmit} disabled={Object.keys(gradingLoading).length>0} className="md:hidden px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                            {Object.keys(gradingLoading).length>0 ? <Loader2 className="w-4 h-4 animate-spin"/> : "交卷"}
                        </button>
                    )}
                    <button onClick={() => setCurrentIndex(Math.min(exam.questions.length - 1, currentIndex + 1))} disabled={currentIndex===exam.questions.length-1} className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="w-6 h-6 text-slate-600" /></button>
                </div>
            </div>

            <ExamReportModal 
                isOpen={isReportOpen} 
                onClose={() => setIsReportOpen(false)} 
                isGenerating={isGeneratingReport} 
                content={reportContent} 
                onRegenerate={() => handleRequestReport(true)}
            />

            {/* In-app Confirmation Modal */}
            <ConfirmationModal 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                content={confirmModal.content}
                onConfirm={confirmModal.onConfirm}
                onCancel={confirmModal.onCancel}
            />
        </div>
    );
};
