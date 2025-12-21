import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AITutor } from './components/AITutor';
import { MATH_TOPICS } from './data/mathContent';
import { Menu, BookOpen, GraduationCap, X, Sparkles, Star, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Topic, SubTopic } from './types';

const App: React.FC = () => {
  // Use both topic ID and subtopic ID for state
  const [currentTopicId, setCurrentTopicId] = useState<string>(MATH_TOPICS[0].id);
  const [currentSubTopicId, setCurrentSubTopicId] = useState<string>(MATH_TOPICS[0].subtopics[0].id);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAITutorMobile, setShowAITutorMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Selection Popover State
  const [selectionPopover, setSelectionPopover] = useState<{top: number, left: number, text: string} | null>(null);
  const [initialAIQuery, setInitialAIQuery] = useState<string>('');

  // Derive current objects
  const currentTopic = useMemo(() => 
    MATH_TOPICS.find(t => t.id === currentTopicId) || MATH_TOPICS[0], 
  [currentTopicId]);

  const currentSubTopic = useMemo(() => 
    currentTopic.subtopics.find(s => s.id === currentSubTopicId) || currentTopic.subtopics[0],
  [currentTopic, currentSubTopicId]);

  // Flatten all subtopics for navigation (Next/Prev)
  const allSubTopicsFlat = useMemo(() => {
    const flat: { topicId: string; subTopic: SubTopic }[] = [];
    MATH_TOPICS.forEach(topic => {
      topic.subtopics.forEach(sub => {
        flat.push({ topicId: topic.id, subTopic: sub });
      });
    });
    return flat;
  }, []);

  const currentIndex = allSubTopicsFlat.findIndex(item => item.topicId === currentTopicId && item.subTopic.id === currentSubTopicId);
  const prevItem = currentIndex > 0 ? allSubTopicsFlat[currentIndex - 1] : null;
  const nextItem = currentIndex < allSubTopicsFlat.length - 1 ? allSubTopicsFlat[currentIndex + 1] : null;

  // Scroll to top when topic changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentSubTopicId]);

  // Handle Text Selection
  useEffect(() => {
      const handleSelection = () => {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed || !selection.toString().trim()) {
              setSelectionPopover(null);
              return;
          }
          
          const text = selection.toString().trim();
          if (text.length < 2) return; // Ignore very short

          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Basic positioning above selection
          setSelectionPopover({
              top: rect.top - 50, 
              left: rect.left + (rect.width / 2),
              text: text
          });
      };

      const handleInteraction = (e: MouseEvent | KeyboardEvent) => {
          // Add a small delay to allow selection to update
          setTimeout(handleSelection, 10);
      };

      document.addEventListener('mouseup', handleInteraction);
      document.addEventListener('keyup', handleInteraction);
      
      return () => {
          document.removeEventListener('mouseup', handleInteraction);
          document.removeEventListener('keyup', handleInteraction);
      };
  }, []);

  const handleSubTopicSelect = (topicId: string, subTopicId: string) => {
      setCurrentTopicId(topicId);
      setCurrentSubTopicId(subTopicId);
      setIsSidebarOpen(false);
  };

  const handleAskAI = () => {
      if (selectionPopover) {
          const query = `解释一下：${selectionPopover.text}`;
          setInitialAIQuery(query);
          
          // Check screen size to toggle mobile modal or not needed for desktop
          if (window.innerWidth < 1280) { // xl breakpoint
              setShowAITutorMobile(true);
          }
          
          // Clear selection
          window.getSelection()?.removeAllRanges();
          setSelectionPopover(null);
      }
  };

  // Helper to render tags
  const renderTag = (tag: string) => {
    switch (tag) {
        case 'important':
            return (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200" title="重点内容">
                    <Star className="w-3.5 h-3.5 fill-current" /> 重点
                </span>
            );
        case 'high-school':
            return (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200" title="高中衔接紧密">
                    <TrendingUp className="w-3.5 h-3.5" /> 高中衔接
                </span>
            );
        case 'hard':
            return (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200" title="重难点">
                    <Zap className="w-3.5 h-3.5 fill-current" /> 难点
                </span>
            );
        case 'extension':
             return (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200" title="知识拓展">
                    <Sparkles className="w-3.5 h-3.5" /> 拓展
                </span>
            );
        default:
            return null;
    }
  };

  const renderTitle = (title: string) => {
      const match = title.match(/^(.*?)（(.*?)）$/);
      if (match) {
          return (
              <span className="flex flex-wrap items-center gap-2">
                  <span>{match[1]}</span>
                  <span className="text-sm bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-normal border border-slate-200">
                      {match[2]}
                  </span>
              </span>
          )
      }
      return title;
  };

  return (
    <div className="fixed inset-0 flex bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        topics={MATH_TOPICS}
        currentTopicId={currentTopicId}
        currentSubTopicId={currentSubTopicId}
        onSelectSubTopic={handleSubTopicSelect}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative">
        
        {/* Responsive Header */}
        <header className="xl:hidden bg-white border-b border-slate-200 px-4 h-16 flex justify-between items-center z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="打开菜单"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{currentTopic.title}</span>
                 <span className="font-bold text-slate-800 truncate text-sm">{currentSubTopic.title}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowAITutorMobile(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-600 rounded-full hover:bg-primary-100 transition-colors text-sm font-medium border border-primary-100"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI 辅导</span>
            <span className="sm:hidden">辅导</span>
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Scrollable Content */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto w-full"
          >
            <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10 space-y-6 pb-24 lg:pb-12">
              
              {/* Breadcrumb / Topic Context */}
              <div className="hidden xl:flex items-center gap-2 text-sm text-slate-400 mb-2">
                   <span>{currentTopic.category}</span>
                   <ChevronRight className="w-3 h-3" />
                   <span>{currentTopic.title}</span>
              </div>

              {/* Subtopic Title Header */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-6">
                 <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                           <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                {renderTitle(currentSubTopic.title)}
                           </h1>
                           <div className="hidden md:flex gap-2">
                                {currentSubTopic.tags?.map(tag => renderTag(tag))}
                           </div>
                      </div>
                      <div className="md:hidden flex gap-2">
                                {currentSubTopic.tags?.map(tag => renderTag(tag))}
                      </div>
                      <p className="text-slate-500 text-sm">
                           本节所属章节：<span className="font-medium text-slate-700">{currentTopic.title}</span>
                      </p>
                 </div>
              </div>

              {/* Content Render */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 min-h-[400px]">
                  <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-700 leading-loose">
                      {currentSubTopic.content}
                  </div>
              </div>
              
              {/* Bottom Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-200 gap-4">
                   {prevItem ? (
                       <button 
                            onClick={() => handleSubTopicSelect(prevItem.topicId, prevItem.subTopic.id)}
                            className="flex-1 flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group text-left"
                       >
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-primary-600 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-0.5">上一节</div>
                                <div className="font-medium text-slate-700 group-hover:text-primary-700 text-sm line-clamp-1">{prevItem.subTopic.title}</div>
                            </div>
                       </button>
                   ) : <div className="flex-1"></div>}

                   {nextItem ? (
                       <button 
                            onClick={() => handleSubTopicSelect(nextItem.topicId, nextItem.subTopic.id)}
                            className="flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group text-right"
                       >
                            <div>
                                <div className="text-xs text-slate-400 mb-0.5">下一节</div>
                                <div className="font-medium text-slate-700 group-hover:text-primary-700 text-sm line-clamp-1">{nextItem.subTopic.title}</div>
                            </div>
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-white group-hover:text-primary-600 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                       </button>
                   ) : <div className="flex-1"></div>}
              </div>

               {/* Footer hint */}
               <div className="text-center py-8 text-slate-400 text-sm xl:hidden">
                  点击右上角“AI 辅导”获取智能帮助
               </div>
            </div>
          </div>

          {/* Desktop AI Tutor Panel */}
          <aside className="hidden xl:block w-96 border-l border-slate-200 bg-white h-full shrink-0 shadow-sm z-20">
             <div className="h-full p-0">
                <AITutor 
                    currentContext={`${currentTopic.title} - ${currentSubTopic.title}`}
                    initialQuery={initialAIQuery}
                    onClearInitialQuery={() => setInitialAIQuery('')}
                />
             </div>
          </aside>

        </div>

        {/* Mobile AI Tutor Modal */}
        {showAITutorMobile && (
           <div className="fixed inset-0 z-50 xl:hidden flex flex-col bg-white animate-in slide-in-from-bottom-10 duration-200">
             <div className="p-3 px-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0 h-14">
               <div className="font-bold text-slate-800 flex items-center gap-2">
                 <div className="p-1 bg-primary-100 rounded-md text-primary-600">
                    <GraduationCap className="w-5 h-5" />
                 </div>
                 <span>AI 智能辅导</span>
               </div>
               <button 
                onClick={() => setShowAITutorMobile(false)} 
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 active:scale-95 transition-all shadow-sm"
               >
                 <X className="w-5 h-5 text-slate-600" />
               </button>
             </div>
             <div className="flex-1 p-0 overflow-hidden bg-slate-50">
                <AITutor 
                    currentContext={`${currentTopic.title} - ${currentSubTopic.title}`}
                    initialQuery={initialAIQuery}
                    onClearInitialQuery={() => setInitialAIQuery('')}
                />
             </div>
           </div>
        )}

      </main>

      {/* Text Selection Popover */}
      {selectionPopover && (
          <button
              onClick={handleAskAI}
              style={{ top: selectionPopover.top, left: selectionPopover.left }}
              className="fixed -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-50 flex items-center gap-1.5 hover:bg-slate-800 transition-all animate-in zoom-in-95 duration-150 active:scale-95"
          >
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              <span>问 AI</span>
          </button>
      )}

    </div>
  );
};

export default App;