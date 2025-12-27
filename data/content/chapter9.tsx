
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { PlanarGeometry } from '../../components/PlanarGeometry';
import { Move, ArrowUpRight, Maximize, Scale, Grid, ArrowDownRight, Anchor } from 'lucide-react';

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

export const Chapter9Content = {
  section9_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Move className="w-5 h-5 text-blue-500" /> 1. 向量的定义
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                既有<span className="font-bold text-primary-600">大小</span>又有<span className="font-bold text-primary-600">方向</span>的量叫做向量 (Vector)。
                <br/>
                <span className="text-xs text-slate-400">区别于只有大小没有方向的数量（标量），如年龄、身高、质量。</span>
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 mb-2 block">几何表示</span>
                    <div className="bg-white rounded border border-slate-200 mb-2 overflow-hidden relative flex justify-center">
                        <PlanarGeometry 
                            width={200} height={120}
                            xDomain={[-1, 5]} yDomain={[-1, 3]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'point', x:0, y:0, label: 'A', color: '#64748b' },
                                { type: 'point', x:4, y:2, label: 'B', color: '#64748b' },
                                { type: 'vector', start: {x:0,y:0}, end: {x:4,y:2}, color: '#3b82f6' }
                            ]}
                        />
                    </div>
                    <div className="text-xs text-slate-500 text-center">有向线段 <MathFormula tex="\overrightarrow{AB}" /></div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 mb-2 block">字母表示</span>
                    <div className="flex items-center justify-center h-[120px] bg-white rounded border border-slate-200 mb-2 text-2xl font-bold font-serif text-slate-800">
                        <MathFormula tex="\boldsymbol{a}, \boldsymbol{b}, \boldsymbol{c}" />
                    </div>
                    <div className="text-xs text-slate-500 text-center">印刷用黑体，手写用箭头 <MathFormula tex="\vec{a}" /></div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 几种特殊的向量</h4>
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700">零向量</span>
                    <span className="text-slate-600">长度为 0，方向任意。记作 <MathFormula tex="\boldsymbol{0}" />。</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700">单位向量</span>
                    <span className="text-slate-600">模长为 1 的向量。</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700">平行向量 (共线向量)</span>
                    <span className="text-slate-600">方向相同或相反的非零向量。规定 <MathFormula tex="\boldsymbol{0} // \boldsymbol{a}" />。</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="font-bold text-slate-700">相等向量</span>
                    <span className="text-slate-600">长度相等且方向相同的向量。</span>
                </div>
            </div>
            
            <WarningCard title="共线与平行的区别">
                <p className="text-xs">
                    在向量中，<span className="font-bold">平行向量</span>就是<span className="font-bold">共线向量</span>。
                    即使它们的基线不重合（如平行四边形的对边），也称为共线向量。这是向量具有<span className="font-bold text-indigo-600">自由平移</span>性质的体现。
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  section9_2: (
    <div className="space-y-6">
        {/* 加法 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-500" /> 1. 向量加法
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                    <span className="font-bold text-emerald-800 block mb-2">三角形法则</span>
                    <div className="bg-white rounded-lg border border-emerald-50 flex items-center justify-center relative overflow-hidden">
                        <PlanarGeometry 
                            width={240} height={160}
                            xDomain={[-1, 4]} yDomain={[-1, 2.5]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'vector', start: {x:0, y:0}, end: {x:1.5, y:0}, color: '#94a3b8', label: 'a' },
                                { type: 'vector', start: {x:1.5, y:0}, end: {x:2.5, y:1.5}, color: '#94a3b8', label: 'b' },
                                { type: 'vector', start: {x:0, y:0}, end: {x:2.5, y:1.5}, color: '#10b981', label: 'a+b', dashed: true },
                                { type: 'point', x:0, y:0, color: '#64748b' },
                                { type: 'point', x:1.5, y:0, color: '#64748b' },
                                { type: 'point', x:2.5, y:1.5, color: '#10b981' }
                            ]}
                        />
                    </div>
                    <div className="text-xs text-emerald-700 mt-2 font-bold">首尾相接，指终点</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                    <span className="font-bold text-blue-800 block mb-2">平行四边形法则</span>
                    <div className="bg-white rounded-lg border border-blue-50 flex items-center justify-center relative overflow-hidden">
                        <PlanarGeometry 
                            width={240} height={160}
                            xDomain={[-1, 4]} yDomain={[-1, 2.5]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'vector', start: {x:0, y:0}, end: {x:1.5, y:0}, color: '#94a3b8', label: 'a' },
                                { type: 'vector', start: {x:0, y:0}, end: {x:1, y:1.5}, color: '#94a3b8', label: 'b' },
                                { type: 'line', start: {x:1, y:1.5}, end: {x:2.5, y:1.5}, color: '#cbd5e1', dashed: true },
                                { type: 'line', start: {x:1.5, y:0}, end: {x:2.5, y:1.5}, color: '#cbd5e1', dashed: true },
                                { type: 'vector', start: {x:0, y:0}, end: {x:2.5, y:1.5}, color: '#3b82f6', label: 'a+b' },
                                { type: 'point', x:0, y:0, color: '#3b82f6' }
                            ]}
                        />
                    </div>
                    <div className="text-xs text-blue-700 mt-2 font-bold">共起点，对角线</div>
                </div>
            </div>
        </div>

        {/* 减法与数乘 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 减法与数乘</h4>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1 text-sm">
                        <span className="font-bold text-slate-700 block mb-1">向量减法</span>
                        <div className="text-slate-600 mb-2">
                            <MathFormula tex="\boldsymbol{a} - \boldsymbol{b} = \boldsymbol{a} + (-\boldsymbol{b})" />
                        </div>
                        <div className="text-xs bg-white p-2 rounded border border-slate-200 text-slate-500">
                            口诀：<span className="font-bold text-red-500">共起点，连终点，指被减</span>。
                            <br/><MathFormula tex="\overrightarrow{OA} - \overrightarrow{OB} = \overrightarrow{BA}" />
                        </div>
                    </div>
                    <div className="w-full md:w-64 bg-white border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                         <PlanarGeometry 
                            width={240} height={160}
                            xDomain={[-1, 4]} yDomain={[-1, 3]}
                            showGrid={false} showAxes={false}
                            items={[
                                { type: 'point', x:0, y:0, label: 'O', color: '#64748b' },
                                { type: 'vector', start: {x:0, y:0}, end: {x:3, y:1}, color: '#94a3b8', label: 'a' }, // OA
                                { type: 'vector', start: {x:0, y:0}, end: {x:1, y:2.5}, color: '#94a3b8', label: 'b' }, // OB
                                { type: 'vector', start: {x:1, y:2.5}, end: {x:3, y:1}, color: '#ef4444', label: 'a-b', dashed: true }, // BA
                            ]}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center p-3 bg-slate-50 rounded-xl">
                    <div className="flex-1 text-sm">
                        <span className="font-bold text-slate-700 block mb-1">数乘向量</span>
                        <div className="text-slate-600 mb-2">
                            实数 <MathFormula tex="\lambda" /> 与向量 <MathFormula tex="\boldsymbol{a}" /> 的积是一个向量，记作 <MathFormula tex="\lambda\boldsymbol{a}" />。
                        </div>
                        <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                            <li>长度：<MathFormula tex="|\lambda\boldsymbol{a}| = |\lambda||\boldsymbol{a}|" /></li>
                            <li>方向：<MathFormula tex="\lambda > 0" /> 同向，<MathFormula tex="\lambda < 0" /> 反向。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* 数量积 (Dot Product) - New Curriculum Addition */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-purple-500" /> 3. 数量积 (内积)
            </h4>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center mb-6">
                <span className="text-xs text-purple-600 font-bold mb-1 uppercase tracking-wider">Definition</span>
                <MathFormula tex="\boldsymbol{a} \cdot \boldsymbol{b} = |\boldsymbol{a}||\boldsymbol{b}|\cos\theta" block className="text-2xl font-bold text-purple-900" />
                <div className="text-xs text-purple-500 mt-2">
                    <MathFormula tex="\theta" /> 是 <MathFormula tex="\boldsymbol{a}" /> 与 <MathFormula tex="\boldsymbol{b}" /> 的夹角 (<MathFormula tex="0 \le \theta \le \pi" />)
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <h5 className="font-bold text-slate-700 text-sm mb-3">几何意义：投影向量</h5>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                        <span className="font-bold">新课标重点：</span>
                        <MathFormula tex="\boldsymbol{a} \cdot \boldsymbol{b}" /> 等于 <MathFormula tex="\boldsymbol{a}" /> 的长度与 <MathFormula tex="\boldsymbol{b}" /> 在 <MathFormula tex="\boldsymbol{a}" /> 方向上的<span className="font-bold text-indigo-600">投影向量</span>的“数值”乘积。
                    </p>
                    <div className="bg-white p-2 rounded border border-slate-100 text-xs">
                        <div><span className="font-bold">数量射影：</span> <MathFormula tex="|\boldsymbol{b}|\cos\theta" /></div>
                        <div className="mt-1"><span className="font-bold text-indigo-600">投影向量：</span> <MathFormula tex="(|\boldsymbol{b}|\cos\theta)\frac{\boldsymbol{a}}{|\boldsymbol{a}|}" /></div>
                    </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                    <h5 className="font-bold text-slate-700 text-sm mb-3">物理意义：功</h5>
                    <p className="text-xs text-slate-600 mb-2">
                        力 <MathFormula tex="\boldsymbol{F}" /> 对物体做功 <MathFormula tex="W" />，等于力与位移 <MathFormula tex="\boldsymbol{s}" /> 的数量积。
                    </p>
                    <MathFormula tex="W = \boldsymbol{F} \cdot \boldsymbol{s}" block className="text-lg text-slate-800" />
                </div>
            </div>
        </div>
    </div>
  ),
  section9_3: (
    <div className="space-y-6">
        {/* 基本定理 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Grid className="w-5 h-5 text-indigo-500" /> 1. 平面向量基本定理
            </h4>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 mb-4">
                <p className="text-sm text-indigo-900 leading-relaxed mb-3">
                    如果 <MathFormula tex="\boldsymbol{e}_1, \boldsymbol{e}_2" /> 是同一平面内的两个<span className="font-bold">不共线</span>向量，
                    那么对于这一平面内的任一向量 <MathFormula tex="\boldsymbol{a}" />，<span className="font-bold">有且只有</span>一对实数 <MathFormula tex="\lambda_1, \lambda_2" />，使
                </p>
                <MathFormula tex="\boldsymbol{a} = \lambda_1 \boldsymbol{e}_1 + \lambda_2 \boldsymbol{e}_2" block className="text-2xl font-bold text-indigo-700" />
                <div className="text-xs text-indigo-500 text-center mt-2">
                    <MathFormula tex="\{\boldsymbol{e}_1, \boldsymbol{e}_2\}" /> 叫做表示这一平面内所有向量的一组<span className="font-bold">基底</span>。
                </div>
            </div>
        </div>

        {/* 坐标运算 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 坐标运算</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-3 font-bold">运算</th>
                            <th className="p-3 font-bold">公式</th>
                            <th className="p-3 font-bold text-xs text-slate-400">设 a=(x1,y1), b=(x2,y2)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-3 font-medium text-slate-700">加法</td>
                            <td className="p-3"><MathFormula tex="\boldsymbol{a}+\boldsymbol{b} = (x_1+x_2, y_1+y_2)" /></td>
                            <td className="p-3 text-xs text-slate-500">坐标分别相加</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-medium text-slate-700">减法</td>
                            <td className="p-3"><MathFormula tex="\boldsymbol{a}-\boldsymbol{b} = (x_1-x_2, y_1-y_2)" /></td>
                            <td className="p-3 text-xs text-slate-500">坐标分别相减</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-medium text-slate-700">数乘</td>
                            <td className="p-3"><MathFormula tex="\lambda\boldsymbol{a} = (\lambda x_1, \lambda y_1)" /></td>
                            <td className="p-3 text-xs text-slate-500">数乘每一个坐标</td>
                        </tr>
                        <tr>
                            <td className="p-3 font-medium text-slate-700">数量积</td>
                            <td className="p-3"><MathFormula tex="\boldsymbol{a}\cdot\boldsymbol{b} = x_1x_2 + y_1y_2" /></td>
                            <td className="p-3 text-xs text-slate-500"><span className="font-bold text-indigo-600">标量</span> (结果是数)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">模长公式</span>
                    <MathFormula tex="|\boldsymbol{a}| = \sqrt{x_1^2 + y_1^2}" className="text-lg" />
                    <div className="mt-2 text-xs text-slate-500 border-t border-slate-200 pt-2">
                        两点间距离：<MathFormula tex="|\overrightarrow{AB}| = \sqrt{(x_B-x_A)^2 + (y_B-y_A)^2}" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">平行与垂直</span>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span>平行 <MathFormula tex="\boldsymbol{a}//\boldsymbol{b}" /></span>
                            <MathFormula tex="x_1y_2 - x_2y_1 = 0" className="font-bold text-blue-600" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>垂直 <MathFormula tex="\boldsymbol{a}\perp\boldsymbol{b}" /></span>
                            <MathFormula tex="x_1x_2 + y_1y_2 = 0" className="font-bold text-red-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section9_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-500" /> 向量应用举例
            </h4>
            
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2">1. 几何应用：三点共线</h5>
                    <p className="text-sm text-slate-600 mb-2">
                        若 <MathFormula tex="\overrightarrow{AB} = \lambda \overrightarrow{AC}" />，则 A, B, C 三点共线。
                    </p>
                    <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                        这是证明几何点共线的最有力工具之一，避免了复杂的解析几何方程联立。
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2">2. 物理应用：力的合成与分解</h5>
                    <div className="flex gap-4 items-center flex-col md:flex-row">
                        <div className="flex-1 text-sm text-slate-600">
                            力是典型的向量（有大小、方向）。合力遵循向量加法的<span className="font-bold">平行四边形法则</span>。
                            <br/>
                            <MathFormula tex="\boldsymbol{F} = \boldsymbol{F}_1 + \boldsymbol{F}_2" />
                        </div>
                        <div className="w-full md:w-64 bg-white border border-slate-200 rounded flex items-center justify-center relative overflow-hidden">
                            <PlanarGeometry 
                                width={200}
                                height={120}
                                xDomain={[-1, 4]}
                                yDomain={[-1, 3]}
                                showGrid={false}
                                showAxes={false}
                                items={[
                                    { type: 'vector', start: {x:0, y:0}, end: {x:3, y:0}, color: '#64748b', label: 'F_1' },
                                    { type: 'vector', start: {x:0, y:0}, end: {x:0, y:2}, color: '#64748b', label: 'F_2' },
                                    { type: 'line', start: {x:3, y:0}, end: {x:3, y:2}, color: '#cbd5e1', dashed: true },
                                    { type: 'line', start: {x:0, y:2}, end: {x:3, y:2}, color: '#cbd5e1', dashed: true },
                                    { type: 'vector', start: {x:0, y:0}, end: {x:3, y:2}, color: '#4f46e5', label: 'F' }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  inquiry_space: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                <Maximize className="w-5 h-5 text-indigo-600" /> 探究：由平面向量到空间向量
            </h4>
            <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm opacity-80">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">2D Plane</div>
                    <h5 className="font-bold text-slate-700 mb-3">平面向量</h5>
                    <ul className="space-y-2 text-slate-600">
                        <li>基底：<MathFormula tex="\{\boldsymbol{e}_1, \boldsymbol{e}_2\}" /> (不共线)</li>
                        <li>坐标：<MathFormula tex="(x, y)" /></li>
                        <li>基本定理：<MathFormula tex="\boldsymbol{a} = x\boldsymbol{e}_1 + y\boldsymbol{e}_2" /></li>
                    </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-indigo-200 shadow-md transform md:scale-105">
                    <div className="text-xs font-bold text-indigo-500 uppercase mb-2">3D Space</div>
                    <h5 className="font-bold text-indigo-900 mb-3">空间向量</h5>
                    <ul className="space-y-2 text-slate-700">
                        <li>基底：<MathFormula tex="\{\boldsymbol{e}_1, \boldsymbol{e}_2, \boldsymbol{e}_3\}" /> (不共面)</li>
                        <li>坐标：<MathFormula tex="(x, y, z)" /></li>
                        <li>基本定理：<MathFormula tex="\boldsymbol{p} = x\boldsymbol{e}_1 + y\boldsymbol{e}_2 + z\boldsymbol{e}_3" /></li>
                    </ul>
                </div>
            </div>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed text-center">
                空间向量的引入，使得我们可以用代数方法解决立体几何问题（如求异面直线夹角、二面角），将"想"的技巧转化为"算"的程序。
            </p>
        </div>
    </div>
  ),
  reading_mechanics: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Anchor className="w-48 h-48" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2 text-xl">阅读：向量源自力学</h4>
            <div className="space-y-4 relative z-10 text-sm text-slate-700 leading-7">
                <p>
                    向量（Vector）一词来自拉丁语 vectus，意为“运载”。
                    虽然我们现在把向量看作纯数学对象，但它的起源与物理学中的力、速度等概念密不可分。
                </p>
                <div className="p-4 bg-white/80 backdrop-blur rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-800 mb-2">历史足迹</h5>
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                        <li>古希腊时期，亚里士多德在研究运动时就涉及了位移合成的思想。</li>
                        <li>1586年，斯蒂文（Stevin）在《静力学原理》中明确阐述了<span className="font-bold text-slate-800">力的平行四边形定则</span>，这是向量加法的物理原型。</li>
                        <li>19世纪，哈密顿（Hamilton）和格拉斯曼（Grassmann）分别创立了四元数理论和扩张量理论，正式建立了现代向量分析的数学基础。</li>
                    </ul>
                </div>
                <p>
                    今天，从天气预报的风场图，到计算机图形学中的光照渲染，再到机器学习中的特征向量，向量无处不在，是描述多维世界的通用语言。
                </p>
            </div>
        </div>
    </div>
  )
};
