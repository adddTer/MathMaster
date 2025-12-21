import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Dices, HelpCircle, Shuffle, Scale, BookOpen, Layers } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 ${className}`}>
    {children}
  </div>
);

const WarningCard = ({ title = "易错警示", children }: { title?: string, children?: React.ReactNode }) => (
  <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm mt-4">
    <div className="w-5 h-5 shrink-0 text-amber-600 mt-0.5">⚠️</div>
    <div>
      <span className="font-bold block mb-1 text-amber-700">{title}</span>
      <div className="text-amber-800/90 leading-relaxed">{children}</div>
    </div>
  </div>
);

export const Chapter15Content = {
  section15_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Dices className="w-5 h-5 text-blue-500" /> 1. 随机试验与样本空间
            </h4>
            <div className="space-y-4 text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 mb-2 block">随机试验 (E)</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                        <li>可以在相同条件下重复进行。</li>
                        <li>结果不止一个，且所有可能结果已知。</li>
                        <li>试验前无法确定是哪一个结果。</li>
                    </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-xl bg-white">
                        <span className="font-bold text-indigo-700 block mb-1">样本空间 (<MathFormula tex="\Omega" />)</span>
                        <p className="text-slate-600">随机试验中所有可能结果组成的集合。</p>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl bg-white">
                        <span className="font-bold text-indigo-700 block mb-1">样本点 (<MathFormula tex="\omega" />)</span>
                        <p className="text-slate-600">样本空间中的每一个元素。</p>
                    </div>
                </div>
                
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-center">
                    <div className="font-bold text-indigo-900 mb-2">示例：抛掷一枚骰子</div>
                    <div className="flex justify-center gap-4 items-center">
                        <div className="bg-white px-3 py-1 rounded shadow-sm border border-indigo-100"><MathFormula tex="\Omega = \{1, 2, 3, 4, 5, 6\}" /></div>
                        <div className="text-xs text-indigo-500">含有6个样本点</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 事件的关系与运算</h4>
            <p className="text-sm text-slate-600 mb-3">随机事件是样本空间 <MathFormula tex="\Omega" /> 的子集。事件的运算本质上是集合的运算。</p>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="p-3 border-b font-bold">名称</th>
                            <th className="p-3 border-b font-bold">符号</th>
                            <th className="p-3 border-b font-bold">含义</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-3 font-bold text-slate-600">包含</td>
                            <td className="p-3"><MathFormula tex="A \subseteq B" /></td>
                            <td className="p-3">事件A发生 <MathFormula tex="\Rightarrow" /> 事件B发生</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-slate-600">并事件 (和)</td>
                            <td className="p-3"><MathFormula tex="A \cup B" /></td>
                            <td className="p-3">A 与 B <span className="font-bold text-indigo-600">至少一个</span>发生</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-slate-600">交事件 (积)</td>
                            <td className="p-3"><MathFormula tex="A \cap B" /> (或 AB)</td>
                            <td className="p-3">A 与 B <span className="font-bold text-indigo-600">同时</span>发生</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-slate-600">互斥事件</td>
                            <td className="p-3"><MathFormula tex="A \cap B = \varnothing" /></td>
                            <td className="p-3">A 与 B <span className="font-bold text-red-600">不可能同时</span>发生</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-slate-600">对立事件</td>
                            <td className="p-3"><MathFormula tex="A \cup B = \Omega, A \cap B = \varnothing" /></td>
                            <td className="p-3">必有一个发生，且只有一个发生</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  ),
  section15_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-500" /> 1. 古典概型 (Classical Probability)
            </h4>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
                <span className="font-bold text-emerald-800 block mb-2">两个核心特征</span>
                <ul className="list-disc list-inside text-sm text-emerald-900 space-y-1">
                    <li><span className="font-bold">有限性：</span>样本空间的样本点只有有限个。</li>
                    <li><span className="font-bold">等可能性：</span>每个样本点发生的可能性相等。</li>
                </ul>
            </div>
            
            <FormulaCard className="bg-emerald-50/20 border-emerald-500">
                <div className="text-xs text-slate-500 mb-2">概率公式</div>
                <MathFormula tex="P(A) = \frac{n(A)}{n(\Omega)} = \frac{\text{事件A包含的样本点数}}{\text{样本空间的总样本点数}}" block className="text-xl font-bold text-emerald-700" />
            </FormulaCard>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 概率的基本性质</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-700">取值范围</span>
                    <MathFormula tex="0 \le P(A) \le 1" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-700">必然事件</span>
                    <MathFormula tex="P(\Omega) = 1" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-700">不可能事件</span>
                    <MathFormula tex="P(\varnothing) = 0" />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-blue-800">对立事件公式</span>
                        <MathFormula tex="P(\bar{A}) = 1 - P(A)" className="font-bold" />
                    </div>
                    <span className="text-[10px] text-blue-600">“正难则反”思想</span>
                </div>
            </div>
        </div>
    </div>
  ),
  section15_3: (
    <div className="space-y-6">
        {/* 互斥事件 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> 1. 互斥事件的加法公式
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                如果事件 A 和 B 互斥（即 <MathFormula tex="A \cap B = \varnothing" />），那么：
            </p>
            <FormulaCard className="bg-indigo-50/20 border-indigo-500">
                <MathFormula tex="P(A \cup B) = P(A) + P(B)" block className="text-2xl font-bold text-indigo-800" />
            </FormulaCard>
            <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded">
                推广：若 <MathFormula tex="A_1, A_2, \dots, A_n" /> 两两互斥，则 <MathFormula tex="P(\cup A_i) = \sum P(A_i)" />。
            </div>
        </div>

        {/* 独立事件 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Shuffle className="w-5 h-5 text-purple-500" /> 2. 相互独立事件
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                        如果事件 A 发生与否不影响事件 B 发生的概率，称 A 与 B 相互独立。
                    </p>
                    <FormulaCard className="my-0 bg-purple-50/20 border-purple-500">
                        <MathFormula tex="P(AB) = P(A)P(B)" block className="text-2xl font-bold text-purple-800" />
                    </FormulaCard>
                </div>
                <div className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                    <span className="font-bold text-slate-700 block mb-2">典型模型</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-2">
                        <li><span className="font-bold">抛硬币：</span>第一次正反不影响第二次。</li>
                        <li><span className="font-bold">射击：</span>甲是否射中不影响乙是否射中。</li>
                        <li><span className="font-bold">有放回摸球：</span>每次摸球的概率环境相同。</li>
                    </ul>
                </div>
            </div>
            
            <WarningCard title="辨析：互斥 vs 独立">
                <div className="grid grid-cols-2 gap-4 text-center mt-2 text-sm">
                    <div className="p-2 border-r border-amber-200">
                        <span className="block font-bold text-slate-800 mb-1">互斥</span>
                        <span className="text-xs text-slate-500">“不能同时发生”</span>
                        <div className="text-xs text-slate-400 font-mono mt-1">A∩B = Ø</div>
                    </div>
                    <div className="p-2">
                        <span className="block font-bold text-slate-800 mb-1">独立</span>
                        <span className="text-xs text-slate-500">“互不影响”</span>
                        <div className="text-xs text-slate-400 font-mono mt-1">P(AB) = P(A)P(B)</div>
                    </div>
                </div>
            </WarningCard>
        </div>
    </div>
  ),
  inquiry_fair: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" /> 探究：确定公平的规则
            </h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                生活中常通过“石头剪刀布”或“抛硬币”来决定先后顺序，这些规则为什么是公平的？
                <br/>
                核心在于：<span className="font-bold text-indigo-700">每个人获胜的概率是否相等</span>。
            </p>
            
            <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                <h5 className="font-bold text-slate-800 mb-2">案例：三门问题 (Monty Hall Problem)</h5>
                <p className="text-sm text-slate-600 mb-3">
                    参赛者面前有三扇门，其中一扇后面有车，另外两扇是山羊。参赛者选了一扇门（比如1号）。
                    主持人（知道门后情况）打开了剩下两扇门中的一扇有山羊的门（比如3号）。
                    问：<span className="font-bold text-indigo-600">参赛者应该换2号门，还是坚持1号门？</span>
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-slate-50 text-center rounded-lg border border-slate-100">
                        <span className="block font-bold text-slate-700 mb-1">不换门</span>
                        <span className="text-sm">中奖概率：<MathFormula tex="\frac{1}{3}" /></span>
                    </div>
                    <div className="p-3 bg-indigo-50 text-center rounded-lg border border-indigo-100 ring-1 ring-indigo-200">
                        <span className="block font-bold text-indigo-800 mb-1">换门</span>
                        <span className="text-sm font-bold text-indigo-600">中奖概率：<MathFormula tex="\frac{2}{3}" /></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  reading_pascal: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen className="w-48 h-48" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 text-xl">阅读：杨辉三角与概率</h4>
            
            <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed relative z-10">
                <p>
                    我国南宋数学家杨辉在《详解九章算法》中记载的“杨辉三角”（西方称帕斯卡三角），不仅是二项式系数表，更隐含了古典概型的规律。
                </p>
                <div className="flex justify-center my-6 font-mono text-sm leading-6">
                    <div className="text-center">
                        <div>1</div>
                        <div>1 &nbsp; 1</div>
                        <div>1 &nbsp; 2 &nbsp; 1</div>
                        <div>1 &nbsp; 3 &nbsp; 3 &nbsp; 1</div>
                        <div>1 &nbsp; 4 &nbsp; 6 &nbsp; 4 &nbsp; 1</div>
                    </div>
                </div>
                <p>
                    <span className="font-bold text-slate-800">高尔顿板实验：</span>
                    小球从顶部滚落，碰到钉子向左或向右的概率均为 1/2。小球落入底部各槽的分布情况，
                    恰好对应杨辉三角的数值比例（二项分布）。
                    <br/>
                    例如第 4 行 <MathFormula tex="1:4:6:4:1" />，总数 16。
                    中间槽落入概率为 <MathFormula tex="\frac{6}{16} = \frac{3}{8}" />，是最可能的结果。
                </p>
            </div>
        </div>
    </div>
  )
};