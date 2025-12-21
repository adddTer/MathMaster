import React from 'react';
import { Divide, FunctionSquare, Scaling, Radical, Sigma, Triangle, Layers, Binary, Scale, Calculator, TrendingUp, Activity, Waves, LineChart, Microscope, Blend, Ruler, Fingerprint, Box, Shapes, BarChart3, Dices } from 'lucide-react';
import { Topic } from '../types';

// Import contents
import { 
    FactorizationContent, 
    EquationsContent, 
    FunctionsContent,
    InequalitiesContent,
    RadicalsContent,
    TrigContent
} from './content/prerequisites';

import { Chapter1Content } from './content/chapter1';
import { Chapter2Content } from './content/chapter2';
import { Chapter3Content } from './content/chapter3';
import { Chapter4Content } from './content/chapter4';
import { Chapter5Content } from './content/chapter5';
import { Chapter6Content } from './content/chapter6';
import { Chapter7Content } from './content/chapter7';
import { Chapter8Content } from './content/chapter8';
import { Chapter9Content } from './content/chapter9';
import { Chapter10Content } from './content/chapter10';
import { Chapter11Content } from './content/chapter11';
import { Chapter12Content } from './content/chapter12';
import { Chapter13Content } from './content/chapter13';
import { Chapter14Content } from './content/chapter14';
import { Chapter15Content } from './content/chapter15';

export const MATH_TOPICS: Topic[] = [
  // ... (keeping existing topics array content as is, assuming it's already there) ...
  // --- 前置知识 ---
  {
    id: 'factorization',
    category: '前置知识',
    title: '因式分解',
    description: '化简代数式的基础，也是解方程、不等式和研究函数性质的关键工具。',
    icon: <Divide className="w-6 h-6" />,
    subtopics: [
      {
        id: 'common-factor',
        title: '提公因式法',
        tags: ['important'],
        content: FactorizationContent.commonFactor
      },
      {
        id: 'formulas',
        title: '公式法',
        tags: ['important'],
        content: FactorizationContent.formulas
      },
      {
        id: 'cross-multiplication',
        title: '十字相乘法',
        tags: ['important', 'high-school'],
        content: FactorizationContent.crossMult
      }
    ]
  },
  {
    id: 'quadratic-equation',
    category: '前置知识',
    title: '一元二次方程',
    description: '核心代数方程，研究方程的根与系数关系。',
    icon: <Sigma className="w-6 h-6" />,
    subtopics: [
      {
        id: 'roots-formula',
        title: '求根公式',
        tags: ['important'],
        content: EquationsContent.roots
      },
      {
        id: 'vieta',
        title: '韦达定理',
        tags: ['important', 'high-school'],
        content: EquationsContent.vieta
      }
    ]
  },
  {
    id: 'quadratic-function',
    category: '前置知识',
    title: '二次函数',
    description: '最重要的基本初等函数之一，数形结合思想的最佳载体。',
    icon: <FunctionSquare className="w-6 h-6" />,
    subtopics: [
      {
        id: 'forms',
        title: '三种形式',
        tags: ['high-school'],
        content: FunctionsContent.forms
      },
      {
        id: 'properties',
        title: '图像性质',
        content: FunctionsContent.props
      },
      {
        id: 'translation',
        title: '图像平移',
        tags: ['important', 'high-school'],
        content: FunctionsContent.translation
      }
    ]
  },
  {
    id: 'inequalities',
    category: '前置知识',
    title: '不等式',
    description: '回顾初中不等式的基本解法，为高中深入学习打下基础。',
    icon: <Scaling className="w-6 h-6" />,
    subtopics: [
        {
            id: 'basic',
            title: '基本性质',
            content: InequalitiesContent.basic
        },
        {
            id: 'absolute-ineq',
            title: '绝对值不等式',
            tags: ['high-school'],
            content: InequalitiesContent.absIneq
        },
        {
            id: 'quadratic-ineq',
            title: '一元二次不等式 (初步)',
            tags: ['important'],
            content: InequalitiesContent.quadraticIneq
        }
    ]
  },
  {
    id: 'radicals-exponents',
    category: '前置知识',
    title: '根式与指数',
    description: '运算能力的体现。',
    icon: <Radical className="w-6 h-6" />,
    subtopics: [
        {
            id: 'rules',
            title: '整数指数幂',
            content: RadicalsContent.rules
        },
        {
            id: 'radical-props',
            title: '二次根式与有理化',
            tags: ['important'],
            content: RadicalsContent.radicals
        }
    ]
  },
  {
    id: 'trigonometry',
    category: '前置知识',
    title: '基础三角函数',
    description: '几何与代数的桥梁。',
    icon: <Triangle className="w-6 h-6" />,
    subtopics: [
        {
            id: 'defs',
            title: '定义与特殊角',
            content: TrigContent.basics
        }
    ]
  },

  // --- 第一章 集合 ---
  {
    id: 'sets-chapter',
    category: '第一章 集合',
    title: '集合',
    description: '现代数学的基石。本章我们将学习集合的基本概念、表示方法以及集合间的基本关系与运算。',
    icon: <Layers className="w-6 h-6" />,
    subtopics: [
      {
        id: 'set-concepts-1-1',
        title: '1.1 集合的概念与表示',
        tags: ['important'],
        content: Chapter1Content.section1_1
      },
      {
        id: 'subset-complement-1-2',
        title: '1.2 子集、全集、补集',
        content: Chapter1Content.section1_2
      },
      {
        id: 'intersection-union-1-3',
        title: '1.3 交集、并集',
        tags: ['high-school', 'important'],
        content: Chapter1Content.section1_3
      },
      {
        id: 'set-laws-inquiry',
        title: '探究：集合运算的运算律',
        tags: ['extension'],
        content: Chapter1Content.section1_extension
      }
    ]
  },

  // --- 第二章 常用逻辑用语 ---
  {
    id: 'logic-chapter',
    category: '第二章 常用逻辑用语',
    title: '常用逻辑用语',
    description: '逻辑是数学思维的体操。本章我们将学习命题的真假判断、充分必要条件的推导以及量词的否定规则。',
    icon: <Binary className="w-6 h-6" />,
    subtopics: [
      {
        id: 'propositions-2-1',
        title: '2.1 命题、定理、定义',
        content: Chapter2Content.section2_1
      },
      {
        id: 'conditions-2-2',
        title: '2.2 充分条件、必要条件',
        tags: ['important', 'hard'],
        content: Chapter2Content.section2_2
      },
      {
        id: 'quantifiers-2-3',
        title: '2.3 全称量词与存在量词',
        tags: ['important'],
        content: Chapter2Content.section2_3
      }
    ]
  },

  // --- 第三章 不等式 ---
  {
    id: 'inequality-chapter',
    category: '第三章 不等式',
    title: '不等式',
    description: '处理数学问题的核心工具。本章将深入研究不等式的性质、基本不等式及其应用，并从函数视角解析一元二次不等式。',
    icon: <Scale className="w-6 h-6" />,
    subtopics: [
      {
        id: 'ineq-properties-3-1',
        title: '3.1 不等式的基本性质',
        content: Chapter3Content.section3_1
      },
      {
        id: 'basic-inequality-3-2',
        title: '3.2 基本不等式',
        tags: ['important', 'high-school'],
        content: Chapter3Content.section3_2
      },
      {
        id: 'quadratic-ineq-func-3-3',
        title: '3.3 一元二次不等式',
        tags: ['high-school', 'hard'],
        content: Chapter3Content.section3_3
      }
    ]
  },

  // --- 第四章 指数与对数 ---
  {
    id: 'exp-log-chapter',
    category: '第四章 指数与对数',
    title: '指数与对数',
    description: '基本初等函数的运算基础。本章我们将从整数指数幂推广到分数指数幂，并引入全新的对数运算工具。',
    icon: <Calculator className="w-6 h-6" />,
    subtopics: [
      {
        id: 'exponents-4-1',
        title: '4.1 指数',
        tags: ['important'],
        content: Chapter4Content.section4_1
      },
      {
        id: 'logarithms-4-2',
        title: '4.2 对数',
        tags: ['important', 'high-school', 'hard'],
        content: Chapter4Content.section4_2
      }
    ]
  },

  // --- 第五章 函数概念与性质 ---
  {
    id: 'function-props-chapter',
    category: '第五章 函数概念与性质',
    title: '函数概念与性质',
    description: '高中数学的核心主线。本章将重新系统认识函数，并重点研究函数的单调性与奇偶性。',
    icon: <TrendingUp className="w-6 h-6" />,
    subtopics: [
      {
        id: 'func-concept-5-1',
        title: '5.1 函数的概念',
        content: Chapter5Content.section5_1
      },
      {
        id: 'func-rep-5-2',
        title: '5.2 函数的表示方法',
        content: Chapter5Content.section5_2
      },
      {
        id: 'monotonicity-5-3',
        title: '5.3 函数的单调性',
        tags: ['important', 'high-school', 'hard'],
        content: Chapter5Content.section5_3
      },
      {
        id: 'parity-5-4',
        title: '5.4 函数的奇偶性',
        tags: ['important', 'high-school'],
        content: Chapter5Content.section5_4
      },
      {
        id: 'func-ops-extension',
        title: '探究：函数运算与复合函数的单调性',
        tags: ['extension', 'hard'],
        content: Chapter5Content.section5_extension
      }
    ]
  },

  // --- 第六章 基本初等函数 ---
  {
    id: 'basic-elementary-funcs-chapter',
    category: '第六章 基本初等函数',
    title: '幂指对函数',
    description: '高中函数学习的主体内容。本章将对幂函数、指数函数和对数函数的图像与性质进行深入的比较和总结。',
    icon: <Activity className="w-6 h-6" />,
    subtopics: [
      {
        id: 'power-func-6-1',
        title: '6.1 幂函数',
        tags: ['important', 'high-school'],
        content: Chapter6Content.section6_1
      },
      {
        id: 'exp-func-6-2',
        title: '6.2 指数函数',
        tags: ['important', 'high-school'],
        content: Chapter6Content.section6_2
      },
      {
        id: 'log-func-6-3',
        title: '6.3 对数函数',
        tags: ['important', 'hard'],
        content: Chapter6Content.section6_3
      }
    ]
  },

  // --- 第七章 三角函数 ---
  {
    id: 'trigonometry-chapter',
    category: '第七章 三角函数',
    title: '三角函数',
    description: '描述周期现象的数学模型。本章将从单位圆出发，建立任意角三角函数的概念，并研究其图象与性质。',
    icon: <Waves className="w-6 h-6" />,
    subtopics: [
      {
        id: 'angles-radians-7-1',
        title: '7.1 角与弧度',
        content: Chapter7Content.section7_1
      },
      {
        id: 'trig-concepts-7-2',
        title: '7.2 三角函数概念',
        tags: ['important'],
        content: Chapter7Content.section7_2
      },
      {
        id: 'trig-graphs-7-3',
        title: '7.3 图象与性质',
        tags: ['important', 'high-school', 'hard'],
        content: Chapter7Content.section7_3
      },
      {
        id: 'trig-apps-7-4',
        title: '7.4 三角函数应用',
        tags: ['high-school'],
        content: Chapter7Content.section7_4
      }
    ]
  },

  // --- 第八章 函数应用 ---
  {
    id: 'function-apps-chapter',
    category: '第八章 函数应用',
    title: '函数应用',
    description: '将函数知识应用于解决实际问题。本章将学习如何利用函数模型描述现实世界，并掌握求方程近似解的二分法。',
    icon: <LineChart className="w-6 h-6" />,
    subtopics: [
      {
        id: 'bisection-8-1',
        title: '8.1 二分法与求方程近似解',
        tags: ['important'],
        content: Chapter8Content.section8_1
      },
      {
        id: 'math-modeling-8-2',
        title: '8.2 函数与数学模型',
        tags: ['high-school'],
        content: Chapter8Content.section8_2
      },
      {
        id: 'music-math-read',
        title: '阅读：G大调的正弦曲线',
        tags: ['extension'],
        content: Chapter8Content.reading_g_major
      }
    ]
  },

  // --- 第九章 平面向量 ---
  {
    id: 'plane-vectors-chapter',
    category: '第九章 平面向量',
    title: '平面向量',
    description: '连接代数与几何的桥梁。本章将引入既有大小又有方向的量，建立向量运算体系，并探索其在物理和几何中的应用。',
    icon: <TrendingUp className="w-6 h-6" />,
    subtopics: [
      {
        id: 'vector-concepts-9-1',
        title: '9.1 向量概念',
        content: Chapter9Content.section9_1
      },
      {
        id: 'vector-ops-9-2',
        title: '9.2 向量运算',
        tags: ['important'],
        content: Chapter9Content.section9_2
      },
      {
        id: 'vector-thm-coords-9-3',
        title: '9.3 向量基本定理及坐标表示',
        tags: ['important', 'high-school'],
        content: Chapter9Content.section9_3
      },
      {
        id: 'vector-apps-9-4',
        title: '9.4 向量应用',
        tags: ['high-school'],
        content: Chapter9Content.section9_4
      },
      {
        id: 'space-vector-inquiry',
        title: '探究：由平面向量到空间向量的推广',
        tags: ['extension'],
        content: Chapter9Content.inquiry_space
      },
      {
        id: 'vector-mechanics-read',
        title: '阅读：向量源自力学',
        tags: ['extension'],
        content: Chapter9Content.reading_mechanics
      }
    ]
  },

  // --- 第十章 三角恒等变换 ---
  {
    id: 'trig-identities-chapter',
    category: '第十章 三角恒等变换',
    title: '三角恒等变换',
    description: '处理三角函数问题的核心工具。本章将推导两角和与差、二倍角的公式，并探索简单的恒等变换方法。',
    icon: <Blend className="w-6 h-6" />,
    subtopics: [
      {
        id: 'trig-sum-diff-10-1',
        title: '10.1 两角和与差的三角函数',
        tags: ['important', 'high-school'],
        content: Chapter10Content.section10_1
      },
      {
        id: 'double-angle-10-2',
        title: '10.2 二倍角的三角函数',
        tags: ['important'],
        content: Chapter10Content.section10_2
      },
      {
        id: 'trig-identities-10-3',
        title: '10.3 几个三角恒等式',
        tags: ['hard'],
        content: Chapter10Content.section10_3
      },
      {
        id: 'superposition-inquiry',
        title: '探究：正弦函数与余弦函数的叠加',
        tags: ['extension', 'important'],
        content: Chapter10Content.inquiry_superposition
      },
      {
        id: 'ptolemy-read',
        title: '阅读：弦表与托勒密定理',
        tags: ['extension'],
        content: Chapter10Content.reading_ptolemy
      }
    ]
  },

  // --- 第十一章 解三角形 ---
  {
    id: 'solving-triangles-chapter',
    category: '第十一章 解三角形',
    title: '解三角形',
    description: '几何计算的集大成者。本章将利用正弦定理和余弦定理解决三角形中的边角度量问题及其在实际中的应用。',
    icon: <Ruler className="w-6 h-6" />,
    subtopics: [
      {
        id: 'law-of-cosines-11-1',
        title: '11.1 余弦定理',
        tags: ['important'],
        content: Chapter11Content.section11_1
      },
      {
        id: 'law-of-sines-11-2',
        title: '11.2 正弦定理',
        tags: ['important'],
        content: Chapter11Content.section11_2
      },
      {
        id: 'triangle-apps-11-3',
        title: '11.3 余弦定理、正弦定理的应用',
        tags: ['high-school'],
        content: Chapter11Content.section11_3
      },
      {
        id: 'heron-qin-inquiry',
        title: '探究：海伦-秦九韶公式',
        tags: ['extension'],
        content: Chapter11Content.inquiry_heron
      }
    ]
  },

  // --- 第十二章 复数 ---
  {
    id: 'complex-numbers-chapter',
    category: '第十二章 复数',
    title: '复数',
    description: '数系的又一次扩充。本章将引入虚数单位，建立复数体系，并探讨复数的代数运算与几何意义。',
    icon: <Fingerprint className="w-6 h-6" />,
    subtopics: [
      {
        id: 'complex-concepts-12-1',
        title: '12.1 复数的概念',
        tags: ['important'],
        content: Chapter12Content.section12_1
      },
      {
        id: 'complex-ops-12-2',
        title: '12.2 复数的运算',
        tags: ['important', 'high-school'],
        content: Chapter12Content.section12_2
      },
      {
        id: 'complex-geometry-12-3',
        title: '12.3 复数的几何意义',
        tags: ['important'],
        content: Chapter12Content.section12_3
      },
      {
        id: 'complex-trig-form-12-4',
        title: '12.4 复数的三角形式',
        tags: ['hard'],
        content: Chapter12Content.section12_4
      },
      {
        id: 'complex-roots-inquiry',
        title: '探究：复数的开方',
        tags: ['extension'],
        content: Chapter12Content.inquiry_roots
      },
      {
        id: 'complex-history-read',
        title: '阅读：复数系是怎样建立的？',
        tags: ['extension'],
        content: Chapter12Content.reading_history
      }
    ]
  },

  // --- 第十三章 立体几何初步 ---
  {
    id: 'solid-geometry-chapter',
    category: '第十三章 立体几何初步',
    title: '立体几何初步',
    description: '培养空间想象力。本章将从认识基本立体图形入手，研究点、线、面之间的位置关系，并掌握简单几何体的表面积与体积计算。',
    icon: <Box className="w-6 h-6" />,
    subtopics: [
        {
            id: 'basic-solid-figs-13-1',
            title: '13.1 基本立体图形',
            tags: ['important'],
            content: Chapter13Content.section13_1
        },
        {
            id: 'positional-relations-13-2',
            title: '13.2 基本图形位置关系',
            tags: ['important', 'hard'],
            content: Chapter13Content.section13_2
        },
        {
            id: 'area-volume-13-3',
            title: '13.3 空间图形的表面积和体积',
            tags: ['high-school'],
            content: Chapter13Content.section13_3
        },
        {
            id: 'prismatoid-app',
            title: '应用：拟柱体体积公式',
            tags: ['extension'],
            content: Chapter13Content.prismatoid_app
        },
        {
            id: 'geo-history-read',
            title: '阅读：几何学的发展',
            tags: ['extension'],
            content: Chapter13Content.reading_geometry
        }
    ]
  },

  // --- 第十四章 统计 ---
  {
    id: 'statistics-chapter',
    category: '第十四章 统计',
    title: '统计',
    description: '数据分析的基础。本章将学习如何获取、整理和分析数据，并利用样本数据估计总体特征。',
    icon: <BarChart3 className="w-6 h-6" />,
    subtopics: [
        {
            id: 'data-acquisition-14-1',
            title: '14.1 获取数据的基本途径',
            content: Chapter14Content.section14_1
        },
        {
            id: 'sampling-14-2',
            title: '14.2 抽样',
            tags: ['important'],
            content: Chapter14Content.section14_2
        },
        {
            id: 'charts-14-3',
            title: '14.3 统计图表',
            content: Chapter14Content.section14_3
        },
        {
            id: 'estimation-14-4',
            title: '14.4 用样本估计总体',
            tags: ['important', 'high-school'],
            content: Chapter14Content.section14_3 // Reusing the same section as it contains charts + estimation
        },
        {
            id: 'electricity-app',
            title: '应用：阶梯电价的设计',
            tags: ['extension'],
            content: Chapter14Content.section14_app
        },
        {
            id: 'engel-read',
            title: '阅读：恩格尔系数',
            tags: ['extension'],
            content: Chapter14Content.reading_engel
        }
    ]
  },

  // --- 第十五章 概率 ---
  {
    id: 'probability-chapter',
    category: '第十五章 概率',
    title: '概率',
    description: '研究随机现象的数学模型。本章将引入样本空间和随机事件，学习古典概型及事件的独立性。',
    icon: <Dices className="w-6 h-6" />,
    subtopics: [
        {
            id: 'random-events-15-1',
            title: '15.1 随机事件和样本空间',
            content: Chapter15Content.section15_1
        },
        {
            id: 'classical-prob-15-2',
            title: '15.2 随机事件的概率',
            tags: ['important'],
            content: Chapter15Content.section15_2
        },
        {
            id: 'mutual-indep-15-3',
            title: '15.3 互斥事件和独立事件',
            tags: ['important', 'high-school'],
            content: Chapter15Content.section15_3
        },
        {
            id: 'fair-rules-inquiry',
            title: '探究：确定公平的规则',
            tags: ['extension'],
            content: Chapter15Content.inquiry_fair
        },
        {
            id: 'pascal-triangle-read',
            title: '阅读：杨辉三角与概率',
            tags: ['extension'],
            content: Chapter15Content.reading_pascal
        }
    ]
  }
];

// Helper: Get a plain text summary of the curriculum
export const getCurriculumSummary = (): string => {
    return MATH_TOPICS.map(topic => {
        const subs = topic.subtopics.map(sub => `  - ${sub.title}`).join('\n');
        return `章节: ${topic.title}\n描述: ${topic.description}\n内容:\n${subs}`;
    }).join('\n\n');
};
