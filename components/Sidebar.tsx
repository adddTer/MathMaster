import React, { useState, useEffect, useMemo } from 'react';
import { Topic, SubTopic } from '../types';
import { ChevronRight, ChevronDown, Quote, BookMarked, Circle, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  topics: Topic[];
  currentTopicId: string;
  currentSubTopicId: string;
  onSelectSubTopic: (topicId: string, subTopicId: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const QUOTES = [
  { text: "数学是上帝书写宇宙的语言。", author: "伽利略" },
  { text: "上帝创造了整数，其余都是人造的。", author: "克罗内克" },
  { text: "数学是科学的皇后。", author: "高斯" },
  { text: "几何无王者之道。", author: "欧几里得" },
  { text: "纯数学，就其本质而言，是逻辑思想的诗篇。", author: "爱因斯坦" },
  { text: "自然总是以最简洁的方式行事。", author: "开普勒" },
  { text: "数学是理性的音乐。", author: "西尔维斯特" },
  { text: "万物皆数。", author: "毕达哥拉斯" },
  { text: "知之者不如好之者，好之者不如乐之者。", author: "孔子" },
  { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
  { text: "我思故我在。", author: "笛卡尔" },
  { text: "数学的本质在于它的自由。", author: "康托尔" },
  { text: "给我一个支点，我就能撬动地球。", author: "阿基米德" },
  { text: "数学是无穷的科学。", author: "赫尔曼·外尔" }
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  topics, 
  currentTopicId,
  currentSubTopicId,
  onSelectSubTopic, 
  isOpen,
  onCloseMobile
}) => {
  const [quote, setQuote] = useState(QUOTES[0]);
  // State to track expanded topics. Default to keeping the current topic expanded.
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set([currentTopicId]));

  useEffect(() => {
    // Ensure the current topic is always expanded when it changes externally
    setExpandedTopicIds(prev => {
        const newSet = new Set(prev);
        newSet.add(currentTopicId);
        return newSet;
    });
  }, [currentTopicId]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setQuote(QUOTES[randomIndex]);
  }, []);

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

  // Group topics by category
  const groupedTopics = useMemo(() => {
    const groups: Record<string, Topic[]> = {};
    topics.forEach(topic => {
      if (!groups[topic.category]) {
        groups[topic.category] = [];
      }
      groups[topic.category].push(topic);
    });
    return groups;
  }, [topics]);

  // Define the display order of categories manually to ensure logical progression
  const categoryOrder = [
    "前置知识", 
    "第一章 集合",
    "第二章 常用逻辑用语",
    "第三章 不等式",
    "第四章 指数与对数",
    "第五章 函数概念与性质",
    "第六章 基本初等函数",
    "第七章 三角函数",
    "第八章 函数应用",
    "第九章 平面向量",
    "第十章 三角恒等变换",
    "第十一章 解三角形",
    "第十二章 复数"
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed md:static top-0 h-full w-80 bg-white border-r border-slate-200 z-50 md:z-auto
          transition-transform duration-300 ease-in-out flex flex-col shrink-0
          ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0 md:shadow-none'}
        `}
      >
        <div className="p-5 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <span>高中数学伴学</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">必修第一册 & 衔接课程</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {categoryOrder.map((category) => {
            const categoryTopics = groupedTopics[category];
            if (!categoryTopics) return null;

            return (
              <div key={category} className="space-y-2">
                <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookMarked className="w-3 h-3" />
                  {category}
                </div>
                
                <div className="space-y-1">
                {categoryTopics.map((topic) => {
                  const isExpanded = expandedTopicIds.has(topic.id);
                  const isTopicActive = currentTopicId === topic.id;

                  return (
                    <div key={topic.id} className="rounded-lg overflow-hidden">
                      {/* Topic Header */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className={`
                          w-full flex items-center gap-3 p-2.5 text-left transition-all duration-200
                          ${isTopicActive 
                            ? 'bg-primary-50/50 text-primary-800' 
                            : 'text-slate-700 hover:bg-slate-50'}
                        `}
                      >
                        <span className={`shrink-0 ${isTopicActive ? 'text-primary-600' : 'text-slate-400'}`}>
                          {React.cloneElement(topic.icon as React.ReactElement<any>, { className: "w-4.5 h-4.5" })}
                        </span>
                        <span className="flex-1 text-sm font-medium truncate">{topic.title}</span>
                        {isExpanded ? (
                             <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                             <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {/* Subtopics List */}
                      {isExpanded && (
                        <div className="bg-slate-50/30 border-l-2 border-slate-100 ml-4 pl-1 my-1 space-y-0.5">
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
                                            w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors
                                            ${isSubActive ? 'bg-white text-primary-600 font-medium shadow-sm ring-1 ring-slate-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'}
                                        `}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-primary-500' : 'bg-slate-300'}`}></div>
                                        <span className="truncate">{sub.title}</span>
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
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
            <Quote className="w-4 h-4 text-slate-300 absolute -top-2 -left-1 fill-current" />
            <p className="text-xs text-slate-600 italic leading-relaxed mb-2 mt-1">
              "{quote.text}"
            </p>
            <p className="text-[10px] text-slate-400 text-right font-bold uppercase tracking-wider">
              — {quote.author}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};