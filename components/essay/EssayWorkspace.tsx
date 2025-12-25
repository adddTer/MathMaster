
import React, { useState, useRef, useEffect } from 'react';
import { Save, Settings, ChevronLeft, Bot, ToggleLeft, ToggleRight, PlayCircle, Layers, PenTool, BookOpen, Target, Check, MessageSquare } from 'lucide-react';
import { AIConfig, EssaySession, ChatMessage } from '../../types';
import { MessageList } from '../ai-tutor/MessageList';
import { ChatInput } from '../ai-tutor/ChatInput';
import { sendMessageToGeminiStream } from '../../services/geminiService';
import { AGENT_PROMPTS } from '../../services/prompts';

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

const PHASES = [
    { id: 'analyzing', label: '选题分析', icon: Target },
    { id: 'discussing', label: '大纲构建', icon: Layers }, 
    { id: 'writing', label: '素材准备', icon: BookOpen },   
    { id: 'reviewing', label: '写作执行', icon: PenTool },  
];

const AGENTS = {
    admin: { name: '管理AI', role: 'admin' as const, avatar: '🤖' },
    logic: { name: '逻辑架构师', role: 'logic' as const, avatar: '📐' },
    rhetoric: { name: '文学修辞家', role: 'rhetoric' as const, avatar: '✒️' },
    history: { name: '历史考据党', role: 'history' as const, avatar: '📜' },
    reality: { name: '时代观察员', role: 'reality' as const, avatar: '🌍' }
};

export const EssayWorkspace: React.FC<EssayWorkspaceProps> = ({ 
    session, aiConfig, availableModels, onBack, onSave, selectedModelId, onOpenSettings
}) => {
    // --- State ---
    const [messages, setMessages] = useState<ChatMessage[]>(session.history || []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Workflow State
    const [mode, setMode] = useState<'auto' | 'proxy'>(session.mode || 'proxy');
    const [currentPhase, setCurrentPhase] = useState(session.groupState || 'analyzing');
    const [subState, setSubState] = useState<'discussion' | 'decision' | 'approval'>(session.subState || 'discussion');
    
    // Orchestration
    const [turnQueue, setTurnQueue] = useState<string[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [pendingDecision, setPendingDecision] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // --- Persist State ---
    useEffect(() => {
        const timer = setTimeout(() => {
            onSave({
                ...session,
                history: messages,
                mode,
                groupState: currentPhase as any,
                subState,
                updatedAt: Date.now()
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [messages, mode, currentPhase, subState]);

    const scrollToBottom = () => {
        if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages.length, isLoading]);

    // --- Bootstrapping ---
    useEffect(() => {
        // If it's a new session (only user input), kick off the Analysis phase
        if (messages.length === 1 && messages[0].role === 'user' && turnQueue.length === 0 && !isLoading) {
            startDiscussionPhase('analyzing');
        }
    }, []);

    // --- Queue Processing (The Engine) ---
    useEffect(() => {
        if (turnQueue.length > 0 && !isLoading && !isPaused) {
            const nextAgent = turnQueue[0];
            processTurn(nextAgent);
        }
    }, [turnQueue, isLoading, isPaused]);

    const startDiscussionPhase = (phase: string) => {
        // Round Robin: Admin Intro -> 4 Advisors -> Admin Decision
        setTurnQueue(['admin', 'logic', 'history', 'rhetoric', 'reality', 'admin']);
        setSubState('discussion');
        setCurrentPhase(phase as any);
    };

    const processTurn = async (agentKey: string) => {
        setIsLoading(true);
        // Pacing delay
        await new Promise(r => setTimeout(r, 800));

        const sender = AGENTS[agentKey as keyof typeof AGENTS];
        const isProxy = mode === 'proxy';
        
        // Determine prompt based on agent
        let systemInstruction = "";
        if (agentKey === 'admin') {
            // Check if this is the final admin turn in the queue (Decision time)
            const isDecisionTurn = turnQueue.length === 1; 
            if (isDecisionTurn) {
                // If it's decision time, switch subState
                setSubState('decision');
            }
            // Admin gets special prompt knowing about Proxy Mode
            // Explicitly casting boolean to avoid type confusion if any
            const isDecisionMode = Boolean(isProxy && isDecisionTurn);
            systemInstruction = AGENT_PROMPTS.admin(session.config.topic, currentPhase, isDecisionMode);
        } else {
            // Exclude admin explicitly to allow TS to infer the 2-argument signature
            const key = agentKey as Exclude<keyof typeof AGENT_PROMPTS, 'admin'>;
            const promptGen = AGENT_PROMPTS[key];
            if (promptGen) systemInstruction = promptGen(session.config.topic, currentPhase);
        }

        // Prepare context: Use limited history for context window efficiency
        // KEY: We map 'user' messages to 'admin' role in the context sent to AI
        // so agents think the user's choices were actually Admin's decisions.
        const contextMessages = messages.filter(m => !m.isError).slice(-15).map(m => ({
            role: m.role,
            text: (m.role === 'user' && messages.indexOf(m) > 0) ? `(Admin Decision): ${m.text}` : m.text
        }));

        const newMsg: ChatMessage = { role: 'model', text: '', sender: sender };
        setMessages(prev => [...prev, newMsg]);

        try {
            let fullText = "";
            await sendMessageToGeminiStream(
                contextMessages,
                `Current Phase: ${currentPhase}. Role: ${sender.name}.`, 
                "请发言。", 
                aiConfig,
                (chunk) => {
                    fullText += chunk;
                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { ...newMsg, text: fullText };
                        return updated;
                    });
                    scrollToBottom();
                },
                systemInstruction
            );

            // Post-turn logic
            setTurnQueue(prev => prev.slice(1));
            
            // If Admin finished the decision turn
            if (agentKey === 'admin' && subState === 'decision') {
                if (mode === 'auto') {
                    // In auto mode, Admin just spoke the decision. Move to Approval.
                    setPendingDecision(fullText); // Use the text as the decision
                    setSubState('approval');
                } else {
                    // In proxy mode, Admin generated options. Wait for user interaction.
                    // SubState stays 'decision' until user clicks.
                }
            }

        } catch (e: any) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...newMsg, text: `(Error: ${e.message})`, isError: true };
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    // --- User Actions ---

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        // 1. Add User Message
        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // 2. Logic Branching
        if (subState === 'decision') {
            // User manually inputted a decision (ignoring options or custom)
            handleDecisionMade(input);
        } else if (subState === 'approval') {
            // User rejected or commented on approval
            // Trigger a re-discussion
            setSubState('discussion');
            setTurnQueue(['admin', 'logic', 'reality', 'admin']); // Short re-loop
        } else {
            // Discussion interruption
            // Admin acknowledges and we continue or adjust
            setTurnQueue(['admin']); 
        }
    };

    const handleInteract = (action: string, payload: any) => {
        if (action === 'apply_suggestion') {
            // User picked an option in Proxy Mode
            handleDecisionMade(payload.text);
        }
    };

    const handleDecisionMade = (decisionText: string) => {
        // Treat this as the approved decision
        // In Proxy mode, we haven't officially added the user message yet if clicked from card
        // So we add it now if it came from a card click (payload)
        
        if (messages[messages.length - 1].text !== decisionText) {
             const userMsg: ChatMessage = { role: 'user', text: `我决定采用以下方案：\n${decisionText}` };
             setMessages(prev => [...prev, userMsg]);
        }

        setPendingDecision(decisionText);
        setSubState('approval');
        // Admin summarizes/confirms
        setTurnQueue(['admin']); 
    };

    const handleApprove = () => {
        // Move to next phase
        let nextPhase = currentPhase;
        if (currentPhase === 'analyzing') nextPhase = 'discussing';
        else if (currentPhase === 'discussing') nextPhase = 'writing';
        else if (currentPhase === 'writing') nextPhase = 'reviewing'; // Placeholder for now

        // Inject system message indicating phase change
        const sysMsg: ChatMessage = { role: 'model', text: `✅ 阶段目标达成。进入下一阶段：${PHASES.find(p=>p.id===nextPhase)?.label}`, sender: AGENTS.admin };
        setMessages(prev => [...prev, sysMsg]);

        startDiscussionPhase(nextPhase);
    };

    const handleEditMessage = (index: number, newText: string) => {
        // Rewind history
        const newHistory = messages.slice(0, index + 1);
        newHistory[index] = { ...newHistory[index], text: newText };
        setMessages(newHistory);
        setTurnQueue([]); 
        setIsPaused(true); // Pause to let user decide
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm z-10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft className="w-5 h-5" /></button>
                    <h1 className="font-bold text-slate-800 text-sm truncate flex items-center gap-2">
                        {session.title}
                        <span className={`px-1.5 py-0.5 text-[10px] rounded border flex items-center gap-1 ${subState === 'approval' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                            {subState === 'approval' ? <Check className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                            {subState === 'approval' ? '等待审批' : '研讨中'}
                        </span>
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {/* Phase Stepper */}
                    <div className="hidden md:flex bg-slate-50 rounded-lg p-1 border border-slate-100 mr-2">
                        {PHASES.map((p, i) => {
                            const isActive = currentPhase === p.id;
                            return (
                                <div key={p.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                                    <p.icon className="w-3 h-3" /> {p.label}
                                </div>
                            );
                        })}
                    </div>
                    {/* Controls */}
                    <button 
                        onClick={() => setIsPaused(!isPaused)} 
                        className={`p-2 rounded-full ${isPaused ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}
                    >
                        {isPaused ? <PlayCircle className="w-5 h-5" /> : <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">||</div>}
                    </button>
                    <button 
                        onClick={() => setMode(mode === 'auto' ? 'proxy' : 'auto')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${mode === 'auto' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                    >
                        {mode === 'auto' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {mode === 'auto' ? '全托管' : '代理'}
                    </button>
                    <button onClick={onSave.bind(null, session)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Save className="w-5 h-5" /></button>
                    <button onClick={onOpenSettings} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Settings className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Chat Area */}
            <MessageList 
                messages={messages}
                isLoading={isLoading}
                isFullscreen={true} 
                scrollRef={scrollRef}
                onInteract={handleInteract}
                onEditMessage={handleEditMessage}
                aiConfig={aiConfig}
                availableModels={availableModels}
            />

            {/* Approval Banner */}
            {subState === 'approval' && (
                <div className="bg-emerald-50 border-t border-emerald-100 p-3 px-6 flex items-center justify-between animate-in slide-in-from-bottom-2">
                    <div className="text-sm text-emerald-800 font-medium">
                        <span className="font-bold">阶段成果待确认：</span> 请检查 AI 的结论，通过后将进入下一阶段。
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setInput("我觉得不行，还要修改..."); inputRef.current?.focus(); }} className="px-4 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-xs hover:bg-emerald-100">有意见</button>
                        <button onClick={handleApprove} className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1"><Check className="w-3 h-3" /> 通过并继续</button>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <ChatInput 
                input={input}
                setInput={setInput}
                onSend={handleSend}
                isLoading={isLoading}
                isConnected={!!aiConfig.apiKey}
                inputRef={inputRef}
            />
        </div>
    );
};
