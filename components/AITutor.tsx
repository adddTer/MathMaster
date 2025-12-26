
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage, AIConfig, AIProvider, ChatSession, ExamSession, SubjectType } from '../types';
import { sendMessageToGeminiStream, evaluateQuizAnswer } from '../services/geminiService';
import { repairMalformedJson } from '../services/geminiServiceUtils';
import { blockRegex } from './MessageRenderer';
import { ExamRunner } from './exam/ExamRunner';
import { SettingsView } from './ai-tutor/SettingsView';
import { HistoryView } from './ai-tutor/HistoryView';
import { ChatHeader } from './ai-tutor/ChatHeader';
import { ChatInput } from './ai-tutor/ChatInput';
import { MessageList } from './ai-tutor/MessageList';
import { getCurriculumSummary } from '../data/mathContent';
import { getChineseCurriculumSummary } from '../data/chineseContent';

interface AITutorProps {
  currentContext: string;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onNavigate?: (subject: SubjectType, topicId: string, subTopicId: string) => void;
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
const STORAGE_KEY_EXAMS = 'math_ai_exams';

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
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
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
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-[2147483647] px-4 py-2 rounded-full border shadow-sm text-xs font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-200 ${bgColors[type]}`}>
            {type === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {type === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
            {type === 'info' && <Info className="w-3.5 h-3.5" />}
            {message}
        </div>
    );
};

export const AITutor: React.FC<AITutorProps> = ({ currentContext, initialQuery, onClearInitialQuery, onNavigate }) => {
  // --- Sessions State ---
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
  
  // --- Exam State ---
  const [exams, setExams] = useState<ExamSession[]>(() => {
      try {
          const saved = localStorage.getItem(STORAGE_KEY_EXAMS);
          if (saved) return JSON.parse(saved);
      } catch(e) {}
      return [];
  });
  const [activeExam, setActiveExam] = useState<ExamSession | null>(null);

  // --- UI State ---
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  // Body Scroll Lock for Fullscreen
  useEffect(() => {
      if (isFullscreen || activeExam) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
      return () => {
          document.body.style.overflow = '';
      };
  }, [isFullscreen, activeExam]);

  // Save Sessions
  useEffect(() => {
      const sessionsToSave = sessions.filter(s => s.messages.length > 1 || s.isPinned);
      if (sessionsToSave.length > 0) {
          localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessionsToSave));
      } else {
          localStorage.removeItem(STORAGE_KEY_SESSIONS);
      }
  }, [sessions]);

  // Save Exams
  useEffect(() => {
      localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(exams));
  }, [exams]);

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
        
        // --- DEV MODE AUTO MODEL UPGRADE ---
        if ((savedDebug === 'true' || useEnvKey) && SYSTEM_ENV_KEY) {
            if (parsed.provider === 'gemini' && parsed.modelId !== 'gemini-3-pro-preview') {
                parsed.modelId = 'gemini-3-pro-preview';
            }
        }
        
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
        if (SYSTEM_ENV_KEY) {
            setConfig({
                provider: 'gemini',
                apiKey: '',
                modelId: 'gemini-3-pro-preview'
            });
            setUseEnvKey(true);
            setHasConfigured(true);
        } else {
            if (!savedDebug) setShowSettings(true);
        }
    }
  }, []);

  const showNotify = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
      setNotification({ msg, type });
  };

  // --- Handlers passed to sub-components ---

  const handleUpdateModels = (provider: AIProvider, models: ModelOption[]) => {
      setAvailableModels(prev => ({ ...prev, [provider]: models }));
      localStorage.setItem('math_ai_custom_models', JSON.stringify(models));
  };

  const handleConfigSave = (newConfig: AIConfig) => {
      localStorage.setItem('math_ai_config', JSON.stringify(newConfig));
      localStorage.setItem('math_ai_debug_mode', String(useEnvKey));
      setConfig(newConfig);
      const isConfigured = !!newConfig.apiKey || (useEnvKey && !!SYSTEM_ENV_KEY);
      setHasConfigured(isConfigured);
      setShowSettings(false);
      if (isConfigured) showNotify("配置已保存", 'success');
  };

  const handleToggleDebugMode = () => {
      setUseEnvKey(!useEnvKey);
  };

  const handleNewChat = () => {
      const newSession = createNewSessionHelper();
      setSessions(prev => sortSessions([newSession, ...prev]));
      setCurrentSessionId(newSession.id);
      setIsHistoryView(false);
      setInput('');
      if (inputRef.current) inputRef.current.focus();
  };

  const handleDelete = (ids: string[], type: 'session' | 'exam') => {
      if (type === 'session') {
          const newSessions = sessions.filter(s => !ids.includes(s.id));
          if (newSessions.length === 0) {
              const newSession = createNewSessionHelper();
              setSessions([newSession]);
              setCurrentSessionId(newSession.id);
          } else {
              setSessions(newSessions);
              if (ids.includes(currentSessionId)) {
                  setCurrentSessionId(newSessions[0].id);
              }
          }
      } else {
          setExams(prev => prev.filter(e => !ids.includes(e.id)));
      }
      showNotify(`已删除 ${ids.length} 项`, 'success');
  };

  const handleRenameSession = (id: string, newTitle: string) => {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleRenameExam = (id: string, newTitle: string) => {
      let uniqueTitle = newTitle;
      let count = 1;
      while (exams.some(ex => ex.id !== id && ex.config.title === uniqueTitle)) {
          uniqueTitle = `${newTitle} (${count})`;
          count++;
      }
      setExams(prev => prev.map(ex => ex.id === id ? { ...ex, config: { ...ex.config, title: uniqueTitle }} : ex));
  };

  const handleTogglePin = (id: string) => {
      setSessions(prev => {
          const updated = prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s);
          return sortSessions(updated);
      });
  };

  // --- Import / Export Logic ---

  const handleExportSingle = (data: ChatSession | ExamSession, type: 'session' | 'exam', title: string) => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `MathAI_${type}_${title.replace(/[\\/:*?"<>|]/g, '')}_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
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

          if (exams.length > 0) {
              const examsFolder = zip.folder("exams");
              exams.forEach(ex => {
                  const safeTitle = ex.config.title.replace(/[\\/:*?"<>|]/g, '_') || 'Untitled';
                  examsFolder.file(`${safeTitle}_${ex.id.slice(-4)}.json`, JSON.stringify(ex, null, 2));
              });
          }

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

  const handleImportFile = async (file: File) => {
      const fileName = file.name.toLowerCase();
      
      // Handle JSON Import
      if (fileName.endsWith('.json')) {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const content = e.target?.result as string;
                  const json = JSON.parse(content);
                  
                  if (json.messages && Array.isArray(json.messages)) {
                      // It's a session
                      const newSession: ChatSession = {
                          ...json,
                          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                          updatedAt: Date.now(),
                          isPinned: false
                      };
                      setSessions(prev => sortSessions([newSession, ...prev]));
                      showNotify("导入对话成功", "success");
                  } else if (json.questions && Array.isArray(json.questions)) {
                      // It's an exam
                      const newExam: ExamSession = {
                          ...json,
                          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                          updatedAt: Date.now()
                      };
                      setExams(prev => [newExam, ...prev]);
                      showNotify("导入试卷成功", "success");
                  } else {
                      showNotify("JSON 文件格式不识别", "error");
                  }
              } catch (err) {
                  showNotify("JSON 解析失败", "error");
              }
          };
          reader.readAsText(file);
          return;
      }

      // Handle ZIP Import
      if (fileName.endsWith('.zip')) {
          // @ts-ignore
          if (!window.JSZip) {
              showNotify("导入组件未加载，请刷新页面重试", "error");
              return;
          }

          // @ts-ignore
          const jsZip = new window.JSZip();
          jsZip.loadAsync(file).then(async (zip: any) => {
              const newSessions: ChatSession[] = [];
              const newExams: ExamSession[] = [];
              
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
                                          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                          updatedAt: Date.now(),
                                          isPinned: false
                                      });
                                  } else if (json.questions && Array.isArray(json.questions)) {
                                      newExams.push({
                                          ...json,
                                          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                          updatedAt: Date.now()
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
              }
              if (newExams.length > 0) {
                  setExams(prev => [...newExams, ...prev]);
              }
              
              if (newSessions.length > 0 || newExams.length > 0) {
                  showNotify(`导入成功: ${newSessions.length} 个对话, ${newExams.length} 份试卷`, "success");
              } else {
                  showNotify("压缩包中未找到有效文件", "info");
              }
          }).catch((e: any) => {
              showNotify("文件解析失败", "error");
          });
          return;
      }
      
      showNotify("不支持的文件格式", "error");
  };

  // --- Session Management Handlers ---

  const currentSession = useMemo(() => {
      if (sessions.length === 0) return createNewSessionHelper();
      return sessions.find(s => s.id === currentSessionId) || sessions[0];
  }, [sessions, currentSessionId]);

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

  useEffect(() => {
      if (initialQuery) {
          setInput(initialQuery);
          onClearInitialQuery?.();
          if (inputRef.current) {
              inputRef.current.focus();
          }
      }
  }, [initialQuery]);

  const getEffectiveConfig = () => {
      if (useEnvKey && SYSTEM_ENV_KEY) {
          return {
              ...config,
              apiKey: SYSTEM_ENV_KEY,
              modelId: config.modelId || 'gemini-3-pro-preview' 
          };
      }
      return config;
  };

  const isConnected = !!config.apiKey || (useEnvKey && !!SYSTEM_ENV_KEY);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isLoading]);

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
    
    let newTitle = undefined;
    if (currentSession.title === '新对话' && messages.length <= 2) {
        newTitle = textToSend.slice(0, 15) + (textToSend.length > 15 ? '...' : '');
    }

    const updatedMessagesWithUser = [...messages, userMsg];
    updateCurrentSessionMessages(updatedMessagesWithUser, newTitle);

    setInput('');
    setIsLoading(true);

    const placeholderMsg: ChatMessage = { role: 'model', text: '' };
    updateCurrentSessionMessages([...updatedMessagesWithUser, placeholderMsg], newTitle);

    const historyForApi = updatedMessagesWithUser.filter(m => !m.isError);

    let accumulatedResponse = '';
    
    const fullContext = `${currentContext}\n\n【当前学科完整目录参考】\n${currentContext.includes('语文') ? getChineseCurriculumSummary() : getCurriculumSummary()}`;

    // Output Buffer for smoother rendering
    let buffer = '';
    let flushTimeout: any = null;

    const flushBuffer = () => {
        if (!buffer) return;
        
        accumulatedResponse += buffer;
        buffer = ''; // Clear buffer immediately
        
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
    };

    try {
      await sendMessageToGeminiStream(
          historyForApi, 
          fullContext, // Pass enriched context
          userMsg.text, 
          effectiveConfig, 
          (chunk) => {
              buffer += chunk;
              
              // Throttle updates to ~50ms to reduce render flicker
              if (!flushTimeout) {
                  flushTimeout = setTimeout(() => {
                      flushBuffer();
                      flushTimeout = null;
                  }, 50);
              }
          }
      );
      
      // Ensure final flush
      if (flushTimeout) clearTimeout(flushTimeout);
      flushBuffer();

    } catch (error: any) {
      setSessions(prev => prev.map(s => {
          if (s.id === (currentSession.id || currentSessionId)) {
              const msgs = [...s.messages];
              const lastMsg = msgs[msgs.length - 1];
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
      const match = str.match(/:::(quiz|keypoint|choice|fill_in|true_false|step_solver|comparison|correction|checklist|tips|suggestions|plot|chart|complex_plane|solid_geometry|exam_config|essay_generator)/);
      return match ? `:::${match[1]}` : ':::';
  };

  const handleExamCreated = (exam: ExamSession) => {
      let newTitle = exam.config.title;
      let count = 1;
      while (exams.some(e => e.config.title === newTitle)) {
          newTitle = `${exam.config.title} (${count})`;
          count++;
      }
      const newExam = { ...exam, config: { ...exam.config, title: newTitle } };
      setExams(prev => [newExam, ...prev]);
      setActiveExam(newExam);
      return newExam;
  };

  const handleSaveExam = (updatedExam: ExamSession) => {
      setExams(prev => prev.map(e => e.id === updatedExam.id ? updatedExam : e));
      setActiveExam(updatedExam);
  };

  const handleComponentInteract = async (action: string, payload?: any, blockIndex?: number, msgIndex?: number) => {
      if (action === 'apply_suggestion') {
          setInput(payload.text);
          if (inputRef.current) inputRef.current.focus();
          return;
      }

      if (action === 'start_exam') {
          const incomingExam = payload.exam;
          const existingExam = exams.find(e => e.id === incomingExam.id);
          let fullExam = existingExam || incomingExam;
          
          if (!existingExam) {
               if (incomingExam.questions && incomingExam.questions.length > 0 && incomingExam.questions[0].content) {
                   fullExam = handleExamCreated(incomingExam);
               } else {
                   showNotify("无法找到试卷数据 (可能已被删除)", "error");
                   return;
               }
          } else {
               setActiveExam(fullExam);
          }
          
          // Force fullscreen when starting exam
          setIsFullscreen(true);

          if (typeof msgIndex === 'number' && typeof blockIndex === 'number') {
              const liteExam = {
                  id: fullExam.id,
                  config: fullExam.config,
                  status: 'done', 
                  questions: Array(fullExam.questions.length).fill({}) 
              };
              
              handleUpdateMessageState(msgIndex, blockIndex, { 
                  status: 'done', 
                  generatedExam: liteExam 
              });
          }
          return;
      }

      if (action === 'open_essay_tool') {
          onNavigate?.('chinese', 'essay-tools', 'ai-essay-generator');
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
      
      if (action === 'update_state' && typeof msgIndex === 'number' && typeof blockIndex === 'number') {
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

  const getCurrentModelName = () => {
      const list = config.provider === 'gemini' ? availableModels.gemini : availableModels.openai;
      const model = list.find(m => m.id === config.modelId);
      return model ? model.name : config.modelId || 'Unknown Model';
  };

  // Main UI Content (Extracted for Portal use)
  const renderMainContent = () => (
    <div 
        className={`flex flex-col h-full bg-slate-50 relative`}
        style={(isFullscreen || activeExam) ? { 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100dvh', 
            zIndex: 2147483647, // Max z-index to break all stacking contexts
            backgroundColor: '#fff'
        } : {}}
    >
      {/* Notifications */}
      {notification && (
          <Notification 
            message={notification.msg} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
      )}

      {/* Conditional Rendering of Views */}
      {activeExam ? (
          <ExamRunner 
              exam={activeExam} 
              aiConfig={getEffectiveConfig()}
              onClose={() => setActiveExam(null)}
              onSave={handleSaveExam}
          />
      ) : showSettings ? (
          <SettingsView 
              config={config}
              onSave={handleConfigSave}
              onClose={() => setShowSettings(false)}
              availableModels={availableModels}
              onUpdateModels={handleUpdateModels}
              systemEnvKey={SYSTEM_ENV_KEY}
              useEnvKey={useEnvKey}
              onToggleDebugMode={handleToggleDebugMode}
          />
      ) : isHistoryView ? (
          <HistoryView 
              sessions={sessions}
              exams={exams}
              currentSessionId={currentSessionId}
              onSelectSession={(id) => { setCurrentSessionId(id); setIsHistoryView(false); }}
              onSelectExam={(ex) => setActiveExam(ex)}
              onClose={() => setIsHistoryView(false)}
              onNewChat={handleNewChat}
              onImportZip={handleImportFile}
              onExportAll={() => generateZipExport(sessions)}
              onExportBatch={(ids) => generateZipExport(sessions.filter(s => ids.includes(s.id)))}
              onExportSingle={handleExportSingle}
              onDelete={handleDelete}
              onRenameSession={handleRenameSession}
              onRenameExam={handleRenameExam}
              onTogglePin={handleTogglePin}
          />
      ) : (
          /* Main Chat Interface */
          <>
              <ChatHeader 
                  title={currentSession?.title}
                  modelName={getCurrentModelName()}
                  isConnected={isConnected}
                  onHistoryClick={() => setIsHistoryView(true)}
                  onNewChatClick={handleNewChat}
                  onFullscreenClick={() => setIsFullscreen(!isFullscreen)}
                  isFullscreen={isFullscreen}
                  onSettingsClick={() => setShowSettings(true)}
              />

              <MessageList 
                  messages={messages}
                  isLoading={isLoading}
                  isFullscreen={isFullscreen}
                  scrollRef={scrollRef}
                  onInteract={handleComponentInteract}
                  aiConfig={getEffectiveConfig()}
                  availableModels={availableModels}
              />

              <ChatInput 
                  input={input}
                  setInput={setInput}
                  onSend={() => handleSend()}
                  isLoading={isLoading}
                  isConnected={isConnected}
                  inputRef={inputRef}
              />
          </>
      )}
    </div>
  );

  // Portal Logic: Only when fullscreen is active or an exam is running
  if (isFullscreen || activeExam) {
      return createPortal(renderMainContent(), document.body);
  }

  return <div className="h-full w-full">{renderMainContent()}</div>;
};
