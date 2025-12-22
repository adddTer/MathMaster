
import React from 'react';
import { User, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../types';
import { MessageRenderer } from '../MessageRenderer';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isFullscreen: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onInteract: (action: string, payload?: any, blockIndex?: number, msgIndex?: number) => void;
    aiConfig: any;
    availableModels: any;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages, isLoading, isFullscreen, scrollRef, onInteract, aiConfig, availableModels
}) => {
    return (
        <div 
            ref={scrollRef}
            className={`flex-1 overflow-y-auto ${isFullscreen ? 'bg-white' : 'bg-slate-50'} p-4 md:p-6 scroll-smooth`}
        >
            <div className={`mx-auto space-y-6 ${isFullscreen ? 'max-w-4xl' : 'max-w-none'}`}>
                {messages.map((msg, idx) => {
                    // Skip empty loading placeholder if it's the very last one and empty
                    if (isLoading && idx === messages.length - 1 && msg.role === 'model' && !msg.text) {
                        return null;
                    }

                    return (
                        <div 
                            key={idx} 
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'items-start group'}`}
                        >
                            {/* Avatar */}
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm
                                ${msg.role === 'model' ? 'bg-white border border-indigo-100 text-indigo-600' : 'bg-primary-600 text-white'}
                            `}>
                                {msg.role === 'model' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={`
                                min-w-0 
                                ${isFullscreen && msg.role === 'model' ? 'w-full' : 'max-w-[85%] rounded-2xl p-4 shadow-sm'}
                                ${msg.role === 'user' 
                                    ? 'bg-primary-600 text-white rounded-tr-sm shadow-md' 
                                    : isFullscreen 
                                        ? 'text-slate-800 pt-1' 
                                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                                }
                                ${msg.isError ? 'border-red-300 bg-red-50 text-red-600' : ''}
                            `}>
                                <div className={isFullscreen && msg.role === 'model' ? "prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-800" : ""}>
                                    <MessageRenderer 
                                        content={msg.text} 
                                        onInteract={(action, payload, blockIdx) => onInteract(action, payload, blockIdx, idx)}
                                        savedState={msg.componentState}
                                        aiConfig={aiConfig}
                                        availableModels={availableModels}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Skeleton */}
                {isLoading && messages.length > 0 && messages[messages.length-1].role === 'model' && messages[messages.length-1].text === '' && (
                     <div className="flex gap-4 items-start animate-pulse">
                         <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                         </div>
                         <div className={`${isFullscreen ? 'w-full' : 'max-w-[85%] w-full bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4'}`}>
                            <div className="h-4 bg-slate-100 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-3"></div>
                            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};
