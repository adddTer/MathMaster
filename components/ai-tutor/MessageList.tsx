
import React, { useState } from 'react';
import { User, Sparkles, Loader2, Bot, Gavel, ScrollText, BookOpen, Globe, Edit2, Check, X } from 'lucide-react';
import { ChatMessage } from '../../types';
import { MessageRenderer } from '../MessageRenderer';

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    isFullscreen: boolean;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    onInteract: (action: string, payload?: any, blockIndex?: number, msgIndex?: number) => void;
    onEditMessage?: (index: number, newText: string) => void;
    aiConfig: any;
    availableModels: any;
}

// Minimalist Avatar
const AgentAvatar = ({ role, name }: { role?: string, name?: string }) => {
    let Icon = Sparkles;
    let colorClass = "bg-indigo-100 text-indigo-600";

    switch (role) {
        case 'user': Icon = User; colorClass = "bg-slate-800 text-white"; break;
        case 'admin': Icon = Bot; colorClass = "bg-indigo-600 text-white"; break;
        case 'logic': Icon = Gavel; colorClass = "bg-blue-100 text-blue-600"; break;
        case 'rhetoric': Icon = ScrollText; colorClass = "bg-purple-100 text-purple-600"; break;
        case 'history': Icon = BookOpen; colorClass = "bg-amber-100 text-amber-600"; break;
        case 'reality': Icon = Globe; colorClass = "bg-emerald-100 text-emerald-600"; break;
    }

    return (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${colorClass}`} title={name}>
            <Icon className="w-5 h-5" />
        </div>
    );
};

export const MessageList: React.FC<MessageListProps> = ({
    messages, isLoading, isFullscreen, scrollRef, onInteract, onEditMessage, aiConfig, availableModels
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editText, setEditText] = useState('');

    const startEditing = (index: number, currentText: string) => {
        setEditingIndex(index);
        setEditText(currentText);
    };

    const saveEdit = (index: number) => {
        if (editText.trim()) {
            onEditMessage?.(index, editText);
        }
        setEditingIndex(null);
        setEditText('');
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditText('');
    };

    return (
        <div 
            ref={scrollRef}
            className={`flex-1 overflow-y-auto ${isFullscreen ? 'bg-white' : 'bg-slate-50'} p-4 md:p-6 scroll-smooth`}
        >
            <div className={`mx-auto space-y-8 ${isFullscreen ? 'max-w-4xl' : 'max-w-none'}`}>
                {messages.map((msg, idx) => {
                    // Skip empty loading placeholder if it's the very last one and empty
                    if (isLoading && idx === messages.length - 1 && msg.role === 'model' && !msg.text) {
                        return null;
                    }

                    const isUser = msg.role === 'user';
                    const isEditing = editingIndex === idx;
                    const canEdit = onEditMessage && (isUser || (msg.sender?.role === 'admin'));
                    
                    // Agent Header Display
                    const agentName = msg.sender?.name || (isUser ? '我' : 'AI 助手');
                    const agentRole = msg.sender?.role || (isUser ? 'user' : 'model');

                    return (
                        <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'items-start'} group`}>
                            {/* Avatar */}
                            <AgentAvatar role={agentRole} name={agentName} />

                            {/* Content Area */}
                            <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                                {/* Name Label (Only for non-user, or if user in a group chat context) */}
                                <span className="text-xs text-slate-400 mb-1.5 px-1">
                                    {agentName}
                                </span>

                                {/* Bubble */}
                                <div className={`
                                    relative p-4 rounded-2xl shadow-sm border text-sm md:text-base leading-relaxed
                                    ${isUser 
                                        ? 'bg-slate-800 text-white border-slate-700 rounded-tr-sm' 
                                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-sm'}
                                    ${msg.isError ? 'border-red-300 bg-red-50 text-red-600' : ''}
                                    ${isEditing ? 'w-full min-w-[300px]' : ''}
                                `}>
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea 
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full p-2 border border-slate-300 rounded text-sm text-slate-800 bg-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={cancelEdit} className="p-1 text-slate-500 hover:bg-slate-200 rounded"><X className="w-4 h-4"/></button>
                                                <button onClick={() => saveEdit(idx)} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"><Check className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={!isUser ? "prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-800" : ""}>
                                                <MessageRenderer 
                                                    content={msg.text} 
                                                    onInteract={(action, payload, blockIdx) => onInteract(action, payload, blockIdx, idx)}
                                                    savedState={msg.componentState}
                                                    aiConfig={aiConfig}
                                                    availableModels={availableModels}
                                                />
                                            </div>
                                            {canEdit && !isLoading && (
                                                <button 
                                                    onClick={() => startEditing(idx, msg.text)}
                                                    className={`absolute -top-3 ${isUser ? '-left-3' : '-right-3'} p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100`}
                                                    title="修改内容"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Loading Skeleton */}
                {isLoading && messages.length > 0 && messages[messages.length-1].role === 'model' && messages[messages.length-1].text === '' && (
                     <div className="flex gap-4 items-start animate-pulse">
                         <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0"></div>
                         <div className="space-y-2 w-full max-w-[60%]">
                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                            <div className="h-20 bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4">
                                <div className="space-y-2">
                                    <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                         </div>
                     </div>
                )}
            </div>
        </div>
    );
};
