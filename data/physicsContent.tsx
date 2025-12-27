
import React from 'react';
import { Target, Activity, Zap, PlayCircle, Clock, BookOpen } from 'lucide-react';
import { Topic } from '../types';
import { PhysicsChapter1Content } from './content/physics_chapter1';
import { PhysicsChapter2Content } from './content/physics_chapter2';
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
        title: '1. 质点 参考系和坐标系',
        content: PhysicsChapter1Content.section1_1
      },
      {
        id: 'p-1-2',
        title: '2. 时间和位移',
        content: PhysicsChapter1Content.section1_2
      },
      {
        id: 'p-1-3',
        title: '3. 运动快慢的描述——速度',
        tags: ['important'],
        content: PhysicsChapter1Content.section1_3
      },
      {
        id: 'p-1-4',
        title: '4. 实验：用打点计时器测速度',
        tags: ['tool'],
        content: PhysicsChapter1Content.section1_4
      },
      {
        id: 'p-1-5',
        title: '5. 速度变化快慢的描述——加速度',
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
        content: PhysicsChapter2Content.section2_3
      },
      {
        id: 'p-2-4',
        title: '4. 匀变速直线运动的速度与位移的关系',
        tags: ['important'],
        content: PhysicsChapter2Content.section2_4
      },
      {
        id: 'p-2-5',
        title: '5. 自由落体运动',
        content: PhysicsChapter2Content.section2_5
      }
    ]
  }
];

export const getPhysicsCurriculumSummary = (): string => {
    return PHYSICS_TOPICS.map(topic => {
        const subs = topic.subtopics.map(sub => `  - ${sub.title}`).join('\n');
        return `模块: ${topic.title}\n描述: ${topic.description}\n内容:\n${subs}`;
    }).join('\n\n');
};
