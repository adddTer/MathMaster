import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { Triangle, Ruler, Target, BookOpen, Compass, Map, Divide } from 'lucide-react';

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

export const Chapter11Content = {
  section11_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-500" /> 1. 余弦定理
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                    <svg viewBox="0 0 200 150" className="w-48 h-36">
                        <polygon points="20,130 180,130 60,30" fill="none" stroke="#64748b" strokeWidth="2" />
                        <text x="55" y="25" fontSize="12" fill="#64748b" fontWeight="bold">A</text>
                        <text x="10" y="140" fontSize="12" fill="#64748b" fontWeight="bold">B</text>
                        <text x="185" y="140" fontSize="12" fill="#64748b" fontWeight="bold">C</text>
                        <text x="100" y="145" fontSize="12" fill="#3b82f6" fontWeight="bold">a</text>
                        <text x="130" y="80" fontSize="12" fill="#3b82f6" fontWeight="bold">b</text>
                        <text x="30" y="80" fontSize="12" fill="#3b82f6" fontWeight="bold">c</text>
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-4">
                        三角形中任何一边的平方，等于其他两边的平方和减去这两边与它们夹角的余弦的积的两倍。
                    </p>
                    <FormulaCard className="my-0 bg-blue-50/30 border-blue-500">
                        <MathFormula tex="a^2 = b^2 + c^2 - 2bc \cos A" block className="text-xl font-bold text-blue-900" />
                        <div className="text-xs text-slate-400 mt-2 space-x-4">
                            <span><MathFormula tex="b^2 = a^2 + c^2 - 2ac \cos B" /></span>
                            <span><MathFormula tex="c^2 = a^2 + b^2 - 2ab \cos C" /></span>
                        </div>
                    </FormulaCard>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 变形与应用</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">求角公式</span>
                    <MathFormula tex="\cos A = \frac{b^2+c^2-a^2}{2bc}" block className="text-lg" />
                    <div className="text-xs text-slate-500 mt-2">已知三边求角 (SSS)</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">勾股定理推广</span>
                    <div className="space-y-1 text-xs text-slate-600">
                        <div><MathFormula tex="A=90^\circ \Rightarrow a^2=b^2+c^2" /></div>
                        <div><MathFormula tex="A>90^\circ \Rightarrow a^2 > b^2+c^2" /></div>
                        <div><MathFormula tex="A<90^\circ \Rightarrow a^2 < b^2+c^2" /></div>
                    </div>
                </div>
            </div>
            
            <WarningCard title="适用场景">
                <ul className="list-disc list-inside text-sm text-slate-600">
                    <li><span className="font-bold text-slate-800">SAS</span>：已知两边及其夹角，求第三边。</li>
                    <li><span className="font-bold text-slate-800">SSS</span>：已知三边，求三个角。</li>
                </ul>
            </WarningCard>
        </div>
    </div>
  ),
  section11_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" /> 1. 正弦定理
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                在一个三角形中，各边和它所对角的正弦的比相等，且该比值等于外接圆直径。
            </p>
            <div className="flex flex-col items-center">
                <FormulaCard className="w-full bg-emerald-50/20 border-emerald-500">
                    <MathFormula tex="\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R" block className="text-2xl font-bold text-emerald-800" />
                    <div className="text-xs text-emerald-600 mt-2">R 为 \triangle ABC 外接圆半径</div>
                </FormulaCard>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 常见变形</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="font-bold text-slate-700 block mb-1">边换角</span>
                    <MathFormula tex="a = 2R \sin A" />
                    <div className="text-xs text-slate-400 mt-1">同理 b, c</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="font-bold text-slate-700 block mb-1">角换边</span>
                    <MathFormula tex="\sin A = \frac{a}{2R}" />
                    <div className="text-xs text-slate-400 mt-1">同理 sinB, sinC</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                    <span className="font-bold text-slate-700 block mb-1">比例关系</span>
                    <MathFormula tex="a:b:c = \sin A:\sin B:\sin C" className="text-xs"/>
                </div>
            </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-3 text-lg">多解问题 (SSA)</h4>
            <div className="text-xs text-indigo-700 mb-3 bg-white p-2 rounded inline-block border border-indigo-100">
                前提：已知 <MathFormula tex="a, b, A" />，即两边及其中一边的对角。
            </div>
            
            <div className="space-y-3">
                <div>
                    <span className="font-bold text-sm text-slate-700 block mb-1">情况 1：A 为锐角</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded border border-indigo-100">
                            <div className="font-bold text-slate-700 mb-1">无解</div>
                            <MathFormula tex="a < b \sin A" />
                        </div>
                        <div className="bg-white p-2 rounded border border-indigo-100">
                            <div className="font-bold text-slate-700 mb-1">一解</div>
                            <MathFormula tex="a = b \sin A" />
                            <div>(直角)</div>
                        </div>
                        <div className="bg-white p-2 rounded border border-indigo-100">
                            <div className="font-bold text-slate-700 mb-1">两解</div>
                            <MathFormula tex="b \sin A < a < b" />
                        </div>
                        <div className="bg-white p-2 rounded border border-indigo-100">
                            <div className="font-bold text-slate-700 mb-1">一解</div>
                            <MathFormula tex="a \ge b" />
                        </div>
                    </div>
                </div>
                
                <div>
                    <span className="font-bold text-sm text-slate-700 block mb-1">情况 2：A 为直角或钝角</span>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded border border-slate-200">
                            <div className="font-bold text-slate-700 mb-1">无解</div>
                            <MathFormula tex="a \le b" />
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                            <div className="font-bold text-slate-700 mb-1">一解</div>
                            <MathFormula tex="a > b" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section11_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Map className="w-5 h-5 text-purple-500" /> 1. 实际应用
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h5 className="font-bold text-slate-700 text-sm">测量术语</h5>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex gap-2">
                            <span className="font-bold bg-purple-50 text-purple-700 px-2 rounded text-xs py-0.5">仰角/俯角</span>
                            <span>视线在水平线以上/以下的角。</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-purple-50 text-purple-700 px-2 rounded text-xs py-0.5">方位角</span>
                            <span>指北方向顺时针转到目标方向线的水平角。</span>
                        </li>
                    </ul>
                </div>
                <div className="space-y-3">
                    <h5 className="font-bold text-slate-700 text-sm">解题步骤</h5>
                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-1">
                        <li>分析题意，画出示意图。</li>
                        <li>将实际问题转化为解三角形问题。</li>
                        <li>选用正弦或余弦定理求解。</li>
                        <li>还原为实际问题的答案。</li>
                    </ol>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 三角形面积公式</h4>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center">
                    <FormulaCard className="my-0 bg-orange-50/20 border-orange-400">
                        <MathFormula tex="S = \frac{1}{2}ab \sin C = \frac{1}{2}bc \sin A = \frac{1}{2}ac \sin B" block className="text-lg font-bold text-orange-800" />
                    </FormulaCard>
                </div>
                <div className="flex-1 space-y-2 text-sm text-slate-600">
                    <div className="p-2 border rounded hover:bg-slate-50 transition-colors flex justify-between">
                        <span>已知三边 (海伦公式)</span>
                        <span className="font-bold text-slate-400">见探究</span>
                    </div>
                    <div className="p-2 border rounded hover:bg-slate-50 transition-colors flex justify-between">
                        <span>已知外接圆半径 R</span>
                        <MathFormula tex="S = \frac{abc}{4R}" />
                    </div>
                    <div className="p-2 border rounded hover:bg-slate-50 transition-colors flex justify-between">
                        <span>已知内切圆半径 r</span>
                        <MathFormula tex="S = \frac{1}{2}(a+b+c)r" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  inquiry_heron: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-6 text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> 探究：海伦公式与三斜求积术
            </h4>
            
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        Western Math
                    </div>
                    <h5 className="font-bold text-slate-800 text-lg mb-2">海伦公式 (Heron's Formula)</h5>
                    <p className="text-sm text-slate-600 mb-3">古希腊数学家海伦发现。已知三边 <MathFormula tex="a,b,c" /> 求面积。</p>
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="text-xs text-slate-500 mb-1">半周长 <MathFormula tex="p = \frac{a+b+c}{2}" /></div>
                        <MathFormula tex="S = \sqrt{p(p-a)(p-b)(p-c)}" block className="font-bold text-indigo-700" />
                    </div>
                </div>
                
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        Ancient Chinese Math
                    </div>
                    <h5 className="font-bold text-slate-800 text-lg mb-2">秦九韶“三斜求积术”</h5>
                    <p className="text-sm text-slate-600 mb-3">南宋秦九韶在《数书九章》中提出，早于海伦公式的等价形式，但无需计算半周长，更适合数值计算。</p>
                    <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                        <MathFormula tex="S = \sqrt{\frac{1}{4}\left[c^2a^2 - \left(\frac{c^2+a^2-b^2}{2}\right)^2\right]}" block className="font-bold text-slate-700 text-sm" />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-indigo-100 text-center">
                <p className="text-sm text-slate-600 italic">
                    "殊途同归：虽然形式不同，但在数学本质上完全等价，展现了中西方数学智慧的交相辉映。"
                </p>
            </div>
        </div>
    </div>
  )
};