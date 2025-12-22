
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Clock, FileText, Trash2, ArrowRight, Upload, Archive, CheckSquare, Square, MoreVertical, Edit2, Download, Pin, PinOff, Search } from 'lucide-react';
import { AIConfig, EssayConfig, EssaySession, AIProvider } from '../../types';
import { EssayWorkspace } from './EssayWorkspace';
import { SettingsView } from '../ai-tutor/SettingsView';
import { EssayWizard } from './EssayWizard';
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
    const [view, setView] = useState<'list' | 'wizard' | 'workspace'>('list');
    const [showSettings, setShowSettings] = useState(false);
    
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

    if (view === 'wizard') {
        return (
            <EssayWizard 
                onCancel={() => setView('list')}
                onComplete={handleCreateSession}
                aiConfig={getEffectiveConfig()}
            />
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

    // --- List View ---
    return (
        <EssayList 
            sessions={sessions}
            onNew={() => setView('wizard')}
            onSelect={handleOpenSession}
            onDelete={(ids) => deleteSessions(ids)}
            onRename={handleRename}
            onTogglePin={togglePin}
            onExport={handleExport}
            onImport={handleImport}
        />
    );
};
