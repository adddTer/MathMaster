
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { ChartComponent } from '../../components/ChartComponent';
import { TrendingUp, ArrowDown, Activity, FastForward, Clock, BarChart, MoveDown } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="f(x)" />
    </div>
    {children}
  </div>
);

const WarningCard = ({ title = "易错警示", children }: { title?: string, children?: React.ReactNode }) => (
  <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm mt-4 shadow-sm">
    <div className="w-5 h-5 shrink-0 text-amber-600 mt-0.5">⚠️</div>
    <div className="flex-1">
      <span className="font-bold block mb-1 text-amber-800">{title}</span>
      <div className="text-amber-800/90 leading-relaxed">{children}</div>
    </div>
  </div>
);

export const PhysicsChapter2Content = {
  section2_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> 实验：探究小车速度随时间变化的规律
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 flex-1">
                        <h5 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-blue-500" /> 实验数据散点图
                        </h5>
                        <p className="text-xs text-slate-600 mb-3">
                            利用打点计时器记录小车运动，每 5 个点取一个计数点 (<MathFormula tex="T=0.1s" />)。
                        </p>
                        <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <ChartComponent 
                                type="scatter"
                                data={[
                                    { label: "0.1", value: 0.20 },
                                    { label: "0.2", value: 0.41 },
                                    { label: "0.3", value: 0.59 },
                                    { label: "0.4", value: 0.82 },
                                    { label: "0.5", value: 1.00 }
                                ]}
                                title="v-t 关系"
                                xLabel="t/s"
                                yLabel="v/(m/s)"
                                width={300}
                                height={200}
                                color="blue"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex-1">
                        <h5 className="font-bold text-indigo-900 mb-3 text-sm">v-t 图像分析</h5>
                        <div className="bg-white p-2 rounded-lg border border-indigo-100 shadow-sm mb-3">
                            <FunctionPlot 
                                type="linear" 
                                color="blue" 
                                label="v = v_0 + at"
                                config={{
                                    functions: [{ expr: "2*x + 1", color: "blue", label: "v=2t+1" }],
                                    xDomain: [0, 5],
                                    yDomain: [0, 12]
                                }}
                            />
                        </div>
                        <div className="text-xs text-indigo-800 space-y-2 bg-white/60 p-3 rounded-lg">
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                图像是一条倾斜直线 <MathFormula tex="\Rightarrow" /> 匀变速直线运动
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                斜率 <MathFormula tex="k = a" /> (加速度)
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                纵截距 <MathFormula tex="b = v_0" /> (初速度)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section2_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <FastForward className="w-5 h-5 text-indigo-500" /> 1. 速度与时间的关系
            </h4>
            <div className="bg-gradient-to-r from-indigo-50 to-white p-5 rounded-xl border border-indigo-100 mb-6">
                <p className="text-sm text-slate-600 mb-3">
                    对于匀变速直线运动，加速度 <MathFormula tex="a" /> 是恒量。由定义式变形可得：
                </p>
                <FormulaCard className="bg-white border-indigo-500 my-0 shadow-md">
                    <MathFormula tex="v = v_0 + at" block className="text-3xl font-bold text-indigo-800" />
                </FormulaCard>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-bold text-slate-700 block mb-2 text-lg">匀加速</span>
                    <div className="text-slate-600 mb-2"><MathFormula tex="a" /> 与 <MathFormula tex="v_0" /> 同号</div>
                    <div className="w-full h-1 bg-gradient-to-r from-slate-300 to-emerald-500 rounded-full"></div>
                    <div className="text-[10px] text-slate-400 mt-1">速度逐渐增加</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                    <span className="font-bold text-slate-700 block mb-2 text-lg">匀减速</span>
                    <div className="text-slate-600 mb-2"><MathFormula tex="a" /> 与 <MathFormula tex="v_0" /> 异号</div>
                    <div className="w-full h-1 bg-gradient-to-r from-slate-400 to-slate-200 rounded-full"></div>
                    <div className="text-[10px] text-slate-400 mt-1">速度逐渐减小</div>
                </div>
            </div>
            
            <WarningCard title="矢量性运算">
                <p className="text-xs leading-relaxed">
                    公式中 <MathFormula tex="v, v_0, a" /> 都是矢量。通常规定初速度 <MathFormula tex="v_0" /> 的方向为正方向。
                    <br/>
                    若物体做匀减速运动，<MathFormula tex="a" /> 必须代入<span className="font-bold text-red-600">负值</span>计算。
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  section2_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> 2. 位移与时间的关系
            </h4>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1 text-sm text-slate-600 flex flex-col justify-center">
                    <p className="mb-4 bg-emerald-50 p-3 rounded-lg text-emerald-900 border border-emerald-100">
                        <span className="font-bold">微元法思想：</span>
                        在 v-t 图像中，图线与时间轴所围成的<span className="font-bold text-emerald-600 underline decoration-2">面积</span>表示位移。
                    </p>
                    <FormulaCard className="my-0 bg-white border-emerald-500 shadow-md">
                        <MathFormula tex="x = v_0 t + \frac{1}{2}at^2" block className="text-3xl font-bold text-emerald-800" />
                    </FormulaCard>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                    <FunctionPlot 
                        config={{
                            functions: [
                                { expr: "2*x + 0.5*x*x", color: "emerald", label: "x = v_0t + 0.5at^2" }
                            ],
                            xDomain: [0, 4],
                            yDomain: [0, 16]
                        }}
                    />
                    <div className="text-center text-xs text-slate-400 mt-2 font-mono">x-t 图像是抛物线的一部分</div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm flex items-center justify-between">
                <div>
                    <span className="font-bold text-slate-700 block mb-1">平均速度公式</span>
                    <span className="text-xs text-slate-500">仅适用于匀变速直线运动</span>
                </div>
                <MathFormula tex="\bar{v} = \frac{v_0 + v}{2}" className="text-xl font-bold text-slate-700"/>
            </div>
        </div>
    </div>
  ),
  section2_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" /> 3. 速度与位移的关系
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                由 <MathFormula tex="v = v_0 + at" /> 和 <MathFormula tex="x = v_0 t + \frac{1}{2}at^2" /> 消去时间 <MathFormula tex="t" />，可得不含时间的推论：
            </p>
            <FormulaCard className="bg-purple-50/20 border-purple-500">
                <MathFormula tex="v^2 - v_0^2 = 2ax" block className="text-3xl font-bold text-purple-800" />
            </FormulaCard>
            <div className="text-xs text-purple-700 bg-purple-50 p-3 rounded-lg mt-4 border border-purple-100 flex items-center gap-2">
                <span className="bg-white text-purple-600 font-bold px-1.5 py-0.5 rounded border border-purple-200">技巧</span>
                当题目<span className="font-bold">不涉及时间 t</span>，也不求时间 t 时，优先选用此公式。
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">4. 比例式 (初速度为0)</h4>
            <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm text-center text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold">
                        <tr>
                            <th className="p-3 border-b border-slate-200">物理量</th>
                            <th className="p-3 border-b border-slate-200">1T末 : 2T末 : 3T末</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-3 font-bold bg-slate-50/50">速度 v</td>
                            <td className="p-3 font-mono text-indigo-600 font-bold"><MathFormula tex="1 : 2 : 3" /></td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold bg-slate-50/50">位移 x</td>
                            <td className="p-3 font-mono text-emerald-600 font-bold"><MathFormula tex="1 : 4 : 9" /></td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold bg-slate-50/50">第nT内位移</td>
                            <td className="p-3 font-mono text-amber-600 font-bold"><MathFormula tex="1 : 3 : 5" /> (奇数比)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  ),
  section2_5: (
    <div className="space-y-6">
        <div className="bg-gradient-to-b from-white to-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <h4 className="font-bold text-slate-800 mb-6 text-lg flex items-center gap-2">
                <MoveDown className="w-5 h-5 text-slate-700" /> 5. 自由落体运动
            </h4>
            
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-700 block mb-2 border-b border-slate-100 pb-1">定义</span>
                        <p className="text-sm text-slate-600">
                            物体只在<span className="font-bold text-indigo-600">重力</span>作用下从<span className="font-bold text-indigo-600">静止</span>开始下落的运动。
                        </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-700 block mb-2 border-b border-slate-100 pb-1">运动性质</span>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>初速度 <MathFormula tex="v_0 = 0" /></li>
                            <li>加速度 <MathFormula tex="a = g" /> (重力加速度)</li>
                            <li>实质：匀加速直线运动的特例</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                            <span className="block text-xs text-indigo-600 font-bold mb-1">速度公式</span>
                            <MathFormula tex="v = gt" className="font-bold text-indigo-800"/>
                        </div>
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                            <span className="block text-xs text-indigo-600 font-bold mb-1">位移(高度)</span>
                            <MathFormula tex="h = \frac{1}{2}gt^2" className="font-bold text-indigo-800"/>
                        </div>
                    </div>
                </div>

                {/* Animation / Visual */}
                <div className="w-full md:w-32 bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center shadow-inner h-64 relative">
                    <div className="absolute top-2 text-[10px] text-slate-400">t=0</div>
                    <div className="w-4 h-4 bg-slate-800 rounded-full absolute top-6 shadow-sm"></div>
                    
                    <div className="w-4 h-4 bg-slate-800/60 rounded-full absolute top-16 shadow-sm"></div>
                    <div className="absolute top-16 right-4 text-[10px] text-slate-400">t=1</div>

                    <div className="w-4 h-4 bg-slate-800/40 rounded-full absolute top-32 shadow-sm"></div>
                    <div className="absolute top-32 right-4 text-[10px] text-slate-400">t=2</div>

                    <div className="w-4 h-4 bg-slate-800/20 rounded-full absolute top-56 shadow-sm"></div>
                    <div className="absolute top-56 right-4 text-[10px] text-slate-400">t=3</div>

                    <ArrowDown className="absolute bottom-2 left-2 w-4 h-4 text-slate-300" />
                    <div className="absolute left-1/2 top-4 bottom-4 w-px border-l border-dashed border-slate-300 -z-10"></div>
                </div>
            </div>
            
            <WarningCard title="重力加速度 g">
                <ul className="text-xs list-disc list-inside text-slate-600 space-y-1">
                    <li>方向：<span className="font-bold">竖直向下</span></li>
                    <li>大小：随纬度升高而增大（赤道最小，两极最大）。</li>
                    <li>计算通常取 <MathFormula tex="g = 9.8 m/s^2" /> 或 <MathFormula tex="10 m/s^2" />。</li>
                </ul>
            </WarningCard>
        </div>
    </div>
  )
};
