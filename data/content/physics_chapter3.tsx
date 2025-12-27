
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { ArrowDown, MoveHorizontal, Anchor, Layers, RefreshCcw, Scale } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="F" />
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

export const PhysicsChapter3Content = {
  section3_1: (
    <div className="space-y-6">
        {/* 重力 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <ArrowDown className="w-5 h-5 text-blue-500" /> 1. 重力 (Gravity)
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                由于地球的吸引而使物体受到的力。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2">基本要素</span>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li><span className="font-bold">大小：</span><MathFormula tex="G = mg" /> (g 为重力加速度)</li>
                        <li><span className="font-bold">方向：</span><span className="text-indigo-600 font-bold">竖直向下</span> (垂直于水平面，非指向地心)</li>
                        <li><span className="font-bold">作用点：</span>重心 (几何形状规则、质量分布均匀的物体，重心在几何中心)</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-center">
                    <div className="relative w-24 h-24 border-b-2 border-slate-300">
                        <div className="absolute left-1/2 bottom-8 w-12 h-12 bg-white border border-slate-400 -translate-x-1/2 flex items-center justify-center shadow-sm">
                            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        </div>
                        <div className="absolute left-1/2 bottom-14 w-0.5 h-10 bg-red-500 -translate-x-1/2"></div>
                        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 w-2 h-2 border-r-2 border-b-2 border-red-500 rotate-45"></div>
                        <span className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 text-xs font-bold text-red-600 mt-1">G</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 弹力 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-emerald-500" /> 2. 弹力 (Elastic Force)
            </h4>
            <div className="text-sm text-slate-600 space-y-4">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-2">胡克定律 (Hooke's Law)</span>
                    <p className="mb-2">在弹性限度内，弹簧弹力的大小与弹簧的伸长（或缩短）量成正比。</p>
                    <FormulaCard className="bg-white border-emerald-500 my-0 py-3">
                        <MathFormula tex="F = kx" block className="text-2xl font-bold text-emerald-800" />
                        <div className="text-xs text-emerald-600 mt-1">k: 劲度系数 (N/m), x: 形变量</div>
                    </FormulaCard>
                </div>
                <WarningCard title="弹力的方向">
                    <ul className="list-disc list-inside space-y-1">
                        <li><span className="font-bold">压力/支持力：</span>垂直于接触面，指向被压/被支持的物体。</li>
                        <li><span className="font-bold">绳的拉力：</span>沿着绳指向绳收缩的方向。</li>
                        <li><span className="font-bold">杆的弹力：</span>不一定沿杆方向（可拉、可压、可挑）。</li>
                    </ul>
                </WarningCard>
            </div>
        </div>
    </div>
  ),
  section3_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <MoveHorizontal className="w-5 h-5 text-purple-500" /> 摩擦力 (Friction)
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
                {/* 滑动摩擦力 */}
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                    <h5 className="font-bold text-purple-900 mb-3 text-base">滑动摩擦力</h5>
                    <p className="text-xs text-purple-800 mb-3">两个相互接触的物体发生<span className="font-bold">相对滑动</span>时产生的阻碍相对运动的力。</p>
                    <div className="bg-white p-3 rounded-lg border border-purple-200 text-center shadow-sm">
                        <MathFormula tex="f = \mu N" block className="text-xl font-bold text-purple-800" />
                        <div className="text-xs text-purple-600 mt-1"><MathFormula tex="\mu" />: 动摩擦因数, N: 正压力</div>
                    </div>
                    <div className="mt-3 text-xs text-purple-800">
                        <span className="font-bold">方向：</span>与<span className="font-bold underline">相对运动</span>方向相反。
                    </div>
                </div>

                {/* 静摩擦力 */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-800 mb-3 text-base">静摩擦力</h5>
                    <p className="text-xs text-slate-600 mb-3">两个相互接触的物体有<span className="font-bold">相对运动趋势</span>时产生的力。</p>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-sm">
                        <MathFormula tex="0 < f \le f_{max}" block className="text-xl font-bold text-slate-700" />
                    </div>
                    <div className="mt-3 text-xs text-slate-600">
                        <span className="font-bold">大小：</span>由外部受力情况决定（平衡条件求解）。
                        <br/>
                        <span className="font-bold">方向：</span>与<span className="font-bold underline">相对运动趋势</span>方向相反。
                    </div>
                </div>
            </div>

            <WarningCard title="易错点辨析">
                <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                    <li>摩擦力不一定是阻力，也可以是动力（如传送带送货）。</li>
                    <li>受静摩擦力的物体不一定静止（如随传送带加速的物体）。</li>
                    <li>正压力 <MathFormula tex="N" /> 不一定等于重力 <MathFormula tex="G" />（如斜面上 <MathFormula tex="N = G\cos\theta" />）。</li>
                </ul>
            </WarningCard>
        </div>
    </div>
  ),
  section3_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">牛顿第三定律</h4>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 text-center">
                <p className="text-lg font-bold text-indigo-900 mb-2">作用力与反作用力</p>
                <p className="text-sm text-indigo-800">
                    两个物体之间的作用力和反作用力总是大小相等，方向相反，作用在同一条直线上。
                </p>
                <div className="mt-4 inline-block bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                    <MathFormula tex="F = -F'" className="text-xl font-bold text-indigo-600" />
                </div>
            </div>

            <div className="mt-6">
                <h5 className="font-bold text-slate-700 mb-3 text-sm">一对相互作用力 vs 一对平衡力</h5>
                <div className="overflow-hidden rounded-lg border border-slate-200 text-sm">
                    <table className="w-full text-center">
                        <thead className="bg-slate-50 text-slate-600 font-bold">
                            <tr>
                                <th className="p-3 border-b">比较项目</th>
                                <th className="p-3 border-b text-indigo-600">相互作用力</th>
                                <th className="p-3 border-b text-emerald-600">平衡力</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="p-3 font-bold bg-slate-50/50">作用对象</td>
                                <td className="p-3"><span className="font-bold text-indigo-600">异体</span> (A对B，B对A)</td>
                                <td className="p-3"><span className="font-bold text-emerald-600">同体</span> (A受到的力)</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold bg-slate-50/50">性质</td>
                                <td className="p-3">一定相同 (同生同灭)</td>
                                <td className="p-3">不一定相同</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-bold bg-slate-50/50">效果</td>
                                <td className="p-3">各自产生效果</td>
                                <td className="p-3">合力为零</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  ),
  section3_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> 4. 力的合成与分解
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 className="font-bold text-slate-700 mb-2 border-l-4 border-indigo-500 pl-2">平行四边形定则</h5>
                    <div className="bg-slate-50 h-40 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden">
                        {/* SVG Visualization */}
                        <svg viewBox="0 0 200 120" className="w-full h-full">
                            <defs>
                                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                    <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
                                </marker>
                                <marker id="arrow-res" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                    <path d="M0,0 L0,6 L6,3 z" fill="#4f46e5" />
                                </marker>
                            </defs>
                            <line x1="20" y1="100" x2="100" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
                            <text x="60" y="115" fontSize="10" fill="#64748b">F1</text>
                            
                            <line x1="20" y1="100" x2="60" y2="40" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
                            <text x="30" y="60" fontSize="10" fill="#64748b">F2</text>
                            
                            <line x1="100" y1="100" x2="140" y2="40" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
                            <line x1="60" y1="40" x2="140" y2="40" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
                            
                            <line x1="20" y1="100" x2="140" y2="40" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrow-res)" />
                            <text x="90" y="60" fontSize="12" fill="#4f46e5" fontWeight="bold">F合</text>
                        </svg>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        合力范围：<MathFormula tex="|F_1 - F_2| \le F \le F_1 + F_2" />
                    </div>
                </div>
                
                <div>
                    <h5 className="font-bold text-slate-700 mb-2 border-l-4 border-emerald-500 pl-2">正交分解法 (重点)</h5>
                    <div className="text-sm text-slate-600 space-y-2">
                        <p>建立坐标系，将力分解到 x 轴和 y 轴上。</p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <MathFormula tex="\begin{cases} F_x = F \cos\theta \\ F_y = F \sin\theta \end{cases}" block className="mb-2"/>
                            <div className="text-xs text-slate-500 border-t border-slate-200 pt-1">
                                合成：<MathFormula tex="F = \sqrt{F_x^2 + F_y^2}" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section3_5: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-500" /> 5. 共点力的平衡
            </h4>
            <FormulaCard className="bg-orange-50/20 border-orange-500">
                <div className="text-sm text-orange-800 font-bold mb-2">平衡条件</div>
                <MathFormula tex="F_{net} = 0 \quad \text{or} \quad \begin{cases} \sum F_x = 0 \\ \sum F_y = 0 \end{cases}" block className="text-xl text-slate-800" />
            </FormulaCard>
            
            <div className="space-y-4 mt-6">
                <h5 className="font-bold text-slate-700 text-sm">常用解题方法</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-indigo-700 block mb-1">合成法</span>
                        <span className="text-xs text-slate-600">适用于受3个力。任意两力的合力与第三个力大小相等、方向相反。</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-indigo-700 block mb-1">正交分解法</span>
                        <span className="text-xs text-slate-600">适用于受3个及以上力。建立坐标系，列方程组求解。</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="font-bold text-indigo-700 block mb-1">矢量三角形</span>
                        <span className="text-xs text-slate-600">三个力平衡构成封闭三角形。适用于动态平衡分析。</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};
