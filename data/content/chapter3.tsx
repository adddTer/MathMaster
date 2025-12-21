import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Scale, ArrowDown, Calculator, Check, Sparkles } from 'lucide-react';

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

export const Chapter3Content = {
  section3_1: (
      <div className="space-y-6">
        {/* 核心判断依据 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-500" /> 1. 比较大小的方法
            </h4>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 mb-2 block text-sm">作差法 (最常用)</span>
                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1 mb-3">
                        <li>作差：<MathFormula tex="A - B" /></li>
                        <li>变形：配方、因式分解、通分</li>
                        <li>定号：判断差与 0 的关系</li>
                    </ol>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-700 font-bold"><MathFormula tex=">0 \Rightarrow >" /></div>
                        <div className="p-2 bg-white rounded border border-slate-200 text-slate-700 font-bold"><MathFormula tex="=0 \Rightarrow =" /></div>
                        <div className="p-2 bg-white rounded border border-red-200 text-red-700 font-bold"><MathFormula tex="<0 \Rightarrow <" /></div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <span className="font-bold text-slate-700 mb-2 block text-sm">作商法</span>
                     <p className="text-xs text-slate-500 mb-2">适用于幂指数、正数比较。</p>
                     <div className="text-xs text-slate-600">
                         若 <MathFormula tex="B > 0" />，则 <MathFormula tex="\frac{A}{B} > 1 \iff A > B" />
                     </div>
                </div>
            </div>
        </div>

        {/* 主要性质 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">2. 不等式的主要性质</h4>
            <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded border-l-4 border-transparent hover:border-slate-300 transition-all">
                    <span className="text-slate-600 font-medium">对称性</span>
                    <MathFormula tex="a > b \iff b < a" />
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded border-l-4 border-transparent hover:border-slate-300 transition-all">
                    <span className="text-slate-600 font-medium">传递性</span>
                    <MathFormula tex="a > b, b > c \Rightarrow a > c" />
                </div>
                <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded border-l-4 border-transparent hover:border-slate-300 transition-all">
                    <span className="text-slate-600 font-medium">可加性</span>
                    <MathFormula tex="a > b \Rightarrow a + c > b + c" />
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-800 block mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4" /> 可乘性 (符号是关键!)
                    </span>
                    <div className="space-y-2 pl-2 border-l-2 border-amber-200 ml-1">
                        <div className="flex justify-between items-center">
                            <span className="text-amber-900/80 text-xs">同乘正数</span>
                            <MathFormula tex="a > b, c > 0 \Rightarrow ac > bc" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-amber-900/80 text-xs font-bold">同乘负数 (变号)</span>
                            <MathFormula tex="a > b, c < 0 \Rightarrow ac < bc" className="font-bold text-red-600" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                         <span className="text-xs text-slate-500 block mb-1">同向可加</span>
                         <MathFormula tex="\begin{cases} a>b \\ c>d \end{cases} \Rightarrow a+c > b+d" />
                     </div>
                     <div className="p-3 bg-slate-50 rounded border border-slate-100 text-center">
                         <span className="text-xs text-slate-500 block mb-1">同向同正可乘</span>
                         <MathFormula tex="\begin{cases} a>b>0 \\ c>d>0 \end{cases} \Rightarrow ac > bd" />
                     </div>
                </div>
            </div>
        </div>
      </div>
  ),
  section3_2: (
      <div className="space-y-6">
        {/* 重要不等式 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Calculator className="w-32 h-32" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">基本不等式 (AM-GM)</h4>
            
            <FormulaCard className="border-indigo-500 bg-indigo-50/20">
                <div className="text-sm text-slate-500 mb-2 font-mono">For a, b &gt; 0</div>
                <MathFormula tex="\sqrt{ab} \le \frac{a+b}{2}" block className="text-3xl font-bold text-indigo-700" />
                <div className="text-xs text-slate-400 mt-2">
                    当且仅当 <MathFormula tex="a=b" /> 时取等号
                </div>
            </FormulaCard>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="text-xs font-bold text-slate-500 block mb-1">变式1: 积定和最小</span>
                    <MathFormula tex="a+b \ge 2\sqrt{ab}" className="font-medium text-slate-800" />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <span className="text-xs font-bold text-slate-500 block mb-1">变式2: 和定积最大</span>
                    <MathFormula tex="ab \le (\frac{a+b}{2})^2" className="font-medium text-slate-800" />
                </div>
            </div>
        </div>

        {/* 应用口诀 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" /> 最值求解三要素
                </h4>
                <div className="flex justify-between items-center gap-2 text-sm bg-slate-50 p-4 rounded-xl mb-4">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-1">1</div>
                        <span className="font-bold text-slate-700">一正</span>
                        <span className="text-[10px] text-slate-500">各项为正</span>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-300 -rotate-90" />
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mb-1">2</div>
                        <span className="font-bold text-slate-700">二定</span>
                        <span className="text-[10px] text-slate-500">积/和为定值</span>
                    </div>
                    <ArrowDown className="w-4 h-4 text-slate-300 -rotate-90" />
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center mb-1">3</div>
                        <span className="font-bold text-slate-700">三相等</span>
                        <span className="text-[10px] text-slate-500">等号能成立</span>
                    </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <span className="font-bold text-amber-800 text-sm mb-2 block">常用技巧："1" 的代换</span>
                    <p className="text-xs text-amber-900/80 mb-2">
                        已知 <MathFormula tex="ax+by=1" />，求 <MathFormula tex="\frac{m}{x} + \frac{n}{y}" /> 的最小值。
                    </p>
                    <div className="text-xs bg-white p-2 rounded border border-amber-200 text-slate-600">
                        <MathFormula tex="\frac{m}{x} + \frac{n}{y} = (\frac{m}{x} + \frac{n}{y}) \cdot 1 = (\frac{m}{x} + \frac{n}{y})(ax+by)" />
                        <br/>展开后利用均值不等式求解。
                    </div>
                </div>
        </div>

        {/* 拓展内容：合并显示 */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm mt-4">
            <h4 className="font-bold text-indigo-900 mb-4 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> 知识拓展
            </h4>
            
            <div className="mb-6">
                <div className="text-xs font-bold text-indigo-500 uppercase mb-2">平均数链</div>
                <div className="overflow-x-auto py-2 px-1 bg-white rounded-lg border border-indigo-50 shadow-sm">
                    <MathFormula tex="\frac{2}{\frac{1}{a}+\frac{1}{b}} \le \sqrt{ab} \le \frac{a+b}{2} \le \sqrt{\frac{a^2+b^2}{2}}" block />
                </div>
                <div className="grid grid-cols-4 text-center text-[10px] text-slate-500 mt-2 gap-1">
                    <span>调和平均</span>
                    <span>几何平均</span>
                    <span>算术平均</span>
                    <span>平方平均</span>
                </div>
            </div>

            <div>
                <div className="text-xs font-bold text-indigo-500 uppercase mb-2">三元均值不等式</div>
                <div className="bg-white p-3 rounded-lg border border-indigo-50 shadow-sm text-center">
                    <MathFormula tex="\frac{a+b+c}{3} \ge \sqrt[3]{abc}" block className="text-lg" />
                    <div className="text-[10px] text-slate-400 mt-2">当且仅当 <MathFormula tex="a=b=c" /> 时取等号</div>
                </div>
            </div>
        </div>
      </div>
  ),
  section3_3: (
      <div className="space-y-6">
         <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
             <p className="text-sm text-slate-600 leading-relaxed">
                 <span className="font-bold text-primary-600">“三个二次”</span>（二次函数、二次方程、二次不等式）是高中数学的重要纽带。
                 <br/>
                 核心在于<span className="font-bold text-slate-800">二次函数的图像</span>与<span className="font-bold text-slate-800">判别式 <MathFormula tex="\Delta" /></span>。
             </p>
         </div>

         {/* 核心表格 */}
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left border-collapse min-w-[500px]">
                     <thead className="bg-slate-50 text-slate-700">
                         <tr>
                             <th className="p-4 border-b border-slate-200 text-xs w-1/4">
                                 <div className="font-bold">判别式</div>
                                 <div className="text-[10px] text-slate-400 font-mono"><MathFormula tex="\Delta = b^2-4ac" /> (a&gt;0)</div>
                             </th>
                             <th className="p-4 border-b border-slate-200 text-center text-emerald-600 font-bold bg-emerald-50/30 w-1/4"><MathFormula tex="\Delta > 0" /></th>
                             <th className="p-4 border-b border-slate-200 text-center text-blue-600 font-bold bg-blue-50/30 w-1/4"><MathFormula tex="\Delta = 0" /></th>
                             <th className="p-4 border-b border-slate-200 text-center text-red-600 font-bold bg-red-50/30 w-1/4"><MathFormula tex="\Delta < 0" /></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         <tr>
                             <td className="p-4 font-bold text-slate-600 bg-slate-50/30 text-xs">二次函数图像 <MathFormula tex="y=ax^2+bx+c" /></td>
                             <td className="p-4 text-center">
                                 <div className="text-[10px] mb-1 text-slate-500">两个交点</div>
                                 {/* Simple SVG illustration could go here, text for now */}
                                 <div className="text-xs font-mono">(x1, 0), (x2, 0)</div>
                             </td>
                             <td className="p-4 text-center">
                                 <div className="text-[10px] mb-1 text-slate-500">一个切点</div>
                                 <div className="text-xs font-mono">切于 x轴</div>
                             </td>
                             <td className="p-4 text-center">
                                 <div className="text-[10px] mb-1 text-slate-500">无交点</div>
                                 <div className="text-xs font-mono">悬浮 x轴上方</div>
                             </td>
                         </tr>
                         <tr>
                             <td className="p-4 font-bold text-slate-600 bg-slate-50/30 text-xs">一元二次方程 <MathFormula tex="=0" /> 的根</td>
                             <td className="p-4 text-center text-xs">两个不相等实根 <MathFormula tex="x_1, x_2" /></td>
                             <td className="p-4 text-center text-xs">两个相等实根 <MathFormula tex="x_1=x_2" /></td>
                             <td className="p-4 text-center text-xs text-slate-400">无实数根</td>
                         </tr>
                         <tr>
                             <td className="p-4 font-bold text-slate-600 bg-slate-50/30 text-xs">不等式 <MathFormula tex=">0" /> 的解集</td>
                             <td className="p-4 text-center text-xs text-emerald-700 font-medium">
                                 <MathFormula tex="\{x|x<x_1 \lor x>x_2\}" />
                                 <div className="text-[10px] mt-1 opacity-70">两根之外</div>
                             </td>
                             <td className="p-4 text-center text-xs text-blue-700 font-medium">
                                 <MathFormula tex="\{x|x \ne -\frac{b}{2a}\}" />
                             </td>
                             <td className="p-4 text-center text-xs text-red-700 font-medium">
                                 <MathFormula tex="\mathbb{R}" /> (全体实数)
                             </td>
                         </tr>
                         <tr>
                             <td className="p-4 font-bold text-slate-600 bg-slate-50/30 text-xs">不等式 <MathFormula tex="<0" /> 的解集</td>
                             <td className="p-4 text-center text-xs text-emerald-700 font-medium">
                                 <MathFormula tex="\{x|x_1 < x < x_2\}" />
                                 <div className="text-[10px] mt-1 opacity-70">两根之间</div>
                             </td>
                             <td className="p-4 text-center text-xs text-blue-700 font-medium"><MathFormula tex="\varnothing" /></td>
                             <td className="p-4 text-center text-xs text-red-700 font-medium"><MathFormula tex="\varnothing" /></td>
                         </tr>
                     </tbody>
                 </table>
             </div>
         </div>
         
         <WarningCard title="解一元二次不等式标准步骤">
             <ol className="list-decimal list-inside text-sm mt-2 space-y-2 text-slate-700">
                 <li><span className="font-bold">二次项系数化正：</span>若 a &lt; 0，先两边同乘 -1，<span className="text-red-600 font-bold">不等号方向改变</span>。</li>
                 <li><span className="font-bold">算判别式：</span>计算 <MathFormula tex="\Delta" />，判断根的情况。</li>
                 <li><span className="font-bold">求根：</span>若 <MathFormula tex="\Delta \ge 0" />，求出方程的根。</li>
                 <li><span className="font-bold">写解集：</span>结合函数图像写出范围。
                     <div className="flex gap-4 mt-1 text-xs text-slate-500 pl-4">
                         <span>• 大于 0 取两边</span>
                         <span>• 小于 0 取中间</span>
                     </div>
                 </li>
             </ol>
         </WarningCard>
      </div>
  )
};