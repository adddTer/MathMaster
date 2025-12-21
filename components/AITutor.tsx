import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, Settings, Save, AlertCircle, CheckCircle2, XCircle, RefreshCcw, Maximize2, Minimize2, Info, HelpCircle, BookOpen, Construction, BrainCircuit, PenTool, History, Plus, MessageSquare, Trash2, ChevronLeft, Pin, PinOff, Edit2, Download, Upload, MoreHorizontal, Check, X, Square, CheckSquare, MoreVertical, Archive, ListChecks } from 'lucide-react';
import { ChatMessage, AIConfig, AIProvider, ChatSession } from '../types';
import { sendMessageToGeminiStream, fetchOpenAIModels, testGeminiConnection, repairMalformedJson, evaluateQuizAnswer } from '../services/geminiService';
import { MessageRenderer, blockRegex } from './MessageRenderer';

interface AITutorProps {
  currentContext: string;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

interface ModelOption {
    id: string;
    name: string;
}

const DEFAULT_GEMINI_MODELS: ModelOption[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3.0 Flash' },
    { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro' },
];

const DEFAULT_OPENAI_MODELS: ModelOption[] = [];

const DEFAULT_CONFIG: AIConfig = {
  provider: 'gemini',
  apiKey: '',
  baseUrl: '',
  modelId: 'gemini-2.5-flash'
};

const STORAGE_KEY_SESSIONS = 'math_ai_chat_sessions';

// Safer access to process.env to prevent ReferenceError in browser
const getSystemEnvKey = (): string => {
    try {
        // @ts-ignore
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
            // @ts-ignore
            return process.env.API_KEY;
        }
    } catch (e) {
        return '';
    }
    return '';
};

const SYSTEM_ENV_KEY = getSystemEnvKey();

// Helper to generate a new session (defined outside to be used in initial state)
const createNewSessionHelper = (initialMsg?: ChatMessage[]): ChatSession => {
    return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        title: '新对话',
        updatedAt: Date.now(),
        messages: initialMsg || [{ role: 'model', text: `同学你好！我是你的 AI 辅导助手。请点击右上角设置图标配置 API Key 即可开始使用。` }],
        isPinned: false
    };
};

const sortSessions = (sessions: ChatSession[]): ChatSession[] => {
    return [...sessions].sort((a, b) => {
        // Pinned sessions first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // Then by date desc
        return b.updatedAt - a.updatedAt;
    });
};

// Notification Toast Component
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200'
    };

    return (
        <div className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full border shadow-sm text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-200 ${bgColors[type]}`}>
            {type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {type === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
            {type === 'info' && <Info className="w-3.5 h-3.5" />}
            {message}
        </div>
    );
};

// Simple Modal Component
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

export const AITutor: React.FC<AITutorProps> = ({ currentContext, initialQuery, onClearInitialQuery }) => {
  // --- Sessions State ---
  // Initialize lazily from localStorage to prevent undefined errors on first render
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
      try {
          if (typeof window !== 'undefined') {
              const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
              if (saved) {
                  const parsed = JSON.parse(saved);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                      return sortSessions(parsed);
                  }
              }
          }
      } catch (e) {
          console.error("Failed to load sessions", e);
      }
      return [createNewSessionHelper()];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
      return sessions.length > 0 ? sessions[0].id : '';
  });

  const [isHistoryView, setIsHistoryView] = useState(false);
  
  // History View Interaction States
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null); // For the 3-dot menu
  
  // Batch Operations State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
  
  // Delete Confirmation
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, targetIds: string[]}>({
      isOpen: false,
      targetIds: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null); // For click outside menu close

  // --- UI State ---
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  // --- Config State ---
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [hasConfigured, setHasConfigured] = useState(false);
  const [useEnvKey, setUseEnvKey] = useState(false);
  const [availableModels, setAvailableModels] = useState<{gemini: ModelOption[], openai: ModelOption[]}>({
      gemini: DEFAULT_GEMINI_MODELS,
      openai: DEFAULT_OPENAI_MODELS
  });
  
  // Test/Fetch State
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

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

  // Save Sessions (Debounced slightly or on change)
  // Logic: Only save sessions that have content (>1 message) or are pinned.
  useEffect(() => {
      // We filter what goes into localStorage to prevent junk buildup
      const sessionsToSave = sessions.filter(s => s.messages.length > 1 || s.isPinned);
      
      if (sessionsToSave.length > 0) {
          localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessionsToSave));
      } else {
          localStorage.removeItem(STORAGE_KEY_SESSIONS);
      }
  }, [sessions]);

  // Load Config
  useEffect(() => {
    const savedConfig = localStorage.getItem('math_ai_config');
    const savedModels = localStorage.getItem('math_ai_custom_models');
    const savedDebug = localStorage.getItem('math_ai_debug_mode');

    if (savedModels) {
        try {
            const parsedModels = JSON.parse(savedModels);
            setAvailableModels(prev => ({
                ...prev,
                openai: parsedModels.length > 0 ? parsedModels : DEFAULT_OPENAI_MODELS
            }));
        } catch (e) {
            console.error("Failed to parse saved models", e);
        }
    }

    if (savedDebug === 'true' && SYSTEM_ENV_KEY) {
        setUseEnvKey(true);
        setHasConfigured(true); 
    }

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.modelId) {
            parsed.modelId = parsed.provider === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash';
        }
        const currentModelList = parsed.provider === 'openai' ? availableModels.openai : DEFAULT_GEMINI_MODELS;
        const modelExists = currentModelList.some((m: ModelOption) => m.id === parsed.modelId);
        if (!modelExists && parsed.provider === 'gemini') {
             parsed.modelId = DEFAULT_GEMINI_MODELS[0].id;
        }

        setConfig(parsed);
        if (parsed.apiKey) setHasConfigured(true);
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    } else {
        if (!savedDebug) setShowSettings(true);
    }
  }, []);

  // --- Session Management Handlers ---

  const currentSession = useMemo(() => {
      if (sessions.length === 0) return createNewSessionHelper();
      return sessions.find(s => s.id === currentSessionId) || sessions[0];
  }, [sessions, currentSessionId]);

  // Define messages derived from current session
  const messages = currentSession?.messages || [];

  const updateCurrentSessionMessages = (newMessages: ChatMessage[], newTitle?: string) => {
      setSessions(prev => {
          const updated = prev.map(s => {
              if (s.id === (currentSession.id || currentSessionId)) {
                  return {
                      ...s,
                      messages: newMessages,
                      title: newTitle || s.title,
                      updatedAt: Date.now()
                  };
              }
              return s;
          });
          return sortSessions(updated);
      });
  };

  const handleNewChat = () => {
      const newSession = createNewSessionHelper();
      // Add new session to top
      setSessions(prev => sortSessions([newSession, ...prev]));
      setCurrentSessionId(newSession.id);
      setIsHistoryView(false);
      setInput('');
      if (inputRef.current) inputRef.current.focus();
  };

  const requestDelete = (ids: string[]) => {
      if (ids.length === 0) return;
      setDeleteModal({
          isOpen: true,
          targetIds: ids
      });
      setMenuOpenId(null);
  };

  const confirmDelete = () => {
      const { targetIds } = deleteModal;
      if (targetIds.length === 0) return;

      const newSessions = sessions.filter(s => !targetIds.includes(s.id));
      
      if (newSessions.length === 0) {
          const newSession = createNewSessionHelper();
          setSessions([newSession]);
          setCurrentSessionId(newSession.id);
      } else {
          setSessions(newSessions);
          if (targetIds.includes(currentSessionId)) {
              setCurrentSessionId(newSessions[0].id);
          }
      }
      
      // Clear batch selection if batch delete
      if (isBatchMode) {
          setSelectedSessionIds(new Set());
      }
      
      setDeleteModal({ isOpen: false, targetIds: [] });
      showNotify(`已删除 ${targetIds.length} 个对话`, 'success');
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setSessions(prev => {
          const updated = prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s);
          return sortSessions(updated);
      });
      setMenuOpenId(null);
  };

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
      e.stopPropagation();
      setEditingSessionId(session.id);
      setEditTitleInput(session.title);
      setMenuOpenId(null);
  };

  const saveTitle = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (editingSessionId) {
          if (editTitleInput.trim()) {
              setSessions(prev => prev.map(s => s.id === editingSessionId ? { ...s, title: editTitleInput.trim() } : s));
          }
          setEditingSessionId(null);
      }
  };

  // --- Import / Export Handlers ---

  const handleExportSingle = (session: ChatSession) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(session));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `MathAI_${session.title.replace(/[\\/:*?"<>|]/g, '')}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      setMenuOpenId(null);
  };

  const handleExportBatch = async () => {
      const targetIds = Array.from(selectedSessionIds);
      if (targetIds.length === 0) return;
      
      const targetSessions = sessions.filter(s => targetIds.includes(s.id));
      await generateZipExport(targetSessions);
      setSelectedSessionIds(new Set());
      setIsBatchMode(false);
  };

  const handleExportAll = async () => {
      await generateZipExport(sessions);
      setMenuOpenId(null); // Close menu if open
  };

  const generateZipExport = async (sessionsToExport: ChatSession[]) => {
      try {
          // @ts-ignore
          if (!window.JSZip) {
              showNotify("导出组件未加载，请刷新页面重试", "error");
              return;
          }
          // @ts-ignore
          const zip = new window.JSZip();
          
          sessionsToExport.forEach(s => {
              const safeTitle = s.title.replace(/[\\/:*?"<>|]/g, '_') || 'Untitled';
              zip.file(`${safeTitle}_${s.id.slice(-4)}.json`, JSON.stringify(s, null, 2));
          });

          const content = await zip.generateAsync({ type: "blob" });
          const url = URL.createObjectURL(content);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `MathAI_History_${new Date().toISOString().slice(0, 10)}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          showNotify("导出成功", "success");
      } catch (e: any) {
          console.error(e);
          showNotify("导出失败: " + e.message, "error");
      }
  };

  const handleImportZip = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // @ts-ignore
      if (!window.JSZip) {
          showNotify("导入组件未加载，请刷新页面重试", "error");
          return;
      }

      // @ts-ignore
      const jsZip = new window.JSZip();
      jsZip.loadAsync(file).then(async (zip: any) => {
          const newSessions: ChatSession[] = [];
          
          const promises: Promise<void>[] = [];
          zip.forEach((relativePath: string, zipEntry: any) => {
              if (!zipEntry.dir && zipEntry.name.endsWith('.json')) {
                  promises.push(
                      zipEntry.async("string").then((content: string) => {
                          try {
                              const json = JSON.parse(content);
                              if (Array.isArray(json.messages)) {
                                  newSessions.push({
                                      ...json,
                                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Renew ID to avoid conflict
                                      updatedAt: Date.now(),
                                      isPinned: false
                                  });
                              }
                          } catch (err) {
                              console.warn("Skipping invalid JSON:", relativePath);
                          }
                      })
                  );
              }
          });

          await Promise.all(promises);
          
          if (newSessions.length > 0) {
              setSessions(prev => sortSessions([...newSessions, ...prev]));
              showNotify(`成功导入 ${newSessions.length} 个对话`, "success");
          } else {
              showNotify("压缩包中未找到有效的对话文件", "info");
          }
      }).catch((e: any) => {
          showNotify("文件解析失败", "error");
      });
      
      if (zipInputRef.current) zipInputRef.current.value = '';
  };

  // --- Batch Operations ---

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

  const showNotify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
      setNotification({ msg, type });
  };

  // Handle Initial Query from props
  useEffect(() => {
      if (initialQuery) {
          setInput(initialQuery);
          onClearInitialQuery?.();
          if (inputRef.current) {
              inputRef.current.focus();
          }
      }
  }, [initialQuery]);

  // Save Config
  const handleSaveConfig = () => {
    localStorage.setItem('math_ai_config', JSON.stringify(config));
    localStorage.setItem('math_ai_custom_models', JSON.stringify(availableModels.openai));
    localStorage.setItem('math_ai_debug_mode', String(useEnvKey));
    
    const isConfigured = !!config.apiKey || (useEnvKey && !!SYSTEM_ENV_KEY);
    setHasConfigured(isConfigured);
    setShowSettings(false);
    setTestStatus('idle'); 
    
    if (isConfigured) {
        showNotify("配置已保存", 'success');
    }
  };

  const toggleDebugMode = () => {
      setUseEnvKey(!useEnvKey);
      setTestStatus('idle');
  };

  const getEffectiveConfig = () => {
      if (useEnvKey && SYSTEM_ENV_KEY) {
          return {
              ...config,
              apiKey: SYSTEM_ENV_KEY
          };
      }
      return config;
  };

  const isConnected = !!config.apiKey || (useEnvKey && !!SYSTEM_ENV_KEY);

  const handleProviderChange = (provider: AIProvider) => {
      const modelList = provider === 'gemini' ? availableModels.gemini : availableModels.openai;
      const defaultModel = modelList.length > 0 ? modelList[0].id : '';
      
      setConfig({
          ...config,
          provider,
          modelId: defaultModel
      });
      setTestStatus('idle');
  };

  const handleTestAndFetch = async () => {
      const effectiveConfig = getEffectiveConfig();

      if (!effectiveConfig.apiKey) {
          setTestStatus('error');
          setTestMessage('未找到 API Key');
          return;
      }
      
      setIsTesting(true);
      setTestStatus('idle');
      setTestMessage('');

      try {
          if (effectiveConfig.provider === 'openai') {
              const models = await fetchOpenAIModels(effectiveConfig);
              if (models.length > 0) {
                  setAvailableModels(prev => ({ ...prev, openai: models }));
                  if (!models.find(m => m.id === effectiveConfig.modelId)) {
                      setConfig(prev => ({ ...prev, modelId: models[0].id }));
                  }
                  setTestStatus('success');
                  setTestMessage(`成功！获取 ${models.length} 个模型`);
              } else {
                   setTestStatus('success');
                   setTestMessage('连接成功，但模型列表为空');
              }
          } else {
              await testGeminiConnection(effectiveConfig.apiKey);
              setTestStatus('success');
              setTestMessage('连接成功！');
          }
      } catch (error: any) {
          setTestStatus('error');
          setTestMessage(error.message || '连接失败');
      } finally {
          setIsTesting(false);
      }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
          }
      });
    }
  };

  // Scroll on new message added (length changed) or loading started
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

  // Scroll on view/layout changes
  useEffect(() => {
    scrollToBottom();
  }, [showSettings, isFullscreen, isHistoryView]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;
    
    const effectiveConfig = getEffectiveConfig();
    
    if (!effectiveConfig.apiKey) {
        setShowSettings(true);
        return;
    }

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    
    // Auto-generate title if it's the first user message in a new chat
    let newTitle = undefined;
    if (currentSession.title === '新对话' && messages.length <= 2) {
        newTitle = textToSend.slice(0, 15) + (textToSend.length > 15 ? '...' : '');
    }

    // Add user message immediately
    const updatedMessagesWithUser = [...messages, userMsg];
    updateCurrentSessionMessages(updatedMessagesWithUser, newTitle);

    setInput('');
    setIsLoading(true);

    // Add placeholder for model response
    // We update session state to include the placeholder
    const placeholderMsg: ChatMessage = { role: 'model', text: '' };
    updateCurrentSessionMessages([...updatedMessagesWithUser, placeholderMsg], newTitle);

    // Prepare history for API (filter out errors and empty placeholders from previous turns if any)
    const historyForApi = updatedMessagesWithUser.filter(m => !m.isError);

    let accumulatedResponse = '';

    try {
      await sendMessageToGeminiStream(
          historyForApi, 
          currentContext, 
          userMsg.text, 
          effectiveConfig, 
          (chunk) => {
              accumulatedResponse += chunk;
              
              // Direct state update for streaming performance
              setSessions(prev => {
                  return prev.map(s => {
                      if (s.id === (currentSession.id || currentSessionId)) {
                          const msgs = [...s.messages];
                          const lastMsg = msgs[msgs.length - 1];
                          if (lastMsg.role === 'model') {
                              msgs[msgs.length - 1] = { ...lastMsg, text: accumulatedResponse };
                          }
                          return { ...s, messages: msgs };
                      }
                      return s;
                  });
              });

              if (scrollRef.current) {
                   const isNearBottom = scrollRef.current.scrollHeight - scrollRef.current.scrollTop - scrollRef.current.clientHeight < 100;
                   if (isNearBottom) scrollToBottom();
              }
          }
      );
    } catch (error: any) {
      setSessions(prev => prev.map(s => {
          if (s.id === (currentSession.id || currentSessionId)) {
              const msgs = [...s.messages];
              const lastMsg = msgs[msgs.length - 1];
              // Replace placeholder or append error
              if (lastMsg.role === 'model' && lastMsg.text === '') {
                   msgs[msgs.length - 1] = { role: 'model', text: `出错了: ${error.message}`, isError: true };
              } else {
                   msgs.push({ role: 'model', text: `出错了: ${error.message}`, isError: true });
              }
              return { ...s, messages: msgs };
          }
          return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMessageState = (msgIndex: number, blockIndex: number, newState: any) => {
      setSessions(prev => prev.map(s => {
          if (s.id === (currentSession.id || currentSessionId)) {
              const newMessages = [...s.messages];
              const msg = newMessages[msgIndex];
              if (!msg.componentState) msg.componentState = {};
              msg.componentState[blockIndex] = {
                  ...msg.componentState[blockIndex],
                  ...newState
              };
              return { ...s, messages: newMessages };
          }
          return s;
      }));
  };

  const getTagFromContent = (str: string) => {
      const match = str.match(/:::(quiz|keypoint|choice|fill_in|true_false|step_solver|comparison|correction|checklist|tips|suggestions)/);
      return match ? `:::${match[1]}` : ':::';
  };

  const handleComponentInteract = async (action: string, payload?: any, msgIndex?: number, blockIndex?: number) => {
      if (action === 'apply_suggestion') {
          setInput(payload.text);
          if (inputRef.current) {
              inputRef.current.focus();
          }
          return;
      }

      const effectiveConfig = getEffectiveConfig();
      if (!effectiveConfig.apiKey) {
           showNotify("请先配置 API Key", "error");
           return;
      }

      if (typeof msgIndex === 'number' && typeof blockIndex === 'number' && payload?.state) {
          handleUpdateMessageState(msgIndex, blockIndex, payload.state);
      }

      if ((action === 'evaluate_quiz' || action === 'auto_submit_quiz') && typeof msgIndex === 'number' && typeof blockIndex === 'number') {
          handleUpdateMessageState(msgIndex, blockIndex, { isEvaluating: true });

          try {
              const evaluation = await evaluateQuizAnswer(payload.question, payload.userAnswer, currentContext, effectiveConfig);
              handleUpdateMessageState(msgIndex, blockIndex, { 
                  isEvaluating: false, 
                  evaluation: evaluation,
                  submitted: true,
                  mode: 'result' 
              });
              showNotify("AI 批改完成", "success");
          } catch (e) {
              handleUpdateMessageState(msgIndex, blockIndex, { isEvaluating: false });
              showNotify("批改服务异常", "error");
          }
      } 
      else if (action === 'fix_json') {
          if (typeof msgIndex !== 'number' || typeof blockIndex !== 'number') return;
          handleUpdateMessageState(msgIndex, blockIndex, { isRepairing: true });

          try {
              const fixedJson = await repairMalformedJson(payload.brokenContent, payload.error, effectiveConfig);
              
              setSessions(prev => prev.map(s => {
                   if (s.id === (currentSession.id || currentSessionId)) {
                       const newMsg = [...s.messages];
                       const msgToFix = newMsg[msgIndex];
                       const parts = msgToFix.text.split(blockRegex);
                       if (parts[blockIndex]) {
                           const originalTag = getTagFromContent(parts[blockIndex]);
                           // Ensure correct block format with newlines
                           parts[blockIndex] = `\n${originalTag}\n${fixedJson}\n:::\n`;
                           
                           newMsg[msgIndex] = {
                               ...msgToFix,
                               text: parts.join(''),
                               componentState: {
                                   ...msgToFix.componentState,
                                   [blockIndex]: { retryCount: 0, isRepairing: false }
                               }
                           };
                       }
                       return { ...s, messages: newMsg };
                   }
                   return s;
              }));
              showNotify("已自动修复题目格式", "success");
          } catch (e) {
              const currentRetry = messages[msgIndex].componentState?.[blockIndex]?.retryCount || 0;
              handleUpdateMessageState(msgIndex, blockIndex, { isRepairing: false, retryCount: currentRetry + 1 });
          }
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCurrentModelName = () => {
      const list = config.provider === 'gemini' ? availableModels.gemini : availableModels.openai;
      const model = list.find(m => m.id === config.modelId);
      return model ? model.name : config.modelId || 'Unknown Model';
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-slate-50 flex flex-col h-full w-full" 
    : "flex flex-col h-full bg-slate-50 relative";

  // --- Render Views ---

  if (showSettings) {
      return (
        <div className={containerClass}>
             <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-slate-800">
                    <Settings className="w-5 h-5" />
                    <h2 className="font-semibold text-sm">AI 配置</h2>
                </div>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                    <span className="text-xs">关闭</span>
                </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5 max-w-2xl mx-auto relative">
                    
                    {SYSTEM_ENV_KEY && (
                        <div className="absolute top-5 right-5">
                            <button 
                                onClick={toggleDebugMode}
                                className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full transition-colors border ${useEnvKey ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                            >
                                <Construction className="w-3 h-3" />
                                {useEnvKey ? 'Dev Mode: ON' : 'Dev Mode: OFF'}
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">服务商</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleProviderChange('gemini')}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                                    config.provider === 'gemini' 
                                    ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Sparkles className="w-5 h-5" />
                                Google Gemini
                            </button>
                            <button 
                                onClick={() => handleProviderChange('openai')}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                                    config.provider === 'openai' 
                                    ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Bot className="w-5 h-5" />
                                OpenAI
                            </button>
                        </div>
                    </div>

                    <div className={useEnvKey ? 'opacity-50 pointer-events-none grayscale' : ''}>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                            <span>API Key</span>
                            {useEnvKey && <span className="text-amber-600 text-xs font-bold">正在使用系统环境变量 Key</span>}
                        </label>
                        <input 
                            type="password" 
                            value={useEnvKey ? 'SYSTEM_ENV_KEY_ACTIVE' : config.apiKey}
                            onChange={(e) => setConfig({...config, apiKey: e.target.value})}
                            placeholder={config.provider === 'gemini' ? "AIzaSy..." : "sk-..."}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            disabled={useEnvKey}
                        />
                    </div>

                    {config.provider === 'openai' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Base URL (可选)</label>
                            <input 
                                type="text" 
                                value={config.baseUrl || ''}
                                onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
                                placeholder="https://api.openai.com/v1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleTestAndFetch}
                            disabled={(!config.apiKey && !useEnvKey) || isTesting}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                            测试连接
                        </button>
                        {testStatus !== 'idle' && (
                            <span className={`text-xs flex items-center gap-1 ${testStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {testStatus === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {testMessage}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">选择模型</label>
                        <div className="relative">
                            <select 
                                value={config.modelId} 
                                onChange={(e) => setConfig({...config, modelId: e.target.value})}
                                disabled={config.provider === 'openai' && availableModels.openai.length === 0}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                            >
                                {(config.provider === 'gemini' ? availableModels.gemini : availableModels.openai).map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                                {config.provider === 'openai' && availableModels.openai.length === 0 && (
                                    <option disabled>请先配置 Key 并测试连接以加载模型</option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSaveConfig}
                        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        保存配置
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // --- History List View ---
  if (isHistoryView) {
      return (
          <div className={containerClass}>
               <ConfirmModal 
                  isOpen={deleteModal.isOpen}
                  title="确认删除"
                  content={`确定要删除选中的 ${deleteModal.targetIds.length} 个对话吗？此操作无法撤销。`}
                  onConfirm={confirmDelete}
                  onCancel={() => setDeleteModal({isOpen: false, targetIds: []})}
               />
               <input 
                  type="file" 
                  ref={zipInputRef} 
                  className="hidden" 
                  accept=".zip" 
                  onChange={handleImportZip}
               />
               
               <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 text-slate-800">
                      <button onClick={() => setIsHistoryView(false)} className="p-1 hover:bg-slate-100 rounded-lg">
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
                                <button onClick={handleExportBatch} disabled={selectedSessionIds.size === 0} className="text-primary-600 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-primary-50 rounded-lg disabled:opacity-50">
                                    <Archive className="w-4 h-4" /> 导出
                                </button>
                                <button onClick={() => requestDelete(Array.from(selectedSessionIds))} disabled={selectedSessionIds.size === 0} className="text-red-600 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg disabled:opacity-50">
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
                                <button onClick={handleExportAll} className="text-slate-500 text-xs font-medium flex items-center gap-1 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors" title="一键备份 (ZIP)">
                                    <Archive className="w-4 h-4" /> 备份
                                </button>
                                <button onClick={handleNewChat} className="text-primary-600 text-xs font-bold flex items-center gap-1 px-2 py-1 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors ml-1">
                                    <Plus className="w-4 h-4" /> 新建
                                </button>
                           </>
                       )}
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20">
                  {sessions.length === 0 && (
                      <div className="text-center text-slate-400 py-10 text-sm">
                          暂无历史对话
                      </div>
                  )}
                  {sessions.map(session => (
                      <div 
                          key={session.id} 
                          onClick={() => {
                              if (isBatchMode) {
                                  toggleSessionSelect(session.id);
                              } else {
                                  setCurrentSessionId(session.id);
                                  setIsHistoryView(false);
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
                                            onClick={(e) => handleTogglePin(e, session.id)} 
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            {session.isPinned ? <><PinOff className="w-3.5 h-3.5" /> 取消置顶</> : <><Pin className="w-3.5 h-3.5" /> 置顶</>}
                                        </button>
                                        <button 
                                            onClick={(e) => startEditing(e, session)} 
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> 重命名
                                        </button>
                                        <button 
                                            onClick={(e) => handleExportSingle(session)} 
                                            className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Download className="w-3.5 h-3.5" /> 导出 JSON
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); requestDelete([session.id]); }} 
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
      );
  }

  // --- Main Chat Interface ---

  return (
    <div className={containerClass}>
      <ConfirmModal 
          isOpen={deleteModal.isOpen}
          title="确认删除"
          content={`确定要删除选中的 ${deleteModal.targetIds.length} 个对话吗？此操作无法撤销。`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteModal({isOpen: false, targetIds: []})}
       />
      {/* Notifications */}
      {notification && (
          <Notification 
            message={notification.msg} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-primary-50 p-1.5 rounded-lg text-primary-600 shrink-0">
             <Bot className="w-5 h-5" />
          </div>
          <div className="min-w-0">
              <h2 className="font-semibold text-sm text-slate-800 truncate">{currentSession?.title}</h2>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                <span className="text-[10px] text-slate-500 truncate max-w-[150px]">
                    {isConnected ? getCurrentModelName() : '未连接'}
                </span>
              </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
            <button 
                onClick={() => setIsHistoryView(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                title="历史对话"
            >
                <History className="w-4 h-4" />
            </button>
            <button 
                onClick={handleNewChat}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors hidden sm:flex"
                title="新对话"
            >
                <Plus className="w-4 h-4" />
            </button>

            <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors hidden md:flex"
                title={isFullscreen ? "退出全屏" : "全屏模式"}
            >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button 
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                title="API 设置"
            >
                <Settings className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className={`flex-1 overflow-y-auto ${isFullscreen ? 'bg-white' : 'bg-slate-50'} p-4`}
      >
        <div className={`mx-auto space-y-6 ${isFullscreen ? 'max-w-3xl' : 'max-w-none'}`}>
            {messages.map((msg, idx) => {
              // Hide the empty placeholder message bubble if we are showing the skeleton
              if (isLoading && idx === messages.length - 1 && msg.role === 'model' && !msg.text) {
                  return null;
              }

              return (
                <div 
                    key={idx} 
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'items-start'}`}
                >
                    {/* Avatar */}
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
                        ${msg.role === 'model' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-600 text-white'}
                    `}>
                        {msg.role === 'model' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble */}
                    <div className={`
                        min-w-0 
                        ${isFullscreen && msg.role === 'model' ? 'w-full' : 'max-w-[85%] rounded-2xl p-4 shadow-sm'}
                        ${msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : isFullscreen 
                                ? 'text-slate-800 pt-1' // Fullscreen model style: document-like
                                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm' // Normal model style: bubble
                        }
                        ${msg.isError ? 'border-red-300 bg-red-50 text-red-600' : ''}
                    `}>
                        {isFullscreen && msg.role === 'model' ? (
                            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-800">
                                <MessageRenderer 
                                    content={msg.text} 
                                    onInteract={(action, payload, blockIdx) => handleComponentInteract(action, payload, idx, blockIdx)}
                                    // Pass saved component state from the message object down to the renderer
                                    savedState={msg.componentState}
                                />
                            </div>
                        ) : (
                            <MessageRenderer 
                                content={msg.text} 
                                onInteract={(action, payload, blockIdx) => handleComponentInteract(action, payload, idx, blockIdx)}
                                savedState={msg.componentState}
                            />
                        )}
                    </div>
                </div>
              );
            })}

            {/* Loading Skeleton - Show only when initially loading before first chunk */}
            {isLoading && messages.length > 0 && messages[messages.length-1].role === 'model' && messages[messages.length-1].text === '' && (
                 <div className="flex gap-4 items-start animate-pulse">
                     <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-1">
                        <Loader2 className="w-4 h-4 text-indigo-300 animate-spin" />
                     </div>
                     <div className={`${isFullscreen ? 'w-full' : 'max-w-[85%] w-full bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4'}`}>
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                     </div>
                 </div>
            )}
        </div>
      </div>

      {/* Input Area */}
      <div className={`shrink-0 border-t border-slate-200 ${isFullscreen ? 'bg-white' : 'bg-white'} p-4`}>
        <div className={`mx-auto ${isFullscreen ? 'max-w-3xl' : 'max-w-none'}`}>
            <div className="relative flex items-center gap-2">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isConnected ? "输入问题或“出题”..." : "请先配置 API Key"}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-500 block p-3 pr-12 transition-all shadow-sm"
                disabled={isLoading}
            />
            <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-1.5 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50 disabled:bg-transparent disabled:text-slate-400"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};