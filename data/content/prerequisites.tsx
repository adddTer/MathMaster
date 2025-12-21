import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { ArrowRight, ArrowDown, ArrowUp, ArrowLeft, Divide, X, Grip, Calculator, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Scale, Sigma, Triangle, Sparkles, ArrowRightLeft } from 'lucide-react';

// Helper for cards (Consistent with Chapter 1-5 style)
const FormulaCard = ({ children, className = '' }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white border-l-4 border-primary-500 shadow-sm border-y border-r border-slate-200 rounded-r-xl p-5 text-center my-4 ${className}`}>
    {children}
  </div>
);

const WarningCard = ({ title = "易错警示", children }: { title?: string, children?: React.ReactNode }) => (
  <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm mt-4">
    <div className="w-5 h-5 shrink-0 text-amber-600 mt-0.5"><AlertTriangle className="w-full h-full" /></div>
    <div>
      <span className="font-bold block mb-1 text-amber-700">{title}</span>
      <div className="text-amber-800/90 leading-relaxed">{children}</div>
    </div>
  </div>
);

// --- Subtopic Contents ---

export const FactorizationContent = {
  commonFactor: (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Divide className="w-5 h-5 text-blue-500" /> 提公因式法
            </h4>
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800 leading-relaxed mb-4">
                <span className="font-bold">口诀：</span>
                <span className="font-bold">“有公先提公”</span>。这是因式分解的第一步，也是最基础的一步。
            </div>
            
            <FormulaCard>
                <div className="text-xs text-slate-400 mb-2">基本模型</div>
                <MathFormula tex="ma + mb + mc = m(a + b + c)" block className="text-2xl text-slate-800 font-medium" />
            </FormulaCard>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-sm mb-3 text-slate-700 border-b border-slate-200 pb-2">操作步骤</h4>
                    <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2">
                        <li><span className="font-medium text-slate-800">定系数：</span>取各项系数的最大公约数。</li>
                        <li><span className="font-medium text-slate-800">定字母：</span>取各项相同的字母。</li>
                        <li><span className="font-medium text-slate-800">定指数：</span>取相同字母的最低次幂。</li>
                    </ol>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                     <h4 className="font-bold text-sm mb-2 text-slate-700">示例</h4>
                     <div className="text-center">
                         <MathFormula tex="3x^2y - 6xy^2" block className="text-lg text-slate-500 mb-2" />
                         <ArrowDown className="w-4 h-4 text-slate-300 mx-auto mb-2" />
                         <MathFormula tex="= 3xy(x - 2y)" block className="text-xl font-bold text-blue-700" />
                     </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Grip className="w-5 h-5 text-indigo-500" /> 分组分解法
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                当项数较多（如4项）且没有整体公因式时，尝试分组。
            </p>
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <MathFormula tex="ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)" block />
            </div>
        </div>
      </div>
  ),
  formulas: (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-500" /> 常用公式
            </h4>
            <p className="text-sm text-slate-600 mb-6">熟练掌握乘法公式的逆运算是高中代数变形的基础。</p>
            
            <div className="grid gap-6 md:grid-cols-2">
                <div className="relative overflow-hidden bg-slate-50 p-5 rounded-2xl border border-slate-200 group hover:border-indigo-300 transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                    <h4 className="font-bold text-indigo-900 mb-3">平方差公式</h4>
                    <MathFormula tex="a^2 - b^2 = (a + b)(a - b)" block className="text-xl text-slate-700 mb-3" />
                    <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-100">
                        特征：两项符号相反，且均为平方项。
                    </div>
                </div>
                
                <div className="relative overflow-hidden bg-slate-50 p-5 rounded-2xl border border-slate-200 group hover:border-pink-300 transition-all">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500"></div>
                    <h4 className="font-bold text-pink-900 mb-3">完全平方公式</h4>
                    <MathFormula tex="a^2 \pm 2ab + b^2 = (a \pm b)^2" block className="text-xl text-slate-700 mb-3" />
                    <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-100">
                        特征：首尾平方同号，中间是积的2倍。
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-3 text-sm">立方公式（拓展）</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">立方和</span>
                    <MathFormula tex="a^3 + b^3 = (a+b)(a^2-ab+b^2)" />
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                    <span className="text-xs text-slate-400 block mb-1">立方差</span>
                    <MathFormula tex="a^3 - b^3 = (a-b)(a^2+ab+b^2)" />
                </div>
            </div>
        </div>
      </div>
  ),
  crossMult: (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <X className="w-5 h-5 text-emerald-500" /> 十字相乘法
            </h4>
            <div className="text-sm text-slate-600 leading-relaxed mb-6">
                处理二次三项式 <MathFormula tex="ax^2 + bx + c" /> 的利器。这是高中解一元二次不等式最常用的方法。
            </div>
            
            <FormulaCard className="bg-emerald-50/30 border-emerald-500 mb-6">
                <div className="text-sm mb-2 text-emerald-800 font-bold">基本形式 (二次项系数为1)</div>
                <MathFormula tex="x^2 + (p+q)x + pq = (x+p)(x+q)" block className="text-xl font-bold text-slate-800" />
            </FormulaCard>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                    <h5 className="font-bold text-slate-700 text-sm">口诀：</h5>
                    <div className="flex flex-col gap-2 text-sm">
                         <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">1</div>
                             <span>竖分二次项与常数项</span>
                         </div>
                         <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
                             <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">2</div>
                             <span>交叉相乘求和</span>
                         </div>
                         <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg flex items-center gap-3 font-bold">
                             <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">3</div>
                             <span>结果等于一次项系数</span>
                         </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 relative">
                     <div className="absolute top-2 left-2 text-xs font-bold text-slate-400">示例: <MathFormula tex="x^2 - 5x + 6" /></div>
                     <div className="flex justify-center gap-8 items-center font-mono text-xl mt-4">
                         <div className="flex flex-col text-center gap-2">
                             <span className="bg-white px-2 rounded border">x</span>
                             <span className="bg-white px-2 rounded border">x</span>
                         </div>
                         <div className="flex flex-col text-center text-slate-300">
                             <X className="w-8 h-8" />
                         </div>
                         <div className="flex flex-col text-center gap-2">
                             <span className="bg-white px-2 rounded border text-red-500">-2</span>
                             <span className="bg-white px-2 rounded border text-red-500">-3</span>
                         </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                         <div className="text-sm text-slate-500 mb-1">验证：</div>
                         <div className="font-bold text-slate-800">
                             <MathFormula tex="(-2x) + (-3x) = -5x" /> <CheckCircle2 className="w-4 h-4 text-emerald-500 inline ml-1"/>
                         </div>
                         <div className="mt-2 text-emerald-700 font-bold bg-emerald-100 inline-block px-3 py-1 rounded-lg">
                             = (x - 2)(x - 3)
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
  )
};

export const EquationsContent = {
    roots: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                     <Sigma className="w-5 h-5 text-indigo-500" /> 求根公式与判别式
                 </h4>
                 <p className="text-sm text-slate-600 mb-4">
                     对于一元二次方程 <MathFormula tex="ax^2 + bx + c = 0 \quad (a \ne 0)" />：
                 </p>
                 
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                     <FormulaCard className="my-0 bg-indigo-50/20 border-indigo-400">
                         <div className="text-xs text-indigo-800 font-bold mb-2">求根公式</div>
                         <MathFormula tex="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" block className="text-xl" />
                     </FormulaCard>
                     <div className="flex flex-col justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                         <div className="text-xs text-slate-500 font-bold mb-2 uppercase">Discriminant</div>
                         <div className="text-lg font-bold text-slate-800 mb-1">
                             <MathFormula tex="\Delta = b^2 - 4ac" />
                         </div>
                         <div className="text-xs text-slate-400">决定根的个数与性质</div>
                     </div>
                 </div>

                 <div className="overflow-hidden rounded-lg border border-slate-200">
                     <table className="w-full text-sm text-center">
                         <thead className="bg-slate-50 text-slate-600 font-bold">
                             <tr>
                                 <th className="p-3 border-b">判别式 <MathFormula tex="\Delta" /></th>
                                 <th className="p-3 border-b">根的情况</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             <tr>
                                 <td className="p-3 text-emerald-600 font-bold"><MathFormula tex="\Delta > 0" /></td>
                                 <td className="p-3">有两个不相等的实数根</td>
                             </tr>
                             <tr>
                                 <td className="p-3 text-blue-600 font-bold"><MathFormula tex="\Delta = 0" /></td>
                                 <td className="p-3">有两个相等的实数根</td>
                             </tr>
                             <tr>
                                 <td className="p-3 text-red-600 font-bold"><MathFormula tex="\Delta < 0" /></td>
                                 <td className="p-3">无实数根</td>
                             </tr>
                         </tbody>
                     </table>
                 </div>
            </div>
            
            <WarningCard title="易错点：分母是 2a">
                在使用求根公式时，切记分母是 <MathFormula tex="2a" /> 而不是 2。当二次项系数 <MathFormula tex="a \ne 1" /> 时尤为容易出错。
            </WarningCard>
        </div>
    ),
    vieta: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-lg">韦达定理</h4>
              <p className="text-sm text-slate-600 mb-6">
                  揭示了方程的根与系数之间的深刻联系，在处理“不解方程求值”问题时效率极高。
              </p>
              
              <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-indigo-50 p-5 rounded-xl text-center border border-indigo-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400"></div>
                      <div className="text-xs text-indigo-500 mb-2 font-bold uppercase tracking-wider">两根之和</div>
                      <MathFormula tex="x_1 + x_2 = -\frac{b}{a}" className="text-2xl font-bold text-indigo-900"/>
                  </div>
                  <div className="flex-1 bg-purple-50 p-5 rounded-xl text-center border border-purple-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                      <div className="text-xs text-purple-500 mb-2 font-bold uppercase tracking-wider">两根之积</div>
                      <MathFormula tex="x_1 x_2 = \frac{c}{a}" className="text-2xl font-bold text-purple-900"/>
                  </div>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> 常用变形技巧
                  </h4>
                  <div className="grid gap-3 text-sm">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-slate-600 font-medium">平方和</span>
                          <MathFormula tex="x_1^2 + x_2^2 = (x_1+x_2)^2 - 2x_1x_2" />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-slate-600 font-medium">倒数和</span>
                          <MathFormula tex="\frac{1}{x_1} + \frac{1}{x_2} = \frac{x_1+x_2}{x_1x_2}" />
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-slate-600 font-medium">差的平方</span>
                          <MathFormula tex="(x_1-x_2)^2 = (x_1+x_2)^2 - 4x_1x_2" />
                      </div>
                  </div>
              </div>
          </div>
        </div>
    )
};

export const FunctionsContent = {
    forms: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">二次函数的三种形式</h4>
                <div className="space-y-4">
                    <div className="p-4 border rounded-xl bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-between group">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Standard Form</span>
                            <span className="font-bold text-slate-700">一般式</span>
                        </div>
                        <MathFormula tex="y = ax^2 + bx + c" className="text-lg group-hover:scale-105 transition-transform"/>
                    </div>
                    <div className="p-4 border rounded-xl bg-blue-50 border-blue-200 flex items-center justify-between group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <div className="pl-2">
                            <span className="text-xs font-bold text-blue-400 uppercase block mb-1">Vertex Form</span>
                            <span className="font-bold text-blue-800">顶点式 (最重要)</span>
                        </div>
                        <MathFormula tex="y = a(x - h)^2 + k" className="text-lg text-blue-900 font-bold group-hover:scale-105 transition-transform"/>
                    </div>
                    <div className="p-4 border rounded-xl bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-between group">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Intercept Form</span>
                            <span className="font-bold text-slate-700">交点式</span>
                        </div>
                        <MathFormula tex="y = a(x - x_1)(x - x_2)" className="text-lg group-hover:scale-105 transition-transform"/>
                    </div>
                </div>
            </div>
            
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-sm">
                <h4 className="font-bold text-indigo-900 mb-2">配方法</h4>
                <p className="mb-2 text-indigo-800/80">将一般式转化为顶点式的核心技能：</p>
                <div className="bg-white p-3 rounded-lg border border-indigo-100 text-center">
                    <MathFormula tex="y = ax^2+bx+c = a(x^2+\frac{b}{a}x)+c" block />
                    <div className="my-1 text-xs text-slate-400">↓ 加上并减去一次项系数一半的平方</div>
                    <MathFormula tex="= a[(x+\frac{b}{2a})^2 - \frac{b^2}{4a^2}] + c = a(x+\frac{b}{2a})^2 + \frac{4ac-b^2}{4a}" block />
                </div>
            </div>
        </div>
    ),
    props: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">图像与性质</h4>
                
                {/* 开口 */}
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <MathFormula tex="a > 0" className="font-bold text-red-700 mb-1 block text-lg" />
                        <span className="text-xs text-slate-600 font-bold">开口向上</span>
                        <div className="mt-2 text-3xl text-red-300 font-serif">∪</div>
                        <div className="text-[10px] text-red-400 mt-1">有最小值</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <MathFormula tex="a < 0" className="font-bold text-blue-700 mb-1 block text-lg" />
                        <span className="text-xs text-slate-600 font-bold">开口向下</span>
                        <div className="mt-2 text-3xl text-blue-300 font-serif">∩</div>
                        <div className="text-[10px] text-blue-400 mt-1">有最大值</div>
                    </div>
                </div>

                {/* 核心要素 */}
                <div className="flex gap-4">
                    <div className="flex-1 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Axis of Symmetry</div>
                        <div className="font-bold text-slate-700 mb-1">对称轴</div>
                        <MathFormula tex="x = -\frac{b}{2a}" className="text-xl font-bold text-primary-600" />
                    </div>
                    <div className="flex-1 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vertex</div>
                        <div className="font-bold text-slate-700 mb-1">顶点坐标</div>
                        <MathFormula tex="(h, k)" className="text-xl font-bold text-primary-600"/>
                    </div>
                </div>
            </div>

            {/* 单调性 */}
            <div className="bg-slate-50 p-5 rounded-xl text-left border border-slate-200">
                <h5 className="font-bold text-slate-700 text-sm mb-3">单调性 (以 a&gt;0 为例)</h5>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <TrendingDown className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">对称轴左侧</span>
                            <span className="text-xs">函数值随 x 增大而减小 (单调递减)</span>
                        </div>
                    </li>
                    <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                            <span className="block font-bold text-slate-800">对称轴右侧</span>
                            <span className="text-xs">函数值随 x 增大而增大 (单调递增)</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    ),
    translation: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">图像平移规律</h4>
                <div className="bg-indigo-50 p-4 rounded-lg text-center mb-6 border border-indigo-100">
                    <div className="text-lg font-bold text-indigo-700">“左加右减，上加下减”</div>
                    <div className="text-xs text-indigo-500 mt-1">Left Add, Right Subtract; Up Add, Down Subtract</div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="p-4 border rounded-xl bg-slate-50 relative">
                        <div className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <ArrowRightLeft className="w-4 h-4 text-blue-500" /> 左右平移
                        </div>
                        <div className="text-xs text-slate-500 mb-3">针对 <MathFormula tex="x" /> 本身的变化</div>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                <span>左移 h</span>
                                <MathFormula tex="x \to (x+h)" />
                            </li>
                            <li className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                <span>右移 h</span>
                                <MathFormula tex="x \to (x-h)" />
                            </li>
                        </ul>
                    </div>
                    <div className="p-4 border rounded-xl bg-slate-50 relative">
                        <div className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <ArrowUp className="w-4 h-4 text-emerald-500" /> 上下平移
                        </div>
                        <div className="text-xs text-slate-500 mb-3">针对函数值 <MathFormula tex="y" /> 的变化</div>
                        <ul className="space-y-3">
                            <li className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                <span>上移 k</span>
                                <MathFormula tex="y \to y+k" />
                            </li>
                            <li className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                                <span>下移 k</span>
                                <MathFormula tex="y \to y-k" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
};

export const InequalitiesContent = {
    basic: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">不等式的基本性质</h4>
                <div className="space-y-4 text-sm">
                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                         <span className="font-bold text-slate-700">传递性</span>
                         <MathFormula tex="a>b, b>c \Rightarrow a>c" />
                     </div>
                     <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                         <span className="font-bold text-slate-700">可加性</span>
                         <MathFormula tex="a>b \Rightarrow a+c > b+c" />
                     </div>
                     <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                         <div className="flex justify-between items-center mb-1">
                             <span className="font-bold text-amber-800">可乘性 (注意符号)</span>
                             <MathFormula tex="a>b, c>0 \Rightarrow ac > bc" />
                         </div>
                         <div className="flex justify-between items-center text-red-600 font-bold">
                             <span>乘以负数变号</span>
                             <MathFormula tex="a>b, c<0 \Rightarrow ac < bc" />
                         </div>
                     </div>
                </div>
            </div>
        </div>
    ),
    absIneq: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">绝对值不等式</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                         <h5 className="font-bold text-indigo-900 mb-2">小于型 (夹中间)</h5>
                         <MathFormula tex="|x| < a \quad (a>0)" block className="mb-2"/>
                         <MathFormula tex="-a < x < a" className="text-lg font-bold text-indigo-700"/>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                         <h5 className="font-bold text-orange-900 mb-2">大于型 (取两边)</h5>
                         <MathFormula tex="|x| > a \quad (a>0)" block className="mb-2"/>
                         <MathFormula tex="x > a \text{ 或 } x < -a" className="text-lg font-bold text-orange-700"/>
                    </div>
                </div>
            </div>
        </div>
    ),
    quadraticIneq: (
        <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">一元二次不等式 (初步)</h4>
                <p className="text-sm text-slate-600 mb-4">
                    形如 <MathFormula tex="ax^2+bx+c>0" /> 的不等式。核心思想是结合二次函数图像。
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                     <span className="font-bold block mb-2">口诀 (当 a &gt; 0 时):</span>
                     <ul className="list-disc list-inside space-y-2 text-slate-700">
                         <li><span className="font-bold text-emerald-600">大于取两边</span>：<MathFormula tex="ax^2+bx+c>0 \Rightarrow x<x_1 \lor x>x_2" /></li>
                         <li><span className="font-bold text-blue-600">小于取中间</span>：<MathFormula tex="ax^2+bx+c<0 \Rightarrow x_1<x<x_2" /></li>
                     </ul>
                </div>
             </div>
        </div>
    )
};

export const RadicalsContent = {
    rules: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">整数指数幂运算性质</h4>
                <div className="grid gap-3 text-sm">
                    <div className="p-3 bg-slate-50 rounded border flex justify-between">
                        <span>同底数幂相乘</span>
                        <MathFormula tex="a^m \cdot a^n = a^{m+n}" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded border flex justify-between">
                        <span>幂的乘方</span>
                        <MathFormula tex="(a^m)^n = a^{mn}" />
                    </div>
                    <div className="p-3 bg-slate-50 rounded border flex justify-between">
                        <span>积的乘方</span>
                        <MathFormula tex="(ab)^n = a^n b^n" />
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-100 flex justify-between">
                        <span className="font-bold text-blue-700">负整数指数幂</span>
                        <MathFormula tex="a^{-n} = \frac{1}{a^n} \quad (a \ne 0)" />
                    </div>
                    <div className="p-3 bg-blue-50 rounded border border-blue-100 flex justify-between">
                        <span className="font-bold text-blue-700">零指数幂</span>
                        <MathFormula tex="a^0 = 1 \quad (a \ne 0)" />
                    </div>
                </div>
            </div>
        </div>
    ),
    radicals: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h4 className="font-bold text-slate-800 mb-4 text-lg">二次根式性质</h4>
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                     <div className="p-4 bg-slate-50 rounded-xl text-center">
                         <MathFormula tex="\sqrt{a^2} = |a|" block className="text-xl font-bold mb-2"/>
                         <span className="text-xs text-slate-500">化简时注意符号</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-xl text-center">
                         <MathFormula tex="(\sqrt{a})^2 = a \quad (a \ge 0)" block className="text-xl font-bold mb-2"/>
                         <span className="text-xs text-slate-500">平方去根号</span>
                     </div>
                 </div>
                 
                 <h5 className="font-bold text-slate-700 text-sm mb-2">分母有理化</h5>
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-sm space-y-3">
                     <div className="flex items-center gap-4">
                         <span className="w-20 font-bold text-indigo-800">单项式</span>
                         <MathFormula tex="\frac{1}{\sqrt{a}} = \frac{\sqrt{a}}{a}" />
                     </div>
                     <div className="flex items-center gap-4">
                         <span className="w-20 font-bold text-indigo-800">多项式</span>
                         <MathFormula tex="\frac{1}{\sqrt{a}+\sqrt{b}} = \frac{\sqrt{a}-\sqrt{b}}{a-b}" />
                         <span className="text-xs text-indigo-400 ml-auto">利用平方差公式</span>
                     </div>
                 </div>
            </div>
        </div>
    )
};

export const TrigContent = {
    basics: (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">锐角三角函数定义</h4>
                <div className="flex gap-6 items-center">
                    <div className="w-32 h-32 relative shrink-0">
                         {/* Right Triangle SVG */}
                         <svg viewBox="0 0 100 100" className="w-full h-full">
                             <polygon points="10,90 90,90 90,30" fill="none" stroke="#64748b" strokeWidth="2" />
                             <rect x="80" y="80" width="10" height="10" fill="none" stroke="#64748b" />
                             <text x="25" y="85" fontSize="10">θ</text>
                             <text x="50" y="98" fontSize="10">邻边 (adj)</text>
                             <text x="95" y="60" fontSize="10">对边 (opp)</text>
                             <text x="40" y="50" fontSize="10">斜边 (hyp)</text>
                         </svg>
                    </div>
                    <div className="flex-1 space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span className="font-bold text-slate-700">正弦 sin θ</span>
                            <MathFormula tex="\frac{\text{对边}}{\text{斜边}}" />
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span className="font-bold text-slate-700">余弦 cos θ</span>
                            <MathFormula tex="\frac{\text{邻边}}{\text{斜边}}" />
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span className="font-bold text-slate-700">正切 tan θ</span>
                            <MathFormula tex="\frac{\text{对边}}{\text{邻边}}" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 text-lg">特殊角三角函数值</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-center text-sm border-collapse">
                        <thead className="bg-slate-50 text-slate-600 font-bold">
                            <tr>
                                <th className="p-2 border">θ</th>
                                <th className="p-2 border">30°</th>
                                <th className="p-2 border">45°</th>
                                <th className="p-2 border">60°</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border font-bold">sin θ</td>
                                <td className="p-2 border"><MathFormula tex="\frac{1}{2}" /></td>
                                <td className="p-2 border"><MathFormula tex="\frac{\sqrt{2}}{2}" /></td>
                                <td className="p-2 border"><MathFormula tex="\frac{\sqrt{3}}{2}" /></td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-bold">cos θ</td>
                                <td className="p-2 border"><MathFormula tex="\frac{\sqrt{3}}{2}" /></td>
                                <td className="p-2 border"><MathFormula tex="\frac{\sqrt{2}}{2}" /></td>
                                <td className="p-2 border"><MathFormula tex="\frac{1}{2}" /></td>
                            </tr>
                            <tr>
                                <td className="p-2 border font-bold">tan θ</td>
                                <td className="p-2 border"><MathFormula tex="\frac{\sqrt{3}}{3}" /></td>
                                <td className="p-2 border">1</td>
                                <td className="p-2 border"><MathFormula tex="\sqrt{3}" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};