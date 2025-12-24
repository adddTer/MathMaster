
import React, { useState, useEffect, useMemo } from 'react';
import { Topic, SubjectType } from '../types';
import { ChevronRight, ChevronDown, BookMarked, Calculator, ScrollText, Languages, Atom, FlaskConical, Dna, BookOpen, LayoutGrid, Snowflake, Gift, PartyPopper, Sparkles } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  currentSubject: SubjectType;
  currentTopicId: string;
  currentSubTopicId: string;
  onSelectSubTopic: (topicId: string, subTopicId: string) => void;
  onSwitchSubject: (subject: SubjectType) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

// --- Configuration ---

const SUBJECT_CONFIG: Record<SubjectType, { label: string, color: string, icon: any }> = {
    math: { label: "数学", color: "blue", icon: Calculator },
    chinese: { label: "语文", color: "orange", icon: ScrollText },
    english: { label: "英语", color: "pink", icon: Languages },
    physics: { label: "物理", color: "indigo", icon: Atom },
    chemistry: { label: "化学", color: "emerald", icon: FlaskConical },
    biology: { label: "生物", color: "teal", icon: Dna },
};

// Define available modules (Books) for each subject
const MODULES: Record<SubjectType, string[]> = {
    math: ['全部', '前置知识', '必修第一册', '必修第二册', '选择性必修'],
    chinese: ['全部', '必修上册', '必修下册'],
    english: ['全部', '必修一', '必修二', '必修三'],
    physics: ['全部', '必修一', '必修二', '必修三'],
    chemistry: ['全部', '必修一', '必修二'],
    biology: ['全部', '必修一', '必修二'],
};

// Helper: Convert Chinese numerals to number for chapter parsing
const chineseToNumber = (str: string): number => {
    const map: Record<string, number> = {
        '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
        '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15
    };
    // Match "第X章" pattern
    const match = str.match(/第([一二三四五六七八九十]+)章/);
    if (match && map[match[1]]) return map[match[1]];
    return 0;
};

// Helper to map categories to Math books
const getMathModule = (category: string): string => {
    if (category.includes('前置')) return '前置知识';
    
    const chapterNum = chineseToNumber(category);
    if (chapterNum > 0) {
        if (chapterNum <= 8) return '必修第一册'; // Ch 1-8
        if (chapterNum <= 15) return '必修第二册'; // Ch 9-15
        return '选择性必修';
    }
    
    // Fallback for named categories if any
    if (category.includes('集合') || category.includes('函数')) return '必修第一册';
    
    return '其他';
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  topics, 
  currentSubject,
  currentTopicId,
  currentSubTopicId,
  onSelectSubTopic, 
  onSwitchSubject,
  isOpen,
  onCloseMobile
}) => {
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set([currentTopicId]));
  const [activeModule, setActiveModule] = useState<string>('全部');
  const [theme, setTheme] = useState<any>(null);

  // Load theme from global window object
  useEffect(() => {
      // @ts-ignore
      if (window.curriculumTheme) {
          // @ts-ignore
          setTheme(window.curriculumTheme);
      }
  }, []);

  // Reset module filter when subject changes
  useEffect(() => {
      setActiveModule('全部');
  }, [currentSubject]);

  // Auto-expand current topic
  useEffect(() => {
    setExpandedTopicIds(prev => {
        const newSet = new Set(prev);
        newSet.add(currentTopicId);
        return newSet;
    });
  }, [currentTopicId]);

  const toggleTopic = (topicId: string) => {
      setExpandedTopicIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(topicId)) {
              newSet.delete(topicId);
          } else {
              newSet.add(topicId);
          }
          return newSet;
      });
  };

  // Group and Filter Topics
  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};
    const cats: string[] = [];
    
    topics.forEach(topic => {
      // Filter Logic
      let shouldShow = true;
      if (activeModule !== '全部') {
          if (currentSubject === 'math') {
              const book = getMathModule(topic.category);
              if (book !== activeModule) shouldShow = false;
          }
          // Add logic for other subjects here if needed
      }

      if (shouldShow) {
          if (!groups[topic.category]) {
            groups[topic.category] = [];
            cats.push(topic.category);
          }
          groups[topic.category].push(topic);
      }
    });
    return { groups, cats };
  }, [topics, activeModule, currentSubject]);

  const SubjectBtn = ({ type }: { type: SubjectType }) => {
      const conf = SUBJECT_CONFIG[type];
      const isActive = currentSubject === type;
      const Icon = conf.icon;
      
      return (
        <button 
            onClick={() => onSwitchSubject(type)}
            className={`
                flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-200
                ${isActive 
                    ? `bg-white text-${conf.color}-600 shadow-sm ring-1 ring-slate-200 transform scale-105 z-10` 
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}
            `}
        >
            <Icon className={`w-5 h-5 ${isActive ? `text-${conf.color}-500 fill-current opacity-20` : 'opacity-70'}`} />
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-80'}`}>{conf.label}</span>
        </button>
      );
  };

  // Theme Icon logic
  const ThemeBadge = () => {
      if (!theme || theme.name === 'default') return null;
      
      let Icon = Sparkles;
      let text = theme.label;
      let styleClass = "bg-primary-50 text-primary-600 border-primary-200";

      if (theme.name === 'eve') {
          Icon = Gift;
          styleClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
      } else if (theme.name === 'christmas') {
          Icon = Snowflake;
          styleClass = "bg-red-100 text-red-700 border-red-200";
      } else if (theme.name === 'newyear') {
          Icon = PartyPopper;
          styleClass = "bg-rose-100 text-rose-700 border-rose-200";
      } else if (theme.name === 'spring_festival') {
          Icon = PartyPopper; 
          styleClass = "bg-red-50 text-red-800 border-red-200 shadow-sm";
      }

      return (
          <div className={`mt-3 px-3 py-2 rounded-lg border ${styleClass} flex items-center justify-between shadow-sm animate-in slide-in-from-left-2`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {text}快乐!
              </span>
          </div>
      );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content - Make background semi-transparent to show global theme */}
      <aside 
        className={`
          fixed md:static top-0 h-full w-80 bg-white/80 backdrop-blur-md border-r border-slate-200 z-50 md:z-auto
          transition-transform duration-300 ease-in-out flex flex-col shrink-0
          ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-none'}
        `}
      >
        {/* Header Section */}
        <div className="flex-shrink-0 border-b border-slate-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] z-10 bg-white/50">
            <div className="p-4 pb-2">
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <div className="bg-primary-600 text-white p-1.5 rounded-lg shadow-sm">
                        <BookOpen className="w-4 h-4" />
                    </div>
                    <span>高中智能伴学</span>
                </h1>
                
                {/* Subject Grid */}
                <div className="bg-slate-100/80 p-1.5 rounded-2xl grid grid-cols-3 gap-1 mb-2">
                    <SubjectBtn type="math" />
                    <SubjectBtn type="chinese" />
                    <SubjectBtn type="english" />
                    <SubjectBtn type="physics" />
                    <SubjectBtn type="chemistry" />
                    <SubjectBtn type="biology" />
                </div>

                <ThemeBadge />
            </div>

            {/* Module Filter Tabs */}
            <div className="px-4 pb-0 overflow-x-auto scrollbar-hide mt-2">
                <div className="flex gap-2 pb-3 min-w-max">
                    {MODULES[currentSubject].map((mod) => (
                        <button
                            key={mod}
                            onClick={() => setActiveModule(mod)}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                                ${activeModule === mod 
                                    ? 'bg-slate-800 text-white shadow-md shadow-slate-200' 
                                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                            `}
                        >
                            {mod}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                  <BookMarked className="w-10 h-10 mb-3 opacity-20" />
                  <span className="text-xs font-medium">该学科内容正在整理中...</span>
              </div>
          ) : groupedTopics.cats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                  <LayoutGrid className="w-10 h-10 mb-3 opacity-20" />
                  <span className="text-xs font-medium">该分册暂无内容</span>
                  <button onClick={() => setActiveModule('全部')} className="mt-2 text-xs text-primary-600 hover:underline">
                      查看全部
                  </button>
              </div>
          ) : (
              groupedTopics.cats.map((category) => {
                const categoryTopics = groupedTopics.groups[category];
                if (!categoryTopics) return null;

                const singleTopic = categoryTopics.length === 1 ? categoryTopics[0] : null;
                const isRedundant = singleTopic && (category.includes(singleTopic.title) || category.startsWith('第'));

                return (
                  <div key={category} className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                    {!isRedundant && (
                        <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="h-px bg-slate-200 flex-1"></div>
                            <span className="flex items-center gap-1.5"><BookMarked className="w-3 h-3" /> {category}</span>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>
                    )}
                    
                    <div className="space-y-1">
                    {categoryTopics.map((topic) => {
                      const isExpanded = expandedTopicIds.has(topic.id);
                      const isTopicActive = currentTopicId === topic.id;
                      const displayTitle = (isRedundant && singleTopic?.id === topic.id) ? category : topic.title;

                      return (
                        <div key={topic.id} className={`rounded-xl overflow-hidden transition-all ${isTopicActive ? 'bg-white shadow-sm border border-slate-100' : ''}`}>
                          {/* Topic Header */}
                          <button
                            onClick={() => toggleTopic(topic.id)}
                            className={`
                              w-full flex items-center gap-3 p-3 text-left transition-all duration-200
                              ${isTopicActive 
                                ? 'text-primary-700' 
                                : 'text-slate-600 hover:bg-white/60 hover:shadow-sm'}
                            `}
                          >
                            <div className={`p-1.5 rounded-md shrink-0 transition-colors ${isTopicActive ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                {React.cloneElement(topic.icon as React.ReactElement<any>, { className: "w-4 h-4" })}
                            </div>
                            <span className="flex-1 text-sm font-bold truncate">{displayTitle}</span>
                            {isExpanded ? (
                                 <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${isTopicActive ? 'text-primary-400' : 'text-slate-300'}`} />
                            ) : (
                                 <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            )}
                          </button>

                          {/* Subtopics List */}
                          {isExpanded && (
                            <div className="pb-2 space-y-0.5 relative">
                                {/* Connector Line */}
                                <div className="absolute left-[22px] top-0 bottom-4 w-px bg-slate-200"></div>
                                
                                {topic.subtopics.map((sub) => {
                                    const isSubActive = currentSubTopicId === sub.id;
                                    return (
                                        <button 
                                            key={sub.id}
                                            onClick={() => {
                                                onSelectSubTopic(topic.id, sub.id);
                                                onCloseMobile();
                                            }}
                                            className={`
                                                relative w-[calc(100%-12px)] ml-auto flex items-center gap-3 py-2 px-3 rounded-l-lg text-left text-xs transition-colors
                                                ${isSubActive 
                                                    ? 'bg-primary-50 text-primary-700 font-bold border-r-2 border-primary-500' 
                                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                                            `}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 z-10 ${isSubActive ? 'bg-primary-500 ring-2 ring-primary-100' : 'bg-slate-300'}`}></div>
                                            <span className="truncate leading-relaxed">{sub.title}</span>
                                        </button>
                                    )
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    </div>
                  </div>
                );
              })
          )}
        </nav>
      </aside>
    </>
  );
};
