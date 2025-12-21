import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { FunctionPlot } from '../../components/FunctionPlot';
import { TrendingUp, TrendingDown, Divide, Split, CheckCircle2, Brackets, MousePointerClick, Microscope } from 'lucide-react';

const WarningCard = ({ title = "易错警示", children }: { title?: string, children?: React.ReactNode }) => (
  <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm mt-4">
    <div className="w-5 h-5 shrink-0 text-amber-600 mt-0.5">⚠️</div>
    <div>
      <span className="font-bold block mb-1 text-amber-700">{title}</span>
      <div className="text-amber-800/90 leading-relaxed">{children}</div>
    </div>
  </div>
);

export const Chapter5Content = {
  section5_1: (
      <div className="space-y-6">
        {/* 函数概念 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">1. 函数的概念</h4>
            <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-primary-500">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        设 <MathFormula tex="A, B" /> 是非空的<span className="font-bold text-primary-600">实数集</span>，如果对于集合 <MathFormula tex="A" /> 中的任意一个数 <MathFormula tex="x" />，
                        按照某个对应关系 <MathFormula tex="f" />，在集合 <MathFormula tex="B" /> 中都有<span className="font-bold text-primary-600">唯一确定</span>的数 <MathFormula tex="y" /> 和它对应，
                        则称 <MathFormula tex="f: A \to B" /> 为从集合 <MathFormula tex="A" /> 到集合 <MathFormula tex="B" /> 的一个函数。
                    </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="p-3 bg-slate-50 border rounded-lg hover:border-blue-300 transition-colors">
                        <div className="font-bold text-slate-700">定义域 (Domain)</div>
                        <div className="text-xs text-slate-400 mt-1">x 的取值范围 A</div>
                    </div>
                    <div className="p-3 bg-slate-50 border rounded-lg hover:border-blue-300 transition-colors">
                        <div className="font-bold text-slate-700">对应关系 (Map)</div>
                        <div className="text-xs text-slate-400 mt-1">法则 f</div>
                    </div>
                    <div className="p-3 bg-slate-50 border rounded-lg hover:border-blue-300 transition-colors">
                        <div className="font-bold text-slate-700">值域 (Range)</div>
                        <div className="text-xs text-slate-400 mt-1">f(x) 的集合 <MathFormula tex="\{f(x)|x \in A\}" /></div>
                    </div>
                </div>
            </div>
        </div>

        {/* 区间表示 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Brackets className="w-5 h-5 text-indigo-500" /> 2. 区间
             </h4>
             <div className="overflow-hidden rounded-lg border border-slate-200 text-sm">
                 <table className="w-full text-left">
                     <thead className="bg-slate-50 text-slate-600">
                         <tr>
                             <th className="p-3 font-bold">名称</th>
                             <th className="p-3 font-bold">不等式</th>
                             <th className="p-3 font-bold">区间符号</th>
                             <th className="p-3 font-bold">数轴特征</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         <tr>
                             <td className="p-3">闭区间</td>
                             <td className="p-3"><MathFormula tex="a \le x \le b" /></td>
                             <td className="p-3 font-mono font-bold text-indigo-700"><MathFormula tex="[a, b]" /></td>
                             <td className="p-3 text-xs text-slate-500">两端实心</td>
                         </tr>
                         <tr>
                             <td className="p-3">开区间</td>
                             <td className="p-3"><MathFormula tex="a < x < b" /></td>
                             <td className="p-3 font-mono font-bold text-indigo-700"><MathFormula tex="(a, b)" /></td>
                             <td className="p-3 text-xs text-slate-500">两端空心</td>
                         </tr>
                         <tr>
                             <td className="p-3">半开半闭</td>
                             <td className="p-3"><MathFormula tex="a \le x < b" /></td>
                             <td className="p-3 font-mono font-bold text-indigo-700"><MathFormula tex="[a, b)" /></td>
                             <td className="p-3 text-xs text-slate-500">左实右空</td>
                         </tr>
                     </tbody>
                 </table>
             </div>
        </div>

        {/* 定义域求法 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">具体函数定义域求法</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs mb-1">分式分母不为0</span>
                    <MathFormula tex="\frac{1}{f(x)} \Rightarrow f(x) \ne 0" className="font-medium text-slate-800" />
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs mb-1">偶次根号下非负</span>
                    <MathFormula tex="\sqrt[2n]{f(x)} \Rightarrow f(x) \ge 0" className="font-medium text-slate-800" />
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs mb-1">对数真数大于0</span>
                    <MathFormula tex="\log_a f(x) \Rightarrow f(x) > 0" className="font-medium text-slate-800" />
                </div>
                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs mb-1">零次幂底数不为0</span>
                    <MathFormula tex="[f(x)]^0 \Rightarrow f(x) \ne 0" className="font-medium text-slate-800" />
                </div>
            </div>
        </div>
        
        <WarningCard title="抽象函数定义域">
            <p className="text-xs leading-relaxed">
                若 <MathFormula tex="f(x)" /> 的定义域为 <MathFormula tex="[a, b]" />，则 <MathFormula tex="f(g(x))" /> 的定义域是使 <MathFormula tex="a \le g(x) \le b" /> 成立的 <MathFormula tex="x" /> 的集合。
                <br/>
                <span className="font-bold text-amber-700 block mt-1">口诀：定义域永远是指 x 的范围，括号内范围一致。</span>
            </p>
        </WarningCard>
      </div>
  ),
  section5_2: (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-lg">函数的表示方法</h4>
              <div className="flex gap-4 mb-6">
                  <div className="flex-1 bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                      <div className="font-bold text-slate-700 mb-1">解析法</div>
                      <div className="text-xs text-slate-500">数学表达式 <MathFormula tex="y=f(x)" /></div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                      <div className="font-bold text-slate-700 mb-1">列表法</div>
                      <div className="text-xs text-slate-500">表格列出 x, y</div>
                  </div>
                  <div className="flex-1 bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                      <div className="font-bold text-slate-700 mb-1">图象法</div>
                      <div className="text-xs text-slate-500">坐标系中的图形</div>
                  </div>
              </div>
              
              <div className="border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-2 mb-3 font-bold text-base text-primary-700">
                      <Split className="w-5 h-5" /> 分段函数
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                      在定义域的不同部分，有不同的对应法则。分段函数是一个函数，不是几个函数。
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 inline-block pr-12">
                      <MathFormula tex="f(x) = \begin{cases} x+1, & x \ge 0 \\ x-1, & x < 0 \end{cases}" block />
                  </div>
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                      <MousePointerClick className="w-3 h-3" />
                      作图提示：分界点处注意是空心圈（不包含）还是实心点（包含）。
                  </div>
              </div>
          </div>
      </div>
  ),
  section5_3: (
      <div className="space-y-6">
          {/* 图像直观 */}
          <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition-colors">
                      <TrendingUp className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="font-bold text-slate-700 text-base">单调递增</div>
                  <div className="text-xs text-slate-400 mt-1">图像从左往右上升</div>
                  <MathFormula tex="x_1 < x_2 \Rightarrow f(x_1) < f(x_2)" className="text-xs text-slate-500 mt-2 block" />
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
                      <TrendingDown className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="font-bold text-slate-700 text-base">单调递减</div>
                  <div className="text-xs text-slate-400 mt-1">图像从左往右下降</div>
                  <MathFormula tex="x_1 < x_2 \Rightarrow f(x_1) > f(x_2)" className="text-xs text-slate-500 mt-2 block" />
              </div>
          </div>

          {/* 代数定义 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">定义法证明单调性</h4>
              <div className="flex gap-4">
                  <div className="hidden md:flex flex-col items-center justify-center gap-1 text-slate-300">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-0.5 h-8 bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-0.5 h-8 bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-0.5 h-8 bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <ol className="list-decimal list-inside text-sm text-slate-700 space-y-4 flex-1">
                      <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-900">取值：</span>
                          任取 <MathFormula tex="x_1, x_2 \in D" />，且 <MathFormula tex="x_1 < x_2" />
                      </li>
                      <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-900">作差：</span>
                          计算 <MathFormula tex="f(x_1) - f(x_2)" />，并进行变形（因式分解、通分、配方）。
                      </li>
                      <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-900">定号：</span>
                          判断差 <MathFormula tex="f(x_1) - f(x_2)" /> 的符号。
                      </li>
                      <li className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-900">下结论：</span>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-center">
                              <div className="bg-white p-2 rounded border border-slate-200 text-red-600 font-bold">差 &lt; 0 <MathFormula tex="\Rightarrow" /> 增</div>
                              <div className="bg-white p-2 rounded border border-slate-200 text-emerald-600 font-bold">差 &gt; 0 <MathFormula tex="\Rightarrow" /> 减</div>
                          </div>
                      </li>
                  </ol>
              </div>
          </div>

          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
               <div className="flex-1">
                   <h4 className="font-bold text-indigo-900 mb-3 text-base flex items-center gap-2"><TrendingUp className="w-5 h-5"/> 对勾函数 (重点模型)</h4>
                   <div className="flex items-center gap-4 mb-4">
                       <MathFormula tex="y = x + \frac{a}{x} \quad (a>0)" block className="text-2xl font-bold text-indigo-700" />
                   </div>
                   <div className="text-xs text-indigo-800 bg-white/50 p-3 rounded-lg border border-indigo-100 mb-3">
                       拐点坐标：<MathFormula tex="(\sqrt{a}, 2\sqrt{a})" />, <MathFormula tex="(-\sqrt{a}, -2\sqrt{a})" />
                   </div>
                   <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
                       <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                           <span className="block font-bold text-indigo-900 mb-1">单调递增区间</span>
                           <MathFormula tex="(-\infty, -\sqrt{a}], [\sqrt{a}, +\infty)" />
                       </div>
                       <div className="bg-white p-2 rounded border border-indigo-100 text-center">
                           <span className="block font-bold text-indigo-900 mb-1">单调递减区间</span>
                           <MathFormula tex="[-\sqrt{a}, 0), (0, \sqrt{a}]" />
                       </div>
                   </div>
               </div>
               <div className="shrink-0 bg-white p-2 rounded-xl border border-indigo-200 shadow-sm">
                   <FunctionPlot type="tick" color="indigo" label="y = x + 1/x" />
               </div>
          </div>
      </div>
  ),
  section5_4: (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">函数的奇偶性</h4>
               <WarningCard title="前提条件">
                   <p className="text-xs">定义域必须<span className="font-bold">关于原点对称</span>。若不关于原点对称，则既非奇函数也非偶函数。</p>
               </WarningCard>
               
               <div className="grid grid-cols-2 gap-6 mt-6">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center hover:bg-slate-100 transition-colors">
                       <div className="font-bold text-slate-800 text-lg mb-2">偶函数</div>
                       <div className="bg-white rounded-lg p-2 mb-3 shadow-sm inline-block px-4">
                           <MathFormula tex="f(-x) = f(x)" className="text-base font-bold text-primary-600" />
                       </div>
                       <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                           图象关于 <span className="font-bold text-slate-700 bg-white px-1 rounded border">y轴</span> 对称
                       </div>
                       <div className="text-[10px] text-slate-400 mt-2">"偶"尔对称</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center hover:bg-slate-100 transition-colors">
                       <div className="font-bold text-slate-800 text-lg mb-2">奇函数</div>
                       <div className="bg-white rounded-lg p-2 mb-3 shadow-sm inline-block px-4">
                           <MathFormula tex="f(-x) = -f(x)" className="text-base font-bold text-primary-600" />
                       </div>
                       <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                           图象关于 <span className="font-bold text-slate-700 bg-white px-1 rounded border">原点</span> 对称
                       </div>
                       <div className="text-[10px] text-slate-400 mt-2">"奇"怪的旋转</div>
                   </div>
               </div>

               <div className="mt-6 p-4 border-t border-slate-100">
                   <h5 className="font-bold text-slate-700 text-sm mb-3">奇偶函数的运算性质</h5>
                   <div className="grid grid-cols-2 gap-4 text-xs text-center text-slate-600">
                       <div className="bg-slate-50 p-2 rounded">奇 <MathFormula tex="\pm" /> 奇 = 奇</div>
                       <div className="bg-slate-50 p-2 rounded">偶 <MathFormula tex="\pm" /> 偶 = 偶</div>
                       <div className="bg-slate-50 p-2 rounded">奇 <MathFormula tex="\times" /> 奇 = 偶</div>
                       <div className="bg-slate-50 p-2 rounded">奇 <MathFormula tex="\times" /> 偶 = 奇</div>
                   </div>
               </div>
          </div>
      </div>
  ),
  section5_extension: (
      <div className="space-y-6">
          {/* 四则运算的单调性 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 函数四则运算的单调性
              </h4>
              <p className="text-sm text-slate-500 mb-3">设 <MathFormula tex="f(x), g(x)" /> 在公共定义域内单调性如下：</p>
              
              <div className="overflow-hidden rounded-lg border border-slate-200 text-sm text-center">
                  <table className="w-full">
                      <thead className="bg-slate-50 text-slate-600 font-bold">
                          <tr>
                              <th className="p-3 border-b">f(x)</th>
                              <th className="p-3 border-b">g(x)</th>
                              <th className="p-3 border-b">f(x) + g(x)</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                          <tr>
                              <td className="p-3 text-red-600 font-bold bg-red-50/20">增</td>
                              <td className="p-3 text-red-600 font-bold bg-red-50/20">增</td>
                              <td className="p-3 text-red-600 font-bold bg-red-50/50">增</td>
                          </tr>
                          <tr>
                              <td className="p-3 text-emerald-600 font-bold bg-emerald-50/20">减</td>
                              <td className="p-3 text-emerald-600 font-bold bg-emerald-50/20">减</td>
                              <td className="p-3 text-emerald-600 font-bold bg-emerald-50/50">减</td>
                          </tr>
                          <tr>
                              <td className="p-3">增</td>
                              <td className="p-3">减</td>
                              <td className="p-3 text-slate-400 italic">不确定</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          {/* 复合函数单调性 */}
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
               <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                   <Microscope className="w-5 h-5 text-indigo-600" /> 探究：复合函数的单调性 <MathFormula tex="y = f(g(x))" />
               </h4>
               <div className="flex flex-col md:flex-row gap-6 items-center">
                   <div className="text-center bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm md:w-1/3 w-full">
                       <div className="text-3xl font-bold text-indigo-600 mb-2">同增异减</div>
                       <div className="text-xs text-slate-500 leading-relaxed">
                           内外层单调性<span className="font-bold text-indigo-600">相同</span> <MathFormula tex="\to" /> <span className="font-bold text-red-500">增</span><br/>
                           内外层单调性<span className="font-bold text-indigo-600">相反</span> <MathFormula tex="\to" /> <span className="font-bold text-emerald-500">减</span>
                       </div>
                   </div>
                   
                   <div className="flex-1 grid grid-cols-2 gap-3 text-xs text-center w-full">
                       <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
                           <div><span className="text-red-500 font-bold">增</span> 套 <span className="text-red-500 font-bold">增</span></div>
                           <div className="text-slate-300 my-1">↓</div>
                           <div className="text-red-600 font-bold text-sm">增</div>
                       </div>
                       <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
                           <div><span className="text-emerald-500 font-bold">减</span> 套 <span className="text-emerald-500 font-bold">减</span></div>
                           <div className="text-slate-300 my-1">↓</div>
                           <div className="text-red-600 font-bold text-sm">增</div>
                       </div>
                       <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
                           <div><span className="text-red-500 font-bold">增</span> 套 <span className="text-emerald-500 font-bold">减</span></div>
                           <div className="text-slate-300 my-1">↓</div>
                           <div className="text-emerald-600 font-bold text-sm">减</div>
                       </div>
                       <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex flex-col justify-center">
                           <div><span className="text-emerald-500 font-bold">减</span> 套 <span className="text-red-500 font-bold">增</span></div>
                           <div className="text-slate-300 my-1">↓</div>
                           <div className="text-emerald-600 font-bold text-sm">减</div>
                       </div>
                   </div>
               </div>
          </div>
      </div>
  )
};