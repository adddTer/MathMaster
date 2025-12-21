import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { Zap, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

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

export const Chapter6Content = {
  section6_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> 1. 幂函数的定义
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                一般地，函数 <MathFormula tex="y = x^\alpha" /> 叫做幂函数，其中 <MathFormula tex="x" /> 是自变量，<MathFormula tex="\alpha" /> 是常数。
            </p>
            <WarningCard title="形式定义">
                <p className="text-xs">
                    系数必须为 1，底数必须单纯是 <MathFormula tex="x" />。<br/>
                    例如：<MathFormula tex="y=2x^2" /> 不是标准幂函数，而是幂函数型函数。
                </p>
            </WarningCard>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 text-lg">2. 五类常见幂函数图像</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                 {/* x */}
                 <div className="p-3 bg-slate-50 border rounded-xl text-center">
                     <FunctionPlot type="linear" color="blue" />
                     <div className="text-xs text-slate-500 mt-2">奇函数 | 增</div>
                 </div>
                 {/* x^2 */}
                 <div className="p-3 bg-slate-50 border rounded-xl text-center">
                     <FunctionPlot type="quadratic" color="purple" />
                     <div className="text-xs text-slate-500 mt-2">偶函数 | 抛物线</div>
                 </div>
                 {/* x^3 */}
                 <div className="p-3 bg-slate-50 border rounded-xl text-center">
                     <FunctionPlot type="cubic" color="orange" />
                     <div className="text-xs text-slate-500 mt-2">奇函数 | 增</div>
                 </div>
                 {/* x^1/2 */}
                 <div className="p-3 bg-slate-50 border rounded-xl text-center">
                     <FunctionPlot type="sqrt" color="emerald" />
                     <div className="text-xs text-slate-500 mt-2">定义域 [0, +∞)</div>
                 </div>
                 {/* x^-1 */}
                 <div className="p-3 bg-slate-50 border rounded-xl text-center">
                     <FunctionPlot type="inverse" color="red" />
                     <div className="text-xs text-slate-500 mt-2">奇函数 | 双曲线</div>
                 </div>
            </div>
            
            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-900 block mb-2 text-sm">第一象限图像性质 (共性)</span>
                <ul className="list-disc list-inside text-xs text-indigo-800 space-y-1">
                    <li>所有幂函数图像都通过点 <MathFormula tex="(1,1)" />。</li>
                    <li><MathFormula tex="\alpha > 0" /> 时，图像过原点 <MathFormula tex="(0,0)" />，在第一象限单调递增。</li>
                    <li><MathFormula tex="\alpha < 0" /> 时，图像不过原点，在第一象限单调递减，坐标轴为渐近线。</li>
                </ul>
            </div>
        </div>
    </div>
  ),
  section6_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">指数函数的定义</h4>
            <FormulaCard className="bg-emerald-50/20 border-emerald-500">
                <MathFormula tex="y = a^x \quad (a>0, a \ne 1)" block className="text-2xl text-emerald-800 font-bold" />
            </FormulaCard>
            <div className="text-xs text-slate-500 text-center mb-4">定义域 <MathFormula tex="\mathbb{R}" />，值域 <MathFormula tex="(0, +\infty)" />，恒过定点 <MathFormula tex="(0, 1)" /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {/* a > 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="w-full max-w-[240px] mb-2">
                    <FunctionPlot type="exp_growth" color="red" />
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-red-500" />
                </div>
                <h5 className="font-bold text-slate-700 mb-2 text-lg"><MathFormula tex="a > 1" /></h5>
                <div className="text-sm text-slate-600 mb-2">单调递增函数</div>
                <div className="text-xs text-slate-400 text-center">
                    增长速度极快 ("爆炸式增长")
                    <br/>
                    <MathFormula tex="x \to +\infty, y \to +\infty" />
                </div>
            </div>

            {/* 0 < a < 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                <div className="w-full max-w-[240px] mb-2">
                    <FunctionPlot type="exp_decay" color="blue" />
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                    <TrendingDown className="w-6 h-6 text-blue-500" />
                </div>
                <h5 className="font-bold text-slate-700 mb-2 text-lg"><MathFormula tex="0 < a < 1" /></h5>
                <div className="text-sm text-slate-600 mb-2">单调递减函数</div>
                <div className="text-xs text-slate-400 text-center">
                    衰减速度极快
                    <br/>
                    <MathFormula tex="x \to +\infty, y \to 0" />
                </div>
            </div>
        </div>

        <WarningCard title="图像变换技巧">
            <div className="text-sm">
                函数 <MathFormula tex="y=a^x" /> 与 <MathFormula tex="y=(\frac{1}{a})^x" /> 的图像关于 <span className="font-bold text-slate-800">y轴</span> 对称。
            </div>
        </WarningCard>
    </div>
  ),
  section6_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">对数函数的定义</h4>
            <FormulaCard className="bg-purple-50/20 border-purple-500">
                <MathFormula tex="y = \log_a x \quad (a>0, a \ne 1)" block className="text-2xl text-purple-800 font-bold" />
            </FormulaCard>
            <div className="text-xs text-slate-500 text-center mb-4">定义域 <MathFormula tex="(0, +\infty)" />，值域 <MathFormula tex="\mathbb{R}" />，恒过定点 <MathFormula tex="(1, 0)" /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                 <ArrowRightLeft className="w-5 h-5 text-indigo-500" /> 指对互逆关系
             </h4>
             <p className="text-sm text-slate-600 mb-4">
                 指数函数 <MathFormula tex="y=a^x" /> 与对数函数 <MathFormula tex="y=\log_a x" /> 互为<span className="font-bold text-indigo-600">反函数</span>。
             </p>
             <div className="flex gap-4 items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="text-center">
                     <span className="text-xs text-slate-400 block mb-1">图像对称轴</span>
                     <MathFormula tex="y=x" className="font-bold text-lg text-slate-700"/>
                 </div>
                 <div className="h-10 w-px bg-slate-200"></div>
                 <div className="text-center">
                     <span className="text-xs text-slate-400 block mb-1">定义域/值域互换</span>
                     <MathFormula tex="D_{exp} = R, R_{exp} = (0,+\infty)" className="text-xs text-slate-600 block"/>
                     <MathFormula tex="D_{log} = (0,+\infty), R_{log} = R" className="text-xs text-slate-600 block"/>
                 </div>
             </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {/* a > 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center group hover:border-red-200 transition-colors">
                <div className="w-full max-w-[240px] mb-2">
                    <FunctionPlot type="log_growth" color="red" />
                </div>
                <h5 className="font-bold text-slate-700 mb-2 text-lg group-hover:text-red-600 transition-colors"><MathFormula tex="a > 1" /></h5>
                <div className="text-sm text-slate-600 mb-2 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">单调递增</div>
                <div className="w-full h-px bg-slate-100 my-2"></div>
                <div className="text-xs text-slate-500 w-full px-2 space-y-1">
                    <div className="flex justify-between"><span>x &gt; 1</span> <span>y &gt; 0</span></div>
                    <div className="flex justify-between"><span>0 &lt; x &lt; 1</span> <span>y &lt; 0</span></div>
                </div>
            </div>

            {/* 0 < a < 1 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center group hover:border-blue-200 transition-colors">
                <div className="w-full max-w-[240px] mb-2">
                    <FunctionPlot type="log_decay" color="blue" />
                </div>
                <h5 className="font-bold text-slate-700 mb-2 text-lg group-hover:text-blue-600 transition-colors"><MathFormula tex="0 < a < 1" /></h5>
                <div className="text-sm text-slate-600 mb-2 font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">单调递减</div>
                <div className="w-full h-px bg-slate-100 my-2"></div>
                <div className="text-xs text-slate-500 w-full px-2 space-y-1">
                    <div className="flex justify-between"><span>x &gt; 1</span> <span>y &lt; 0</span></div>
                    <div className="flex justify-between"><span>0 &lt; x &lt; 1</span> <span>y &gt; 0</span></div>
                </div>
            </div>
        </div>
        
        <WarningCard title="比较大小的方法 (打擂台法)">
            <p className="text-sm">
                比较 <MathFormula tex="\log_a b" /> 与 <MathFormula tex="\log_c d" />：
                <br/>通常引入中间量 <span className="font-bold text-slate-800">0</span> 或 <span className="font-bold text-slate-800">1</span>。
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border">正负看 1 (底数真数同范围为正)</div>
                <div className="bg-white p-2 rounded border">大小看单调性</div>
            </div>
        </WarningCard>
    </div>
  )
};