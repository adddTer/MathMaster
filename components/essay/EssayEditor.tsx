
import React, { useState, useEffect } from 'react';
import { Plus, ArrowRight, Upload, Archive, CheckSquare, Square, MoreVertical, Edit2, Download, Pin, PinOff, Search, Sparkles } from 'lucide-react';
import { AIConfig, EssaySession, AIProvider } from '../../types';
import { EssayWorkspace } from './EssayWorkspace';
import { SettingsView } from '../ai-tutor/SettingsView';
import { EssayList } from './EssayList';

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
    const [view, setView] = useState<'list' | 'input' | 'workspace'>('list');
    const [showSettings, setShowSettings] = useState(false);
    
    // New Session Input State
    const [newMaterial, setNewMaterial] = useState('');
    
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

    // --- Derived Data ---

    const currentSession = sessions.find(s => s.id === currentSessionId);
    const currentModelList = aiConfig.provider === 'gemini' ? availableModels.gemini : availableModels.openai;

    // --- Handlers ---

    const getEffectiveConfig = () => {
        if (useEnvKey && systemEnvKey) {
            return { ...aiConfig, apiKey: systemEnvKey, modelId: selectedModelId || aiConfig.modelId || 'gemini-3-pro-preview' };
        }
        return { ...aiConfig, modelId: selectedModelId };
    };

    const handleCreateSession = () => {
        if (!newMaterial.trim()) return;

        // Auto-generate a temporary title, AI will refine it later
        const title = newMaterial.length > 15 ? newMaterial.slice(0, 15) + '...' : newMaterial;
        
        const newSession: EssaySession = {
            id: Date.now().toString(),
            title: title,
            config: {
                topic: newMaterial, // Store material here
                requirements: "", 
                wordCount: 800, 
            },
            history: [
                { 
                    role: 'user', 
                    text: newMaterial,
                }
            ],
            currentText: '',
            advisors: [],
            cards: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastModelId: selectedModelId,
            isPinned: false,
            mode: 'proxy', // Default to User Proxy mode
            groupState: 'analyzing',
            subState: 'discussion' // Start in discussion mode
        };
        
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        setView('workspace');
        setNewMaterial('');
    };

    const handleOpenSession = (id: string) => {
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

    const handleRename = (id: string, newTitle: string) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    };
    
    const togglePin = (id: string) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    };
    
    const deleteSessions = (ids: string[]) => {
        if (confirm(`确定要删除选中的 ${ids.length} 个写作项目吗？`)) {
            setSessions(prev => prev.filter(s => !ids.includes(s.id)));
            if (ids.includes(currentSessionId || '')) {
                setCurrentSessionId(null);
                setView('list');
            }
        }
    };
    
    // --- Import/Export ---
    const handleExport = (sessionsToExport: EssaySession[]) => {
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
                a.download = `Essay_Batch_${new Date().toISOString().slice(0, 10)}.zip`;
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

    if (view === 'input') {
        return (
            <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto items-center justify-center">
                <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-10">
                        <div className="flex items-center gap-3 mb-6 justify-center">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800">提交写作材料</h2>
                        </div>
                        
                        <p className="text-slate-500 mb-6 text-center text-base leading-relaxed">
                            请粘贴作文题目或材料。不需要指定文体或字数，<br/>AI 顾问团将深入解读材料，并在您的指挥下完成创作。
                        </p>

                        <textarea
                            value={newMaterial}
                            onChange={(e) => setNewMaterial(e.target.value)}
                            placeholder="例如：
阅读下面的材料，根据要求写作。
...材料内容...
"
                            className="w-full h-64 p-5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-300 outline-none resize-none bg-slate-50 text-slate-800 mb-8 text-base shadow-inner transition-all"
                            autoFocus
                        />

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setView('list')}
                                className="px-8 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors bg-white text-base"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleCreateSession}
                                disabled={!newMaterial.trim()}
                                className="flex-1 px-8 py-3.5 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
                            >
                                召集顾问团 <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'workspace' && currentSession) {
        return (
            <EssayWorkspace 
                session={currentSession}
                aiConfig={getEffectiveConfig()}
                availableModels={currentModelList}
                selectedModelId={selectedModelId}
                onBack={() => setView('list')}
                onSave={handleUpdateSession}
                onOpenSettings={() => setShowSettings(true)}
            />
        );
    }

    // --- List View ---
    return (
        <EssayList 
            sessions={sessions}
            onNew={() => setView('input')}
            onSelect={handleOpenSession}
            onDelete={(ids) => deleteSessions(ids)}
            onRename={handleRename}
            onTogglePin={togglePin}
            onExport={handleExport}
            onImport={handleImport}
        />
    );
};
