
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, MousePointerClick, Type, CheckSquare, Square, HelpCircle, PenLine, Eye, BrainCircuit, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { safeParseJSON, StyledBlock, StandardTextBlock, ErrorBlock, InlineParser } from './utils';

export const ChoiceBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::choice\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [selected, setSelected] = useState<number | null>(savedState?.selected ?? null);
    const [hasSubmitted, setHasSubmitted] = useState(savedState?.hasSubmitted ?? false);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // Safety check for data.answer being non-string
    const correctIndex = data.answer ? (String(data.answer).trim().toUpperCase().charCodeAt(0) - 65) : -1;
    
    const handleSelect = (idx: number) => {
        if (hasSubmitted) return;
        setSelected(idx);
        setHasSubmitted(true);
        onInteract?.('update_state', { state: { selected: idx, hasSubmitted: true } });
    };
    return (
        <StyledBlock title="单选题" icon={MousePointerClick} color="indigo">
             <StandardTextBlock content={data.question || ""} />
             <div className="mt-4 space-y-2">
                 {(data.options || []).map((opt: string, idx: number) => {
                     let statusClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                     let icon = null;
                     if (hasSubmitted) {
                         if (idx === correctIndex) {
                             statusClass = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500";
                             icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
                         } else if (idx === selected && idx !== correctIndex) {
                             statusClass = "bg-red-50 border-red-300";
                             icon = <XCircle className="w-4 h-4 text-red-500" />;
                         } else {
                             statusClass = "opacity-50 border-slate-100";
                         }
                     }
                     return (
                        <button key={idx} onClick={() => handleSelect(idx)} disabled={hasSubmitted}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${statusClass}`}>
                            <span className={`text-sm flex-1 mr-2 ${hasSubmitted && idx === correctIndex ? 'font-bold text-emerald-900' : 'text-slate-700'}`}>
                                <InlineParser content={opt} />
                            </span>
                            {icon}
                        </button>
                     );
                 })}
             </div>
             {hasSubmitted && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${selected === correctIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {selected === correctIndex ? '回答正确' : '回答错误'}
                        </span>
                        <span className="text-xs text-slate-400">正确答案: {String.fromCharCode(65 + correctIndex)}</span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed"><StandardTextBlock content={data.explanation || "暂无解析"} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

export const MultipleChoiceBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::multiple_choice\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    // selected is array of indices
    const [selected, setSelected] = useState<number[]>(savedState?.selected ?? []);
    const [hasSubmitted, setHasSubmitted] = useState(savedState?.hasSubmitted ?? false);
    
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // Parse correct answers. Supports array ["A", "C"] or string "AC" or "A,C"
    let correctIndices: number[] = [];
    if (Array.isArray(data.answer)) {
        correctIndices = data.answer.map((a: string) => String(a).trim().toUpperCase().charCodeAt(0) - 65);
    } else if (typeof data.answer === 'string') {
        const str = data.answer.toUpperCase().replace(/[^A-Z]/g, '');
        correctIndices = str.split('').map(c => c.charCodeAt(0) - 65);
    }
    
    const toggleSelect = (idx: number) => {
        if (hasSubmitted) return;
        const newSelected = selected.includes(idx) 
            ? selected.filter(i => i !== idx)
            : [...selected, idx];
        setSelected(newSelected);
        onInteract?.('update_state', { state: { selected: newSelected } });
    };

    const handleSubmit = () => {
        if (selected.length === 0) return;
        setHasSubmitted(true);
        onInteract?.('update_state', { state: { hasSubmitted: true } });
    };

    // Grading Logic
    const userSet = new Set<number>(selected);
    const correctSet = new Set<number>(correctIndices);
    let hasWrong = false;
    let missingCorrect = false;
    
    userSet.forEach((i) => { if(!correctSet.has(i)) hasWrong = true; });
    correctSet.forEach((i) => { if(!userSet.has(i)) missingCorrect = true; });
    
    let status = 'wrong';
    if (!hasWrong) {
        status = missingCorrect ? 'partial' : 'correct';
    }

    return (
        <StyledBlock title="多选题" icon={CheckSquare} color="indigo">
             <StandardTextBlock content={data.question || ""} />
             <div className="mt-4 space-y-2">
                 {(data.options || []).map((opt: string, idx: number) => {
                     const isSelected = selected.includes(idx);
                     const isCorrect = correctIndices.includes(idx);
                     
                     let statusClass = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                     if (isSelected) statusClass = "bg-indigo-50 border-indigo-500 text-indigo-900";

                     let icon = isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300" />;

                     if (hasSubmitted) {
                         if (isCorrect) {
                             statusClass = "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500";
                             // Mark missing correct answers if not selected
                             icon = <CheckSquare className="w-5 h-5 text-emerald-600" />;
                         } else if (isSelected && !isCorrect) {
                             statusClass = "bg-red-50 border-red-300";
                             icon = <XCircle className="w-5 h-5 text-red-500" />;
                         } else {
                             statusClass = "opacity-50 border-slate-100";
                             icon = <Square className="w-5 h-5 text-slate-200" />;
                         }
                     }

                     return (
                        <button key={idx} onClick={() => toggleSelect(idx)} disabled={hasSubmitted}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${statusClass}`}>
                            <span className={`text-sm flex-1 mr-2 ${hasSubmitted && isCorrect ? 'font-bold text-emerald-900' : 'text-slate-700'}`}>
                                <InlineParser content={opt} />
                            </span>
                            {icon}
                        </button>
                     );
                 })}
             </div>
             
             {!hasSubmitted ? (
                 <div className="mt-4 flex justify-end">
                     <button 
                        onClick={handleSubmit} 
                        disabled={selected.length === 0}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                         提交答案
                     </button>
                 </div>
             ) : (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            status === 'correct' ? 'bg-emerald-100 text-emerald-700' : 
                            status === 'partial' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                        }`}>
                            {status === 'correct' ? '完全正确' : status === 'partial' ? '部分正确 (漏选)' : '回答错误'}
                        </span>
                        <span className="text-xs text-slate-400">
                            正确答案: {correctIndices.map(i => String.fromCharCode(65 + i)).join('')}
                        </span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed"><StandardTextBlock content={data.explanation || "暂无解析"} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

export const FillInBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::fill_in\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [userVal, setUserVal] = useState(savedState?.userVal ?? "");
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>(savedState?.status ?? 'idle');
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const parseNumber = (input: string): number => {
        if (!input) return NaN;
        const clean = String(input).replace(/\s/g, '');
        if (clean.includes('/')) {
            const parts = clean.split('/');
            return parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : NaN;
        }
        return parseFloat(clean);
    };
    const handleSubmit = () => {
        if (!userVal.trim()) return;
        const userNum = parseNumber(userVal);
        const ansNum = parseNumber(data.answer);
        let isCorrect = false;
        if (!isNaN(userNum) && !isNaN(ansNum)) {
             if (Math.abs(userNum - ansNum) < 0.0001) isCorrect = true;
        } else {
            if (userVal.replace(/\s/g, '').toLowerCase() === String(data.answer).replace(/\s/g, '').toLowerCase()) isCorrect = true;
        }
        const newStatus = isCorrect ? 'correct' : 'wrong';
        setStatus(newStatus);
        onInteract?.('update_state', { state: { userVal, status: newStatus } });
    };
    return (
        <StyledBlock title="填空题" icon={Type} color="cyan">
             <StandardTextBlock content={data.question || ""} />
             <div className="mt-4 flex gap-2">
                 <input type="text" value={userVal} onChange={(e) => setUserVal(e.target.value)} disabled={status === 'correct'} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="输入答案 (如 0.5)"
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm outline-none transition-all ${status === 'correct' ? 'bg-emerald-50 border-emerald-300' : status === 'wrong' ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'}`} />
                 <button onClick={handleSubmit} disabled={status === 'correct' || !userVal} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">提交</button>
             </div>
             {status !== 'idle' && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 rounded-lg">
                    <div className="text-sm text-slate-600"><StandardTextBlock content={data.explanation || `参考答案：${data.answer}`} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

export const TrueFalseBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::true_false\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    const [result, setResult] = useState<'correct' | 'wrong' | null>(savedState?.result ?? null);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const getCorrectAnswer = (val: any): boolean => {
        if (typeof val === 'boolean') return val;
        if (typeof val === 'string') return val.toLowerCase().trim() === 'true';
        return !!val;
    };
    const check = (choice: boolean) => {
        if (result) return;
        const ans = getCorrectAnswer(data.answer);
        const newResult = choice === ans ? 'correct' : 'wrong';
        setResult(newResult);
        onInteract?.('update_state', { state: { result: newResult } });
    };
    return (
        <StyledBlock title="判断题" icon={CheckSquare} color="emerald">
            <StandardTextBlock content={data.question || ""} />
            <div className="mt-4 flex gap-3">
                <button onClick={() => check(true)} disabled={!!result} className={`flex-1 py-2 rounded-lg border font-medium transition-all ${result ? (getCorrectAnswer(data.answer) ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'opacity-50') : 'hover:bg-slate-50'}`}>正确</button>
                <button onClick={() => check(false)} disabled={!!result} className={`flex-1 py-2 rounded-lg border font-medium transition-all ${result ? (!getCorrectAnswer(data.answer) ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'opacity-50') : 'hover:bg-slate-50'}`}>错误</button>
            </div>
            {result && (
                <div className={`p-4 border-t mt-4 rounded-lg ${result === 'correct' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                        {result === 'correct' ? <CheckCircle2 className="w-4 h-4 text-emerald-600"/> : <XCircle className="w-4 h-4 text-red-500"/>}
                        <span className={result === 'correct' ? 'text-emerald-700' : 'text-red-700'}>{result === 'correct' ? '回答正确' : '回答错误'}</span>
                    </div>
                    <div className="text-sm text-slate-600"><StandardTextBlock content={data.explanation} /></div>
                </div>
            )}
        </StyledBlock>
    );
};

export const QuizBlock: React.FC<{ content: string; onInteract?: (a: string, p?: any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::quiz\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    const question = data.question || ""; 
    let displayQuestion = question;
    let displayAnswer = data.answer;
    let displayExplanation = data.explanation;
    if (!question && !displayAnswer) {
         const parts = rawJson.split(/\n\s*---\s*\n/);
         displayQuestion = parts[0];
         displayAnswer = parts[1];
         displayExplanation = parts[2];
    }
    const isAutoSubmit = data.auto_submit === true;
    const [mode, setMode] = useState<'question' | 'input' | 'result'>(
        savedState?.mode ?? (isAutoSubmit ? 'input' : 'question')
    );
    
    // Use local state for the textarea to avoid re-renders on every keystroke
    const [localUserAnswer, setLocalUserAnswer] = useState(savedState?.userAnswer ?? "");
    
    // Sync local state with props if they change externally (e.g. initial load or batch update)
    useEffect(() => {
        if (savedState?.userAnswer !== undefined && savedState.userAnswer !== localUserAnswer) {
            setLocalUserAnswer(savedState.userAnswer);
        }
    }, [savedState?.userAnswer]);

    const [submitted, setSubmitted] = useState(savedState?.submitted ?? false);
    const evaluation = savedState?.evaluation;
    const isEvaluating = savedState?.isEvaluating || false;
    
    const updateState = (newPartialState: any) => {
        onInteract?.('update_state', { state: { 
            mode, 
            userAnswer: localUserAnswer, // Ensure current local answer is saved
            submitted, 
            ...newPartialState 
        }});
    };
    
    const handleModeChange = (newMode: 'question' | 'input' | 'result') => {
        setMode(newMode);
        updateState({ mode: newMode });
    };

    const handleBlur = () => {
        // Only update parent state on blur to persist progress without re-rendering component
        if (localUserAnswer !== savedState?.userAnswer) {
            updateState({ userAnswer: localUserAnswer });
        }
    };

    const handleSubmitToAI = () => {
        if (!localUserAnswer.trim()) return;
        // Make sure state is up to date before submitting
        updateState({ userAnswer: localUserAnswer });
        onInteract?.('auto_submit_quiz', { question: displayQuestion, userAnswer: localUserAnswer });
        updateState({ isEvaluating: true });
    };

    return (
        <StyledBlock title="主观题" icon={HelpCircle} color="violet">
            <StandardTextBlock content={displayQuestion || "题目内容解析错误"} />
            {mode === 'question' && !isAutoSubmit && (
                <div className="bg-slate-50 border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-200 mt-4 -mx-5 -mb-5">
                    <button onClick={() => handleModeChange('input')} className="py-3 flex items-center justify-center gap-2 text-sm text-violet-600 font-medium hover:bg-violet-50"><PenLine className="w-4 h-4" /><span>我来做做看</span></button>
                    <button onClick={() => handleModeChange('result')} className="py-3 flex items-center justify-center gap-2 text-sm text-slate-500 font-medium hover:bg-slate-100"><Eye className="w-4 h-4" /><span>直接看答案</span></button>
                </div>
            )}
            {mode === 'input' && (
                <div className="bg-slate-50 border-t border-slate-100 p-4 mt-4 -mx-5 -mb-5">
                    <textarea 
                        value={localUserAnswer} 
                        onChange={(e) => setLocalUserAnswer(e.target.value)} 
                        onBlur={handleBlur}
                        placeholder="请输入你的解题思路..." 
                        className="w-full h-24 p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-violet-100 outline-none mb-3 resize-none bg-white text-slate-800" 
                    />
                    {isEvaluating && (
                        <div className="mb-3 p-3 bg-violet-50 border border-violet-100 rounded-lg flex items-center gap-3 animate-pulse">
                            <Loader2 className="w-4 h-4 text-violet-500 animate-spin" />
                            <span className="text-xs text-violet-600 font-medium">AI 正在批改你的答案...</span>
                        </div>
                    )}
                    {!isEvaluating && evaluation && (
                        <div className={`mb-3 p-4 rounded-lg border flex gap-3 ${
                            evaluation.status === 'correct' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                            evaluation.status === 'wrong' ? 'bg-red-50 border-red-100 text-red-800' :
                            'bg-amber-50 border-amber-100 text-amber-800'
                        }`}>
                            {evaluation.status === 'correct' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : 
                             evaluation.status === 'wrong' ? <XCircle className="w-5 h-5 shrink-0" /> : 
                             <AlertCircle className="w-5 h-5 shrink-0" />}
                            <div>
                                <div className="font-bold text-sm mb-1">
                                    {evaluation.status === 'correct' ? '回答正确' :
                                     evaluation.status === 'wrong' ? '回答有误' :
                                     '思路部分正确'}
                                </div>
                                <div className="text-sm opacity-90">{evaluation.feedback}</div>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {isAutoSubmit ? (
                             <button 
                                onClick={handleSubmitToAI} 
                                disabled={!localUserAnswer.trim() || submitted || isEvaluating} 
                                className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                             >
                                <BrainCircuit className="w-4 h-4" />
                                <span>{submitted ? '重新提交' : '提交给 AI 批改'}</span>
                             </button>
                        ) : (
                             <>
                                <button 
                                    onClick={handleSubmitToAI}
                                    disabled={!localUserAnswer.trim() || isEvaluating} 
                                    className="flex-1 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <BrainCircuit className="w-4 h-4" />
                                    <span>AI 批改</span>
                                </button>
                                <button onClick={() => handleModeChange('result')} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">参考答案</button>
                             </>
                        )}
                    </div>
                </div>
            )}
            {(mode === 'result' || (submitted && evaluation)) && (
                <div className="bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top-2 mt-4 -mx-5 -mb-5">
                     <div className="px-5 py-4 border-b border-slate-100 bg-white">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">参考答案</div>
                         <StandardTextBlock content={displayAnswer || "暂无参考答案"} />
                         {displayExplanation && (<div className="mt-4 pt-4 border-t border-slate-50"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">详细解析</div><StandardTextBlock content={displayExplanation} /></div>)}
                    </div>
                    {!isAutoSubmit && (
                        <button onClick={() => handleModeChange('input')} className="w-full py-2 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><span>收起</span><ChevronUp className="w-3 h-3" /></button>
                    )}
                </div>
            )}
        </StyledBlock>
    );
};
