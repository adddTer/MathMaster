
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Anchor, Activity, Scale, Box, ArrowRight, Weight } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="F=ma" />
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

export const PhysicsChapter4Content = {
  section4_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Anchor className="w-5 h-5 text-blue-500" /> 1. 牛顿第一定律 (惯性定律)
            </h4>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-900 mb-4">
                一切物体总保持<span className="font-bold">匀速直线运动状态</span>或<span className="font-bold">静止状态</span>，直到有<span className="font-bold text-red-600">外力</span>迫使它改变这种状态为止。
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2">力的含义</span>
                    <p className="text-sm text-slate-600">力不是维持物体运动的原因，而是<span className="font-bold text-indigo-600">改变</span>物体运动状态的原因（即产生加速度的原因）。</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2">惯性 (Inertia)</span>
                    <p className="text-sm text-slate-600">物体保持原来运动状态的性质。<span className="font-bold text-indigo-600">质量</span>是惯性大小的唯一量度。</p>
                </div>
            </div>
        </div>
    </div>
  ),
  section4_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" /> 2. 实验：探究加速度与力、质量的关系
            </h4>
            
            <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 text-sm">实验方法：控制变量法</h5>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>保持 <MathFormula tex="m" /> 不变，探究 <MathFormula tex="a" /> 与 <MathFormula tex="F" /> 的关系。</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>保持 <MathFormula tex="F" /> 不变，探究 <MathFormula tex="a" /> 与 <MathFormula tex="m" /> 的关系。</span>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 text-sm">实验结论</h5>
                    <div className="flex justify-around items-center h-16">
                        <div className="text-center">
                            <MathFormula tex="a \propto F" className="text-lg font-bold text-purple-700"/>
                            <div className="text-xs text-slate-400">F-a 图像为过原点直线</div>
                        </div>
                        <div className="text-center">
                            <MathFormula tex="a \propto \frac{1}{m}" className="text-lg font-bold text-purple-700"/>
                            <div className="text-xs text-slate-400">a-1/m 图像为过原点直线</div>
                        </div>
                    </div>
                </div>
            </div>

            <WarningCard title="实验注意事项">
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li><span className="font-bold">平衡摩擦力：</span>垫高长木板一端，使小车重力沿斜面分力与摩擦力平衡（不挂砂桶，小车能匀速下滑）。</li>
                    <li><span className="font-bold">质量条件：</span>砂桶质量远小于小车质量 (<MathFormula tex="m_{sand} \ll M_{cart}" />)，此时绳拉力近似等于砂桶重力。</li>
                </ul>
            </WarningCard>
        </div>
    </div>
  ),
  section4_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-500" /> 3. 牛顿第二定律
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                物体加速度的大小跟作用力成正比，跟物体的质量成反比，加速度的方向跟作用力的方向相同。
            </p>
            <FormulaCard className="bg-indigo-50/20 border-indigo-500">
                <MathFormula tex="F_{net} = ma" block className="text-3xl font-bold text-indigo-800" />
                <div className="text-xs text-indigo-600 mt-2">矢量式：F 与 a 方向永远相同</div>
            </FormulaCard>
            
            <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">瞬时性</span>
                    <span className="text-slate-600">a 与 F 同时产生、同时消失、同时变化。</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">独立性</span>
                    <span className="text-slate-600">每个力各自产生分加速度，<MathFormula tex="F_x = ma_x, F_y = ma_y" />。</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">同体性</span>
                    <span className="text-slate-600">F, m, a 必须对应同一个物体。</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">矢量性</span>
                    <span className="text-slate-600">遵循平行四边形定则。</span>
                </div>
            </div>
        </div>
    </div>
  ),
  section4_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-500" /> 4. 力学单位制
            </h4>
            <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold">
                        <tr>
                            <th className="p-3 border-b">类别</th>
                            <th className="p-3 border-b">物理量</th>
                            <th className="p-3 border-b">单位 (SI)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="bg-emerald-50/30">
                            <td className="p-3 font-bold text-emerald-800" rowSpan={3}>基本量</td>
                            <td className="p-3">长度</td>
                            <td className="p-3 font-mono">米 (m)</td>
                        </tr>
                        <tr className="bg-emerald-50/30">
                            <td className="p-3">质量</td>
                            <td className="p-3 font-mono">千克 (kg)</td>
                        </tr>
                        <tr className="bg-emerald-50/30">
                            <td className="p-3">时间</td>
                            <td className="p-3 font-mono">秒 (s)</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-bold text-slate-600">导出量</td>
                            <td className="p-3">速度、加速度、力...</td>
                            <td className="p-3 font-mono">m/s, m/s², N...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-100">
                <span className="font-bold">牛顿 (N) 的定义：</span>使质量为 1kg 的物体产生 1m/s² 加速度的力。
                <br/>
                <MathFormula tex="1 N = 1 kg \cdot m/s^2" />
            </div>
        </div>
    </div>
  ),
  section4_5: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-indigo-500" /> 5. 牛顿运动定律的应用
            </h4>
            
            <div className="grid gap-4">
                <div className="border-l-4 border-indigo-500 pl-4 py-1">
                    <h5 className="font-bold text-slate-800 text-sm">两类动力学问题</h5>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <span className="font-bold">受力情况</span>
                        <div className="flex-1 h-px bg-indigo-200 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-indigo-600 font-bold text-xs border border-indigo-200 rounded">加速度 a</div>
                        </div>
                        <span className="font-bold">运动情况</span>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 text-sm mb-2">解题步骤</h5>
                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                        <li>确定研究对象（隔离法或整体法）。</li>
                        <li>进行受力分析和运动分析，画示意图。</li>
                        <li>建立直角坐标系（通常取加速度方向为 x 轴）。</li>
                        <li>列方程求解：
                            <MathFormula tex="\begin{cases} F_{x} = ma \\ F_{y} = 0 \end{cases}" block className="my-1 ml-4"/>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
  ),
  section4_6: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Weight className="w-5 h-5 text-orange-500" /> 6. 超重与失重
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                本质：视重（支持力或拉力）与实重（重力）的差异，取决于<span className="font-bold text-orange-600">加速度方向</span>。
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-center">
                    <span className="font-bold text-orange-900 text-lg block mb-2">超重</span>
                    <div className="text-xs text-orange-800 mb-3 bg-white/50 p-1 rounded inline-block">加速度向上 (加速上升/减速下降)</div>
                    <MathFormula tex="F_N - G = ma \Rightarrow F_N = G + ma" block className="text-xl font-bold text-orange-700"/>
                    <div className="mt-2 text-xs font-bold text-orange-600">视重 &gt; 实重</div>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-center">
                    <span className="font-bold text-slate-800 text-lg block mb-2">失重</span>
                    <div className="text-xs text-slate-600 mb-3 bg-white/50 p-1 rounded inline-block">加速度向下 (加速下降/减速上升)</div>
                    <MathFormula tex="G - F_N = ma \Rightarrow F_N = G - ma" block className="text-xl font-bold text-slate-700"/>
                    <div className="mt-2 text-xs font-bold text-slate-600">视重 &lt; 实重</div>
                </div>
            </div>

            <WarningCard title="完全失重">
                <p className="text-sm">
                    当 <MathFormula tex="a = g" /> (竖直向下) 时，<MathFormula tex="F_N = 0" />。
                    <br/>
                    此时一切由重力产生的物理现象（如浮力、天平称重）都会完全消失。
                </p>
            </WarningCard>
        </div>
    </div>
  )
};
