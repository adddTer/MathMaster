
import React, { useState, useRef, useEffect } from 'react';
import { Save, Settings, Check } from 'lucide-react';
import { AIConfig, EssayConfig, EssayAdvisorSuggestion, EditorCard, EssaySession } from '../../types';
import { fetchAdvisors, fetchSuggestions, streamEssayWriter } from '../../services/essayService';
import { EssaySidebar } from './EssaySidebar';
import { EssayAdvisors } from './EssayAdvisors';
import { EssaySuggestions } from './EssaySuggestions';
import { EssayInput } from './EssayInput';
import { EssayPreview } from './EssayPreview';

interface ModelOption {
    id: string;
    name: string;
}

interface EssayWorkspaceProps {
    session: EssaySession;
    aiConfig: AIConfig;
    availableModels: ModelOption[];
    onBack: () => void;
    onSave: (session: EssaySession) => void;
    selectedModelId: string;
    onOpenSettings?: () => void;
}

const LOADING_MESSAGES = [
    "正在召集顾问团成员...",
    "逻辑架构师正在分析题目结构...",
    "历史考据党正在翻阅典籍...",
    "文学修辞家正在构思词藻...",
    "时代观察员正在整理素材...",
    "正在生成多维度写作建议..."
];

export const EssayWorkspace: React.FC<EssayWorkspaceProps> = ({ 
    session, 
    aiConfig, 
    onBack, 
    onSave,
    selectedModelId,
    onOpenSettings
}) => {
    // Local state initialized from session
    const [history, setHistory] = useState(session.history || []);
    const [generatedText, setGeneratedText] = useState(session.currentText || '');
    const [advisors, setAdvisors] = useState<EssayAdvisorSuggestion[]>(session.advisors || []);
    const [cards, setCards] = useState<EditorCard[]>(session.cards || []);
    
    const [loadingAdvisors, setLoadingAdvisors] = useState(false);
    const [loadingCards, setLoadingCards] = useState(false);
    const [isWriting, setIsWriting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Progress UI state
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    
    const [mainInput, setMainInput] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const sidebarBottomRef = useRef<HTMLDivElement>(null);

    // Initial Load Logic
    useEffect(() => {
        if (history.length <= 1 && advisors.length === 0 && !loadingAdvisors && aiConfig.apiKey) {
            initRound();
        }
    }, [aiConfig.apiKey]);

    // Sync to parent on major changes
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSaveSession();
        }, 2000);
        return () => clearTimeout(timer);
    }, [history, generatedText, advisors, cards]);

    // Loading Progress Simulation
    useEffect(() => {
        let progressInterval: any;
        let messageInterval: any;

        if (loadingAdvisors) {
            setLoadingProgress(0);
            setLoadingMessageIndex(0);
            
            progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 90) return prev;
                    const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
                    return prev + increment;
                });
            }, 200);

            messageInterval = setInterval(() => {
                setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500);
        } else {
            setLoadingProgress(100);
        }

        return () => {
            clearInterval(progressInterval);
            clearInterval(messageInterval);
        };
    }, [loadingAdvisors]);

    const handleSaveSession = () => {
        setIsSaving(true);
        onSave({
            ...session,
            history,
            currentText: generatedText,
            advisors,
            cards,
            updatedAt: Date.now(),
            lastModelId: selectedModelId
        });
        setTimeout(() => setIsSaving(false), 500);
    };

    const getEffectiveConfig = () => ({
        ...aiConfig,
        modelId: selectedModelId
    });

    const initRound = async () => {
        setLoadingAdvisors(true);
        setAdvisors([]); 
        setCards([]); 
        
        try {
            const newAdvisors = await fetchAdvisors(session.config, generatedText, getEffectiveConfig());
            setAdvisors(newAdvisors);
            setLoadingAdvisors(false);
            
            if (newAdvisors.length > 0) {
                setLoadingCards(true);
                const newCards = await fetchSuggestions(session.config, generatedText, newAdvisors, getEffectiveConfig());
                setCards(newCards);
                setLoadingCards(false);
            }
        } catch (e) {
            console.error(e);
            setLoadingAdvisors(false);
            setLoadingCards(false);
        }
    };

    const handleCardSelect = (content: string) => {
        setMainInput(content);
        if (inputRef.current) inputRef.current.focus();
    };

    const handleSend = async () => {
        if (!mainInput.trim() || isWriting) return;
        
        if (!aiConfig.apiKey) {
            onOpenSettings?.();
            return;
        }

        const instruction = mainInput;
        setMainInput('');
        
        const newHistory = [...history, { role: 'user' as const, content: instruction }];
        setHistory(newHistory);
        
        setIsWriting(true);
        setHistory(prev => [...prev, { role: 'model', content: '收到指令，执笔人正在生成...' }]);

        try {
            await streamEssayWriter(session.config, generatedText, instruction, getEffectiveConfig(), (chunk) => {
                setGeneratedText(prev => prev + chunk);
            });
            setGeneratedText(prev => prev + "\n\n");
            setIsWriting(false);
            
            setHistory(prev => [...prev, { role: 'model', content: '本段落已完成。顾问团正在评估下一步进展...' }]);
            initRound();
            
        } catch (e: any) {
            setHistory(prev => [...prev, { role: 'model', content: `生成出错: ${e.message}` }]);
            setIsWriting(false);
        }
    };

    return (
        <div className="flex h-full bg-slate-100">
            <EssaySidebar 
                session={session} 
                history={history} 
                onBack={onBack} 
                bottomRef={sidebarBottomRef}
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="lg:hidden text-slate-400 font-bold">返回</button>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">{session.title}</h1>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">{session.config.style}</span>
                                {session.config.selectedAngle && <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">立意：{session.config.selectedAngle}</span>}
                                <span>{session.config.wordCount}</span>
                                {isSaving && <span className="text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3" /> 已保存</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {onOpenSettings && (
                            <button 
                                onClick={onOpenSettings}
                                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${!aiConfig.apiKey ? 'bg-red-50 text-red-600 animate-pulse' : 'text-slate-500 hover:bg-slate-100'}`}
                                title="设置 API Key"
                            >
                                <Settings className="w-5 h-5" />
                                {!aiConfig.apiKey && <span className="text-xs font-bold hidden sm:inline">未配置 Key</span>}
                            </button>
                        )}
                        <button 
                            onClick={handleSaveSession}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-2" 
                            title="保存"
                        >
                            <Save className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    <EssayAdvisors 
                        advisors={advisors}
                        loading={loadingAdvisors}
                        progress={loadingProgress}
                        messageIndex={loadingMessageIndex}
                        loadingMessages={LOADING_MESSAGES}
                        hasApiKey={!!aiConfig.apiKey}
                        onOpenSettings={onOpenSettings || (() => {})}
                    />

                    <EssaySuggestions 
                        cards={cards}
                        loading={loadingCards}
                        onSelect={handleCardSelect}
                    />

                    <EssayInput 
                        value={mainInput}
                        onChange={setMainInput}
                        onSend={handleSend}
                        isWriting={isWriting}
                        inputRef={inputRef}
                    />

                    <EssayPreview 
                        title={session.title}
                        content={generatedText}
                        isWriting={isWriting}
                        bottomRef={bottomRef}
                    />
                </div>
            </div>
        </div>
    );
};
