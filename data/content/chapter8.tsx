import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { Target, Search, BarChart3, Music, Repeat, ArrowRight } from 'lucide-react';

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

export const Chapter8Content = {
  section8_1: (
    <div className="space-y-6">
        {/* 零点概念 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" /> 1. 函数的零点
            </h4>
            <div className="text-sm text-slate-600 mb-4 leading-relaxed">
                对于函数 <MathFormula tex="y=f(x)" />，我们把使 <MathFormula tex="f(x)=0" /> 的实数 <MathFormula tex="x" /> 叫做函数 <MathFormula tex="y=f(x)" /> 的零点。
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <span className="font-bold text-slate-700 mb-2 block">等价关系链</span>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm">
                    <div className="bg-white px-3 py-2 rounded border shadow-sm">方程 <MathFormula tex="f(x)=0" /> 有实数根</div>
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />
                    <div className="bg-white px-3 py-2 rounded border shadow-sm">函数 <MathFormula tex="y=f(x)" /> 的图象与 x 轴有交点</div>
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 md:rotate-0" />
                    <div className="bg-white px-3 py-2 rounded border shadow-sm">函数 <MathFormula tex="y=f(x)" /> 有零点</div>
                </div>
            </div>
            <WarningCard title="概念辨析">
                <p className="text-xs">
                    “零点”不是一个点，而是一个<span className="font-bold text-red-600">实数</span>（即横坐标）。
                    <br/>
                    例如函数 <MathFormula tex="y=x-1" /> 的零点是 <MathFormula tex="1" />，而不是 <MathFormula tex="(1,0)" />。
                </p>
            </WarningCard>
        </div>

        {/* 零点存在性定理 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 零点存在性定理</h4>
            <p className="text-sm text-slate-600 mb-3">
                如果函数 <MathFormula tex="y=f(x)" /> 在区间 <MathFormula tex="[a, b]" /> 上图象是连续不断的，且满足：
            </p>
            <FormulaCard className="bg-emerald-50/20 border-emerald-500">
                <MathFormula tex="f(a) \cdot f(b) < 0" block className="text-2xl font-bold text-emerald-700" />
            </FormulaCard>
            <p className="text-sm text-slate-600 mt-3">
                则函数 <MathFormula tex="y=f(x)" /> 在区间 <MathFormula tex="(a, b)" /> 内至少有一个零点。
            </p>
        </div>

        {/* 二分法 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-500" /> 3. 二分法求近似解
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                通过不断把函数零点所在的区间一分为二，使区间的两个端点逐步逼近零点，进而得到零点近似值的方法。
            </p>
            
            <div className="space-y-3">
                <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                    <div className="text-sm text-slate-700">
                        <span className="font-bold block text-indigo-900 mb-1">确定初始区间</span>
                        确定区间 <MathFormula tex="[a, b]" />，验证 <MathFormula tex="f(a) \cdot f(b) < 0" />，给定精确度 <MathFormula tex="\varepsilon" />。
                    </div>
                </div>
                <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                    <div className="text-sm text-slate-700">
                        <span className="font-bold block text-indigo-900 mb-1">求中点</span>
                        求区间 <MathFormula tex="(a, b)" /> 的中点 <MathFormula tex="x_1 = \frac{a+b}{2}" />。
                    </div>
                </div>
                <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                    <div className="text-sm text-slate-700">
                        <span className="font-bold block text-indigo-900 mb-1">判断计算</span>
                        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 mt-1">
                            <li>若 <MathFormula tex="f(x_1) = 0" />，则 <MathFormula tex="x_1" /> 就是零点，结束。</li>
                            <li>若 <MathFormula tex="f(a) \cdot f(x_1) < 0" />，则零点在 <MathFormula tex="(a, x_1)" />，令 <MathFormula tex="b = x_1" />。</li>
                            <li>若 <MathFormula tex="f(x_1) \cdot f(b) < 0" />，则零点在 <MathFormula tex="(x_1, b)" />，令 <MathFormula tex="a = x_1" />。</li>
                        </ul>
                    </div>
                </div>
                <div className="flex gap-4 items-start p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
                    <div className="text-sm text-slate-700">
                        <span className="font-bold block text-indigo-900 mb-1">判断精度</span>
                        判断区间长度是否 <MathFormula tex="|a-b| < \varepsilon" />，若是则得到近似解，否则重复步骤2-3。
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section8_2: (
    <div className="space-y-6">
        {/* 建模步骤 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> 1. 数学建模基本流程
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-sm">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="font-bold text-emerald-800 mb-1">实际问题</div>
                    <div className="text-xs text-emerald-600">审题、抽象</div>
                </div>
                <div className="hidden md:flex items-center justify-center text-emerald-300"><ArrowRight /></div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-bold text-blue-800 mb-1">数学模型</div>
                    <div className="text-xs text-blue-600">建立函数关系</div>
                </div>
                <div className="hidden md:flex items-center justify-center text-blue-300"><ArrowRight /></div>
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="font-bold text-indigo-800 mb-1">数学结果</div>
                    <div className="text-xs text-indigo-600">求解、推演</div>
                </div>
                <div className="hidden md:flex items-center justify-center text-indigo-300"><ArrowRight /></div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-800 mb-1">实际结论</div>
                    <div className="text-xs text-slate-500">检验、解释</div>
                </div>
            </div>
        </div>

        {/* 常见增长模型对比 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">2. 三种常见函数模型的增长差异</h4>
            
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2 bg-blue-50 rounded border border-blue-100">
                    <span className="font-bold block text-blue-800">直线上升</span>
                    <MathFormula tex="y=kx+b" />
                    <span className="scale-75 block mt-1 opacity-70">匀速增长</span>
                </div>
                <div className="p-2 bg-red-50 rounded border border-red-100">
                    <span className="font-bold block text-red-800">指数爆炸</span>
                    <MathFormula tex="y=a^x" />
                    <span className="scale-75 block mt-1 opacity-70">增长最快</span>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-100">
                    <span className="font-bold block text-purple-800">对数增长</span>
                    <MathFormula tex="y=\log_a x" />
                    <span className="scale-75 block mt-1 opacity-70">增长越来越慢</span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-2">
                    <FunctionPlot type="log_growth" color="purple" label="log" />
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-2">
                    <FunctionPlot type="linear" color="blue" label="linear" />
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-2">
                    <FunctionPlot type="exp_growth" color="red" label="exp" />
                </div>
            </div>
            
            <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-bold">结论：</span>当 <MathFormula tex="x" /> 足够大时，<MathFormula tex="a^x > x^n > \log_a x" /> （其中 <MathFormula tex="a>1, n>0" />）。
                <br/>指数函数总是“跑得最快”的，对数函数则是“跑得最慢”的。
            </div>
        </div>
    </div>
  ),
  reading_g_major: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Music className="w-48 h-48" />
            </div>
            
            <h4 className="font-bold text-indigo-900 mb-2 text-xl flex items-center gap-2">
                <Music className="w-6 h-6" /> 阅读：数学与音乐
            </h4>
            <h5 className="text-indigo-700 font-medium text-sm mb-6">—— G大调的正弦曲线</h5>

            <div className="space-y-6 relative z-10">
                <p className="text-sm text-slate-700 leading-relaxed">
                    音乐是流动的数学。声音的本质是波，而最纯粹的声音（纯音）可以用<span className="font-bold text-indigo-600">正弦函数</span>来描述。
                    当我们按下一个琴键，琴弦震动产生的声波，可以简化为：
                </p>
                <div className="bg-white/80 p-4 rounded-xl border border-indigo-100 text-center backdrop-blur-sm">
                    <MathFormula tex="y = A \sin(\omega t + \phi)" block className="text-2xl font-bold text-indigo-800" />
                    <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-slate-600">
                        <div>
                            <span className="block font-bold text-indigo-600 mb-1">A (振幅)</span>
                            决定声音的<br/><span className="font-bold">响度 (音量)</span>
                        </div>
                        <div>
                            <span className="block font-bold text-indigo-600 mb-1">ω (频率)</span>
                            决定声音的<br/><span className="font-bold">音高</span>
                        </div>
                        <div>
                            <span className="block font-bold text-indigo-600 mb-1">波形</span>
                            不同函数的叠加决定<br/><span className="font-bold">音色</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-indigo-100 pt-4">
                    <h6 className="font-bold text-indigo-900 mb-2 text-sm">十二平均律与等比数列</h6>
                    <p className="text-sm text-slate-700 mb-3">
                        在现代音乐通用的“十二平均律”中，相邻两个半音的频率之比是一个常数。
                        这构成了一个公比为 <MathFormula tex="\sqrt[12]{2}" /> 的<span className="font-bold text-indigo-600">等比数列</span>。
                    </p>
                    <div className="flex items-center gap-2 text-xs bg-indigo-100/50 p-2 rounded-lg text-indigo-800">
                        <Repeat className="w-4 h-4" />
                        <span>若中央C (do) 的频率为 <MathFormula tex="f_0" />，则高八度C的频率恰好是 <MathFormula tex="2f_0" />。</span>
                    </div>
                </div>
                
                <div className="bg-white/60 p-4 rounded-lg border border-indigo-100 text-xs text-slate-500 italic">
                    “数学家莱布尼茨曾说：音乐是心灵在不知不觉中进行的算术运算。”
                </div>
            </div>
        </div>
    </div>
  )
};