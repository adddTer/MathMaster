
import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    isLoading: boolean;
    isConnected: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    input, setInput, onSend, isLoading, isConnected, inputRef
}) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="shrink-0 border-t border-slate-200 bg-white p-4 z-20">
            <div className="max-w-3xl mx-auto relative flex items-center gap-2">
                <div className="relative w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={isConnected ? "输入问题，或尝试“出题”、“写作文”..." : "请先配置 API Key"}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 block p-3.5 pr-12 transition-all shadow-sm placeholder:text-slate-400"
                        disabled={isLoading}
                    />
                    <button 
                        onClick={onSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:bg-transparent disabled:text-slate-300 disabled:shadow-none active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
