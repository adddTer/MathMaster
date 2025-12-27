
import React from 'react';
import { Target, Activity, Zap, PlayCircle, Clock, BookOpen, Magnet, Scale, Orbit, TrendingUp, RotateCw, Rocket } from 'lucide-react';
import { Topic } from '../types';
import { PhysicsChapter1Content } from './content/physics_chapter1';
import { PhysicsChapter2Content } from './content/physics_chapter2';
import { PhysicsChapter3Content } from './content/physics_chapter3';
import { PhysicsChapter4Content } from './content/physics_chapter4';
import { PhysicsChapter5Content } from './content/physics_chapter5';
import { PhysicsChapter6Content } from './content/physics_chapter6';
import { PhysicsChapter7Content } from './content/physics_chapter7';
import { PhysicsSummaryContent } from './content/physics_summary';

export const PHYSICS_TOPICS: Topic[] = [
  {
    id: 'physics-summary',
    category: '核心公式汇总',
    title: '公式速查手册',
    description: '必修一核心物理公式、推论及重要结论的集中展示。',
    icon: <BookOpen className="w-6 h-6" />,
    subtopics: [
      {
        id: 'p-summary-1',
        title: '必修一公式全览',
        tags: ['important', 'tool'],
        content: PhysicsSummaryContent.cheat_sheet
      }
    ]
  },
  {
    id: 'physics-ch1',
    category: '第一章 运动的描述',
    title: '运动的描述',
    description: '物理学的开篇，建立描述物体运动的基本概念和框架。',
    icon: <Target className="w-6 h-6" />,
    subtopics: [
      {
        id: 'p-1-1',
        title: '1. 质点 参考系',
        content: PhysicsChapter1Content.section1_1
      },
      {
        id: 'p-1-2',
        title: '2. 时间 位移',
        content: PhysicsChapter1Content.section1_2
      },
      {
        id: 'p-1-3',
        title: '3. 速度',
        tags: ['important'],
        content: (
            <div>
                {PhysicsChapter1Content.section1_3}
                <div className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">实验辅助：打点计时器</h3>
                    {PhysicsChapter1Content.section1_4}
                </div>
            </div>
        )
      },
      {
        id: 'p-1-4',
        title: '4. 加速度',
        tags: ['important', 'hard'],
        content: PhysicsChapter1Content.section1_5
      }
    ]
  },
  {
    id: 'physics-ch2',
    category: '第二章 匀变速直线运动的研究',
    title: '匀变速直线运动',
    description: '深入研究最简单的变速运动，掌握公式与图像法。',
    icon: <Activity className="w-6 h-6" />,
    subtopics: [
      {
        id: 'p-2-1',
        title: '1. 实验：探究小车速度随时间变化的规律',
        tags: ['tool'],
        content: PhysicsChapter2Content.section2_1
      },
      {
        id: 'p-2-2',
        title: '2. 匀变速直线运动的速度与时间的关系',
        content: PhysicsChapter2Content.section2_2
      },
      {
        id: 'p-2-3',
        title: '3. 匀变速直线运动的位移与时间的关系',
        tags: ['important'],
        content: (
            <div>
                {PhysicsChapter2Content.section2_3}
                <div className="mt-8 border-t border-slate-200 pt-6">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">重要推论：速度与位移的关系</h3>
                    {PhysicsChapter2Content.section2_4}
                </div>
            </div>
        )
      },
      {
        id: 'p-2-4',
        title: '4. 自由落体运动',
        content: PhysicsChapter2Content.section2_5
      }
    ]
  },
  {
    id: 'physics-ch3',
    category: '第三章 相互作用——力',
    title: '相互作用——力',
    description: '探究力的本质、合成与分解，建立受力分析的思维。',
    icon: <Magnet className="w-6 h-6" />,
    subtopics: [
      { id: 'p-3-1', title: '1. 重力与弹力', content: PhysicsChapter3Content.section3_1 },
      { id: 'p-3-2', title: '2. 摩擦力', tags: ['important', 'hard'], content: PhysicsChapter3Content.section3_2 },
      { id: 'p-3-3', title: '3. 牛頓第三定律', content: PhysicsChapter3Content.section3_3 },
      { id: 'p-3-4', title: '4. 力的合成和分解', tags: ['important', 'tool'], content: PhysicsChapter3Content.section3_4 },
      { id: 'p-3-5', title: '5. 共点力的平衡', tags: ['hard'], content: PhysicsChapter3Content.section3_5 }
    ]
  },
  {
    id: 'physics-ch4',
    category: '第四章 运动和力的关系',
    title: '运动和力的关系',
    description: '牛顿运动定律的核心章节，连接运动学与动力学的桥梁。',
    icon: <Orbit className="w-6 h-6" />,
    subtopics: [
      { id: 'p-4-1', title: '1. 牛頓第一定律', content: PhysicsChapter4Content.section4_1 },
      { id: 'p-4-2', title: '2. 实验：探究加速度与力、质量的关系', tags: ['tool'], content: PhysicsChapter4Content.section4_2 },
      { id: 'p-4-3', title: '3. 牛頓第二定律', tags: ['important', 'hard'], content: PhysicsChapter4Content.section4_3 },
      { id: 'p-4-4', title: '4. 力学单位制', content: PhysicsChapter4Content.section4_4 },
      { id: 'p-4-5', title: '5. 牛顿运动定律的应用', tags: ['important'], content: PhysicsChapter4Content.section4_5 },
      { id: 'p-4-6', title: '6. 超重与失重', content: PhysicsChapter4Content.section4_6 }
    ]
  },
  {
    id: 'physics-ch5',
    category: '第五章 抛体运动',
    title: '抛体运动',
    description: '研究曲线运动的基本方法，重点掌握运动的合成与分解及平抛运动规律。',
    icon: <TrendingUp className="w-6 h-6" />,
    subtopics: [
      { id: 'p-5-1', title: '1. 曲线运动', content: PhysicsChapter5Content.section5_1 },
      { id: 'p-5-2', title: '2. 运动的合成与分解', tags: ['important', 'hard'], content: PhysicsChapter5Content.section5_2 },
      { id: 'p-5-3', title: '3. 实验：探究平抛运动的特点', tags: ['tool'], content: PhysicsChapter5Content.section5_3 },
      { id: 'p-5-4', title: '4. 抛体运动的规律', tags: ['important'], content: PhysicsChapter5Content.section5_4 }
    ]
  },
  {
    id: 'physics-ch6',
    category: '第六章 圆周运动',
    title: '圆周运动',
    description: '探讨物体做圆周运动的动力学条件，理解向心力与向心加速度。',
    icon: <RotateCw className="w-6 h-6" />,
    subtopics: [
      { id: 'p-6-1', title: '1. 圆周运动', content: PhysicsChapter6Content.section6_1 },
      { id: 'p-6-2', title: '2. 向心力', tags: ['important'], content: PhysicsChapter6Content.section6_2 },
      { id: 'p-6-3', title: '3. 向心加速度', content: PhysicsChapter6Content.section6_3 },
      { id: 'p-6-4', title: '4. 生活中的圆周运动', tags: ['extension'], content: PhysicsChapter6Content.section6_4 }
    ]
  },
  {
    id: 'physics-ch7',
    category: '第七章 万有引力与宇宙航行',
    title: '万有引力与宇宙航行',
    description: '探索天体运动规律，连接地上物体与天上星体的运动。',
    icon: <Rocket className="w-6 h-6" />,
    subtopics: [
      { id: 'p-7-1', title: '1. 行星的运动', content: PhysicsChapter7Content.section7_1 },
      { id: 'p-7-2', title: '2. 万有引力定律', tags: ['important'], content: PhysicsChapter7Content.section7_2 },
      { id: 'p-7-3', title: '3. 万有引力理论的成就', tags: ['important', 'hard'], content: PhysicsChapter7Content.section7_3 },
      { id: 'p-7-4', title: '4. 宇宙航行', content: PhysicsChapter7Content.section7_4 },
      { id: 'p-7-5', title: '5. 相对论时空观与局限性', tags: ['extension'], content: PhysicsChapter7Content.section7_5 }
    ]
  }
];

export const getPhysicsCurriculumSummary = (): string => {
    return PHYSICS_TOPICS.map(topic => {
        const subs = topic.subtopics.map(sub => `  - ${sub.title}`).join('\n');
        return `模块: ${topic.title}\n描述: ${topic.description}\n内容:\n${subs}`;
    }).join('\n\n');
};
