
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { PlanarGeometry } from '../../components/PlanarGeometry';
import { RotateCw, Disc, ArrowRight, Activity, Car, TrainFront, Crosshair, Force } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="\omega" />
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

export const PhysicsChapter6Content = {
  section6_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-blue-500" /> 1. 圆周运动的描述
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-2">线速度 (Linear Velocity)</span>
                    <MathFormula tex="v = \frac{\Delta s}{\Delta t} = \frac{2\pi r}{T}" block className="text-xl font-bold text-blue-700 mb-2" />
                    <p className="text-xs text-blue-800">描述运动快慢，方向为切线方向。</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-2">角速度 (Angular Velocity)</span>
                    <MathFormula tex="\omega = \frac{\Delta \theta}{\Delta t} = \frac{2\pi}{T}" block className="text-xl font-bold text-emerald-700 mb-2" />
                    <p className="text-xs text-emerald-800">描述转动快慢，单位 rad/s。</p>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm">三者关系</span>
                <MathFormula tex="v = \omega r" className="text-xl font-bold text-slate-800" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 常见传动模型</h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white p-4 border border-slate-200 rounded-xl text-center hover:border-indigo-300 transition-colors">
                    <div className="relative h-24 mb-2 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-slate-400 flex items-center justify-center text-xs">A</div>
                        <div className="h-0.5 w-16 bg-slate-400"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-slate-400 flex items-center justify-center text-xs">B</div>
                    </div>
                    <span className="font-bold text-slate-700 block mb-1">皮带/齿轮传动</span>
                    <span className="text-xs text-slate-500 block mb-2">边缘点线速度相等</span>
                    <MathFormula tex="v_A = v_B \Rightarrow \frac{\omega_A}{\omega_B} = \frac{r_B}{r_A}" className="text-indigo-600 font-bold" />
                </div>
                <div className="flex-1 bg-white p-4 border border-slate-200 rounded-xl text-center hover:border-indigo-300 transition-colors">
                    <div className="relative h-24 mb-2 flex items-center justify-center">
                        <div className="w-2 h-20 bg-slate-300 rounded mx-auto relative">
                            <div className="absolute top-2 left-1/2 w-12 h-1 bg-slate-400 -translate-x-1/2"></div>
                            <div className="absolute bottom-2 left-1/2 w-20 h-1 bg-slate-400 -translate-x-1/2"></div>
                        </div>
                    </div>
                    <span className="font-bold text-slate-700 block mb-1">同轴传动</span>
                    <span className="text-xs text-slate-500 block mb-2">角速度相等</span>
                    <MathFormula tex="\omega_A = \omega_B \Rightarrow \frac{v_A}{v_B} = \frac{r_A}{r_B}" className="text-indigo-600 font-bold" />
                </div>
            </div>
        </div>
    </div>
  ),
  section6_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Disc className="w-5 h-5 text-purple-500" /> 3. 向心力 (Centripetal Force)
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                做匀速圆周运动的物体所受的合力，方向始终<span className="font-bold text-purple-600">指向圆心</span>，作用是改变速度的方向。
            </p>
            
            <FormulaCard className="bg-purple-50/20 border-purple-500">
                <MathFormula tex="F_n = m\frac{v^2}{r} = m\omega^2 r = m v \omega" block className="text-2xl font-bold text-purple-800" />
                <div className="text-xs text-purple-600 mt-2 text-center">
                    牛顿第二定律 <MathFormula tex="F_n = m a_n" /> 的体现
                </div>
            </FormulaCard>
            
            <div className="mt-6">
                <h5 className="font-bold text-slate-700 text-sm mb-3 border-l-4 border-slate-400 pl-2">来源分析（受力分析）</h5>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="text-center font-bold text-slate-700 mb-2 text-xs">圆锥摆模型</div>
                        <PlanarGeometry 
                            width={240} height={200}
                            xDomain={[-2, 2]} yDomain={[-1, 3]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'line', start: {x:0, y:3}, end: {x:1.5, y:0}, color: '#cbd5e1' }, // String
                                { type: 'circle', center: {x:1.5, y:0}, radius: 0.2, fill: '#64748b', color: '#64748b' }, // Ball
                                { type: 'vector', start: {x:1.5, y:0}, end: {x:1.5, y:-1.5}, color: '#ef4444', label: 'G' }, // Gravity
                                { type: 'vector', start: {x:1.5, y:0}, end: {x:0.5, y:2}, color: '#3b82f6', label: 'F_T' }, // Tension
                                { type: 'vector', start: {x:1.5, y:0}, end: {x:0, y:0}, color: '#8b5cf6', label: 'F_n', dashed: true }, // Resultant
                                { type: 'line', start: {x:0, y:3}, end: {x:0, y:0}, dashed: true, color: '#94a3b8' }, // Axis
                                { type: 'line', start: {x:0, y:0}, end: {x:1.5, y:0}, dashed: true, color: '#94a3b8' }, // Radius
                            ]}
                            title="F_合 = F_n 指向圆心"
                        />
                        <div className="text-center text-xs text-slate-500 mt-2">
                            <MathFormula tex="F_n = m g \tan\theta" />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                        <div className="space-y-4 text-xs text-slate-600">
                            <div className="p-3 bg-white rounded border border-slate-200">
                                <span className="font-bold text-indigo-600 block mb-1">汽车转弯</span>
                                静摩擦力提供向心力：<MathFormula tex="f_{static} = m\frac{v^2}{r}" />
                            </div>
                            <div className="p-3 bg-white rounded border border-slate-200">
                                <span className="font-bold text-indigo-600 block mb-1">天体运动</span>
                                万有引力提供向心力：<MathFormula tex="G\frac{Mm}{r^2} = m\frac{v^2}{r}" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WarningCard title="向心力不是一种新的力">
                <p className="text-xs">
                    向心力是<span className="font-bold">按效果命名</span>的力。它可以是重力、弹力、摩擦力等各种性质的力，也可以是这些力的<span className="font-bold">合力</span>或<span className="font-bold">分力</span>。
                    <br/>
                    受力分析时，<span className="text-red-600 font-bold">绝不能</span>多画一个“向心力”。
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  section6_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> 4. 向心加速度 (Centripetal Acceleration)
            </h4>
            
            <div className="flex flex-col gap-6">
                <div className="text-sm text-slate-600">
                    <p className="mb-4">
                        描述速度<span className="font-bold text-indigo-600">方向</span>变化快慢的物理量。即使物体做匀速圆周运动（速率不变），由于速度方向时刻在变，所以也存在加速度。
                    </p>
                    <FormulaCard className="bg-indigo-50/20 border-indigo-500">
                        <MathFormula tex="a_n = \frac{v^2}{r} = \omega^2 r" block className="text-3xl font-bold text-indigo-800" />
                        <div className="mt-2 text-xs text-indigo-600 flex justify-center gap-4">
                            <span>方向：始终指向圆心</span>
                            <span>特性：时刻改变（变加速运动）</span>
                        </div>
                    </FormulaCard>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-700 text-sm mb-3">矢量推导：速度的变化量</h5>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <PlanarGeometry 
                            width={240} height={200}
                            xDomain={[-2, 2]} yDomain={[-2, 2]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'circle', center: {x:0, y:0}, radius: 1.5, dashed: true, color: '#cbd5e1' },
                                { type: 'vector', start: {x:1.5, y:0}, end: {x:1.5, y:1}, color: '#3b82f6', label: 'v_A' },
                                { type: 'vector', start: {x:1.06, y:1.06}, end: {x:0.35, y:1.77}, color: '#3b82f6', label: 'v_B' },
                                { type: 'point', x:1.5, y:0, label: 'A' },
                                { type: 'point', x:1.06, y:1.06, label: 'B' },
                                // Delta V triangle (moved to center for visibility)
                                { type: 'vector', start: {x:-1, y:0}, end: {x:-1, y:1}, color: '#94a3b8', label: 'v_A' },
                                { type: 'vector', start: {x:-1, y:0}, end: {x:-1.7, y:0.7}, color: '#94a3b8', label: 'v_B' },
                                { type: 'vector', start: {x:-1, y:1}, end: {x:-1.7, y:0.7}, color: '#ef4444', label: '\\Delta v' },
                            ]}
                            title="速度矢量三角形"
                        />
                        <div className="text-xs text-slate-600 space-y-2 flex-1">
                            <p>如图所示，将 <MathFormula tex="v_A" /> 平移，使起点与 <MathFormula tex="v_B" /> 重合。</p>
                            <p>由三角形法则：<MathFormula tex="\Delta v = v_B - v_A" />。</p>
                            <p>当 <MathFormula tex="\Delta t \to 0" /> 时，<MathFormula tex="\Delta v" /> 的方向指向圆心。</p>
                            <p className="font-bold text-indigo-700">结论：加速度方向与 <MathFormula tex="\Delta v" /> 方向一致，即指向圆心。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section6_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-orange-500" /> 5. 生活中的圆周运动
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                        <TrainFront className="w-4 h-4" /> 铁路转弯
                    </h5>
                    <p className="text-xs text-slate-600 mb-3">
                        外轨高于内轨。
                        <br/>
                        最佳速度：重力与支持力的合力刚好提供向心力。
                    </p>
                    <MathFormula tex="m g \tan\theta = m \frac{v^2}{r}" block className="text-base font-bold text-orange-700 mb-2"/>
                    <div className="text-[10px] text-slate-500 text-center">此时轮缘与轨道无挤压</div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-sm">
                        拱形桥 (最高点)
                    </h5>
                    <p className="text-xs text-slate-600 mb-3">
                        重力与支持力的合力提供向心力。
                    </p>
                    <MathFormula tex="mg - N = m \frac{v^2}{r}" block className="text-base font-bold text-orange-700 mb-2"/>
                    <div className="text-[10px] text-slate-500 text-center">
                        <MathFormula tex="N < mg" /> (失重状态)
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                <h5 className="font-bold text-orange-900 text-sm mb-2">离心运动</h5>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded border border-orange-100">
                        <MathFormula tex="F_{合} = F_n" />
                        <div className="mt-1">圆周运动</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-orange-100">
                        <MathFormula tex="F_{合} < F_n" />
                        <div className="mt-1 font-bold text-orange-600">离心运动</div>
                        <div className="text-[9px] text-slate-400">远离圆心</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-orange-100">
                        <MathFormula tex="F_{合} > F_n" />
                        <div className="mt-1 font-bold text-indigo-600">近心运动</div>
                        <div className="text-[9px] text-slate-400">靠近圆心</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};
