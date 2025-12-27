
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Zap, Activity, Clock, ArrowDown, Ruler,  Calculator, BookOpen } from 'lucide-react';

const SummaryCard = ({ title, icon: Icon, formulas, color = "indigo" }: any) => {
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        red: "bg-red-50 text-red-600 border-red-100",
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
            </div>
            <div className="space-y-4">
                {formulas.map((item: any, idx: number) => (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{item.label}</span>
                            {item.note && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded scale-95 origin-right">{item.note}</span>}
                        </div>
                        <div className="bg-slate-50/50 px-3 py-2 rounded-lg border border-slate-100 text-center group-hover:bg-slate-50 group-hover:border-slate-200 transition-colors">
                            <MathFormula tex={item.tex} />
                        </div>
                    </div>
                ))}
            </div>
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
                        汇集必修一核心考点公式。熟记公式是解题的基础，理解物理意义是灵活运用的关键。
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute -right-6 -bottom-12 opacity-10 text-white">
                    <Calculator className="w-48 h-48" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <SummaryCard 
                    title="运动的描述 (基础)" 
                    icon={Clock}
                    color="blue"
                    formulas={[
                        { label: "平均速度定义", tex: "\\bar{v} = \\frac{\\Delta x}{\\Delta t}" },
                        { label: "加速度定义", tex: "a = \\frac{\\Delta v}{\\Delta t} = \\frac{v - v_0}{t}", note: "矢量" }
                    ]}
                />
                
                <SummaryCard 
                    title="匀变速直线运动 (核心)" 
                    icon={Zap}
                    color="indigo"
                    formulas={[
                        { label: "速度-时间公式", tex: "v = v_0 + at" },
                        { label: "位移-时间公式", tex: "x = v_0 t + \\frac{1}{2}at^2" },
                        { label: "速度-位移公式", tex: "v^2 - v_0^2 = 2ax", note: "不含 t，推荐" }
                    ]}
                />

                <SummaryCard 
                    title="重要推论 (解题技巧)" 
                    icon={Activity}
                    color="purple"
                    formulas={[
                        { label: "平均速度推论", tex: "\\bar{v} = \\frac{v_0 + v}{2} = v_{\\frac{t}{2}}", note: "仅限匀变速" },
                        { label: "位移差公式 (判别式)", tex: "\\Delta x = aT^2", note: "相邻相等时间" },
                        { label: "逐差法求加速度", tex: "a = \\frac{x_m - x_n}{(m-n)T^2}", note: "实验必考" }
                    ]}
                />

                <SummaryCard 
                    title="自由落体 (v0=0, a=g)" 
                    icon={ArrowDown}
                    color="emerald"
                    formulas={[
                        { label: "速度公式", tex: "v = gt" },
                        { label: "高度公式", tex: "h = \\frac{1}{2}gt^2" },
                        { label: "速度位移公式", tex: "v^2 = 2gh" }
                    ]}
                />

                <SummaryCard 
                    title="初速度为0的比例关系" 
                    icon={Ruler}
                    color="orange"
                    formulas={[
                        { label: "1T末, 2T末...速度比", tex: "1:2:3:\\dots:n" },
                        { label: "1T内, 2T内...位移比", tex: "1:4:9:\\dots:n^2" },
                        { label: "第1T内, 第2T内...位移比", tex: "1:3:5:\\dots:(2n-1)" }
                    ]}
                />
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
                <div className="bg-white p-1 rounded-full border border-amber-200 shrink-0">
                    <Zap className="w-3 h-3 text-amber-500" />
                </div>
                <div>
                    <span className="font-bold block mb-1 text-amber-900">使用贴士</span>
                    公式记忆只是第一步。在解决实际问题时，首先要画出<span className="font-bold">运动过程示意图</span>，标明已知量和未知量，规定<span className="font-bold">正方向</span>（通常取初速度方向），注意矢量正负号的代入。
                </div>
            </div>
        </div>
    )
};
