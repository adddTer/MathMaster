
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { RotateCw, Compass, Waves, Anchor, RefreshCcw } from 'lucide-react';

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

export const Chapter7Content = {
  section7_1: (
    <div className="space-y-6">
        {/* 任意角 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-blue-500" /> 1. 任意角
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-slate-700 mb-2">正角</span>
                    <div className="w-16 h-16 mx-auto bg-white rounded-full border border-slate-200 relative mb-2">
                        <div className="absolute top-1/2 left-1/2 w-full h-px bg-slate-300 -translate-y-1/2 -translate-x-1/2"></div>
                        {/* CCW arrow */}
                        <svg viewBox="0 0 40 40" className="absolute top-0 left-0 w-full h-full">
                            <path d="M 28 20 A 8 8 0 0 0 20 12" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500">逆时针旋转</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-slate-700 mb-2">负角</span>
                    <div className="w-16 h-16 mx-auto bg-white rounded-full border border-slate-200 relative mb-2">
                        <div className="absolute top-1/2 left-1/2 w-full h-px bg-slate-300 -translate-y-1/2 -translate-x-1/2"></div>
                        {/* CW arrow */}
                        <svg viewBox="0 0 40 40" className="absolute top-0 left-0 w-full h-full">
                            <path d="M 28 20 A 8 8 0 0 1 20 28" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow-red)" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500">顺时针旋转</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="block font-bold text-slate-700 mb-2">零角</span>
                    <div className="text-xs text-slate-500 mt-6">射线没有旋转</div>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
                <span className="font-bold text-indigo-900 block mb-1">终边相同的角</span>
                <MathFormula tex="S = \{ \beta \mid \beta = \alpha + k \cdot 360^\circ, k \in \mathbb{Z} \}" block className="text-indigo-800" />
            </div>
        </div>

        {/* 弧度制 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-purple-500" /> 2. 弧度制
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                规定：长度等于半径长的弧所对的圆心角为 <MathFormula tex="1" /> 弧度的角。
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <FormulaCard className="flex-1 my-0 bg-purple-50/20 border-purple-400">
                    <div className="text-xs text-purple-800 font-bold mb-2">角度 <MathFormula tex="\leftrightarrow" /> 弧度</div>
                    <MathFormula tex="180^\circ = \pi \text{ rad}" block className="text-xl font-bold" />
                    <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
                        <div><MathFormula tex="1^\circ = \frac{\pi}{180}" /></div>
                        <div><MathFormula tex="1 \text{ rad} \approx 57.30^\circ" /></div>
                    </div>
                </FormulaCard>
                <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm text-slate-600 font-bold">弧长公式</span>
                        <MathFormula tex="l = |\alpha| r" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-sm text-slate-600 font-bold">扇形面积</span>
                        <MathFormula tex="S = \frac{1}{2}lr = \frac{1}{2}|\alpha|r^2" />
                    </div>
                </div>
            </div>
            
            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-center text-xs bg-slate-50 rounded-lg border border-slate-200">
                    <tbody className="divide-x divide-slate-200">
                        <tr>
                            <td className="p-2 font-bold bg-slate-100">角度</td>
                            <td className="p-2">30°</td>
                            <td className="p-2">45°</td>
                            <td className="p-2">60°</td>
                            <td className="p-2">90°</td>
                            <td className="p-2">180°</td>
                            <td className="p-2">270°</td>
                            <td className="p-2">360°</td>
                        </tr>
                        <tr className="border-t border-slate-200">
                            <td className="p-2 font-bold bg-slate-100">弧度</td>
                            <td className="p-2"><MathFormula tex="\frac{\pi}{6}" /></td>
                            <td className="p-2"><MathFormula tex="\frac{\pi}{4}" /></td>
                            <td className="p-2"><MathFormula tex="\frac{\pi}{3}" /></td>
                            <td className="p-2"><MathFormula tex="\frac{\pi}{2}" /></td>
                            <td className="p-2"><MathFormula tex="\pi" /></td>
                            <td className="p-2"><MathFormula tex="\frac{3\pi}{2}" /></td>
                            <td className="p-2"><MathFormula tex="2\pi" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  ),
  section7_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">任意角的三角函数</h4>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-48 h-48 relative shrink-0">
                    <svg viewBox="-55 -55 110 110" className="w-full h-full overflow-visible">
                        {/* Axes */}
                        <line x1="-50" y1="0" x2="50" y2="0" stroke="#94a3b8" strokeWidth="1" />
                        <line x1="0" y1="-50" x2="0" y2="50" stroke="#94a3b8" strokeWidth="1" />
                        {/* Unit Circle */}
                        <circle cx="0" cy="0" r="40" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                        {/* Point P */}
                        <circle cx="28.28" cy="-28.28" r="3" fill="#ef4444" />
                        <line x1="0" y1="0" x2="28.28" y2="-28.28" stroke="#ef4444" strokeWidth="1.5" />
                        <text x="32" y="-28" fontSize="8" fill="#ef4444" fontWeight="bold">P(x,y)</text>
                        <text x="5" y="-10" fontSize="8" fill="#64748b">r=1</text>
                    </svg>
                </div>
                <div className="flex-1 space-y-4">
                    <p className="text-sm text-slate-600">
                        设 <MathFormula tex="\alpha" /> 是一个任意角，它的终边与单位圆交于点 <MathFormula tex="P(x, y)" />，则：
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                            <span className="block text-xs text-blue-500 font-bold mb-1">正弦 sine</span>
                            <MathFormula tex="\sin\alpha = y" className="font-bold text-blue-800" />
                        </div>
                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                            <span className="block text-xs text-emerald-500 font-bold mb-1">余弦 cosine</span>
                            <MathFormula tex="\cos\alpha = x" className="font-bold text-emerald-800" />
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                            <span className="block text-xs text-purple-500 font-bold mb-1">正切 tangent</span>
                            <MathFormula tex="\tan\alpha = \frac{y}{x}" className="font-bold text-purple-800" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">三角函数在各象限的符号</h4>
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative w-48 h-48 mx-auto bg-slate-50 rounded-full border border-slate-200">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-300"></div>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-slate-300"></div>
                    
                    {/* Quadrant Labels */}
                    <div className="absolute top-8 right-8 text-center">
                        <span className="font-bold text-slate-400 text-xs block">I</span>
                        <span className="text-emerald-600 font-bold text-sm">全正</span>
                    </div>
                    <div className="absolute top-8 left-8 text-center">
                        <span className="font-bold text-slate-400 text-xs block">II</span>
                        <span className="text-blue-600 font-bold text-sm">sin +</span>
                    </div>
                    <div className="absolute bottom-8 left-8 text-center">
                        <span className="font-bold text-slate-400 text-xs block">III</span>
                        <span className="text-purple-600 font-bold text-sm">tan +</span>
                    </div>
                    <div className="absolute bottom-8 right-8 text-center">
                        <span className="font-bold text-slate-400 text-xs block">IV</span>
                        <span className="text-emerald-600 font-bold text-sm">cos +</span>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold text-slate-700 mb-3 text-sm">记忆口诀：</h5>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="p-2 border-l-4 border-emerald-400 bg-slate-50">一全正</div>
                        <div className="p-2 border-l-4 border-blue-400 bg-slate-50">二正弦 (sin)</div>
                        <div className="p-2 border-l-4 border-purple-400 bg-slate-50">三正切 (tan)</div>
                        <div className="p-2 border-l-4 border-emerald-600 bg-slate-50">四余弦 (cos)</div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400 italic">"ASTC" - All Students Take Calculus</div>
                </div>
            </div>
        </div>
    </div>
  ),
  section7_3: (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            {/* Sin Graph */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold text-slate-700"><MathFormula tex="y=\sin x" /></h5>
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">奇函数</span>
                </div>
                <FunctionPlot type="sin" color="blue" />
                <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex justify-between"><span>周期</span> <MathFormula tex="2\pi" /></div>
                    <div className="flex justify-between"><span>值域</span> <MathFormula tex="[-1, 1]" /></div>
                    <div className="flex justify-between"><span>对称轴</span> <MathFormula tex="x=k\pi+\frac{\pi}{2}" /></div>
                </div>
            </div>

            {/* Cos Graph */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold text-slate-700"><MathFormula tex="y=\cos x" /></h5>
                    <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">偶函数</span>
                </div>
                <FunctionPlot type="cos" color="emerald" />
                <div className="text-xs text-slate-500 mt-2 space-y-1">
                    <div className="flex justify-between"><span>周期</span> <MathFormula tex="2\pi" /></div>
                    <div className="flex justify-between"><span>值域</span> <MathFormula tex="[-1, 1]" /></div>
                    <div className="flex justify-between"><span>对称轴</span> <MathFormula tex="x=k\pi" /></div>
                </div>
            </div>
            
            {/* Tan Graph */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold text-slate-700"><MathFormula tex="y=\tan x" /></h5>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">奇函数</span>
                </div>
                <div className="w-full flex justify-center">
                    <div className="w-full md:w-3/4">
                        <FunctionPlot type="tan" color="purple" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs text-slate-500 mt-2 text-center">
                    <div><span className="block font-bold">周期</span> <MathFormula tex="\pi" /></div>
                    <div><span className="block font-bold">值域</span> <MathFormula tex="\mathbb{R}" /></div>
                    <div><span className="block font-bold">渐近线</span> <MathFormula tex="x=k\pi+\frac{\pi}{2}" /></div>
                </div>
            </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                <Waves className="w-5 h-5" /> 函数 <MathFormula tex="y=A\sin(\omega x + \phi)" /> 的变换
            </h4>
            <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">A</div>
                    <div className="text-sm">
                        <span className="font-bold text-indigo-900">振幅变换 (纵向伸缩)</span>
                        <div className="text-xs text-slate-500">决定函数的最大值和最小值 (Range: <MathFormula tex="[-A, A]" />)</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0"><MathFormula tex="\omega" /></div>
                    <div className="text-sm">
                        <span className="font-bold text-indigo-900">周期变换 (横向伸缩)</span>
                        <div className="text-xs text-slate-500">决定函数的周期 <MathFormula tex="T = \frac{2\pi}{\omega}" />。 <MathFormula tex="\omega > 1" /> 图象变窄（快）。</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0"><MathFormula tex="\phi" /></div>
                    <div className="text-sm">
                        <span className="font-bold text-indigo-900">相位变换 (左右平移)</span>
                        <div className="text-xs text-slate-500">
                            "左加右减"。注意：平移量是 <MathFormula tex="|\frac{\phi}{\omega}|" /> (需提取 <MathFormula tex="\omega" />)。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section7_4: (
    <div className="space-y-6">
        {/* Model Analysis */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
                <Anchor className="w-5 h-5 text-indigo-500" /> 正弦型函数模型详解
            </h4>
            
            <div className="bg-white p-6 rounded-xl border border-indigo-200 text-center mb-6 shadow-sm">
                <MathFormula tex="y = A\sin(\omega x + \phi) + k" block className="text-2xl font-bold text-indigo-800 mb-2" />
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">The General Sinusoidal Model</div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <span className="block font-bold text-slate-700 mb-2">物理含义</span>
                    <ul className="space-y-2 text-slate-600">
                        <li><span className="font-bold text-indigo-600">A (振幅):</span> 偏离平衡位置的最大距离。 <MathFormula tex="A = \frac{y_{max}-y_{min}}{2}" /></li>
                        <li><span className="font-bold text-indigo-600">k (偏置):</span> 平衡位置/中心线。 <MathFormula tex="k = \frac{y_{max}+y_{min}}{2}" /></li>
                        <li><span className="font-bold text-indigo-600">ω (角频率):</span> 变化快慢。 <MathFormula tex="\omega = \frac{2\pi}{T}" /></li>
                        <li><span className="font-bold text-indigo-600">φ (初相):</span> <MathFormula tex="x=0" /> 时的状态。</li>
                    </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-center">
                    <FunctionPlot 
                        config={{
                            functions: [{ expr: "2 * Math.sin(x) + 1", color: "indigo", label: "y=2\\sin x + 1" }],
                            xDomain: [0, 10],
                            yDomain: [-2, 4]
                        }}
                    />
                    <div className="text-center text-xs text-slate-400 mt-2">
                        示例：中心线 y=1, 振幅=2
                    </div>
                </div>
            </div>
        </div>

        {/* Ferris Wheel Example */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-emerald-500" /> 经典模型：摩天轮
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        设摩天轮半径为 <MathFormula tex="R" />，中心距离地面高度为 <MathFormula tex="h_0" />，转动角速度为 <MathFormula tex="\omega" />。
                        若 <MathFormula tex="t=0" /> 时乘客位于最低点，则乘客相对地面的高度 <MathFormula tex="H(t)" /> 为：
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-center">
                        <MathFormula tex="H(t) = -R\cos(\omega t) + h_0" block className="text-xl font-bold text-emerald-800" />
                        <div className="text-xs text-emerald-600 mt-2">
                            或 <MathFormula tex="H(t) = R\sin(\omega t - \frac{\pi}{2}) + h_0" />
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                        <span className="font-bold">解题关键：</span>确定最低点和最高点的时间差（半个周期），从而求出 <MathFormula tex="\omega" />。
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 flex flex-col items-center justify-center">
                    <div className="relative w-32 h-32 border-4 border-slate-300 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <div className="absolute bottom-0 w-4 h-4 bg-red-500 rounded-full translate-y-1/2"></div>
                        <div className="absolute top-0 w-4 h-4 bg-blue-500 rounded-full -translate-y-1/2"></div>
                    </div>
                    <div className="w-40 border-b-2 border-slate-400 mt-8 relative">
                        <div className="absolute -top-8 left-1/2 h-8 w-0.5 bg-slate-300 -translate-x-1/2"></div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-slate-500">地面</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Port Water Depth (Refined) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <Anchor className="w-32 h-32" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">应用：港口水深与安全进港</h4>
            
            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mb-6">
                <h5 className="font-bold text-blue-900 mb-3 text-sm">建模步骤</h5>
                <ol className="list-decimal list-inside text-sm text-slate-700 space-y-2">
                    <li><span className="font-bold">确定参数：</span>
                        <div className="mt-2 ml-4 grid grid-cols-1 gap-2 text-xs bg-white p-3 rounded-lg border border-blue-50 shadow-sm">
                            <div><span className="font-bold text-blue-600">k (平均水深):</span> <MathFormula tex="\frac{H_{max} + H_{min}}{2}" /></div>
                            <div><span className="font-bold text-blue-600">A (潮差一半):</span> <MathFormula tex="\frac{H_{max} - H_{min}}{2}" /></div>
                            <div><span className="font-bold text-blue-600">ω (角速度):</span> <MathFormula tex="\frac{2\pi}{T}" /> (通常潮汐周期约为12小时)</div>
                        </div>
                    </li>
                    <li><span className="font-bold">建立不等式：</span>
                        若船只吃水 <MathFormula tex="d" />，安全余量 <MathFormula tex="a" />，则安全进港条件为：
                        <MathFormula tex="y(t) \ge d + a" block className="my-2 font-bold text-center text-blue-800"/>
                    </li>
                    <li><span className="font-bold">求解区间：</span>
                        利用三角函数图像或单位圆求解 <MathFormula tex="t" /> 的范围。
                    </li>
                </ol>
            </div>
        </div>
    </div>
  )
};
