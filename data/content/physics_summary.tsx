
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Zap, Activity, Clock, ArrowDown, Ruler,  Calculator, BookOpen, GitMerge } from 'lucide-react';

const SummaryCard = ({ title, icon: Icon, mainFormulas, inferences, color = "indigo" }: any) => {
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">{title}</h4>
            </div>
            
            {/* 核心公式区 - 放大显示 */}
            <div className="space-y-6 mb-6">
                {mainFormulas.map((item: any, idx: number) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-sm font-bold text-slate-700">{item.label}</span>
                            {item.note && <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{item.note}</span>}
                        </div>
                        <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-3 rounded-xl border border-slate-200 text-center shadow-sm group-hover:border-slate-300 transition-colors">
                            <MathFormula tex={item.tex} className="text-2xl md:text-3xl font-bold text-slate-800" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 二级推论区 - 单独展示 */}
            {inferences && inferences.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 relative">
                    <div className="absolute -top-3 left-4 bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <GitMerge className="w-3 h-3" /> 二级推论
                    </div>
                    <div className="space-y-3 mt-1">
                        {inferences.map((item: any, idx: number) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                                <span className="text-xs text-slate-500 font-medium shrink-0">{item.label}</span>
                                <div className="text-right">
                                    <MathFormula tex={item.tex} className="text-base md:text-lg font-medium text-slate-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const PhysicsSummaryContent = {
    cheat_sheet: (
        <div className="space-y-6">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white">
                <div className="relative z-10">
                    <h3 className="font-bold text-2xl mb-2 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-indigo-300" />
                        物理公式速查手册
                    </h3>
                    <p className="text-indigo-200 text-sm opacity-90 max-w-lg">
                        核心公式大字展示，常用推论分类归纳。解题时请注意矢量方向和适用条件。
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute -right-6 -bottom-12 opacity-10 text-white">
                    <Calculator className="w-48 h-48" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <SummaryCard 
                    title="运动的描述 (定义式)" 
                    icon={Clock}
                    color="blue"
                    mainFormulas={[
                        { label: "平均速度", tex: "\\bar{v} = \\frac{\\Delta x}{\\Delta t}" },
                        { label: "加速度", tex: "a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}", note: "决定式" }
                    ]}
                    inferences={[
                        { label: "平均速率", tex: "v_{rate} = \\frac{S}{t}" }
                    ]}
                />
                
                <SummaryCard 
                    title="匀变速直线运动 (核心)" 
                    icon={Zap}
                    color="indigo"
                    mainFormulas={[
                        { label: "速度公式", tex: "v = v_0 + at" },
                        { label: "位移公式", tex: "x = v_0 t + \\frac{1}{2}at^2" }
                    ]}
                    inferences={[
                        { label: "速度位移公式 (不含t)", tex: "v^2 - v_0^2 = 2ax" },
                        { label: "平均速度推论", tex: "\\bar{v} = v_{\\frac{t}{2}} = \\frac{v_0 + v}{2}" },
                        { label: "中间位置速度", tex: "v_{\\frac{x}{2}} = \\sqrt{\\frac{v_0^2 + v^2}{2}}" },
                        { label: "位移差公式 (实验用)", tex: "\\Delta x = aT^2" }
                    ]}
                />

                <SummaryCard 
                    title="牛顿运动定律 (动力学)" 
                    icon={Activity}
                    color="purple"
                    mainFormulas={[
                        { label: "牛顿第二定律", tex: "F_{net} = ma" },
                        { label: "滑动摩擦力", tex: "f = \\mu N" }
                    ]}
                    inferences={[
                        { label: "重力", tex: "G = mg" },
                        { label: "胡克定律", tex: "F = kx" },
                        { label: "超重/失重", tex: "F_N = m(g \\pm a)" }
                    ]}
                />

                <SummaryCard 
                    title="自由落体 (v0=0, a=g)" 
                    icon={ArrowDown}
                    color="emerald"
                    mainFormulas={[
                        { label: "速度公式", tex: "v = gt" },
                        { label: "下落高度", tex: "h = \\frac{1}{2}gt^2" }
                    ]}
                    inferences={[
                        { label: "速度位移公式", tex: "v^2 = 2gh" },
                        { label: "第 n 秒末速度比", tex: "1:2:3:\\dots:n" },
                        { label: "第 n 秒内位移比", tex: "1:3:5:\\dots:(2n-1)" }
                    ]}
                />
            </div>
        </div>
    )
};
