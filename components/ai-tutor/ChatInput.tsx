
import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    isLoading: boolean;
    isConnected: boolean;
    inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    input, setInput, onSend, isLoading, isConnected, inputRef
}) => {
    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Logic:
        // Desktop: Enter sends (unless Shift/Ctrl held). Shift+Enter = Newline.
        // Mobile: Enter = Newline (Standard textarea behavior). Send via button only.
        
        // Simple heuristic for desktop environment (mouse pointer usually implies desktop)
        const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        if (isDesktop) {
            // Prevent send if Shift or Ctrl is pressed (Allowing line breaks or other shortcuts)
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
                e.preventDefault();
                onSend();
            }
        }
        // On mobile, we let the default behavior happen (newline), user must tap button to send.
    };

    return (
        <div className="shrink-0 border-t border-slate-200 bg-white p-4 z-20">
            <div className="max-w-3xl mx-auto relative flex items-end gap-2">
                <div className="relative w-full">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isConnected ? "输入问题，或尝试“出题”、“写作文”..." : "请先配置 API Key"}
                        className="w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 block p-3.5 pr-12 transition-all shadow-sm placeholder:text-slate-400 resize-none min-h-[48px] max-h-[120px]"
                        disabled={isLoading}
                        rows={1}
                    />
                    <button 
                        onClick={onSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-1.5 p-2 bg-slate-900 text-white hover:bg-slate-700 rounded-lg transition-all shadow-md disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
