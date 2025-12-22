
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Clock, FileText, Trash2, ArrowRight, Upload, Archive, CheckSquare, Square, MoreVertical, Edit2, Download, Pin, PinOff, Search, Check, X, ListChecks, Sparkles, BrainCircuit, Layers, BookOpen, PenTool, Loader2 } from 'lucide-react';
import { AIConfig, EssayConfig, EssaySession, AIProvider } from '../../types';
import { EssayWorkspace } from './EssayWorkspace';
import { SettingsView } from '../ai-tutor/SettingsView';
import { fetchBrainstorming, fetchOutline, fetchMaterials } from '../../services/essayService';

interface ModelOption {
    id: string;
    name: string;
}

interface EssayEditorProps {
    aiConfig: AIConfig;
    availableModels: { gemini: ModelOption[], openai: ModelOption[] };
    onConfigSave?: (newConfig: AIConfig) => void;
    onUpdateModels?: (provider: AIProvider, models: ModelOption[]) => void;
    systemEnvKey?: string;
    useEnvKey?: boolean;
    onToggleDebugMode?: () => void;
    onBack: () => void;
}

// 4 Stages of Writing
type WizardPhase = 'setup' | 'brainstorm' | 'structure' | 'materials' | 'writing';

export const EssayEditor: React.FC<EssayEditorProps> = ({ 
    aiConfig, 
    availableModels, 
    onBack,
    onConfigSave,
    onUpdateModels,
    systemEnvKey = '',
    useEnvKey = false,
    onToggleDebugMode
}) => {
    // --- State ---
    const [sessions, setSessions] = useState<EssaySession[]>(() => {
        try {
            const saved = localStorage.getItem('essay_sessions');
            return saved ? JSON.parse(saved) : [];
        } catch (e) { return []; }
    });
    
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'wizard' | 'workspace'>('list');
    const [showSettings, setShowSettings] = useState(false);
    
    // Management State
    const [searchQuery, setSearchQuery] = useState('');
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // --- Wizard State ---
    const [wizardPhase, setWizardPhase] = useState<WizardPhase>('setup');
    const [isLoading, setIsLoading] = useState(false);
    const [newConfig, setNewConfig] = useState<EssayConfig>({
        topic: '',
        requirements: '',
        wordCount: '800',
        style: '议论文'
    });
    const [brainstormOptions, setBrainstormOptions] = useState<any[]>([]);
    const [outlineDraft, setOutlineDraft] = useState<string[]>([]);
    const [materialOptions, setMaterialOptions] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<Set<number>>(new Set());
    
    const [selectedModelId, setSelectedModelId] = useState(aiConfig.modelId || '');

    // --- Effects ---

    useEffect(() => {
        localStorage.setItem('essay_sessions', JSON.stringify(sessions));
    }, [sessions]);

    useEffect(() => {
        if (!selectedModelId && aiConfig.modelId) {
            setSelectedModelId(aiConfig.modelId);
        }
    }, [aiConfig.modelId]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // --- Derived Data ---

    const currentSession = sessions.find(s => s.id === currentSessionId);
    const currentModelList = aiConfig.provider === 'gemini' ? availableModels.gemini : availableModels.openai;

    const filteredSessions = useMemo(() => {
        let filtered = sessions;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.config.topic.toLowerCase().includes(q));
        }
        return filtered.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return b.updatedAt - a.updatedAt;
        });
    }, [sessions, searchQuery]);

    // --- Handlers: Wizard Logic ---

    const getEffectiveConfig = () => {
        if (useEnvKey && systemEnvKey) {
            return { ...aiConfig, apiKey: systemEnvKey, modelId: selectedModelId || aiConfig.modelId || 'gemini-3-pro-preview' };
        }
        return { ...aiConfig, modelId: selectedModelId };
    };

    const handleWizardNext = async () => {
        if (wizardPhase === 'setup') {
            if (!newConfig.topic.trim()) return;
            setIsLoading(true);
            try {
                const options = await fetchBrainstorming(newConfig, getEffectiveConfig());
                setBrainstormOptions(options);
                setWizardPhase('brainstorm');
            } catch (e) {
                alert("生成立意失败，请检查网络或 API Key");
            } finally { setIsLoading(false); }
        } else if (wizardPhase === 'brainstorm') {
            if (!newConfig.selectedAngle) return;
            setIsLoading(true);
            try {
                const outline = await fetchOutline(newConfig, getEffectiveConfig());
                setOutlineDraft(outline);
                setNewConfig(prev => ({ ...prev, outline }));
                setWizardPhase('structure');
            } catch (e) {
                alert("生成大纲失败");
            } finally { setIsLoading(false); }
        } else if (wizardPhase === 'structure') {
            // Outline is editable, so just move to materials
            setIsLoading(true);
            try {
                const materials = await fetchMaterials(newConfig, getEffectiveConfig());
                setMaterialOptions(materials);
                // Pre-select all
                setSelectedMaterials(new Set(materials.map((_, i) => i)));
                setWizardPhase('materials');
            } catch (e) {
                alert("生成素材失败");
            } finally { setIsLoading(false); }
        } else if (wizardPhase === 'materials') {
            // Finalize
            const chosenMaterials = materialOptions.filter((_, i) => selectedMaterials.has(i));
            const finalConfig = { ...newConfig, materials: chosenMaterials };
            handleCreateSession(finalConfig);
        }
    };

    const handleCreateSession = (config: EssayConfig) => {
        const newSession: EssaySession = {
            id: Date.now().toString(),
            title: config.topic,
            config: config,
            history: [{ role: 'model', content: `主编您好，写作项目“${config.topic}”已启动。\n\n**立意**：${config.selectedAngle}\n**大纲**：已就绪\n**素材**：已准备${config.materials?.length}条\n\n顾问团已就位，请下达第一条写作指令。` }],
            currentText: '',
            advisors: [],
            cards: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastModelId: selectedModelId,
            isPinned: false
        };
        
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setView('workspace');
    };

    const handleOpenSession = (id: string) => {
        if (isBatchMode) {
            toggleSelection(id);
            return;
        }
        setCurrentSessionId(id);
        const session = sessions.find(s => s.id === id);
        if (session && session.lastModelId) {
            setSelectedModelId(session.lastModelId);
        }
        setView('workspace');
    };

    const handleUpdateSession = (updated: EssaySession) => {
        setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    // --- Handlers: Management (Same as before) ---
    const handleRename = (id: string, newTitle: string) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
        setEditingId(null);
    };
    const togglePin = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
        setMenuOpenId(null);
    };
    const deleteSessions = (ids: string[]) => {
        if (confirm(`确定要删除选中的 ${ids.length} 个写作项目吗？`)) {
            setSessions(prev => prev.filter(s => !ids.includes(s.id)));
            setSelectedIds(new Set());
            setIsBatchMode(false);
            if (ids.includes(currentSessionId || '')) {
                setCurrentSessionId(null);
                setView('list');
            }
        }
    };
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        setSelectedIds(newSet);
    };
    const selectAll = () => {
        if (selectedIds.size === filteredSessions.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredSessions.map(s => s.id)));
    };
    
    // --- Import/Export (Same as before) ---
    const handleExport = (sessionsToExport: EssaySession[], filenamePrefix: string) => {
        try {
            // @ts-ignore
            if (!window.JSZip) { alert("导出组件加载中，请稍后重试"); return; }
            // @ts-ignore
            const zip = new window.JSZip();
            sessionsToExport.forEach(s => {
                const safeTitle = s.title.replace(/[\\/:*?"<>|]/g, '_') || 'Untitled';
                zip.file(`${safeTitle}_${s.id.slice(-4)}.json`, JSON.stringify(s, null, 2));
            });
            zip.generateAsync({ type: "blob" }).then((content: Blob) => {
                const url = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Essay_${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        } catch (e) { console.error(e); alert("导出失败"); }
    };
    const handleImport = (file: File) => {
        // @ts-ignore
        if (!window.JSZip) return;
        // @ts-ignore
        const jsZip = new window.JSZip();
        jsZip.loadAsync(file).then(async (zip: any) => {
            const newSessions: EssaySession[] = [];
            const promises: Promise<void>[] = [];
            zip.forEach((relativePath: string, zipEntry: any) => {
                if (!zipEntry.dir && zipEntry.name.endsWith('.json')) {
                    promises.push(
                        zipEntry.async("string").then((content: string) => {
                            try {
                                const json = JSON.parse(content);
                                if (json.config && json.history) {
                                    newSessions.push({ ...json, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), updatedAt: Date.now() });
                                }
                            } catch (e) {}
                        })
                    );
                }
            });
            await Promise.all(promises);
            if (newSessions.length > 0) {
                setSessions(prev => [...newSessions, ...prev]);
                alert(`成功导入 ${newSessions.length} 个项目`);
            }
        });
    };

    // --- Render Views ---

    if (showSettings) {
        return (
            <div className="h-full bg-slate-50">
                <SettingsView 
                    config={aiConfig}
                    onSave={(cfg) => { onConfigSave?.(cfg); setShowSettings(false); }}
                    onClose={() => setShowSettings(false)}
                    availableModels={availableModels}
                    onUpdateModels={onUpdateModels || (() => {})}
                    systemEnvKey={systemEnvKey}
                    useEnvKey={useEnvKey}
                    onToggleDebugMode={onToggleDebugMode || (() => {})}
                />
            </div>
        );
    }

    if (view === 'wizard') {
        const renderStepIndicator = () => (
            <div className="flex justify-between mb-8 px-4">
                {['头脑风暴', '确定立意', '构建骨架', '填充血肉'].map((label, i) => {
                    const phases = ['setup', 'brainstorm', 'structure', 'materials'];
                    const currentIdx = phases.indexOf(wizardPhase);
                    const isCompleted = i < currentIdx;
                    const isCurrent = i === currentIdx;
                    return (
                        <div key={i} className={`flex flex-col items-center gap-2 ${isCurrent ? 'text-orange-600 font-bold' : (isCompleted ? 'text-emerald-600' : 'text-slate-300')}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${isCurrent ? 'border-orange-600 bg-orange-50' : (isCompleted ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white')}`}>
                                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className="text-xs hidden sm:block">{label}</span>
                        </div>
                    )
                })}
            </div>
        );

        return (
            <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
                    <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-10">
                        {renderStepIndicator()}
                        <h2 className="text-xl font-bold text-slate-800 text-center">
                            {wizardPhase === 'setup' && "第一步：确定主题"}
                            {wizardPhase === 'brainstorm' && "第二步：选择立意 (切入点)"}
                            {wizardPhase === 'structure' && "第三步：构建大纲"}
                            {wizardPhase === 'materials' && "第四步：精选素材"}
                        </h2>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                <span className="animate-pulse">AI 顾问团正在思考中...</span>
                            </div>
                        ) : (
                            <>
                                {wizardPhase === 'setup' && (
                                    <div className="space-y-6 max-w-lg mx-auto">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">作文题目</label>
                                            <input type="text" value={newConfig.topic} onChange={e => setNewConfig({...newConfig, topic: e.target.value})} placeholder="例如：论“变与不变”" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">要求/材料</label>
                                            <textarea value={newConfig.requirements} onChange={e => setNewConfig({...newConfig, requirements: e.target.value})} placeholder="粘贴作文材料..." className="w-full p-3 h-24 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">体裁</label>
                                                <select value={newConfig.style} onChange={e => setNewConfig({...newConfig, style: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none">
                                                    <option>议论文</option><option>记叙文</option><option>散文</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">字数</label>
                                                <select value={newConfig.wordCount} onChange={e => setNewConfig({...newConfig, wordCount: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none">
                                                    <option value="800">800字</option><option value="1000">1000字</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {wizardPhase === 'brainstorm' && (
                                    <div className="grid gap-4">
                                        {brainstormOptions.map((opt, i) => (
                                            <div key={i} onClick={() => setNewConfig({...newConfig, selectedAngle: opt.title})} className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${newConfig.selectedAngle === opt.title ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}>
                                                <h3 className="font-bold text-lg text-slate-800 mb-2">{opt.title}</h3>
                                                <p className="text-sm text-slate-600 mb-3">{opt.description}</p>
                                                <div className="flex gap-2">
                                                    {opt.tags?.map((t: string, j: number) => <span key={j} className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">{t}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {wizardPhase === 'structure' && (
                                    <div className="space-y-4">
                                        {outlineDraft.map((item, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">{i+1}</div>
                                                <textarea 
                                                    value={item} 
                                                    onChange={e => {
                                                        const newDraft = [...outlineDraft];
                                                        newDraft[i] = e.target.value;
                                                        setOutlineDraft(newDraft);
                                                        setNewConfig({...newConfig, outline: newDraft});
                                                    }}
                                                    className="flex-1 p-3 border border-slate-200 rounded-lg text-sm leading-relaxed focus:border-orange-300 outline-none resize-none h-20"
                                                />
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            const newDraft = [...outlineDraft, "新段落..."];
                                            setOutlineDraft(newDraft);
                                            setNewConfig({...newConfig, outline: newDraft});
                                        }} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm hover:bg-slate-50">+ 添加段落</button>
                                    </div>
                                )}

                                {wizardPhase === 'materials' && (
                                    <div className="space-y-3">
                                        {materialOptions.map((mat, i) => (
                                            <div key={i} onClick={() => {
                                                const newSet = new Set(selectedMaterials);
                                                if (newSet.has(i)) newSet.delete(i); else newSet.add(i);
                                                setSelectedMaterials(newSet);
                                            }} className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${selectedMaterials.has(i) ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selectedMaterials.has(i) ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'}`}>
                                                    {selectedMaterials.has(i) && <Check className="w-3.5 h-3.5" />}
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed">{mat}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
                        <button onClick={() => {
                            if (wizardPhase === 'setup') setView('list');
                            else if (wizardPhase === 'brainstorm') setWizardPhase('setup');
                            else if (wizardPhase === 'structure') setWizardPhase('brainstorm');
                            else if (wizardPhase === 'materials') setWizardPhase('structure');
                        }} className="px-6 py-2 rounded-lg text-slate-500 hover:bg-white hover:shadow-sm transition-all font-medium">上一步</button>
                        
                        <button onClick={handleWizardNext} disabled={isLoading || (wizardPhase === 'setup' && !newConfig.topic.trim())} className="px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-md transition-all font-bold flex items-center gap-2">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (wizardPhase === 'materials' ? '开始写作' : '下一步')} <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'workspace' && currentSession) {
        return (
            <EssayWorkspace 
                session={currentSession}
                aiConfig={aiConfig}
                availableModels={currentModelList}
                selectedModelId={selectedModelId}
                onBack={() => setView('list')}
                onSave={handleUpdateSession}
                onOpenSettings={() => setShowSettings(true)}
            />
        );
    }

    // --- List View Render ---
    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={(e) => { if (e.target.files?.[0]) handleImport(e.target.files[0]); e.target.value = ''; }} />

            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">写作项目</h2>
                        <p className="text-slate-500 mt-1 text-sm">管理你的多智能体协作文章</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                        {isBatchMode ? (
                            <>
                                <button onClick={selectAll} className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
                                    {selectedIds.size === filteredSessions.length ? '取消全选' : '全选'}
                                </button>
                                <button onClick={() => handleExport(sessions.filter(s => selectedIds.has(s.id)), "Batch")} disabled={selectedIds.size === 0} className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg flex items-center gap-1 disabled:opacity-50">
                                    <Archive className="w-3.5 h-3.5" /> 导出
                                </button>
                                <button onClick={() => deleteSessions(Array.from(selectedIds))} disabled={selectedIds.size === 0} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 disabled:opacity-50">
                                    <Trash2 className="w-3.5 h-3.5" /> 删除
                                </button>
                                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                                <button onClick={() => { setIsBatchMode(false); setSelectedIds(new Set()); }} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">退出</button>
                            </>
                        ) : (
                            <>
                                <div className="relative group">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="搜索项目..." className="pl-9 pr-3 py-1.5 bg-slate-100 border-transparent focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 rounded-lg text-sm outline-none transition-all w-40 md:w-60" />
                                </div>
                                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
                                <button onClick={() => setIsBatchMode(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="批量管理"><ListChecks className="w-5 h-5" /></button>
                                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="导入备份"><Upload className="w-5 h-5" /></button>
                                <button onClick={() => {
                                    setNewConfig({ topic: '', requirements: '', wordCount: '800', style: '议论文', selectedAngle: '', outline: [], materials: [] });
                                    setWizardPhase('setup');
                                    setView('wizard');
                                }} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all active:scale-95 ml-2">
                                    <Plus className="w-5 h-5" /> <span className="hidden sm:inline">新建</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {sessions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500"><FileText className="w-8 h-8" /></div>
                            <h3 className="text-lg font-bold text-slate-700 mb-2">暂无写作项目</h3>
                            <p className="text-slate-500 mb-6 max-w-md mx-auto">开始你的第一个 AI 辅助写作项目吧。这里将保存你的所有创作历史，随时继续编辑。</p>
                            <button onClick={() => { setWizardPhase('setup'); setView('wizard'); }} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">开始创作</button>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">未找到与 "{searchQuery}" 相关的项目</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSessions.map(session => (
                                <div key={session.id} onClick={() => handleOpenSession(session.id)} className={`bg-white p-5 rounded-xl border shadow-sm transition-all cursor-pointer group flex flex-col h-48 relative ${isBatchMode && selectedIds.has(session.id) ? 'border-orange-400 ring-1 ring-orange-400 bg-orange-50' : 'border-slate-200 hover:shadow-md hover:border-orange-300'}`}>
                                    {isBatchMode && (<div className="absolute top-4 right-4 z-10 text-orange-600">{selectedIds.has(session.id) ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-slate-300" />}</div>)}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${session.isPinned ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}><FileText className="w-5 h-5" /></div>
                                        {!isBatchMode && (
                                            <div className="relative" ref={menuOpenId === session.id ? menuRef : null}>
                                                <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id); }} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                                {menuOpenId === session.id && (
                                                    <div className="absolute right-0 top-8 w-32 bg-white border border-slate-200 shadow-xl rounded-lg z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                                        <button onClick={(e) => togglePin(session.id, e)} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">{session.isPinned ? <><PinOff className="w-3.5 h-3.5" /> 取消置顶</> : <><Pin className="w-3.5 h-3.5" /> 置顶</>}</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingId(session.id); setEditTitle(session.title); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> 重命名</button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleExport([session], session.title); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Download className="w-3.5 h-3.5" /> 导出 JSON</button>
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        <button onClick={(e) => { e.stopPropagation(); deleteSessions([session.id]); }} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> 删除</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-h-0">
                                        {editingId === session.id ? (
                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename(session.id, editTitle)} className="w-full text-sm border-2 border-orange-400 rounded px-1 py-0.5 focus:outline-none" autoFocus />
                                                <button onClick={() => handleRename(session.id, editTitle)} className="p-1 bg-green-500 text-white rounded"><Check className="w-3 h-3" /></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 bg-slate-200 text-slate-500 rounded"><X className="w-3 h-3" /></button>
                                            </div>
                                        ) : (
                                            <h3 className="font-bold text-slate-800 text-lg mb-1 line-clamp-2 group-hover:text-orange-700 transition-colors flex items-center gap-1">{session.isPinned && <Pin className="w-3 h-3 text-orange-500 rotate-45 shrink-0" />}{session.title}</h3>
                                        )}
                                        <div className="text-xs text-slate-400 mt-2 flex items-center gap-2"><Clock className="w-3 h-3" />{new Date(session.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                                        <div className="flex gap-2"><span className="bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-100">{session.config.style}</span><span className="bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-100">{session.currentText.length} 字</span></div>
                                        {!isBatchMode && (<span className="flex items-center gap-1 text-orange-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">继续写作 <ArrowRight className="w-3 h-3" /></span>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
