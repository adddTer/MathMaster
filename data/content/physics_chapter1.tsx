
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Target, Clock, Activity, Ruler, Zap, PlayCircle, MousePointer2, Settings } from 'lucide-react';

const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 p-2 opacity-5 text-primary-500">
        <MathFormula tex="\sum" />
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

export const PhysicsChapter1Content = {
  section1_1: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2 relative z-10">
                <Target className="w-5 h-5 text-blue-500" /> 1. 质点 (Point Mass)
            </h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed relative z-10">
                用来代替物体的<span className="font-bold text-slate-800">有质量的点</span>。这是一种为了简化研究而引入的<span className="font-bold text-blue-600">理想化物理模型</span>。
            </p>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">核心判断依据</span>
                <p className="text-sm text-slate-700 font-medium mb-3">
                    物体的大小和形状对所研究的问题<span className="text-blue-600">没有影响</span>或<span className="text-blue-600">影响可以忽略</span>。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2 p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <div className="mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div></div>
                        <div>
                            <span className="font-bold">能看作质点：</span>
                            <div className="opacity-80 mt-0.5">研究地球绕太阳公转（公转半径远大于地球半径）。</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 p-2 rounded bg-red-50 text-red-800 border border-red-100">
                        <div className="mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div></div>
                        <div>
                            <span className="font-bold">不能看作质点：</span>
                            <div className="opacity-80 mt-0.5">研究地球自转、研究跳水运动员的空中姿态。</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 参考系与坐标系</h4>
            <div className="space-y-6">
                <div className="flex gap-4 items-start group">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 group-hover:bg-indigo-100 transition-colors"><Clock className="w-5 h-5"/></div>
                    <div>
                        <span className="font-bold text-slate-800 block text-base mb-1">参考系 (Reference Frame)</span>
                        <p className="text-sm text-slate-600 leading-relaxed mb-2">
                            为了描述物体运动而选作参照的物体。
                        </p>
                        <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside bg-slate-50 p-2 rounded-lg">
                            <li><span className="font-bold">任意性</span>：可选任意物体（通常选地面）。</li>
                            <li><span className="font-bold">标准性</span>：一旦被选作参考系，就假定它是不动的。</li>
                            <li><span className="font-bold">差异性</span>：参考系不同，运动描述可能不同（如“刻舟求剑”）。</li>
                        </ul>
                    </div>
                </div>
                
                <div className="flex gap-4 items-start group">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0 group-hover:bg-purple-100 transition-colors"><Ruler className="w-5 h-5"/></div>
                    <div className="w-full">
                        <span className="font-bold text-slate-800 block text-base mb-1">坐标系 (Coordinate System)</span>
                        <p className="text-sm text-slate-600 mb-3">为了定量描述物体的位置及位置变化。</p>
                        
                        {/* Improved Coordinate Visualization */}
                        <div className="relative h-16 w-full bg-slate-50 rounded-xl border border-slate-200 flex items-center px-8 overflow-hidden">
                            <div className="absolute left-0 bottom-0 text-[10px] text-slate-300 p-1">1D Space</div>
                            <div className="w-full h-0.5 bg-slate-400 relative">
                                {/* Origin */}
                                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-2 h-2 bg-slate-600 rounded-full ring-4 ring-white"></div>
                                    <span className="text-xs font-mono font-bold text-slate-500 mt-2">0</span>
                                </div>
                                {/* Point A */}
                                <div className="absolute top-1/2 left-[50%] -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full ring-4 ring-white"></div>
                                    <span className="text-xs font-mono font-bold text-purple-600 mt-2">3</span>
                                </div>
                                {/* Point B */}
                                <div className="absolute top-1/2 left-[80%] -translate-y-1/2 flex flex-col items-center">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white"></div>
                                    <span className="text-xs font-mono font-bold text-blue-600 mt-2">x</span>
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-1/2 right-0 w-0 h-0 border-l-[8px] border-l-slate-400 border-y-[4px] border-y-transparent -translate-y-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section1_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg">1. 时刻与时间间隔</h4>
            
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="relative h-12 w-full flex items-center">
                    {/* Time Axis Line */}
                    <div className="absolute w-full h-0.5 bg-slate-300"></div>
                    <div className="absolute right-0 w-0 h-0 border-l-[10px] border-l-slate-300 border-y-[6px] border-y-transparent"></div>
                    
                    {/* t1 */}
                    <div className="absolute left-[20%] flex flex-col items-center group cursor-pointer">
                        <div className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-slate-50 group-hover:scale-125 transition-transform relative z-10"></div>
                        <div className="absolute top-4 text-xs font-bold text-red-600 whitespace-nowrap">t₁ (8:00)</div>
                        <div className="absolute bottom-4 text-[10px] text-slate-400 bg-white px-1 rounded border border-slate-200">时刻</div>
                    </div>

                    {/* t2 */}
                    <div className="absolute left-[60%] flex flex-col items-center group cursor-pointer">
                        <div className="w-3 h-3 bg-red-500 rounded-full ring-4 ring-slate-50 group-hover:scale-125 transition-transform relative z-10"></div>
                        <div className="absolute top-4 text-xs font-bold text-red-600 whitespace-nowrap">t₂ (8:45)</div>
                        <div className="absolute bottom-4 text-[10px] text-slate-400 bg-white px-1 rounded border border-slate-200">时刻</div>
                    </div>

                    {/* Interval Bar */}
                    <div className="absolute left-[20%] width-[40%] h-1 bg-blue-500/30 rounded-full top-1/2 -translate-y-1/2" style={{ width: '40%' }}></div>
                    <div className="absolute left-[40%] top-[-20px] text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        Δt = 45min (时间间隔)
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-red-200 transition-colors">
                    <span className="font-bold text-slate-800 block mb-1">时刻 (Instant)</span>
                    <span className="text-slate-500 text-xs">时间轴上的一个点。如“第3秒初”、“第3秒末”。</span>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-200 transition-colors">
                    <span className="font-bold text-slate-800 block mb-1">时间间隔 (Interval)</span>
                    <span className="text-slate-500 text-xs">时间轴上的一段。如“3秒内”、“第3秒内”。</span>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 路程与位移</h4>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="w-1/2 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h5 className="font-bold text-indigo-900 mb-2 flex items-center justify-between">
                            位移 (Displacement)
                            <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded">矢量</span>
                        </h5>
                        <p className="text-xs text-indigo-800/80 mb-2">初位置指向末位置的有向线段。</p>
                        <MathFormula tex="\Delta x = x_{final} - x_{initial}" className="text-indigo-700 font-bold" />
                    </div>
                    <div className="w-1/2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h5 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
                            路程 (Distance)
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">标量</span>
                        </h5>
                        <p className="text-xs text-slate-600">物体运动轨迹的实际长度。</p>
                    </div>
                </div>
                
                <WarningCard title="关键区别">
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                        <li>只有在<span className="font-bold text-red-600">单向直线运动</span>中，位移的大小才等于路程。</li>
                        <li>一般情况下：<MathFormula tex="|\text{位移}| \le \text{路程}" />。</li>
                        <li>位移与路径无关，只取决于始末位置；路程与路径有关。</li>
                    </ul>
                </WarningCard>
            </div>
        </div>
    </div>
  ),
  section1_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" /> 速度 (Velocity)
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                描述物体运动<span className="font-bold text-orange-600">快慢</span>和<span className="font-bold text-orange-600">方向</span>的物理量。
            </p>
            <FormulaCard className="bg-orange-50/30 border-orange-500">
                <MathFormula tex="v = \frac{\Delta x}{\Delta t}" block className="text-3xl font-bold text-orange-700" />
                <div className="text-xs text-orange-600 mt-2">单位：m/s, km/h</div>
            </FormulaCard>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-bold text-slate-800 block mb-1 text-base">平均速度</span>
                    <div className="text-xs text-slate-500 mb-2">粗略描述一段时间内的运动快慢</div>
                    <MathFormula tex="\bar{v} = \frac{x}{t}" className="text-slate-700 font-bold" />
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <MousePointer2 className="w-3 h-3" /> 方向：与位移方向相同
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <span className="font-bold text-slate-800 block mb-1 text-base">瞬时速度</span>
                    <div className="text-xs text-slate-500 mb-2">精确描述某一时刻（位置）的快慢</div>
                    <MathFormula tex="v = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t}" className="text-slate-700 font-bold" />
                    <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <MousePointer2 className="w-3 h-3" /> 方向：轨迹切线方向
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200 text-sm">
            <h5 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4" /> 速率 (Speed) vs 速度 (Velocity)
            </h5>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-bold block text-xs text-slate-500 mb-1">瞬时速率</span>
                    <p className="text-slate-700">瞬时速度的大小。汽车速度计显示的就是瞬时速率。</p>
                </div>
                <div>
                    <span className="font-bold block text-xs text-slate-500 mb-1">平均速率</span>
                    <p className="text-slate-700">路程与时间的比值。<MathFormula tex="v_{rate} = \frac{S}{t}" /></p>
                </div>
            </div>
            <div className="text-xs text-red-500 italic border-t border-slate-200 pt-2 mt-2">
                注意：平均速度的大小 <MathFormula tex="\ne" /> 平均速率（除非单向直线运动）。
            </div>
        </div>
    </div>
  ),
  section1_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-500" /> 实验：打点计时器
            </h4>
            
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm text-indigo-600 font-bold text-xl shrink-0 text-center min-w-[60px]">
                    <div>50<span className="text-xs">Hz</span></div>
                </div>
                <div>
                    <h5 className="font-bold text-indigo-900 text-sm mb-1">核心考点：频率与周期</h5>
                    <p className="text-sm text-indigo-800/80 leading-relaxed">
                        我国使用的交流电频率通常为 <span className="font-bold text-indigo-700">50Hz</span>。
                        <br/>
                        这意味着打点计时器每隔 <MathFormula tex="T = \frac{1}{f} = 0.02s" /> 打一个点。
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                    <h5 className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">电磁打点计时器</h5>
                    <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex justify-between"><span>电源</span> <span className="font-bold text-slate-800">约 8V 交流电</span></li>
                        <li className="flex justify-between"><span>原理</span> <span>电流磁效应 (振针打点)</span></li>
                        <li className="flex justify-between"><span>阻力</span> <span>较大 (纸带与限位孔/复写纸摩擦)</span></li>
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                    <h5 className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-2">电火花计时器</h5>
                    <ul className="text-xs text-slate-600 space-y-2">
                        <li className="flex justify-between"><span>电源</span> <span className="font-bold text-slate-800">220V 交流电</span></li>
                        <li className="flex justify-between"><span>原理</span> <span>脉冲电流放电 (墨粉纸盘)</span></li>
                        <li className="flex justify-between"><span>阻力</span> <span className="font-bold text-emerald-600">较小 (精度更高)</span></li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h5 className="font-bold text-slate-700 mb-4 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" /> 纸带数据处理
                </h5>
                
                {/* Visual Representation of Tape */}
                <div className="relative h-20 w-full bg-white border border-slate-300 shadow-inner flex items-center mb-6 overflow-hidden rounded-md">
                    <div className="absolute w-full h-px bg-slate-200 top-1/2"></div>
                    <div className="flex w-full px-6 relative justify-between items-center">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-1 z-10 relative group">
                                <div className="w-2.5 h-2.5 bg-slate-800 rounded-full shadow-sm group-hover:scale-125 transition-transform"></div>
                                <span className="text-xs font-mono font-bold text-slate-500 absolute top-4">{i}</span>
                                {i < 4 && (
                                    <div className="absolute left-[50%] w-[200%] top-[-20px] border-b border-slate-300 text-[10px] text-slate-400 text-center pt-1 hidden md:block">
                                        <MathFormula tex={`x_{${i+1}}`} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <span className="font-bold text-indigo-700 block mb-1">1. 求瞬时速度</span>
                        <p className="text-xs text-slate-600 mb-2">
                            “做匀变速直线运动的物体，中间时刻的瞬时速度等于该段时间内的平均速度。”
                        </p>
                        <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                            <MathFormula tex="v_n = \frac{x_n + x_{n+1}}{2T}" />
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-indigo-700 block mb-1">2. 逐差法求加速度</span>
                        <p className="text-xs text-slate-600 mb-2">
                            利用 <MathFormula tex="\Delta x = aT^2" />。
                        </p>
                        <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                            <MathFormula tex="a = \frac{(x_4+x_5+x_6)-(x_1+x_2+x_3)}{9T^2}" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section1_5: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" /> 加速度 (Acceleration)
            </h4>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-4">
                        描述速度<span className="font-bold text-red-600">变化快慢</span>的物理量，等于速度的变化量与发生这一变化所用时间的比值。
                    </p>
                    <FormulaCard className="bg-red-50/20 border-red-500 my-0">
                        <MathFormula tex="a = \frac{\Delta v}{\Delta t} = \frac{v - v_0}{t}" block className="text-3xl font-bold text-red-800" />
                        <div className="text-xs text-red-600 mt-2 text-center font-bold">定义式</div>
                    </FormulaCard>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-3 text-sm">加速度的方向 (矢量性)</h5>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200">
                            <div className="flex flex-col items-center gap-1 w-8">
                                <div className="w-full h-1 bg-emerald-500 rounded"></div>
                                <div className="w-full h-1 bg-emerald-500 rounded"></div>
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-emerald-700">加速运动</span>
                                <br/><MathFormula tex="a" /> 与 <MathFormula tex="v" /> 同向
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200">
                            <div className="flex flex-col items-center gap-1 w-8">
                                <div className="w-full h-1 bg-red-500 rounded"></div>
                                <div className="w-full h-1 bg-emerald-500 rounded"></div>
                            </div>
                            <div className="text-xs">
                                <span className="font-bold text-red-700">减速运动</span>
                                <br/><MathFormula tex="a" /> 与 <MathFormula tex="v" /> 反向
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <WarningCard title="概念辨析 (必考)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-center">
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="font-bold block text-slate-700 text-sm mb-1">速度大</span>
                        <span className="text-slate-500">位置变化快</span>
                        <div className="text-amber-600 mt-1">如：高速飞行的飞机</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm">
                        <span className="font-bold block text-slate-700 text-sm mb-1">速度变化大</span>
                        <span className="text-slate-500"><MathFormula tex="\Delta v" /> 大</span>
                        <div className="text-amber-600 mt-1">如：从0加速到100</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-amber-100 shadow-sm ring-2 ring-amber-100">
                        <span className="font-bold block text-slate-700 text-sm mb-1">速度变化快</span>
                        <span className="text-slate-500"><MathFormula tex="a" /> 大</span>
                        <div className="text-amber-600 mt-1">如：子弹射出瞬间</div>
                    </div>
                </div>
                <p className="mt-3 text-xs text-amber-800 text-center">
                    <span className="font-bold">结论：</span>加速度与速度大小无必然联系，只与速度变化的快慢有关。
                </p>
            </WarningCard>
        </div>
    </div>
  )
};
