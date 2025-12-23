
import React from 'react';
import { Divide, FunctionSquare, Scaling, Radical, Sigma, Triangle, Layers, Binary, Scale, Calculator, TrendingUp, Activity, Waves, LineChart, Microscope, Blend, Ruler, Fingerprint, Box, Shapes, BarChart3, Dices, Move } from 'lucide-react';
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
        id: 'set-concepts',
        title: '1.1 集合的概念',
        content: Chapter1Content.section1_1
      },
      {
        id: 'set-relations',
        title: '1.2 集合间的基本关系',
        content: Chapter1Content.section1_2
      },
      {
        id: 'set-operations',
        title: '1.3 集合的基本运算',
        tags: ['important'],
        content: Chapter1Content.section1_3
      },
      {
        id: 'sets-extension',
        title: '拓展：集合的运算律',
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
    description: '数学推理的语言。我们将学习命题、充分条件与必要条件、全称量词与存在量词。',
    icon: <Binary className="w-6 h-6" />,
    subtopics: [
      {
        id: 'propositions',
        title: '2.1 命题',
        content: Chapter2Content.section2_1
      },
      {
        id: 'conditions',
        title: '2.2 充分条件与必要条件',
        tags: ['hard', 'important'],
        content: Chapter2Content.section2_2
      },
      {
        id: 'quantifiers',
        title: '2.3 全称量词与存在量词',
        content: Chapter2Content.section2_3
      }
    ]
  },

  // --- 第三章 不等式 ---
  {
    id: 'inequalities-chapter',
    category: '第三章 不等式',
    title: '不等式',
    description: '研究数量间的不等关系。重点掌握不等式的性质、基本不等式以及一元二次不等式的解法。',
    icon: <Scale className="w-6 h-6" />,
    subtopics: [
      {
        id: 'ineq-properties',
        title: '3.1 不等式的性质',
        content: Chapter3Content.section3_1
      },
      {
        id: 'basic-inequality',
        title: '3.2 基本不等式',
        tags: ['important', 'hard'],
        content: Chapter3Content.section3_2
      },
      {
        id: 'quadratic-inequalities',
        title: '3.3 一元二次不等式',
        tags: ['important'],
        content: Chapter3Content.section3_3
      }
    ]
  },

  // --- 第四章 指数函数与对数函数 ---
  {
    id: 'exp-log-chapter',
    category: '第四章 指数函数与对数函数',
    title: '指数与对数',
    description: '拓展幂的运算，引入对数概念。这是学习后续基本初等函数的基础。',
    icon: <Calculator className="w-6 h-6" />,
    subtopics: [
      {
        id: 'exponents',
        title: '4.1 指数',
        content: Chapter4Content.section4_1
      },
      {
        id: 'logarithms',
        title: '4.2 对数',
        tags: ['important', 'hard'],
        content: Chapter4Content.section4_2
      }
    ]
  },

  // --- 第五章 函数的概念与性质 ---
  {
    id: 'functions-chapter',
    category: '第五章 函数的概念与性质',
    title: '函数的概念与性质',
    description: '高中数学的核心。深入理解函数的定义、定义域、值域，以及单调性、奇偶性等重要性质。',
    icon: <Activity className="w-6 h-6" />,
    subtopics: [
      {
        id: 'function-concept',
        title: '5.1 函数的概念',
        tags: ['important'],
        content: Chapter5Content.section5_1
      },
      {
        id: 'function-representation',
        title: '5.2 函数的表示法',
        content: Chapter5Content.section5_2
      },
      {
        id: 'monotonicity',
        title: '5.3 函数的单调性',
        tags: ['important', 'hard'],
        content: Chapter5Content.section5_3
      },
      {
        id: 'parity',
        title: '5.4 函数的奇偶性',
        tags: ['important'],
        content: Chapter5Content.section5_4
      },
      {
        id: 'func-extension',
        title: '拓展：函数性质的综合应用',
        tags: ['extension', 'hard'],
        content: Chapter5Content.section5_extension
      }
    ]
  },

  // --- 第六章 幂函数、指数函数和对数函数 ---
  {
    id: 'elementary-functions',
    category: '第六章 幂函数、指数函数和对数函数',
    title: '基本初等函数',
    description: '研究幂函数、指数函数和对数函数的图像与性质，掌握它们在描述增长与衰减中的应用。',
    icon: <TrendingUp className="w-6 h-6" />,
    subtopics: [
      {
        id: 'power-function',
        title: '6.1 幂函数',
        content: Chapter6Content.section6_1
      },
      {
        id: 'exp-function',
        title: '6.2 指数函数',
        tags: ['important'],
        content: Chapter6Content.section6_2
      },
      {
        id: 'log-function',
        title: '6.3 对数函数',
        tags: ['important'],
        content: Chapter6Content.section6_3
      }
    ]
  },

  // --- 第七章 三角函数 ---
  {
    id: 'trig-functions',
    category: '第七章 三角函数',
    title: '三角函数',
    description: '刻画周期现象的数学模型。从单位圆定义出发，研究正弦、余弦、正切函数的性质与图像。',
    icon: <Waves className="w-6 h-6" />,
    subtopics: [
      {
        id: 'arbitrary-angle',
        title: '7.1 任意角和弧度制',
        content: Chapter7Content.section7_1
      },
      {
        id: 'trig-concepts',
        title: '7.2 任意角的三角函数',
        tags: ['important'],
        content: Chapter7Content.section7_2
      },
      {
        id: 'trig-graphs',
        title: '7.3 三角函数的图像与性质',
        tags: ['important', 'hard'],
        content: Chapter7Content.section7_3
      },
      {
        id: 'trig-models',
        title: '7.4 三角函数应用',
        content: Chapter7Content.section7_4
      }
    ]
  },

  // --- 第八章 函数的应用 ---
  {
    id: 'func-applications',
    category: '第八章 函数的应用',
    title: '函数的应用',
    description: '函数与方程的联系（零点问题），以及利用函数模型解决实际问题。',
    icon: <LineChart className="w-6 h-6" />,
    subtopics: [
      {
        id: 'zero-points',
        title: '8.1 函数的零点与方程的解',
        tags: ['important', 'hard'],
        content: Chapter8Content.section8_1
      },
      {
        id: 'modeling',
        title: '8.2 函数模型及其应用',
        content: Chapter8Content.section8_2
      },
      {
        id: 'math-music',
        title: '阅读：数学与音乐',
        tags: ['extension'],
        content: Chapter8Content.reading_g_major
      }
    ]
  },

  // --- 第九章 平面向量 ---
  {
    id: 'vectors',
    category: '第九章 平面向量',
    title: '平面向量',
    description: '沟通代数与几何的桥梁。掌握向量的线性运算、数量积及其坐标表示。',
    icon: <Move className="w-6 h-6" />, // Changed icon to 'Move' which represents vector-like movement
    subtopics: [
      {
        id: 'vector-concepts',
        title: '9.1 平面向量的概念',
        content: Chapter9Content.section9_1
      },
      {
        id: 'vector-linear-ops',
        title: '9.2 向量的线性运算',
        content: Chapter9Content.section9_2
      },
      {
        id: 'vector-fundamental',
        title: '9.3 平面向量基本定理及坐标表示',
        tags: ['important'],
        content: Chapter9Content.section9_3
      },
      {
        id: 'vector-apps',
        title: '9.4 向量的应用',
        content: Chapter9Content.section9_4
      },
      {
        id: 'vector-extension-space',
        title: '探究：由平面向量到空间向量',
        tags: ['extension'],
        content: Chapter9Content.inquiry_space
      },
      {
        id: 'vector-reading-history',
        title: '阅读：向量源自力学',
        tags: ['extension'],
        content: Chapter9Content.reading_mechanics
      }
    ]
  },

  // --- 第十章 三角恒等变换 ---
  {
    id: 'trig-identities',
    category: '第十章 三角恒等变换',
    title: '三角恒等变换',
    description: '利用两角和与差、二倍角公式进行三角函数的化简与证明。',
    icon: <Blend className="w-6 h-6" />,
    subtopics: [
      {
        id: 'sum-diff-formulas',
        title: '10.1 两角和与差的三角函数',
        tags: ['important'],
        content: Chapter10Content.section10_1
      },
      {
        id: 'double-angle',
        title: '10.2 二倍角的三角函数',
        tags: ['important'],
        content: Chapter10Content.section10_2
      },
      {
        id: 'simple-transform',
        title: '10.3 几个三角恒等变换',
        tags: ['hard'],
        content: Chapter10Content.section10_3
      },
      {
        id: 'auxiliary-angle',
        title: '探究：辅助角公式',
        tags: ['extension', 'tool'],
        content: Chapter10Content.inquiry_superposition
      },
      {
        id: 'ptolemy-theorem',
        title: '阅读：弦表与托勒密定理',
        tags: ['extension'],
        content: Chapter10Content.reading_ptolemy
      }
    ]
  },

  // --- 第十一章 解三角形 ---
  {
    id: 'solving-triangles',
    category: '第十一章 解三角形',
    title: '解三角形',
    description: '正弦定理与余弦定理的综合应用，解决几何测量等实际问题。',
    icon: <Ruler className="w-6 h-6" />,
    subtopics: [
      {
        id: 'cosine-law',
        title: '11.1 余弦定理',
        tags: ['important'],
        content: Chapter11Content.section11_1
      },
      {
        id: 'sine-law',
        title: '11.2 正弦定理',
        tags: ['important'],
        content: Chapter11Content.section11_2
      },
      {
        id: 'triangle-apps',
        title: '11.3 解三角形应用举例',
        content: Chapter11Content.section11_3
      },
      {
        id: 'heron-formula',
        title: '探究：海伦公式与三斜求积术',
        tags: ['extension'],
        content: Chapter11Content.inquiry_heron
      }
    ]
  },

  // --- 第十二章 复数 ---
  {
    id: 'complex-numbers',
    category: '第十二章 复数',
    title: '复数',
    description: '数系的扩充。引入虚数单位 i，学习复数的代数形式、几何意义及四则运算。',
    icon: <Fingerprint className="w-6 h-6" />,
    subtopics: [
      {
        id: 'complex-concepts',
        title: '12.1 复数的概念',
        content: Chapter12Content.section12_1
      },
      {
        id: 'complex-ops',
        title: '12.2 复数的四则运算',
        tags: ['important'],
        content: Chapter12Content.section12_2
      },
      {
        id: 'complex-geometry',
        title: '12.3 复数的几何意义',
        content: Chapter12Content.section12_3
      },
      {
        id: 'complex-trig-form',
        title: '12.4 复数的三角形式 (选学)',
        tags: ['extension', 'hard'],
        content: Chapter12Content.section12_4
      },
      {
        id: 'complex-roots',
        title: '探究：复数的开方与单位根',
        tags: ['extension'],
        content: Chapter12Content.inquiry_roots
      },
      {
        id: 'complex-history',
        title: '阅读：复数系是怎样建立的？',
        tags: ['extension'],
        content: Chapter12Content.reading_history
      }
    ]
  },

  // --- 第十三章 立体几何初步 ---
  {
    id: 'solid-geometry',
    category: '第十三章 立体几何初步',
    title: '立体几何',
    description: '培养空间想象力。认识简单几何体，掌握空间点、线、面的位置关系。',
    icon: <Box className="w-6 h-6" />,
    subtopics: [
      {
        id: 'solids-structure',
        title: '13.1 简单几何体',
        content: Chapter13Content.section13_1
      },
      {
        id: 'space-relations',
        title: '13.2 空间基本关系',
        tags: ['important'],
        content: Chapter13Content.section13_2
      },
      {
        id: 'surface-volume',
        title: '13.3 表面积与体积',
        content: Chapter13Content.section13_3
      },
      {
        id: 'prismatoid',
        title: '应用：拟柱体体积公式',
        tags: ['extension', 'tool'],
        content: Chapter13Content.prismatoid_app
      },
      {
        id: 'geometry-history',
        title: '阅读：几何学的发展',
        tags: ['extension'],
        content: Chapter13Content.reading_geometry
      }
    ]
  },

  // --- 第十四章 统计 ---
  {
    id: 'statistics',
    category: '第十四章 统计',
    title: '统计',
    description: '数据处理的艺术。学习抽样方法，用样本估计总体的分布和特征。',
    icon: <BarChart3 className="w-6 h-6" />,
    subtopics: [
      {
        id: 'stats-concepts',
        title: '14.1 获取数据的途径',
        content: Chapter14Content.section14_1
      },
      {
        id: 'sampling',
        title: '14.2 抽样',
        tags: ['important'],
        content: Chapter14Content.section14_2
      },
      {
        id: 'estimation',
        title: '14.3 统计图表与特征数',
        tags: ['important'],
        content: Chapter14Content.section14_3
      },
      {
        id: 'stats-app',
        title: '应用：阶梯电价的设计',
        content: Chapter14Content.section14_app
      },
      {
        id: 'engel-coeff',
        title: '阅读：恩格尔系数',
        tags: ['extension'],
        content: Chapter14Content.reading_engel
      }
    ]
  },

  // --- 第十五章 概率 ---
  {
    id: 'probability',
    category: '第十五章 概率',
    title: '概率',
    description: '研究随机现象的规律。掌握随机事件、古典概型以及互斥事件与独立事件的概率计算。',
    icon: <Dices className="w-6 h-6" />,
    subtopics: [
      {
        id: 'random-events',
        title: '15.1 随机事件与样本空间',
        content: Chapter15Content.section15_1
      },
      {
        id: 'classical-prob',
        title: '15.2 古典概型',
        tags: ['important'],
        content: Chapter15Content.section15_2
      },
      {
        id: 'event-operations',
        title: '15.3 互斥事件与独立事件',
        tags: ['important', 'hard'],
        content: Chapter15Content.section15_3
      },
      {
        id: 'fair-rules',
        title: '探究：确定公平的规则',
        tags: ['extension'],
        content: Chapter15Content.inquiry_fair
      },
      {
        id: 'pascal-triangle',
        title: '阅读：杨辉三角与概率',
        tags: ['extension'],
        content: Chapter15Content.reading_pascal
      }
    ]
  }
];

export const getCurriculumSummary = (): string => {
    return MATH_TOPICS.map(topic => {
        const subs = topic.subtopics.map(sub => `  - ${sub.title}`).join('\n');
        return `模块: ${topic.title}\n描述: ${topic.description}\n内容:\n${subs}`;
    }).join('\n\n');
};
