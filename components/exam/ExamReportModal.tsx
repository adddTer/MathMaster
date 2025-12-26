
import React from 'react';
import { BarChart2, X, Loader2, RefreshCcw } from 'lucide-react';
import { StandardTextBlock } from '../blocks/utils';

interface ExamReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    isGenerating: boolean;
    content: string;
    onRegenerate: () => void;
}

export const ExamReportModal: React.FC<ExamReportModalProps> = ({ isOpen, onClose, isGenerating, content, onRegenerate }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [content, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-600" /> 综合学习评价报告
                    </h3>
                    <div className="flex items-center gap-2">
                        {!isGenerating && content && (
                            <button onClick={onRegenerate} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="重新生成">
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6" ref={scrollRef}>
                    {isGenerating && !content ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <span className="animate-pulse">AI 老师正在分析试卷...</span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-700 leading-relaxed">
                            <StandardTextBlock content={content} />
                            {isGenerating && <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1 align-middle"></span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
