import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { SolidGeometry } from '../../components/SolidGeometry';
import { Box, Layers, Maximize, Ruler, BookOpen, Rotate3d, Square } from 'lucide-react';

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

export const Chapter13Content = {
  section13_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Box className="w-5 h-5 text-blue-500" /> 1. 简单几何体
            </h4>
            <p className="text-sm text-slate-600 mb-6">
                几何体 (Solid) 是由点、线、面围成的空间部分。
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 text-base">多面体 (Polyhedron)</h5>
                    <div className="text-sm text-slate-500 mb-6 text-center">由若干个平面多边形围成的几何体</div>
                    <div className="grid grid-cols-2 gap-8 w-full">
                        <div className="text-center group">
                            <SolidGeometry type="prism" width={120} height={120} autoRotate />
                            <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">棱柱</span>
                        </div>
                        <div className="text-center group">
                            <SolidGeometry type="pyramid" width={120} height={120} autoRotate />
                            <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors">棱锥</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2 text-base">旋转体 (Solid of Revolution)</h5>
                    <div className="text-sm text-slate-500 mb-6 text-center">平面曲线绕定直线旋转一周形成的几何体</div>
                    <div className="text-center group">
                        <SolidGeometry type="cylinder_wire" width={140} height={140} autoRotate />
                        <span className="text-sm font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">圆柱</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 棱柱、棱锥、棱台的结构特征</h4>
            <div className="space-y-4 text-sm">
                <div className="p-4 border-l-4 border-blue-400 bg-blue-50/30 rounded-r-lg">
                    <span className="font-bold text-slate-800 block mb-2 text-base">棱柱 (Prism)</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-1.5 ml-2">
                        <li>有两个面互相<span className="font-bold text-blue-600">平行</span>（底面）。</li>
                        <li>其余各面都是<span className="font-bold">平行四边形</span>（侧面）。</li>
                        <li>相邻侧面的公共边互相<span className="font-bold">平行</span>（侧棱）。</li>
                    </ul>
                </div>
                <div className="p-4 border-l-4 border-purple-400 bg-purple-50/30 rounded-r-lg">
                    <span className="font-bold text-slate-800 block mb-2 text-base">棱锥 (Pyramid)</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-1.5 ml-2">
                        <li>有一个面是多边形（底面）。</li>
                        <li>其余各面都是有一个<span className="font-bold text-purple-600">公共顶点</span>的三角形（侧面）。</li>
                    </ul>
                </div>
                <div className="p-4 border-l-4 border-orange-400 bg-orange-50/30 rounded-r-lg">
                    <span className="font-bold text-slate-800 block mb-2 text-base">棱台 (Frustum)</span>
                    <div className="text-slate-700 leading-relaxed">
                        用一个平行于棱锥底面的平面去截棱锥，底面与截面之间的部分。
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section13_2: (
    <div className="space-y-6">
        {/* 四个公理 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" /> 1. 平面的基本性质 (四个公理)
            </h4>
            <div className="space-y-4 text-sm">
                <div className="flex gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 items-start">
                    <div className="bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 text-slate-500 shadow-sm">1</div>
                    <div>
                        <span className="font-bold text-slate-800 text-base block mb-1">公理1 (确定性)</span>
                        <p className="text-slate-600">如果一条直线上的<span className="font-bold text-indigo-600">两点</span>在一个平面内，那么这条直线在此平面内。</p>
                    </div>
                </div>
                <div className="flex gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 items-start">
                    <div className="bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 text-slate-500 shadow-sm">2</div>
                    <div>
                        <span className="font-bold text-slate-800 text-base block mb-1">公理2 (交线存在)</span>
                        <p className="text-slate-600">如果两个不重合的平面有一个公共点，那么它们有且只有一条过该点的<span className="font-bold text-indigo-600">公共直线</span>。</p>
                    </div>
                </div>
                <div className="flex gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 items-start">
                    <div className="bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 text-slate-500 shadow-sm">3</div>
                    <div>
                        <span className="font-bold text-slate-800 text-base block mb-1">公理3 (确定平面)</span>
                        <p className="text-slate-600">经过<span className="font-bold text-indigo-600">不在同一直线上</span>的三点，有且只有一个平面。</p>
                        <div className="text-xs text-slate-500 mt-2 p-2 bg-white rounded border border-slate-100">推论：直线与线外一点、两条相交/平行直线都能确定一个平面。</div>
                    </div>
                </div>
                <div className="flex gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 items-start">
                    <div className="bg-white w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center font-bold text-sm shrink-0 text-slate-500 shadow-sm">4</div>
                    <div>
                        <span className="font-bold text-slate-800 text-base block mb-1">公理4 (平行传递)</span>
                        <p className="text-slate-600">平行于同一条直线的两条直线互相平行。</p>
                    </div>
                </div>
            </div>
        </div>

        {/* 空间直线位置关系 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2 text-lg">2. 空间两直线的位置关系</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-center h-full">
                    <div className="font-bold text-emerald-600 text-lg mb-1">相交</div>
                    <div className="text-sm text-slate-600">共面，有1个公共点</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-center h-full">
                    <div className="font-bold text-blue-600 text-lg mb-1">平行</div>
                    <div className="text-sm text-slate-600">共面，无公共点</div>
                </div>
                <div className="p-4 bg-white rounded-lg border-2 border-purple-100 shadow-sm flex flex-col justify-center h-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-bl">重点</div>
                    <div className="font-bold text-purple-600 text-lg mb-1">异面</div>
                    <div className="text-sm text-slate-600">不同在任何一个平面内</div>
                </div>
            </div>

            <WarningCard title="异面直线 (Skew Lines)">
                <div className="space-y-2">
                    <p className="text-sm text-slate-700">既不相交也不平行的两条直线。</p>
                    <div className="pt-2 border-t border-amber-200/50">
                        <span className="font-bold text-slate-800 text-sm">异面直线所成的角：</span>
                        <p className="text-sm text-slate-600 mt-1">
                            过空间任一点分别引这两条直线的平行线，这两条相交直线所成的锐角（或直角）。
                            <br/>
                            <span className="font-medium text-amber-800">取值范围：<MathFormula tex="(0, 90^\circ]" /></span>
                        </p>
                    </div>
                </div>
            </WarningCard>
        </div>

        {/* 线面与面面关系 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Square className="w-5 h-5 text-slate-500" /> 线面与面面位置关系
            </h4>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="p-3 border-b font-bold w-1/4">关系</th>
                            <th className="p-3 border-b font-bold">线与面 <MathFormula tex="l, \alpha" /></th>
                            <th className="p-3 border-b font-bold">面与面 <MathFormula tex="\alpha, \beta" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-700">平行</td>
                            <td className="p-3">
                                <span className="block mb-1">无公共点</span>
                                <MathFormula tex="l // \alpha" className="text-slate-500" />
                            </td>
                            <td className="p-3">
                                <span className="block mb-1">无公共点</span>
                                <MathFormula tex="\alpha // \beta" className="text-slate-500" />
                            </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-700">相交</td>
                            <td className="p-3">有且仅有一个公共点</td>
                            <td className="p-3">有一条公共直线</td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-slate-700">包含/重合</td>
                            <td className="p-3">
                                <span className="block mb-1">有无数个公共点 (在面内)</span>
                                <MathFormula tex="l \subset \alpha" className="text-slate-500" />
                            </td>
                            <td className="p-3">重合</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  ),
  section13_3: (
    <div className="space-y-6">
        {/* 柱体 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Maximize className="w-5 h-5 text-emerald-500" /> 1. 柱体 (Prism & Cylinder)
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2 bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
                    <span className="font-bold text-emerald-900 block mb-3 text-lg">体积公式</span>
                    <MathFormula tex="V = Sh" block className="text-4xl font-bold text-emerald-700 mb-2" />
                    <div className="text-sm text-emerald-700 mt-2 font-medium">S: 底面积, h: 高</div>
                </div>
                <div className="w-full md:w-1/2 text-sm text-slate-600 space-y-4">
                    <div className="p-3 border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-800 block mb-1">圆柱体积</span>
                        <MathFormula tex="V = \pi r^2 h" className="text-base" />
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-800 block mb-1">圆柱侧面积</span>
                        <div className="flex items-center justify-between">
                            <MathFormula tex="S_{side} = 2\pi r l" className="text-base" />
                            <span className="text-xs text-slate-400">展开是矩形</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 锥体 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Rotate3d className="w-5 h-5 text-purple-500" /> 2. 锥体 (Pyramid & Cone)
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/2 bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                    <span className="font-bold text-purple-900 block mb-3 text-lg">体积公式</span>
                    <MathFormula tex="V = \frac{1}{3}Sh" block className="text-4xl font-bold text-purple-700 mb-2" />
                    <div className="text-sm text-purple-700 mt-2 font-medium">是同底等高柱体的 <MathFormula tex="1/3" /></div>
                </div>
                <div className="w-full md:w-1/2 text-sm text-slate-600 space-y-4">
                    <div className="p-3 border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-800 block mb-1">圆锥体积</span>
                        <MathFormula tex="V = \frac{1}{3}\pi r^2 h" className="text-base" />
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                        <span className="font-bold text-slate-800 block mb-1">圆锥侧面积</span>
                        <div className="flex items-center justify-between">
                            <MathFormula tex="S_{side} = \pi r l" className="text-base" />
                            <span className="text-xs text-slate-400">展开是扇形</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 球体 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <div className="w-5 h-5 rounded-full border-2 border-orange-500"></div> 3. 球 (Sphere)
            </h4>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-center">
                    <span className="font-bold text-orange-900 block mb-2 text-base">表面积</span>
                    <MathFormula tex="S = 4\pi R^2" block className="text-3xl font-bold text-orange-700" />
                </div>
                <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 text-center">
                    <span className="font-bold text-orange-900 block mb-2 text-base">体积</span>
                    <MathFormula tex="V = \frac{4}{3}\pi R^3" block className="text-3xl font-bold text-orange-700" />
                </div>
            </div>
            <WarningCard title="记忆技巧">
                <p className="text-sm leading-relaxed">
                    表面积是半径平方的 4 倍圆面积；
                    体积是半径立方的 <MathFormula tex="4/3" />。<br/>
                    <span className="italic opacity-80 block mt-1 text-xs">微积分视角：体积的导数 <MathFormula tex="(4/3 \pi R^3)' = 4\pi R^2" /> 恰好是表面积。</span>
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  prismatoid_app: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-xl flex items-center gap-3">
                <Ruler className="w-6 h-6 text-indigo-600" /> 应用：拟柱体体积公式
            </h4>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                <span className="font-bold text-indigo-700">拟柱体</span>是指所有的顶点都在两个平行平面内的多面体。
                柱体、锥体、台体都是拟柱体的特例。
            </p>
            
            <div className="bg-white border-l-4 border-indigo-500 shadow-sm rounded-r-xl p-6 text-center my-6">
                <div className="text-sm text-slate-500 mb-3 font-medium uppercase tracking-widest">Universal Volume Formula</div>
                <MathFormula tex="V = \frac{h}{6}(S_{up} + 4S_{mid} + S_{low})" block className="text-3xl font-bold text-indigo-800 my-4" />
                <div className="grid grid-cols-3 gap-4 text-sm text-slate-600 mt-4 border-t border-slate-100 pt-4">
                    <div className="flex flex-col"><span className="font-bold text-indigo-600 mb-1">S_up</span> 上底面积</div>
                    <div className="flex flex-col"><span className="font-bold text-indigo-600 mb-1">S_mid</span> 中截面面积</div>
                    <div className="flex flex-col"><span className="font-bold text-indigo-600 mb-1">S_low</span> 下底面积</div>
                </div>
            </div>

            <div className="mt-8 space-y-4">
                <h5 className="font-bold text-slate-800 text-lg border-l-4 border-slate-300 pl-3">公式的退化验证</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 柱体 */}
                    <div className="p-5 bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-lg mb-3 text-indigo-700 border-b border-indigo-50 pb-2">柱体</div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">面积关系</span>
                                <MathFormula tex="S_{up}=S_{low}=S_{mid}=S" className="text-base font-medium text-slate-700" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">推导</span>
                                <MathFormula tex="V = \frac{h}{6}(6S) = Sh" className="text-lg font-bold text-slate-800" />
                            </div>
                        </div>
                    </div>

                    {/* 锥体 */}
                    <div className="p-5 bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-lg mb-3 text-indigo-700 border-b border-indigo-50 pb-2">锥体</div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">面积关系</span>
                                <MathFormula tex="S_{up}=0, S_{mid}=\frac{1}{4}S_{low}" className="text-base font-medium text-slate-700" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">推导</span>
                                <MathFormula tex="V = \frac{h}{6}(0 + 4\cdot\frac{S}{4} + S)" className="text-sm block mb-1" />
                                <MathFormula tex="= \frac{1}{3}Sh" className="text-lg font-bold text-slate-800" />
                            </div>
                        </div>
                    </div>

                    {/* 台体 */}
                    <div className="p-5 bg-white rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-lg mb-3 text-indigo-700 border-b border-indigo-50 pb-2">台体</div>
                        <div className="space-y-3">
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">中截面</span>
                                <MathFormula tex="\sqrt{S_{mid}} = \frac{\sqrt{S'}+\sqrt{S}}{2}" className="text-base font-medium text-slate-700" />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 block mb-1">推导结果</span>
                                <MathFormula tex="V = \frac{1}{3}h(S' + \sqrt{S'S} + S)" className="text-lg font-bold text-slate-800" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  reading_geometry: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
                <BookOpen className="w-64 h-64" />
            </div>
            <h4 className="font-bold text-slate-800 mb-6 text-2xl tracking-tight">阅读：几何学的发展</h4>
            
            <div className="space-y-8 relative z-10">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                        <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                    </div>
                    <div className="pb-4">
                        <h5 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            欧几里得几何 <span className="text-xs font-normal text-slate-400 border border-slate-200 rounded px-2 py-0.5">BC 300</span>
                        </h5>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            欧几里得在《几何原本》中，利用5条公理和5条公设，通过逻辑推理建立了一个严密的几何体系。
                            这是人类历史上第一个公理化体系，也是我们高中学习的立体几何的基础。
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-50"></div>
                        <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                    </div>
                    <div className="pb-4">
                        <h5 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            解析几何 <span className="text-xs font-normal text-slate-400 border border-slate-200 rounded px-2 py-0.5">17世纪</span>
                        </h5>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            笛卡尔创立了解析几何，引入坐标系，用代数方法研究几何问题。
                            这实现了“数”与“形”的完美结合，也就是我们前面学习的函数图像、向量坐标运算的理论源头。
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-50"></div>
                    </div>
                    <div>
                        <h5 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            非欧几何 <span className="text-xs font-normal text-slate-400 border border-slate-200 rounded px-2 py-0.5">19世纪</span>
                        </h5>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            罗巴切夫斯基和黎曼分别突破了欧几里得的<span className="font-bold text-slate-800">第五公设（平行公设）</span>，创立了非欧几何。
                            在黎曼几何中，过直线外一点没有平行线（如球面几何），三角形内角和大于180°。
                            这一理论后来成为了爱因斯坦广义相对论的数学基础。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};