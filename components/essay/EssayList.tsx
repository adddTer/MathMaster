
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, ListChecks, Upload, Archive, CheckSquare, Square, MoreVertical, Pin, PinOff, Edit2, Download, Trash2, Check, X, FileText, Clock, ArrowRight } from 'lucide-react';
import { EssaySession } from '../../types';

interface EssayListProps {
    sessions: EssaySession[];
    onNew: () => void;
    onSelect: (id: string) => void;
    onDelete: (ids: string[]) => void;
    onRename: (id: string, title: string) => void;
    onTogglePin: (id: string) => void;
    onExport: (sessions: EssaySession[]) => void;
    onImport: (file: File) => void;
}

export const EssayList: React.FC<EssayListProps> = ({ 
    sessions, onNew, onSelect, onDelete, onRename, onTogglePin, onExport, onImport 
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

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

    const filteredSessions = sessions.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.config.topic.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.updatedAt - a.updatedAt;
    });

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        setSelectedIds(newSet);
    };

    const selectAll = () => {
        if (selectedIds.size === filteredSessions.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredSessions.map(s => s.id)));
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={(e) => { if (e.target.files?.[0]) onImport(e.target.files[0]); e.target.value = ''; }} />

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
                                <button onClick={() => onExport(sessions.filter(s => selectedIds.has(s.id)))} disabled={selectedIds.size === 0} className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg flex items-center gap-1 disabled:opacity-50">
                                    <Archive className="w-3.5 h-3.5" /> 导出
                                </button>
                                <button onClick={() => onDelete(Array.from(selectedIds))} disabled={selectedIds.size === 0} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 disabled:opacity-50">
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
                                <button onClick={onNew} className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-sm flex items-center gap-2 transition-all active:scale-95 ml-2">
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
                            <button onClick={onNew} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">开始创作</button>
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">未找到与 "{searchQuery}" 相关的项目</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSessions.map(session => (
                                <div key={session.id} onClick={() => { if(isBatchMode) toggleSelection(session.id); else onSelect(session.id); }} className={`bg-white p-5 rounded-xl border shadow-sm transition-all cursor-pointer group flex flex-col h-48 relative ${isBatchMode && selectedIds.has(session.id) ? 'border-orange-400 ring-1 ring-orange-400 bg-orange-50' : 'border-slate-200 hover:shadow-md hover:border-orange-300'}`}>
                                    {isBatchMode && (<div className="absolute top-4 right-4 z-10 text-orange-600">{selectedIds.has(session.id) ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6 text-slate-300" />}</div>)}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg ${session.isPinned ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}><FileText className="w-5 h-5" /></div>
                                        {!isBatchMode && (
                                            <div className="relative" ref={menuOpenId === session.id ? menuRef : null}>
                                                <button onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id); }} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
                                                {menuOpenId === session.id && (
                                                    <div className="absolute right-0 top-8 w-32 bg-white border border-slate-200 shadow-xl rounded-lg z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                                        <button onClick={(e) => { e.stopPropagation(); onTogglePin(session.id); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2">{session.isPinned ? <><PinOff className="w-3.5 h-3.5" /> 取消置顶</> : <><Pin className="w-3.5 h-3.5" /> 置顶</>}</button>
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingId(session.id); setEditTitle(session.title); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> 重命名</button>
                                                        <button onClick={(e) => { e.stopPropagation(); onExport([session]); setMenuOpenId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Download className="w-3.5 h-3.5" /> 导出 JSON</button>
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        <button onClick={(e) => { e.stopPropagation(); onDelete([session.id]); }} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> 删除</button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-h-0">
                                        {editingId === session.id ? (
                                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && (onRename(session.id, editTitle), setEditingId(null))} className="w-full text-sm border-2 border-orange-400 rounded px-1 py-0.5 focus:outline-none" autoFocus />
                                                <button onClick={() => { onRename(session.id, editTitle); setEditingId(null); }} className="p-1 bg-green-500 text-white rounded"><Check className="w-3 h-3" /></button>
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
