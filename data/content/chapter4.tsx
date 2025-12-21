import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Calculator, ArrowRightLeft, Spline } from 'lucide-react';

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

export const Chapter4Content = {
  section4_1: (
      <div className="space-y-6">
        {/* n次方根 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 text-lg">1. n 次方根</h4>
            <div className="space-y-4 text-sm">
                <p className="text-slate-600">
                    若 <MathFormula tex="x^n = a" /> (<MathFormula tex="n>1, n\in \mathbb{N}^*" />)，则 x 叫做 a 的 n 次方根。
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-2">n 为奇数</span>
                        <div className="space-y-2">
                            <div className="text-xs text-slate-500">记为 <MathFormula tex="\sqrt[n]{a}" /></div>
                            <div className="text-xs text-slate-500">a 的 n 次方根只有一个，符号与 a 相同</div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700 block mb-2">n 为偶数</span>
                        <div className="space-y-2">
                            <div className="text-xs text-slate-500">正数 a 有两个互为相反数的 n 次方根 <MathFormula tex="\pm\sqrt[n]{a}" /></div>
                            <div className="text-xs text-slate-500 text-red-500">负数没有偶次方根</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <WarningCard title="根式性质辨析">
                <div className="grid grid-cols-2 gap-8 text-center mt-2">
                    <div>
                        <MathFormula tex="(\sqrt[n]{a})^n = a" className="text-lg block mb-1" />
                        <span className="text-xs text-slate-400">前提：式子有意义</span>
                    </div>
                    <div>
                        <MathFormula tex="\sqrt[n]{a^n} = \begin{cases} a & n\text{为奇数} \\ |a| & n\text{为偶数} \end{cases}" className="text-lg block mb-1" />
                        <span className="text-xs text-slate-400">注意偶次根号下出来是绝对值</span>
                    </div>
                </div>
            </WarningCard>
        </div>

        {/* 根式与分数指数幂 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 text-lg">2. 分数指数幂</h4>
            <div className="space-y-4">
                <p className="text-sm text-slate-600">规定正数的正分数指数幂的意义为：</p>
                <FormulaCard className="bg-indigo-50/20 border-indigo-300">
                    <MathFormula tex="a^{\frac{m}{n}} = \sqrt[n]{a^m} \quad (a>0, m,n \in \mathbb{N}^*, n>1)" block className="text-2xl font-bold text-indigo-700" />
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-500 block mb-2">负分数指数幂：</span>
                        <MathFormula tex="a^{-\frac{m}{n}} = \frac{1}{a^{\frac{m}{n}}} = \frac{1}{\sqrt[n]{a^m}}" block className="text-xl text-slate-600" />
                    </div>
                </FormulaCard>
            </div>
        </div>

        {/* 运算性质 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-500" /> 有理指数幂的运算性质
            </h4>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg text-center h-24">
                    <span className="text-xs text-slate-500 mb-1">同底数幂相乘</span>
                    <MathFormula tex="a^r a^s = a^{r+s}" className="font-bold text-lg text-slate-700" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg text-center h-24">
                    <span className="text-xs text-slate-500 mb-1">幂的乘方</span>
                    <MathFormula tex="(a^r)^s = a^{rs}" className="font-bold text-lg text-slate-700" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg text-center h-24">
                    <span className="text-xs text-slate-500 mb-1">积的乘方</span>
                    <MathFormula tex="(ab)^r = a^r b^r" className="font-bold text-lg text-slate-700" />
                </div>
            </div>
        </div>
      </div>
  ),
  section4_2: (
      <div className="space-y-6">
        {/* 对数定义 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
                <Spline className="w-32 h-32" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">1. 对数的定义</h4>
            <div className="flex flex-col items-center gap-6">
                <div className="bg-slate-50 px-8 py-6 rounded-2xl shadow-inner text-center">
                    <MathFormula tex="a^x = N \iff x = \log_a N" block className="text-3xl font-bold text-indigo-700 mb-2" />
                    <div className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 inline-block shadow-sm">
                        底数 <MathFormula tex="a>0, a \ne 1" />，真数 <MathFormula tex="N>0" />
                    </div>
                </div>
                
                <div className="flex gap-4 w-full">
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-center flex-1 hover:border-blue-300 transition-colors">
                        <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">常用对数</div>
                        <MathFormula tex="\lg N = \log_{10} N" className="text-lg font-bold text-slate-700" />
                        <div className="text-[10px] text-slate-400 mt-2">
                             <MathFormula tex="\lg 10 = 1" />, <MathFormula tex="\lg 2 \approx 0.3010" />
                        </div>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-center flex-1 hover:border-emerald-300 transition-colors">
                        <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">自然对数</div>
                        <MathFormula tex="\ln N = \log_{e} N" className="text-lg font-bold text-slate-700" />
                        <div className="text-[10px] text-slate-400 mt-2">
                             <MathFormula tex="e \approx 2.71828..." />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full text-center">
                    <div className="bg-white border border-slate-100 rounded p-2 text-sm text-slate-600">
                        <span className="text-slate-400 text-xs block mb-1">性质 1</span>
                        <MathFormula tex="\log_a 1 = 0" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded p-2 text-sm text-slate-600">
                        <span className="text-slate-400 text-xs block mb-1">性质 2</span>
                        <MathFormula tex="\log_a a = 1" />
                    </div>
                </div>
            </div>
        </div>

        {/* 运算性质 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 对数的运算性质</h4>
            <div className="text-xs text-slate-400 mb-3 text-right">前提：<MathFormula tex="a>0, a \ne 1, M>0, N>0" /></div>
            <div className="grid gap-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <div>
                        <span className="text-emerald-800 font-bold block mb-1">积变和</span>
                        <span className="text-xs text-emerald-600 opacity-80">Product Rule</span>
                    </div>
                    <MathFormula tex="\log_a (MN) = \log_a M + \log_a N" className="text-lg" />
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div>
                        <span className="text-blue-800 font-bold block mb-1">商变差</span>
                        <span className="text-xs text-blue-600 opacity-80">Quotient Rule</span>
                    </div>
                    <MathFormula tex="\log_a \frac{M}{N} = \log_a M - \log_a N" className="text-lg" />
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <div>
                        <span className="text-purple-800 font-bold block mb-1">幂指提</span>
                        <span className="text-xs text-purple-600 opacity-80">Power Rule</span>
                    </div>
                    <MathFormula tex="\log_a M^n = n \log_a M" className="text-lg" />
                </div>
            </div>
        </div>

        {/* 换底公式 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                    <ArrowRightLeft className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-indigo-900 text-lg">换底公式</h4>
            </div>
            
            <p className="text-xs text-indigo-700/80 mb-4">
                统一底数是解决对数问题的关键工具。可以将任意对数转化为以常用对数或自然对数为底的计算。
            </p>
            
            <div className="bg-white/80 p-4 rounded-xl text-center border border-indigo-100 shadow-sm mb-4">
                <MathFormula tex="\log_a b = \frac{\log_c b}{\log_c a} \quad (c>0, c \ne 1)" block className="text-2xl" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-100/50">
                    <div className="text-xs text-indigo-500 font-bold mb-1">推论1：倒数关系</div>
                    <MathFormula tex="\log_a b = \frac{1}{\log_b a}" className="text-sm" />
                </div>
                <div className="bg-white/60 p-3 rounded-lg border border-indigo-100/50">
                    <div className="text-xs text-indigo-500 font-bold mb-1">推论2：连锁关系</div>
                    <MathFormula tex="\log_a b \cdot \log_b c = \log_a c" className="text-sm" />
                </div>
            </div>
        </div>
      </div>
  )
};