
import React from 'react';

interface EssayPreviewProps {
    title: string;
    content: string;
    isWriting: boolean;
    bottomRef: React.RefObject<HTMLDivElement | null>;
}

export const EssayPreview: React.FC<EssayPreviewProps> = ({ title, content, isWriting, bottomRef }) => {
    if (!content) return null;

    return (
        <section className="mt-8 pt-8 border-t border-slate-200" ref={bottomRef}>
            <div className="text-center mb-6">
                <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-400">
                    正文预览
                </span>
            </div>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                <h1 className="text-2xl font-bold text-center mb-8 text-slate-900">{title}</h1>
                <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-loose text-slate-700 font-serif">
                    {content}
                    {isWriting && <span className="animate-pulse inline-block w-2 h-4 bg-slate-400 ml-1 align-middle"></span>}
                </div>
            </div>
        </section>
    );
};
