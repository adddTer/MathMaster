
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { MousePointer2, TrendingUp, Move, CornerDownRight, GitMerge } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="v_0" />
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

export const PhysicsChapter5Content = {
  section5_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> 1. 曲线运动的性质
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">速度方向</span>
                    <p className="text-sm text-slate-600 mb-2">
                        质点在某一点的速度方向，沿曲线在这一点的<span className="font-bold text-indigo-600">切线方向</span>。
                    </p>
                    <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                        <span className="font-bold">结论：</span>曲线运动一定是<span className="font-bold text-red-600">变速运动</span>（速度方向时刻改变）。
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">动力学条件</span>
                    <p className="text-sm text-slate-600 mb-2">
                        物体所受<span className="font-bold text-indigo-600">合外力</span>的方向与<span className="font-bold text-indigo-600">速度</span>方向不在同一直线上。
                    </p>
                    <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                        合力指向曲线的<span className="font-bold text-blue-600">凹侧</span>（轨迹夹在 F 与 v 之间）。
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section5_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-purple-500" /> 2. 运动的合成与分解
            </h4>
            
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 mb-6">
                <h5 className="font-bold text-purple-900 mb-3 text-sm">经典模型：小船渡河</h5>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1 text-sm">最短时间</div>
                        <p className="text-xs text-slate-600 mb-2">
                            船头始终垂直于河岸 (<MathFormula tex="\theta = 90^\circ" />)。
                        </p>
                        <MathFormula tex="t_{min} = \frac{d}{v_{boat}}" block className="text-lg font-bold text-purple-700" />
                        <div className="text-[10px] text-slate-400 mt-2">与水流速度无关</div>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                        <div className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1 text-sm">最短位移</div>
                        <div className="text-xs text-slate-600 space-y-1">
                            <div><span className="font-bold text-indigo-600">v船 &gt; v水：</span> 船头偏向上游，合速度垂直河岸。位移 <MathFormula tex="x = d" />。</div>
                            <div><span className="font-bold text-red-600">v船 &lt; v水：</span> 无法垂直渡河。合速度与船速垂直时位移最短。</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2 text-sm">关联速度模型（绳拉船）</h5>
                <p className="text-xs text-slate-600 mb-3">
                    分解原则：将物体的<span className="font-bold">实际速度</span>（合速度）分解为<span className="font-bold">沿绳方向</span>（收缩/伸长）和<span className="font-bold">垂直绳方向</span>（转动）的分量。
                </p>
                <div className="bg-white p-2 rounded border border-slate-200 text-center text-sm">
                    <MathFormula tex="v_{rope} = v_{obj} \cdot \cos\theta" />
                    <div className="text-[10px] text-slate-400 mt-1">v_obj 为物体实际运动速度，theta 为绳与速度方向夹角</div>
                </div>
            </div>
        </div>
    </div>
  ),
  section5_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">3. 实验：探究平抛运动的特点</h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-800 text-sm block mb-1">水平方向</span>
                        <p className="text-xs text-blue-700">
                            两球同时落地实验中，平抛小球与水平匀速小球在水平方向始终对齐 <MathFormula tex="\to" /> <span className="font-bold">匀速直线运动</span>。
                        </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-800 text-sm block mb-1">竖直方向</span>
                        <p className="text-xs text-emerald-700">
                            平抛小球与自由落体小球同时落地 <MathFormula tex="\to" /> <span className="font-bold">自由落体运动</span>。
                        </p>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-center">
                    <div className="relative w-32 h-32 border-l border-b border-slate-300">
                        <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="absolute top-0 left-8 w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                        <div className="absolute top-4 left-16 w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                        <div className="absolute top-12 left-24 w-2 h-2 bg-blue-500 rounded-full opacity-50"></div>
                        {/* Trajectory */}
                        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <path d="M 0 0 Q 50 0 100 100" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 2" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section5_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <CornerDownRight className="w-5 h-5 text-orange-500" /> 4. 抛体运动的规律
            </h4>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1 space-y-4">
                    <p className="text-sm text-slate-600">
                        以抛出点为原点，水平方向为 x 轴，竖直向下为 y 轴。
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">位移 Displacement</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center bg-white p-2 rounded border border-slate-200">
                                    <span className="text-xs text-slate-500">水平</span>
                                    <MathFormula tex="x = v_0 t" />
                                </div>
                                <div className="text-center bg-white p-2 rounded border border-slate-200">
                                    <span className="text-xs text-slate-500">竖直</span>
                                    <MathFormula tex="y = \frac{1}{2}gt^2" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">速度 Velocity</span>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center bg-white p-2 rounded border border-slate-200">
                                    <span className="text-xs text-slate-500">水平</span>
                                    <MathFormula tex="v_x = v_0" />
                                </div>
                                <div className="text-center bg-white p-2 rounded border border-slate-200">
                                    <span className="text-xs text-slate-500">竖直</span>
                                    <MathFormula tex="v_y = gt" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 bg-white rounded-xl border border-slate-200 p-2 shadow-inner">
                    <FunctionPlot 
                        config={{
                            functions: [{ expr: "0.5 * x * x", color: "orange", label: "y = \\frac{g}{2v_0^2}x^2" }],
                            xDomain: [0, 4],
                            yDomain: [0, 8]
                        }}
                    />
                    <div className="text-center text-xs text-slate-400 mt-2">轨迹为抛物线</div>
                </div>
            </div>

            <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100">
                <h5 className="font-bold text-orange-900 mb-3 text-sm">重要推论 (偏转角)</h5>
                <div className="flex gap-8 items-center justify-center">
                    <div className="text-center">
                        <MathFormula tex="\tan\theta = \frac{v_y}{v_x} = \frac{gt}{v_0}" block className="text-lg font-bold text-orange-800" />
                        <span className="text-xs text-orange-600">速度偏角</span>
                    </div>
                    <div className="text-center">
                        <MathFormula tex="\tan\alpha = \frac{y}{x} = \frac{\frac{1}{2}gt^2}{v_0 t} = \frac{gt}{2v_0}" block className="text-lg font-bold text-orange-800" />
                        <span className="text-xs text-orange-600">位移偏角</span>
                    </div>
                </div>
                <div className="mt-3 text-center border-t border-orange-200 pt-2">
                    <MathFormula tex="\tan\theta = 2\tan\alpha" className="font-bold text-xl text-orange-700" />
                    <p className="text-xs text-orange-800/70 mt-1">
                        几何意义：速度的反向延长线交于水平位移的<span className="font-bold">中点</span>。
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
};
