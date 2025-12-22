import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Library, BookOpen, Clock, Send, Sparkles, User, Bot, ArrowRight, Copy, RefreshCw, ChevronLeft, Lightbulb, Feather, Settings, Loader2 } from 'lucide-react';
import { AIConfig, EssayConfig, EssayAdvisorSuggestion, EditorCard, AIProvider } from '../types';

interface ModelOption {
    id: string;
    name: string;
}

interface EssayEditorProps {
    aiConfig: AIConfig;
    availableModels: { gemini: ModelOption[], openai: ModelOption[] };
    onBack: () => void;
}

// Mock Data for UI Visualization
const MOCK_ADVISORS: EssayAdvisorSuggestion[] = [
    { role: 'logic', name: '逻辑架构师', avatar: '📐', content: '建议采用层进式结构，先论述现象，再挖掘本质，最后升华到社会层面。' },
    { role: 'rhetoric', name: '文学修辞家', avatar: '✒️', content: '开篇可以使用排比句增强气势，结尾呼应开头，形成回环。' },
    { role: 'history', name: '历史考据党', avatar: '📜', content: '可以引用苏轼《赤壁赋》中关于变与不变的哲理作为论据。' },
    { role: 'reality', name: '时代观察员', avatar: '🌍', content: '结合当下数字化时代的碎片化阅读现象，使文章更具现实意义。' }
];

const MOCK_CARDS: EditorCard[] = [
    { id: '1', title: '稳健型：层层递进', tags: ['逻辑严密', '结构清晰'], reasoning: '适合考场作文，稳中求胜。', content: '纵观历史长河，变的是时代更迭，不变的是民族精神的内核。我们在数字化浪潮中，更应坚守文化的根基。' },
    { id: '2', title: '创新型：反弹琵琶', tags: ['视角独特', '文采斐然'], reasoning: '逆向思维，容易脱颖而出。', content: '人们常说“变则通”，然而在某些时刻，不变不仅是一种坚守，更是一种在浮躁尘世中难得的清醒与孤傲。' },
    { id: '3', title: '现实型：针砭时弊', tags: ['切中痛点', '时代感强'], reasoning: '紧扣热点，引发共鸣。', content: '当算法推荐填满了我们的碎片时间，我们是否还拥有深度思考的能力？在这个瞬息万变的时代，保持独立思考的“不变”，显得尤为珍贵。' }
];

export const EssayEditor: React.FC<EssayEditorProps> = ({ aiConfig, availableModels, onBack }) => {
    const [step, setStep] = useState<'setup' | 'writing'>('setup');
    const [config, setConfig] = useState<EssayConfig>({
        topic: '',
        requirements: '',
        wordCount: 800,
        style: '议论文'
    });
    
    // Model Selection (Local state for specific override)
    const [selectedModelId, setSelectedModelId] = useState(aiConfig.modelId || '');
    
    // Writing State
    const [mainInput, setMainInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<{role: 'user'|'model', content: string}[]>([]);
    const [generatedText, setGeneratedText] = useState(''); // The final essay content
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Sync model selection with global config initially
    useEffect(() => {
        setSelectedModelId(aiConfig.modelId || '');
    }, [aiConfig.modelId]);

    // Auto-scroll to bottom of generated text
    useEffect(() => {
        if (generatedText && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [generatedText]);

    const handleStart = () => {
        if (!config.topic.trim()) return;
        setStep('writing');
        // Initial Mock Interaction
        setHistory([{ role: 'model', content: `主编您好，我是您的执行团队。关于“${config.topic}”这个选题，顾问团已经准备好了初步建议，请您审阅并做出第一步指示。` }]);
    };

    const handleCardClick = (content: string) => {
        setMainInput(content);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleSend = () => {
        if (!mainInput.trim() || isGenerating) return;
        
        const newMsg = { role: 'user' as const, content: mainInput };
        setHistory(prev => [...prev, newMsg]);
        setMainInput('');
        setIsGenerating(true);
        
        // Mock Response for now (Part 1 implementation)
        setTimeout(() => {
            setHistory(prev => [...prev, { role: 'model', content: '收到主编指令。执笔人正在生成段落...' }]);
            setGeneratedText(prev => prev + (prev ? '\n\n' : '') + newMsg.content + "（此处将由 AI 执笔人进行扩写和润色...）");
            setIsGenerating(false);
        }, 1500);
    };

    const currentModelList = aiConfig.provider === 'gemini' ? availableModels.gemini : availableModels.openai;

    // --- View: Setup ---
    if (step === 'setup') {
        return (
            <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b border-orange-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <Feather className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">新建写作项目</h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    智能多角色写作辅助系统
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">作文题目</label>
                            <input 
                                type="text" 
                                value={config.topic}
                                onChange={e => setConfig({...config, topic: e.target.value})}
                                placeholder="例如：论“变与不变”"
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">写作要求 / 材料</label>
                            <textarea 
                                value={config.requirements}
                                onChange={e => setConfig({...config, requirements: e.target.value})}
                                placeholder="粘贴作文材料或具体要求..."
                                className="w-full p-3 h-24 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none resize-none transition-all bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">体裁</label>
                                <select 
                                    value={config.style}
                                    onChange={e => setConfig({...config, style: e.target.value})}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option>议论文</option>
                                    <option>记叙文</option>
                                    <option>散文</option>
                                    <option>应用文</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">字数要求</label>
                                <select 
                                    value={config.wordCount}
                                    onChange={e => setConfig({...config, wordCount: Number(e.target.value)})}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                >
                                    <option value={800}>800字 (高考标准)</option>
                                    <option value={600}>600字</option>
                                    <option value={1000}>1000字+</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                                <Settings className="w-3 h-3" /> 模型配置
                            </label>
                            <select 
                                value={selectedModelId}
                                onChange={e => setSelectedModelId(e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:border-orange-300 outline-none bg-white"
                            >
                                {currentModelList.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                            <div className="text-[10px] text-slate-400 mt-1">
                                建议使用推理能力较强的模型 (如 Gemini Pro / GPT-4) 以获得最佳的逻辑建议。
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                onClick={onBack}
                                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors bg-white"
                            >
                                返回
                            </button>
                            <button 
                                onClick={handleStart}
                                disabled={!config.topic.trim()}
                                className="flex-1 px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                启动编委会
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- View: Main Editor ---
    return (
        <div className="flex h-full bg-slate-100">
            {/* Left: Chat/History Context */}
            <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-700">编辑部会议记录</h3>
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {history.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div className={`text-sm p-3 rounded-xl ${msg.role === 'user' ? 'bg-orange-50 text-orange-900 rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none'}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="text-sm p-3 rounded-xl bg-slate-50 text-slate-500 rounded-tl-none flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> 思考中...
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Main Workspace */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="lg:hidden text-slate-400"><ChevronLeft className="w-6 h-6" /></button>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">{config.topic}</h1>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">{config.style}</span>
                                <span>{config.wordCount}字</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="预览全文">
                            <BookOpen className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {/* 1. Advisors Area */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                            <Library className="w-4 h-4" /> 顾问团意见
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {MOCK_ADVISORS.map((advisor, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-orange-200 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded-full text-sm">
                                            {advisor.avatar}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{advisor.name}</span>
                                        <span className="text-[10px] text-slate-400 bg-slate-50 px-1 rounded ml-auto">{advisor.role}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {advisor.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 2. Suggestion Cards (The Decision Layer) */}
                    <section>
                        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-slate-500 uppercase tracking-wider">
                            <Lightbulb className="w-4 h-4" /> 主编决策建议
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {MOCK_CARDS.map((card) => (
                                <div 
                                    key={card.id} 
                                    onClick={() => handleCardClick(card.content)}
                                    className="bg-gradient-to-b from-white to-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-300 hover:-translate-y-1 transition-all cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-800 group-hover:text-orange-700 transition-colors">{card.title}</h4>
                                        <Copy className="w-3 h-3 text-slate-300 group-hover:text-orange-400" />
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {card.tags.map(t => (
                                            <span key={t} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">{t}</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3 italic border-l-2 border-slate-200 pl-2">
                                        "{card.reasoning}"
                                    </p>
                                    <div className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-100 group-hover:border-orange-100">
                                        {card.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Editor Input Area (The Execution Layer) */}
                    <section className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden ring-4 ring-orange-50/50">
                        <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex justify-between items-center">
                            <span className="text-xs font-bold text-orange-800 flex items-center gap-2">
                                <PenTool className="w-3 h-3" /> 主编指令
                            </span>
                            <span className="text-[10px] text-orange-600/70">
                                点击上方卡片可直接引用，或手动输入指令
                            </span>
                        </div>
                        <div className="p-4">
                            <textarea
                                ref={inputRef}
                                value={mainInput}
                                onChange={e => setMainInput(e.target.value)}
                                className="w-full min-h-[120px] text-sm text-slate-800 border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none resize-none placeholder-slate-400 bg-white shadow-inner"
                                placeholder="在此输入你的决定。例如：'采用方案一，但把开头改得更具诗意一些...'，或者直接点击上方卡片引用内容。"
                            />
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-slate-400">
                                    身份：<span className="font-bold text-slate-600">Decision Maker</span>
                                </span>
                                <button 
                                    onClick={handleSend}
                                    disabled={!mainInput.trim() || isGenerating}
                                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all active:scale-95"
                                >
                                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                                    {isGenerating ? '执行中...' : '下达指令'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 4. Generated Text Area (Ghostwriter) */}
                    {generatedText && (
                        <section className="mt-8 pt-8 border-t border-slate-200" ref={bottomRef}>
                            <div className="text-center mb-6">
                                <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-400">
                                    正文预览
                                </span>
                            </div>
                            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
                                <h1 className="text-2xl font-bold text-center mb-8 text-slate-900">{config.topic}</h1>
                                <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-loose text-slate-700 font-serif">
                                    {generatedText}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};