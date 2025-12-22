import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ListChecks, Upload, Archive, Plus, FileText, Check, X, Play, MoreVertical, Edit2, Download, Trash2, CheckSquare, Square, MessageSquare, Pin, PinOff } from 'lucide-react';
import { ChatSession, ExamSession } from '../../types';

interface HistoryViewProps {
    sessions: ChatSession[];
    exams: ExamSession[];
    currentSessionId: string;
    onSelectSession: (id: string) => void;
    onSelectExam: (exam: ExamSession) => void;
    onClose: () => void;
    onNewChat: () => void;
    onImportZip: (file: File) => void;
    onExportAll: () => void;
    onExportBatch: (ids: string[]) => void;
    onExportSingle: (data: any, type: 'session' | 'exam', title: string) => void;
    onDelete: (ids: string[], type: 'session' | 'exam') => void;
    onRenameSession: (id: string, newTitle: string) => void;
    onRenameExam: (id: string, newTitle: string) => void;
    onTogglePin: (id: string) => void;
}

// Simple Modal Component (Local to HistoryView)
const ConfirmModal = ({ 
    isOpen, 
    title, 
    content, 
    onConfirm, 
    onCancel 
}: { 
    isOpen: boolean, 
    title: string, 
    content: string, 
    onConfirm: () => void, 
    onCancel: () => void 
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 animate-in zoom-in-95 duration-200">
                <h3 className="font-bold text-lg text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm mb-6">{content}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium">
                        取消
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-medium">
                        确认删除
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HistoryView: React.FC<HistoryViewProps> = ({ 
    sessions, exams, currentSessionId, 
    onSelectSession, onSelectExam, onClose, onNewChat,
    onImportZip, onExportAll, onExportBatch, onExportSingle, 
    onDelete, onRenameSession, onRenameExam, onTogglePin
}) => {
    // History View Interaction States
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [editingExamId, setEditingExamId] = useState<string | null>(null);
    const [editTitleInput, setEditTitleInput] = useState('');
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null); 
    
    // Batch Operations State
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
    
    // Delete Confirmation
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, targetIds: string[], type: 'session' | 'exam'}>({
        isOpen: false,
        targetIds: [],
        type: 'session'
    });

    const zipInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null); 

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleBatchMode = () => {
        setIsBatchMode(!isBatchMode);
        setSelectedSessionIds(new Set());
        setMenuOpenId(null);
    };
  
    const toggleSessionSelect = (id: string) => {
        const newSet = new Set(selectedSessionIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedSessionIds(newSet);
    };
  
    const selectAll = () => {
        if (selectedSessionIds.size === sessions.length) {
            setSelectedSessionIds(new Set());
        } else {
            setSelectedSessionIds(new Set(sessions.map(s => s.id)));
        }
    };

    const handleRequestDelete = (ids: string[], type: 'session' | 'exam' = 'session') => {
        setDeleteModal({ isOpen: true, targetIds: ids, type });
        setMenuOpenId(null);
    };

    const confirmDelete = () => {
        onDelete(deleteModal.targetIds, deleteModal.type);
        setDeleteModal({ isOpen: false, targetIds: [], type: 'session' });
        if (isBatchMode) {
            setSelectedSessionIds(new Set());
        }
    };

    const startEditing = (e: React.MouseEvent, id: string, initialTitle: string, type: 'session' | 'exam' = 'session') => {
        e.stopPropagation();
        if (type === 'session') {
            setEditingSessionId(id);
        } else {
            setEditingExamId(id);
        }
        setEditTitleInput(initialTitle);
        setMenuOpenId(null);
    };
  
    const saveTitle = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (editingSessionId) {
            if (editTitleInput.trim()) {
                onRenameSession(editingSessionId, editTitleInput.trim());
            }
            setEditingSessionId(null);
        } else if (editingExamId) {
            if (editTitleInput.trim()) {
                onRenameExam(editingExamId, editTitleInput.trim());
            }
            setEditingExamId(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
             <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="确认删除"
                content={`确定要删除选中的 ${deleteModal.targetIds.length} 项吗？此操作无法撤销。`}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({...deleteModal, isOpen: false})}
             />
             <input 
                type="file" 
                ref={zipInputRef} 
                className="hidden" 
                accept=".zip" 
                onChange={(e) => {
                    if (e.target.files?.[0]) onImportZip(e.target.files[0]);
                    e.target.value = '';
                }}
             />
             
             <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-slate-800">
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold text-sm">历史对话</h2>
                </div>
                <div className="flex items-center gap-2">
                     {isBatchMode ? (
                         <>
                             <button onClick={selectAll} className="text-slate-500 text-xs font-medium px-2 py-1 hover:bg-slate-100 rounded-lg">
                                 {selectedSessionIds.size === sessions.length ? '取消全选' : '全选'}
                             </button>
                             <button onClick={() => onExportBatch(Array.from(selectedSessionIds))} disabled={selectedSessionIds.size === 0} className="text-primary-600 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-primary-50 rounded-lg disabled:opacity-50">
                                 <Archive className="w-4 h-4" /> 导出
                             </button>
                             <button onClick={() => handleRequestDelete(Array.from(selectedSessionIds))} disabled={selectedSessionIds.size === 0} className="text-red-600 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg disabled:opacity-50">
                                 <Trash2 className="w-4 h-4" /> 删除
                             </button>
                             <button onClick={toggleBatchMode} className="text-slate-500 text-xs font-bold px-2 py-1 hover:bg-slate-100 rounded-lg">
                                 退出
                             </button>
                         </>
                     ) : (
                         <>
                             <button onClick={toggleBatchMode} className="text-slate-500 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors" title="批量管理">
                                 <ListChecks className="w-4 h-4" /> 批量
                             </button>
                             <div className="h-4 w-px bg-slate-200 mx-1"></div>
                             <button onClick={() => zipInputRef.current?.click()} className="text-slate-500 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors" title="导入备份 (ZIP)">
                                 <Upload className="w-4 h-4" /> 导入
                             </button>
                             <button onClick={onExportAll} className="text-slate-500 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors" title="一键备份 (ZIP)">
                                 <Archive className="w-4 h-4" /> 备份
                             </button>
                             <button onClick={onNewChat} className="text-primary-600 text-xs font-bold flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors ml-1">
                                 <Plus className="w-4 h-4" /> 新建
                             </button>
                         </>
                     )}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
                {/* Exams List Section */}
                {exams.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">我的试卷</h3>
                        {exams.map(exam => {
                            const totalScore = exam.questions.reduce((acc, q) => acc + (q.obtainedScore || 0), 0);
                            const maxScore = exam.questions.reduce((acc, q) => acc + q.score, 0);
                            const isGraded = exam.status === 'submitted' || exam.status === 'graded';

                            return (
                            <div 
                                key={exam.id}
                                className="group p-3 rounded-xl border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`p-2 rounded-lg shrink-0 ${exam.status === 'submitted' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1 relative">
                                        {editingExamId === exam.id ? (
                                            <div className="flex items-center gap-2 pr-2" onClick={e => e.stopPropagation()}>
                                                <input 
                                                    type="text" 
                                                    value={editTitleInput}
                                                    onChange={e => setEditTitleInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && saveTitle()}
                                                    className="w-full text-sm border-2 border-primary-500 rounded-md px-2 py-1 bg-white text-slate-900 shadow-sm focus:outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={saveTitle} className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm"><Check className="w-3.5 h-3.5" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditingExamId(null); }} className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 shadow-sm"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-medium text-sm text-slate-800 truncate">{exam.config.title}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                                    <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{exam.questions.length} 题</span>
                                                    {isGraded && (
                                                        <>
                                                          <span>•</span>
                                                          <span className="font-bold text-emerald-600">{totalScore}/{maxScore} 分</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 relative ml-2" ref={menuOpenId === `exam-${exam.id}` ? menuRef : null}>
                                     <button 
                                          onClick={() => onSelectExam(exam)}
                                          className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg flex items-center gap-1 text-xs font-bold"
                                     >
                                         <Play className="w-3.5 h-3.5" /> 打开
                                     </button>
                                     <button 
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              setMenuOpenId(menuOpenId === `exam-${exam.id}` ? null : `exam-${exam.id}`);
                                          }}
                                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                     >
                                          <MoreVertical className="w-4 h-4" />
                                     </button>
                                     
                                     {menuOpenId === `exam-${exam.id}` && (
                                          <div className="absolute right-0 top-8 w-32 bg-white border border-slate-200 shadow-lg rounded-lg z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                              <button 
                                                  onClick={(e) => startEditing(e, exam.id, exam.config.title, 'exam')} 
                                                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                  <Edit2 className="w-3.5 h-3.5" /> 重命名
                                              </button>
                                              <button 
                                                  onClick={(e) => onExportSingle(exam, 'exam', exam.config.title)} 
                                                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                              >
                                                  <Download className="w-3.5 h-3.5" /> 导出 JSON
                                              </button>
                                              <div className="h-px bg-slate-100 my-1"></div>
                                              <button 
                                                  onClick={(e) => { e.stopPropagation(); handleRequestDelete([exam.id], 'exam'); }} 
                                                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                              >
                                                  <Trash2 className="w-3.5 h-3.5" /> 删除
                                              </button>
                                          </div>
                                      )}
                                </div>
                            </div>
                        )})}
                    </div>
                )}

                {/* Chat Sessions List Section */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">对话记录</h3>
                    {sessions.length === 0 && (
                        <div className="text-center text-slate-400 py-4 text-sm">暂无历史对话</div>
                    )}
                    {sessions.map(session => (
                        <div 
                            key={session.id} 
                            onClick={() => {
                                if (isBatchMode) {
                                    toggleSessionSelect(session.id);
                                } else {
                                    onSelectSession(session.id);
                                }
                            }}
                            className={`group p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isBatchMode 
                                  ? (selectedSessionIds.has(session.id) ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200')
                                  : (session.id === currentSessionId ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200' : 'bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm')
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                {isBatchMode ? (
                                    <div className={`shrink-0 ${selectedSessionIds.has(session.id) ? 'text-indigo-600' : 'text-slate-300'}`}>
                                        {selectedSessionIds.has(session.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                    </div>
                                ) : (
                                    <div className={`p-2 rounded-lg shrink-0 ${session.id === currentSessionId ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                )}
                                
                                <div className="min-w-0 flex-1 relative">
                                    {editingSessionId === session.id ? (
                                        <div className="flex items-center gap-2 pr-2" onClick={e => e.stopPropagation()}>
                                            <input 
                                                type="text" 
                                                value={editTitleInput}
                                                onChange={e => setEditTitleInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && saveTitle()}
                                                className="w-full text-sm border-2 border-primary-500 rounded-md px-2 py-1 bg-white text-slate-900 shadow-sm focus:outline-none"
                                                autoFocus
                                            />
                                            <button onClick={saveTitle} className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 shadow-sm"><Check className="w-3.5 h-3.5" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(null); }} className="p-1.5 bg-slate-200 text-slate-600 rounded-md hover:bg-slate-300 shadow-sm"><X className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`font-medium text-sm truncate flex items-center gap-1.5 ${session.id === currentSessionId ? 'text-primary-900' : 'text-slate-700'}`}>
                                                {session.isPinned && <Pin className="w-3 h-3 fill-slate-400 text-slate-400 rotate-45" />}
                                                {session.title}
                                            </div>
                                            <div className="text-xs text-slate-400">{new Date(session.updatedAt).toLocaleString()}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {!isBatchMode && (
                              <div className="relative ml-2" ref={menuOpenId === session.id ? menuRef : null}>
                                  <button 
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setMenuOpenId(menuOpenId === session.id ? null : session.id);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                  >
                                      <MoreVertical className="w-4 h-4" />
                                  </button>
                                  
                                  {menuOpenId === session.id && (
                                      <div className="absolute right-0 top-8 w-32 bg-white border border-slate-200 shadow-lg rounded-lg z-20 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                                          <button 
                                              onClick={(e) => onTogglePin(session.id)} 
                                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          >
                                              {session.isPinned ? <><PinOff className="w-3.5 h-3.5" /> 取消置顶</> : <><Pin className="w-3.5 h-3.5" /> 置顶</>}
                                          </button>
                                          <button 
                                              onClick={(e) => startEditing(e, session.id, session.title, 'session')} 
                                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          >
                                              <Edit2 className="w-3.5 h-3.5" /> 重命名
                                          </button>
                                          <button 
                                              onClick={(e) => onExportSingle(session, 'session', session.title)} 
                                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          >
                                              <Download className="w-3.5 h-3.5" /> 导出 JSON
                                          </button>
                                          <div className="h-px bg-slate-100 my-1"></div>
                                          <button 
                                              onClick={(e) => { e.stopPropagation(); handleRequestDelete([session.id], 'session'); }} 
                                              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                          >
                                              <Trash2 className="w-3.5 h-3.5" /> 删除
                                          </button>
                                      </div>
                                  )}
                              </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
