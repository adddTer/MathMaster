
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { BoxSelect, Grip, List, Type, Fingerprint, Layers, Microscope } from 'lucide-react';

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

export const Chapter1Content = {
  section1_1: (
      <div className="space-y-6">
        {/* 定义 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-500" /> 1. 集合的概念
            </h4>
            <div className="space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                    一般地，我们把研究对象统称为<span className="font-bold text-primary-700 bg-primary-50 px-1 rounded">元素</span>，
                    把一些元素组成的总体叫做<span className="font-bold text-primary-700 bg-primary-50 px-1 rounded">集合</span>。
                </p>
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                    <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide border-b border-slate-200 pb-2">集合元素的三个特性</div>
                    <ul className="space-y-3 text-sm text-slate-700">
                        <li className="flex gap-3">
                            <span className="font-bold bg-white border border-slate-200 px-2 rounded text-xs py-0.5 h-fit text-slate-600 shadow-sm shrink-0">确定性</span>
                            <span>对于一个给定的集合，任何一个元素要么属于它，要么不属于它，非此即彼。</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold bg-white border border-slate-200 px-2 rounded text-xs py-0.5 h-fit text-slate-600 shadow-sm shrink-0">互异性</span>
                            <span>集合中的元素必须是各不相同的，相同的元素只能算一个。</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold bg-white border border-slate-200 px-2 rounded text-xs py-0.5 h-fit text-slate-600 shadow-sm shrink-0">无序性</span>
                            <span>集合中的元素没有先后顺序，<MathFormula tex="\{1, 2\} = \{2, 1\}" />。</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* 集合的表示方法 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                 <List className="w-5 h-5 text-purple-500" /> 2. 集合的表示方法
             </h4>
             <div className="grid md:grid-cols-2 gap-4">
                 <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                     <div className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                         <List className="w-4 h-4" /> 列举法
                     </div>
                     <p className="text-xs text-purple-900/80 mb-2">将集合的元素一一列举出来，并括在大括号内。</p>
                     <div className="bg-white p-2 rounded border border-purple-100 text-center text-sm">
                         <MathFormula tex="\{1, 2, 3, 4\}" />
                     </div>
                 </div>
                 <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                     <div className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                         <Type className="w-4 h-4" /> 描述法
                     </div>
                     <p className="text-xs text-indigo-900/80 mb-2">用集合所含元素的共同特征表示集合。</p>
                     <div className="bg-white p-2 rounded border border-indigo-100 text-center text-sm">
                         <MathFormula tex="\{x \in \mathbb{R} \mid x < 10\}" />
                     </div>
                 </div>
             </div>
        </div>

        {/* 常用数集 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">3. 常用数集及其记法</h4>
             <div className="flex flex-wrap gap-3">
                <span className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2"><MathFormula tex="\mathbb{N}" /> 自然数集</span>
                <span className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2"><MathFormula tex="\mathbb{N}^* (\mathbb{N}_+)" /> 正整数集</span>
                <span className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2"><MathFormula tex="\mathbb{Z}" /> 整数集</span>
                <span className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2"><MathFormula tex="\mathbb{Q}" /> 有理数集</span>
                <span className="px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm font-medium flex items-center gap-2"><MathFormula tex="\mathbb{R}" /> 实数集</span>
             </div>
             
             <WarningCard title="元素与集合的关系符号">
                 <div className="grid grid-cols-2 gap-4 text-center mt-2">
                     <div>
                         <MathFormula tex="a \in A" className="font-bold text-lg" />
                         <div className="text-xs text-slate-500">属于 (元素 vs 集合)</div>
                     </div>
                     <div>
                         <MathFormula tex="a \notin A" className="font-bold text-lg" />
                         <div className="text-xs text-slate-500">不属于</div>
                     </div>
                 </div>
             </WarningCard>
        </div>
      </div>
  ),
  section1_2: (
      <div className="space-y-6">
        {/* 包含关系 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <BoxSelect className="w-5 h-5 text-emerald-500" /> 集合间的基本关系
            </h4>
            <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center min-w-[80px] shadow-sm">
                        <MathFormula tex="A \subseteq B" className="font-bold text-xl text-emerald-700"/>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Subset</div>
                    </div>
                    <div className="text-sm text-slate-700 flex-1">
                        <span className="font-bold text-slate-900 block mb-1 text-base">子集</span>
                        如果集合 A 中<span className="font-bold text-emerald-600 bg-emerald-50 px-1 rounded">任意一个</span>元素都是集合 B 的元素，称 A 为 B 的子集。
                        <div className="mt-3 flex gap-2">
                            <span className="text-xs bg-white px-2 py-1 rounded border text-slate-500">自反性：<MathFormula tex="A \subseteq A" /></span>
                            <span className="text-xs bg-white px-2 py-1 rounded border text-slate-500">空集：<MathFormula tex="\varnothing \subseteq A" /></span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="bg-white p-3 rounded-lg border border-slate-200 text-center min-w-[80px] shadow-sm">
                        <MathFormula tex="A \subsetneq B" className="font-bold text-xl text-emerald-700"/>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Proper</div>
                    </div>
                    <div className="text-sm text-slate-700 flex-1">
                        <span className="font-bold text-slate-900 block mb-1 text-base">真子集</span>
                        若 <MathFormula tex="A \subseteq B" /> 且 <MathFormula tex="A \neq B" /> (即 B 中至少有一个元素不属于 A)。
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <div className="bg-white p-3 rounded-lg border border-slate-200 text-center min-w-[80px] shadow-sm">
                        <MathFormula tex="A = B" className="font-bold text-xl text-emerald-700"/>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Equal</div>
                    </div>
                    <div className="text-sm text-slate-700 flex-1">
                        <span className="font-bold text-slate-900 block mb-1 text-base">集合相等</span>
                        若 <MathFormula tex="A \subseteq B" /> 且 <MathFormula tex="B \subseteq A" />，则 <MathFormula tex="A = B" />。
                        <div className="text-xs text-slate-500 mt-1">这意味着两个集合中的元素完全相同。</div>
                    </div>
                </div>
            </div>
        </div>

        {/* 补集 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                 <Grip className="w-5 h-5 text-indigo-500" /> 全集与补集
            </h4>
            <div className="text-sm text-slate-700 space-y-4">
                <p><span className="font-bold bg-slate-100 px-1 py-0.5 rounded">全集 (U)</span>：如果一个集合包含我们所研究问题中涉及的所有元素，通常称其为全集。</p>
                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                     <div className="relative w-32 h-24 bg-white border-2 border-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                         <span className="absolute top-1 right-1 text-xs font-bold">U</span>
                         <div className="w-16 h-16 rounded-full border-2 border-slate-800 bg-slate-200 flex items-center justify-center">
                             <span className="font-bold">A</span>
                         </div>
                         <div className="absolute bottom-1 right-1 text-[10px] text-indigo-600 font-bold">∁UA (白色区域)</div>
                     </div>
                     <div className="flex-1">
                        <span className="font-bold block mb-2 text-indigo-800 text-lg">补集</span>
                        <p className="mb-3 leading-relaxed">对于一个集合 A，由全集 U 中<span className="font-bold text-red-500">不属于</span> A 的所有元素组成的集合。</p>
                        <FormulaCard className="my-0 py-3 bg-white border-indigo-200">
                             <MathFormula tex="\complement_U A = \{x \mid x \in U, x \notin A\}" />
                        </FormulaCard>
                     </div>
                </div>
            </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl text-center text-blue-900 text-sm shadow-sm border border-blue-100">
            <span className="font-bold text-blue-700 block mb-1 text-base">🔥 必背结论：子集个数</span> 
            若集合 A 有 <MathFormula tex="n" /> 个元素，则：
            <div className="flex justify-center gap-8 mt-2">
                <div>子集个数：<MathFormula tex="2^n" className="font-bold text-lg" /></div>
                <div>真子集个数：<MathFormula tex="2^n - 1" className="font-bold text-lg" /></div>
            </div>
        </div>
      </div>
  ),
  section1_3: (
      <div className="space-y-8">
         {/* 符号与定义对比 - STRICT FIX: Removed relative/overflow-hidden/hover transitions/shadows to prevent layout thrashing */}
         <div className="grid md:grid-cols-2 gap-6">
             <div className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                 <div className="w-full h-1.5 bg-blue-500 rounded-t-sm mb-4"></div>
                 <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center mb-4 bg-blue-50 text-blue-600">
                    <MathFormula tex="\cap" className="text-3xl font-bold" />
                 </div>
                 <span className="font-bold text-slate-800 text-xl mb-1">交集</span>
                 <span className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full mb-3">且 (AND)</span>
                 <p className="text-sm text-slate-500 text-center px-4 mb-3">属于 A <span className="font-bold text-slate-800">且</span> 属于 B 的元素</p>
                 <div className="w-full bg-slate-50 p-3 rounded-lg text-center border border-slate-100 mt-auto">
                    <MathFormula tex="\{x \mid x \in A \text{ 且 } x \in B\}" className="text-xs text-slate-500 font-mono" />
                 </div>
             </div>
             
             <div className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                 <div className="w-full h-1.5 bg-emerald-500 rounded-t-sm mb-4"></div>
                 <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center mb-4 bg-emerald-50 text-emerald-600">
                    <MathFormula tex="\cup" className="text-3xl font-bold" />
                 </div>
                 <span className="font-bold text-slate-800 text-xl mb-1">并集</span>
                 <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full mb-3">或 (OR)</span>
                 <p className="text-sm text-slate-500 text-center px-4 mb-3">属于 A <span className="font-bold text-slate-800">或</span> 属于 B 的元素</p>
                 <div className="w-full bg-slate-50 p-3 rounded-lg text-center border border-slate-100 mt-auto">
                    <MathFormula tex="\{x \mid x \in A \text{ 或 } x \in B\}" className="text-xs text-slate-500 font-mono" />
                 </div>
             </div>
         </div>

         {/* 运算性质列表 */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                 <Layers className="w-5 h-5 text-slate-500" /> 常用运算性质
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-transparent">
                     <span className="text-slate-600 font-medium">交集的子集关系</span>
                     <MathFormula tex="A \cap B \subseteq A" />
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-transparent">
                     <span className="text-slate-600 font-medium">并集的超集关系</span>
                     <MathFormula tex="A \subseteq A \cup B" />
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-transparent">
                     <span className="text-slate-600 font-medium">与空集交</span>
                     <MathFormula tex="A \cap \varnothing = \varnothing" />
                 </div>
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-transparent">
                     <span className="text-slate-600 font-medium">与空集并</span>
                     <MathFormula tex="A \cup \varnothing = A" />
                 </div>
             </div>
             
             <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     <div>
                         <span className="font-bold text-indigo-900 block mb-1">德·摩根律</span>
                         <span className="text-xs text-indigo-700">补集的运算规则，常用于复杂集合化简。</span>
                     </div>
                     <div className="text-right space-y-2">
                         <MathFormula tex="\complement_U(A \cup B) = (\complement_U A) \cap (\complement_U B)" className="block bg-white px-3 py-1 rounded border border-indigo-100 shadow-sm" />
                         <MathFormula tex="\complement_U(A \cap B) = (\complement_U A) \cup (\complement_U B)" className="block bg-white px-3 py-1 rounded border border-indigo-100 shadow-sm" />
                     </div>
                 </div>
             </div>
         </div>
         
         {/* 容斥原理 */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-3 text-sm">有限集合的元素个数 (容斥原理)</h4>
             <FormulaCard className="my-0 py-4 bg-amber-50/30 border-amber-400">
                 <MathFormula tex="\text{card}(A \cup B) = \text{card}(A) + \text{card}(B) - \text{card}(A \cap B)" block className="text-lg text-slate-800"/>
             </FormulaCard>
         </div>

         <WarningCard title="解题策略：数形结合">
             <p className="mb-2 font-medium">处理集合运算时的两大“法宝”：</p>
             <div className="grid grid-cols-2 gap-4 mt-2">
                 <div className="bg-white p-3 rounded border border-amber-200/50">
                     <span className="font-bold text-primary-600 block mb-1">1. Venn 图</span>
                     <span className="text-xs text-slate-500">适用于：抽象集合、元素较少或离散的集合。直观展示包含、相交关系。</span>
                 </div>
                 <div className="bg-white p-3 rounded border border-amber-200/50">
                     <span className="font-bold text-primary-600 block mb-1">2. 数轴</span>
                     <span className="text-xs text-slate-500">适用于：不等式表示的连续实数集合。注意端点的<span className="font-bold text-red-500">空心/实心</span>。</span>
                 </div>
             </div>
             <p className="mt-3 text-xs text-slate-400 border-t border-amber-200 pt-2">
                 特别提醒：遇到含参数的问题（如 <MathFormula tex="A \subseteq B" />），千万别忘了 <MathFormula tex="A = \varnothing" /> 的情况！
             </p>
         </WarningCard>
      </div>
  ),
  section1_extension: (
      <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
              <h4 className="font-bold text-indigo-900 mb-6 text-lg flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-indigo-600" /> 探究：集合运算的运算律
              </h4>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  类比实数的加法和乘法运算律（交换律、结合律、分配律），集合的交、并运算也满足类似的规律。
              </p>

              <div className="grid gap-6">
                  {/* 交换律 */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">1</span>
                          <h5 className="font-bold text-slate-800">交换律</h5>
                      </div>
                      <div className="ml-11 grid md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-2 rounded text-center text-sm border border-slate-100">
                              <span className="text-xs text-slate-400 block mb-1">并集</span>
                              <MathFormula tex="A \cup B = B \cup A" className="font-medium text-slate-700"/>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center text-sm border border-slate-100">
                              <span className="text-xs text-slate-400 block mb-1">交集</span>
                              <MathFormula tex="A \cap B = B \cap A" className="font-medium text-slate-700"/>
                          </div>
                      </div>
                  </div>

                  {/* 结合律 */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">2</span>
                          <h5 className="font-bold text-slate-800">结合律</h5>
                      </div>
                      <div className="ml-11 space-y-2">
                          <div className="bg-slate-50 p-2 rounded text-center text-sm border border-slate-100">
                              <MathFormula tex="(A \cup B) \cup C = A \cup (B \cup C)" className="font-medium text-slate-700"/>
                          </div>
                          <div className="bg-slate-50 p-2 rounded text-center text-sm border border-slate-100">
                              <MathFormula tex="(A \cap B) \cap C = A \cap (B \cap C)" className="font-medium text-slate-700"/>
                          </div>
                      </div>
                  </div>

                  {/* 分配律 */}
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm ring-1 ring-indigo-50">
                      <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                          <h5 className="font-bold text-indigo-900">分配律 (重点)</h5>
                      </div>
                      <p className="ml-11 text-xs text-slate-500 mb-3">类似于实数运算 <MathFormula tex="a(b+c) = ab + ac" /></p>
                      <div className="ml-11 space-y-3">
                          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                              <div className="text-xs text-indigo-400 mb-1 font-bold uppercase">交对并的分配</div>
                              <MathFormula tex="A \cap (B \cup C) = (A \cap B) \cup (A \cap C)" className="font-bold text-indigo-800 block text-center"/>
                          </div>
                          <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                              <div className="text-xs text-indigo-400 mb-1 font-bold uppercase">并对交的分配</div>
                              <MathFormula tex="A \cup (B \cap C) = (A \cup B) \cap (A \cup C)" className="font-bold text-indigo-800 block text-center"/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
};
