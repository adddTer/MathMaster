import React from 'react';
import { BookOpen, PenTool, Feather, ScrollText, Library } from 'lucide-react';
import { Topic } from '../types';

export const CHINESE_TOPICS: Topic[] = [
  {
    id: 'essay-tools',
    category: '智能工具',
    title: '作文生成与辅导',
    description: 'AI 驱动的交互式写作辅助系统。',
    icon: <Feather className="w-6 h-6" />,
    subtopics: [
      {
        id: 'ai-essay-generator',
        title: 'AI 交互式作文生成',
        tags: ['tool', 'important'],
        content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-xl border border-orange-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                        <PenTool className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">交互式多智能体作文生成系统</h2>
                        <p className="text-slate-500 mt-1">你是主编，AI 是你的顾问团与执笔人。</p>
                    </div>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                    <p>
                        这是一个全新的写作辅助工具。不同于传统的“一键生成”，在这里，你将掌握绝对的控制权。
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-8">
                        <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <Library className="w-4 h-4 text-orange-500" /> 4+1 顾问团
                            </h3>
                            <p className="text-sm">
                                逻辑架构师、文学修辞家、历史考据党、时代观察员。四位 AI 顾问实时在线，为你提供多维度的素材与观点。
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <ScrollText className="w-4 h-4 text-orange-500" /> 决策式写作
                            </h3>
                            <p className="text-sm">
                                系统会生成多个写作方向的“建议卡片”。你可以采纳、修改或拒绝。每一个段落的走向，都由你（主编）拍板。
                            </p>
                        </div>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                        <p className="text-sm font-medium text-orange-800">
                            🚀 系统正在初始化中... 请期待即将上线的完整体验。
                        </p>
                    </div>
                </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'ancient-poetry',
    category: '古诗文',
    title: '必修古诗文鉴赏',
    description: '高中语文必背篇目深度解析。',
    icon: <ScrollText className="w-6 h-6" />,
    subtopics: [
      {
        id: 'shi-jing',
        title: '诗经·氓',
        content: (
            <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-xl font-bold mb-4">卫风·氓</h3>
                <p className="text-slate-600 mb-4">《诗经》中的弃妇诗代表作。通过“赋、比、兴”的手法，叙述了女子从恋爱、结婚到被弃的过程。</p>
                <div className="bg-slate-50 p-4 rounded border border-slate-100 text-sm italic text-slate-500">
                    内容待补充...
                </div>
            </div>
        )
      },
      {
        id: 'li-sao',
        title: '离骚 (节选)',
        content: (
            <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h3 className="text-xl font-bold mb-4">离骚</h3>
                <p className="text-slate-600 mb-4">屈原的代表作，中国古代最长的抒情诗。</p>
            </div>
        )
      }
    ]
  }
];

export const getChineseCurriculumSummary = (): string => {
    return CHINESE_TOPICS.map(topic => {
        const subs = topic.subtopics.map(sub => `  - ${sub.title}`).join('\n');
        return `模块: ${topic.title}\n描述: ${topic.description}\n内容:\n${subs}`;
    }).join('\n\n');
};
