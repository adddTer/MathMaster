
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { PlanarGeometry } from '../../components/PlanarGeometry';
import { Orbit, Globe, Rocket, Scale, Clock, AlertTriangle, Atom } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="G" />
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

export const PhysicsChapter7Content = {
  section7_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Orbit className="w-5 h-5 text-blue-500" /> 1. 开普勒行星运动定律
            </h4>
            
            <div className="space-y-6">
                {/* First Law */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm border-l-4 border-blue-500 pl-2">第一定律 (轨道定律)</span>
                    <p className="text-sm text-slate-600 mb-3">所有行星绕太阳运动的轨道都是<span className="font-bold">椭圆</span>，太阳处在椭圆的一个<span className="font-bold">焦点</span>上。</p>
                    <div className="flex justify-center bg-white p-2 rounded-lg border border-slate-200">
                        <PlanarGeometry 
                            width={240} height={140}
                            xDomain={[-3, 3]} yDomain={[-2, 2]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'function', expr: 'Math.sqrt(3 * (1 - (x*x)/4))', color: '#94a3b8', dashed: true }, // Upper ellipse
                                { type: 'function', expr: '-Math.sqrt(3 * (1 - (x*x)/4))', color: '#94a3b8', dashed: true }, // Lower ellipse
                                { type: 'circle', center: {x: -1, y: 0}, radius: 0.3, fill: '#f59e0b', color: '#f59e0b' }, // Sun at Focus 1
                                { type: 'circle', center: {x: 2, y: 0}, radius: 0.15, fill: '#3b82f6', color: '#3b82f6', label: 'Planet' }, // Planet
                                { type: 'point', x: 1, y: 0, color: '#cbd5e1' }, // Empty Focus 2
                            ]}
                            title="行星轨道示意图"
                        />
                    </div>
                </div>

                {/* Second Law */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm border-l-4 border-emerald-500 pl-2">第二定律 (面积定律)</span>
                    <p className="text-sm text-slate-600">
                        对任意一个行星来说，它与太阳的连线在相等的时间内扫过相等的面积。
                    </p>
                    <div className="mt-2 text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded">
                        推论：近日点速度最大，远日点速度最小。
                    </div>
                </div>

                {/* Third Law */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm border-l-4 border-purple-500 pl-2">第三定律 (周期定律)</span>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 text-sm text-slate-600">
                            所有行星轨道的半长轴的三次方跟它的公转周期的二次方之比都相等。
                        </div>
                        <FormulaCard className="my-0 py-2 px-4 bg-purple-50/20 border-purple-400">
                            <MathFormula tex="\frac{a^3}{T^2} = k" className="text-xl font-bold text-purple-800" />
                        </FormulaCard>
                    </div>
                    <WarningCard title="关于常量 k">
                        <p className="text-xs">
                            <MathFormula tex="k" /> 值只与<span className="font-bold text-slate-800">中心天体</span>（太阳）的质量有关，与行星无关。
                            不同中心天体系统（如地球卫星系统），k 值不同。
                        </p>
                    </WarningCard>
                </div>
            </div>
        </div>
    </div>
  ),
  section7_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> 2. 万有引力定律
            </h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                自然界中任何两个物体都相互吸引，引力的方向在它们的连线上。
            </p>
            
            <FormulaCard className="bg-indigo-50/20 border-indigo-500">
                <MathFormula tex="F = G \frac{m_1 m_2}{r^2}" block className="text-3xl font-bold text-indigo-800" />
                <div className="text-xs text-indigo-600 mt-2">
                    <span className="font-bold">G:</span> 引力常量 (<MathFormula tex="6.67 \times 10^{-11} N \cdot m^2 / kg^2" />)
                </div>
            </FormulaCard>

            <div className="grid md:grid-cols-2 gap-4 mt-6 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">适用条件</span>
                    <ul className="list-disc list-inside text-xs text-slate-500 space-y-1">
                        <li>质点间的相互作用。</li>
                        <li>质量分布均匀的球体（r 为球心距）。</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">卡文迪许实验</span>
                    <p className="text-xs text-slate-500">
                        利用<span className="font-bold">扭秤实验</span>放大了微小引力，首次测出了引力常量 G。被称为“第一个称出地球质量的人”。
                    </p>
                </div>
            </div>

            <WarningCard title="引力与重力的关系">
                <p className="text-sm mb-2">
                    重力是万有引力的一个<span className="font-bold">分力</span>（另一个分力提供随地球自转的向心力）。
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-center">
                    <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="block font-bold mb-1">两极处</span>
                        <MathFormula tex="G_{gravity} = F_{pull}" />
                        <span className="block text-slate-400 transform scale-90">向心力为0</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-amber-200">
                        <span className="block font-bold mb-1">赤道处</span>
                        <MathFormula tex="G_{gravity} = F_{pull} - F_n" />
                        <span className="block text-slate-400 transform scale-90">向心力最大</span>
                    </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                    * 通常计算中（忽略自转），近似认为 <MathFormula tex="mg = G\frac{Mm}{R^2}" /> (黄金代换)。
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  section7_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-500" /> 3. 万有引力理论的成就
            </h4>
            
            <div className="bg-gradient-to-r from-emerald-50 to-white p-5 rounded-xl border border-emerald-100 mb-6">
                <div className="text-sm font-bold text-emerald-800 mb-2">核心解题思路：万有引力提供向心力</div>
                <MathFormula tex="G\frac{Mm}{r^2} = F_n" block className="text-xl font-bold text-emerald-700" />
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                    <span className="px-2 py-1 bg-white rounded border border-emerald-200 text-xs"><MathFormula tex="m\frac{v^2}{r}" /></span>
                    <span className="px-2 py-1 bg-white rounded border border-emerald-200 text-xs"><MathFormula tex="m\omega^2 r" /></span>
                    <span className="px-2 py-1 bg-white rounded border border-emerald-200 text-xs"><MathFormula tex="m(\frac{2\pi}{T})^2 r" /></span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                    <div>
                        <span className="font-bold text-slate-700 text-sm">计算天体质量 (M)</span>
                        <div className="text-xs text-slate-600 mt-1 mb-2">已知环绕天体的周期 T 和轨道半径 r：</div>
                        <MathFormula tex="M = \frac{4\pi^2 r^3}{G T^2}" className="text-emerald-700 font-bold" />
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                    <div>
                        <span className="font-bold text-slate-700 text-sm">计算天体密度 (<MathFormula tex="\rho" />)</span>
                        <div className="text-xs text-slate-600 mt-1 mb-2">
                            若卫星绕天体表面运行 (<MathFormula tex="r \approx R" />)：
                        </div>
                        <MathFormula tex="\rho = \frac{M}{V} = \frac{3\pi}{G T^2}" className="text-emerald-700 font-bold" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section7_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Rocket className="w-5 h-5 text-orange-500" /> 4. 宇宙航行
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                    <div className="text-xs font-bold text-orange-800 mb-1">第一宇宙速度</div>
                    <MathFormula tex="7.9 \text{ km/s}" block className="text-xl font-bold text-orange-600 mb-1" />
                    <div className="text-[10px] text-orange-700/80">
                        最小发射速度<br/>最大环绕速度
                    </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-700 mb-1">第二宇宙速度</div>
                    <MathFormula tex="11.2 \text{ km/s}" block className="text-xl font-bold text-slate-600 mb-1" />
                    <div className="text-[10px] text-slate-500">脱离地球引力<br/>成为太阳行星</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-700 mb-1">第三宇宙速度</div>
                    <MathFormula tex="16.7 \text{ km/s}" block className="text-xl font-bold text-slate-600 mb-1" />
                    <div className="text-[10px] text-slate-500">飞出太阳系</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner mb-6">
                <h5 className="font-bold text-slate-700 mb-3 text-sm">卫星运行规律 (越远越慢)</h5>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span>轨道半径 <MathFormula tex="r" /></span>
                        <span className="font-bold text-indigo-600">增大 <MathFormula tex="\uparrow" /></span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span>线速度 <MathFormula tex="v = \sqrt{GM/r}" /></span>
                        <span className="font-bold text-emerald-600">减小 <MathFormula tex="\downarrow" /></span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span>角速度 <MathFormula tex="\omega = \sqrt{GM/r^3}" /></span>
                        <span className="font-bold text-emerald-600">减小 <MathFormula tex="\downarrow" /></span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>周期 <MathFormula tex="T = \sqrt{4\pi^2 r^3/GM}" /></span>
                        <span className="font-bold text-indigo-600">增大 <MathFormula tex="\uparrow" /></span>
                    </div>
                </div>
            </div>

            <WarningCard title="同步卫星 (Geostationary Satellite) 特点">
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    <li><span className="font-bold">定轨道：</span>必须在赤道正上方。</li>
                    <li><span className="font-bold">定周期：</span>T = 24h (与地球自转同步)。</li>
                    <li><span className="font-bold">定高度：</span>h ≈ 36000 km (唯一确定)。</li>
                    <li><span className="font-bold">定速度：</span>v ≈ 3.08 km/s (恒定)。</li>
                </ul>
            </WarningCard>
        </div>
    </div>
  ),
  section7_5: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Atom className="w-5 h-5 text-slate-600" /> 5. 经典力学的局限性
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2 border-b border-slate-100 pb-1">经典力学 (牛顿)</span>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            适用：宏观、低速、弱引力
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            时间、空间、质量是绝对的，与运动无关。
                        </li>
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2 border-b border-slate-100 pb-1">相对论 & 量子力学</span>
                    <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                            适用：微观、高速、强引力
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                            时间延缓（钟慢效应）、长度收缩（尺缩效应）、质量随速度增加。
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-slate-100/50 rounded-lg text-xs text-slate-500 italic text-center">
                “牛顿力学是相对论在低速情况下的近似。”
            </div>
        </div>
    </div>
  )
};
