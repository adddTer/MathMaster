import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { Blend, CopyPlus, Calculator, RotateCw, BookOpen } from 'lucide-react';

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

export const Chapter10Content = {
  section10_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Blend className="w-5 h-5 text-blue-500" /> 1. 两角差的余弦公式 (核心公式)
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                这是三角恒等变换的基石。记作 <MathFormula tex="C_{(\alpha-\beta)}" />。
            </p>
            <FormulaCard className="bg-blue-50/20 border-blue-500">
                <MathFormula tex="\cos(\alpha-\beta) = \cos\alpha\cos\beta + \sin\alpha\sin\beta" block className="text-xl font-bold text-blue-800" />
            </FormulaCard>
            <div className="text-xs text-slate-500 text-center bg-slate-50 p-2 rounded">
                记忆口诀：余余正正符号反（余弦减，中间加）
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 其它和差公式推导</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">两角和的余弦 <MathFormula tex="C_{(\alpha+\beta)}" /></span>
                    <div className="text-xs text-slate-500 mb-2">将 <MathFormula tex="\beta" /> 换成 <MathFormula tex="-\beta" /></div>
                    <MathFormula tex="\cos(\alpha+\beta) = \cos\alpha\cos\beta - \sin\alpha\sin\beta" block className="text-sm font-bold" />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">两角和的正弦 <MathFormula tex="S_{(\alpha+\beta)}" /></span>
                    <div className="text-xs text-slate-500 mb-2">利用诱导公式 <MathFormula tex="\cos(\frac{\pi}{2}-\theta)=\sin\theta" /></div>
                    <MathFormula tex="\sin(\alpha+\beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta" block className="text-sm font-bold" />
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">两角和的正切 <MathFormula tex="T_{(\alpha+\beta)}" /></span>
                    <div className="text-xs text-slate-500 mb-2">弦化切：分子分母同除以 <MathFormula tex="\cos\alpha\cos\beta" /></div>
                    <MathFormula tex="\tan(\alpha+\beta) = \frac{\tan\alpha + \tan\beta}{1 - \tan\alpha\tan\beta}" block className="text-lg font-bold text-indigo-700" />
                    <div className="mt-2 text-xs text-slate-400 text-center">
                        常用变形：<MathFormula tex="\tan\alpha + \tan\beta = \tan(\alpha+\beta)(1-\tan\alpha\tan\beta)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section10_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <CopyPlus className="w-5 h-5 text-emerald-500" /> 二倍角公式
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                令和差公式中的 <MathFormula tex="\beta = \alpha" /> 即可得到。
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <div className="font-bold text-emerald-800 w-16 text-center"><MathFormula tex="S_{2\alpha}" /></div>
                    <MathFormula tex="\sin 2\alpha = 2\sin\alpha\cos\alpha" className="text-lg" />
                </div>
                <div className="flex flex-col gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="font-bold text-blue-800 w-16 text-center"><MathFormula tex="C_{2\alpha}" /></div>
                        <MathFormula tex="\cos 2\alpha = \cos^2\alpha - \sin^2\alpha" className="text-lg" />
                    </div>
                    <div className="pl-20 text-sm space-y-1 text-blue-700">
                        <div><MathFormula tex="= 2\cos^2\alpha - 1" /> (只含余弦)</div>
                        <div><MathFormula tex="= 1 - 2\sin^2\alpha" /> (只含正弦)</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div className="font-bold text-purple-800 w-16 text-center"><MathFormula tex="T_{2\alpha}" /></div>
                    <MathFormula tex="\tan 2\alpha = \frac{2\tan\alpha}{1-\tan^2\alpha}" className="text-lg" />
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">重要变形：降幂扩角</h4>
            <p className="text-sm text-slate-600 mb-4">
                在积分和解三角方程中非常常用，通过“升角”来“降幂”。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                    <MathFormula tex="\sin^2\alpha = \frac{1 - \cos 2\alpha}{2}" block className="text-lg font-bold" />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                    <MathFormula tex="\cos^2\alpha = \frac{1 + \cos 2\alpha}{2}" block className="text-lg font-bold" />
                </div>
            </div>
        </div>
    </div>
  ),
  section10_3: (
    <div className="space-y-6">
        {/* 半角公式 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" /> 1. 半角公式
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-2">正弦半角</div>
                    <MathFormula tex="\sin\frac{\alpha}{2} = \pm\sqrt{\frac{1-\cos\alpha}{2}}" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-2">余弦半角</div>
                    <MathFormula tex="\cos\frac{\alpha}{2} = \pm\sqrt{\frac{1+\cos\alpha}{2}}" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-xs text-slate-500 mb-2">正切半角</div>
                    <MathFormula tex="\tan\frac{\alpha}{2} = \frac{1-\cos\alpha}{\sin\alpha} = \frac{\sin\alpha}{1+\cos\alpha}" />
                </div>
            </div>
            <div className="mt-3 text-xs text-slate-400 text-center">
                注：根号前的符号由 <MathFormula tex="\frac{\alpha}{2}" /> 所在的象限决定。
            </div>
        </div>

        {/* 积化和差与和差化积 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 积化和差与和差化积 (了解)</h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="font-bold text-slate-700 block mb-2">积化和差 (乘积变加减)</span>
                    <div className="space-y-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <MathFormula tex="\sin\alpha\cos\beta = \frac{1}{2}[\sin(\alpha+\beta)+\sin(\alpha-\beta)]" block />
                        <MathFormula tex="\cos\alpha\cos\beta = \frac{1}{2}[\cos(\alpha+\beta)+\cos(\alpha-\beta)]" block />
                        <MathFormula tex="\sin\alpha\sin\beta = -\frac{1}{2}[\cos(\alpha+\beta)-\cos(\alpha-\beta)]" block />
                    </div>
                </div>
                <div>
                    <span className="font-bold text-slate-700 block mb-2">和差化积 (加减变乘积)</span>
                    <div className="space-y-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <MathFormula tex="\sin\theta+\sin\phi = 2\sin\frac{\theta+\phi}{2}\cos\frac{\theta-\phi}{2}" block />
                        <MathFormula tex="\cos\theta+\cos\phi = 2\cos\frac{\theta+\phi}{2}\cos\frac{\theta-\phi}{2}" block />
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  inquiry_superposition: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-indigo-600" /> 探究：辅助角公式
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                        形如 <MathFormula tex="y = a\sin x + b\cos x" /> 的函数，可以转化为一个单一的正弦型函数。
                        这是研究此类函数周期、最值、单调性的关键工具。
                    </p>
                    <FormulaCard className="my-0 bg-white border-indigo-300">
                        <MathFormula tex="a\sin x + b\cos x = \sqrt{a^2+b^2}\sin(x+\phi)" block className="text-xl font-bold text-indigo-800" />
                        <div className="mt-2 text-xs text-slate-500">
                            其中 <MathFormula tex="\tan\phi = \frac{b}{a}" />
                        </div>
                    </FormulaCard>
                    <div className="mt-4 text-xs text-slate-500">
                        <span className="font-bold">物理意义：</span> 两个同频率简谐波的叠加，仍然是简谐波，只是振幅和初相发生了改变。
                    </div>
                </div>
                <div className="flex-1 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm min-h-[200px]">
                    <FunctionPlot 
                        config={{
                            functions: [
                                { expr: "Math.sin(x) + Math.cos(x)", color: "indigo", label: "\\sin x + \\cos x" },
                                { expr: "1.414 * Math.sin(x + 0.785)", color: "red", label: "\\sqrt{2}\\sin(x+\\frac{\\pi}{4})" }
                            ],
                            xDomain: [-Math.PI, 2*Math.PI],
                            yDomain: [-2, 2]
                        }}
                    />
                    <div className="text-center text-xs text-indigo-400 mt-1">红蓝图像重合验证公式</div>
                </div>
            </div>
        </div>
    </div>
  ),
  reading_ptolemy: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen className="w-48 h-48" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 text-xl">阅读：弦表与托勒密定理</h4>
            
            <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed relative z-10">
                <p>
                    古希腊天文学家托勒密（Ptolemy）在其巨著《天文学大成》中，为了制作高精度的<span className="font-bold text-slate-800">弦表</span>（类似于现在的三角函数表），利用了几何学中的一个重要定理。
                </p>
                
                <div className="bg-white/80 p-4 rounded-xl border border-slate-200 my-4 shadow-sm">
                    <h5 className="font-bold text-slate-800 mb-2">托勒密定理</h5>
                    <p className="mb-2">圆内接四边形对角线的乘积等于两组对边乘积之和。</p>
                    <MathFormula tex="AC \cdot BD = AB \cdot CD + BC \cdot AD" block className="font-bold text-lg text-indigo-700" />
                </div>

                <p>
                    如果取 <MathFormula tex="AC" /> 为圆的直径，且设圆的直径为 1，那么圆上的弦长就可以表示为对应圆心角一半的正弦值。
                    通过巧妙构造圆内接四边形，托勒密实际上推导出了等价于现在的<span className="font-bold text-primary-600">两角和与差</span>的公式。
                </p>
                <p>
                    这使得他能够从已知的弦长（如 36°，72° 等）出发，计算出更多角度的弦长，最终编制出间隔为半度的弦表，误差极小，统治了西方天文学一千多年。
                </p>
            </div>
        </div>
    </div>
  )
};