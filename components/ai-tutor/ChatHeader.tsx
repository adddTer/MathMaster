
import React from 'react';
import { Bot, History, Plus, Minimize2, Maximize2, Settings } from 'lucide-react';

interface ChatHeaderProps {
    title: string;
    modelName: string;
    isConnected: boolean;
    onHistoryClick: () => void;
    onNewChatClick: () => void;
    onFullscreenClick: () => void;
    isFullscreen: boolean;
    onSettingsClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    title, modelName, isConnected,
    onHistoryClick, onNewChatClick,
    onFullscreenClick, isFullscreen, onSettingsClick
}) => {
    return (
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-10 shadow-sm transition-shadow">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600 shrink-0 shadow-sm border border-primary-100">
                    <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h2 className="font-bold text-slate-800 text-sm truncate">{title}</h2>
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`}></span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                            {isConnected ? modelName : '未连接'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
                <button onClick={onHistoryClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-all active:scale-95" title="历史对话">
                    <History className="w-4 h-4" />
                </button>
                <button onClick={onNewChatClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-all hidden sm:flex active:scale-95" title="新对话">
                    <Plus className="w-4 h-4" />
                </button>
                <button onClick={onFullscreenClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-all hidden md:flex active:scale-95" title={isFullscreen ? "退出全屏" : "全屏模式"}>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={onSettingsClick} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-all active:scale-95" title="API 设置">
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
