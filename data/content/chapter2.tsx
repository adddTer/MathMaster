import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw, GitMerge, AlertTriangle } from 'lucide-react';

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

export const Chapter2Content = {
  section2_1: (
      <div className="space-y-6">
        {/* 命题定义 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
            <h4 className="font-bold text-slate-800 mb-4 text-lg">1. 命题</h4>
            <div className="space-y-4 text-sm">
                <p className="text-slate-600 leading-relaxed">
                    一般地，我们把用语言、符号或式子表达的，可以<span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">判断真假</span>的陈述句叫做命题。
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-emerald-800 block text-sm mb-1">真命题</span>
                            <span className="text-xs text-emerald-700">判断为真的语句。</span>
                            <div className="text-[10px] text-emerald-600 mt-1 opacity-80">例：三角形内角和是180°</div>
                        </div>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-red-800 block text-sm mb-1">假命题</span>
                            <span className="text-xs text-red-700">判断为假的语句。</span>
                            <div className="text-[10px] text-red-600 mt-1 opacity-80">例：偶数都是合数 (2是偶数但不是合数)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 结构 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-slate-500" /> 2. 命题的结构
            </h4>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <div className="flex items-center justify-center gap-3 text-lg mb-4">
                    <span className="font-bold text-slate-400">形式：</span>
                    <span className="font-serif italic text-slate-600">若</span>
                    <span className="px-3 py-1 bg-white border border-indigo-200 rounded text-indigo-600 font-bold shadow-sm">p</span>
                    <span className="font-serif italic text-slate-600">，则</span>
                    <span className="px-3 py-1 bg-white border border-purple-200 rounded text-purple-600 font-bold shadow-sm">q</span>
                </div>
                <div className="grid grid-cols-2 gap-8 text-sm mt-6 border-t border-slate-200 pt-4">
                    <div>
                        <div className="font-bold text-indigo-700 mb-1">条件</div>
                        <div className="text-slate-500 text-xs">已知的事项 p</div>
                    </div>
                    <div>
                        <div className="font-bold text-purple-700 mb-1">结论</div>
                        <div className="text-slate-500 text-xs">由已知事项推出的事项 q</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
  ),
  section2_2: (
      <div className="space-y-6">
        {/* 推导符号 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <div className="flex items-center justify-center gap-10 mb-4">
                <div className="text-center group">
                     <div className="text-3xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform"><MathFormula tex="\Rightarrow" /></div>
                     <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">推出</div>
                     <div className="text-[10px] text-slate-400">若 p 则 q 为真</div>
                </div>
                <div className="text-center group">
                     <div className="text-3xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform"><MathFormula tex="\Leftrightarrow" /></div>
                     <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">等价</div>
                     <div className="text-[10px] text-slate-400">互为充要条件</div>
                </div>
            </div>
            <p className="text-sm text-slate-600 border-t border-slate-100 pt-3 mt-2">
                只有当命题 “若 p，则 q” 为<span className="font-bold text-emerald-600">真命题</span>时，才说 <MathFormula tex="p \Rightarrow q" />。
            </p>
        </div>

        {/* 核心关系 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary-500" /> 四种逻辑关系
             </h4>
             <div className="space-y-3">
                 <div className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-colors border border-emerald-100">
                     <div className="font-mono font-bold text-emerald-700 w-24 text-center shrink-0 text-lg bg-white py-1 rounded border border-emerald-200"><MathFormula tex="p \Rightarrow q" /></div>
                     <div className="text-sm text-slate-700">
                         p 是 q 的<span className="font-bold text-emerald-700 px-1">充分</span>条件
                         <br/>
                         <span className="text-xs text-slate-400">有 p 一定有 q</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors border border-blue-100">
                     <div className="font-mono font-bold text-blue-700 w-24 text-center shrink-0 text-lg bg-white py-1 rounded border border-blue-200"><MathFormula tex="q \Rightarrow p" /></div>
                     <div className="text-sm text-slate-700">
                         p 是 q 的<span className="font-bold text-blue-700 px-1">必要</span>条件
                         <br/>
                         <span className="text-xs text-slate-400">要 q 必须有 p</span>
                     </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-xl hover:bg-purple-50 transition-colors border border-purple-100">
                     <div className="font-mono font-bold text-purple-700 w-24 text-center shrink-0 text-lg bg-white py-1 rounded border border-purple-200"><MathFormula tex="p \Leftrightarrow q" /></div>
                     <div className="text-sm text-slate-700">
                         p 是 q 的<span className="font-bold text-purple-700 px-1">充要</span>条件
                         <br/>
                         <span className="text-xs text-slate-400">p 即是 q，q 即是 p</span>
                     </div>
                 </div>
             </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">实例辨析</h4>
            <div className="space-y-2 text-sm">
                 <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                     <span><span className="font-bold">p:</span> x &gt; 2</span>
                     <span><span className="font-bold">q:</span> x &gt; 1</span>
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">充分不必要</span>
                 </div>
                 <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                     <span><span className="font-bold">p:</span> |x| = 1</span>
                     <span><span className="font-bold">q:</span> x = 1</span>
                     <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">必要不充分</span>
                 </div>
                 <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                     <span><span className="font-bold">p:</span> 三角形三边相等</span>
                     <span><span className="font-bold">q:</span> 三角形三角相等</span>
                     <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">充要条件</span>
                 </div>
            </div>
        </div>

        {/* 集合法判断 (小推大) */}
        <WarningCard title="判别技巧：集合法 (小范围推大范围)">
            <p className="mb-3 text-sm text-slate-700">
                设 <MathFormula tex="A = \{x \mid p(x)\}, B = \{x \mid q(x)\}" />，将逻辑关系转化为集合包含关系：
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white border border-emerald-200 rounded-xl shadow-sm">
                    <MathFormula tex="A \subseteq B" className="text-xl block mb-2 font-bold text-emerald-600" />
                    <span className="text-xs text-slate-500">"小" <MathFormula tex="\subseteq" /> "大"</span>
                    <div className="text-sm font-bold text-emerald-700 mt-2 bg-emerald-50 rounded py-1">p 是 q 的充分条件</div>
                </div>
                <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-sm">
                    <MathFormula tex="B \subseteq A" className="text-xl block mb-2 font-bold text-blue-600" />
                    <span className="text-xs text-slate-500">"大" <MathFormula tex="\supseteq" /> "小"</span>
                    <div className="text-sm font-bold text-blue-700 mt-2 bg-blue-50 rounded py-1">p 是 q 的必要条件</div>
                </div>
            </div>
        </WarningCard>
      </div>
  ),
  section2_3: (
      <div className="space-y-6">
         {/* 符号介绍 */}
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center group hover:border-indigo-300 transition-all">
                 <div className="text-4xl font-bold text-indigo-600 mb-2 font-serif">∀</div>
                 <div className="text-sm font-bold text-slate-800">全称量词</div>
                 <div className="text-xs text-slate-500 mt-1">所有的、任意一个、一切</div>
                 <div className="mt-2 text-xs text-slate-400 font-mono"><MathFormula tex="\forall x \in M, p(x)" /></div>
             </div>
             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center group hover:border-amber-300 transition-all">
                 <div className="text-4xl font-bold text-amber-600 mb-2 font-serif">∃</div>
                 <div className="text-sm font-bold text-slate-800">存在量词</div>
                 <div className="text-xs text-slate-500 mt-1">存在一个、至少有一个、有些</div>
                 <div className="mt-2 text-xs text-slate-400 font-mono"><MathFormula tex="\exists x \in M, p(x)" /></div>
             </div>
         </div>

         {/* 命题的否定 (重要考点) */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                 <RefreshCw className="w-5 h-5 text-blue-500" /> 命题的否定
             </h4>
             <p className="text-sm text-slate-500 mb-3">
                 含有一个量词的命题的否定，遵循“<span className="font-bold text-slate-700">改量词，否结论</span>”的规则。
             </p>
             <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                 <div className="grid grid-cols-2 bg-slate-100 p-3 font-bold text-slate-600 text-center text-xs uppercase tracking-wider">
                     <div>原命题</div>
                     <div>命题的否定</div>
                 </div>
                 <div className="grid grid-cols-2 border-t border-slate-200 divide-x divide-slate-200">
                     <div className="p-4 text-center flex flex-col justify-center gap-2">
                         <span className="text-xs text-slate-400">全称命题</span>
                         <MathFormula tex="\forall x \in M, p(x)" className="font-medium"/>
                     </div>
                     <div className="p-4 text-center flex flex-col justify-center bg-red-50/10 gap-2">
                         <span className="text-xs text-red-400">特称命题</span>
                         <div className="flex items-center justify-center gap-2">
                             <MathFormula tex="\exists x \in M," />
                             <span className="font-bold text-red-600"><MathFormula tex="\neg p(x)" /></span>
                         </div>
                     </div>
                 </div>
                 <div className="grid grid-cols-2 border-t border-slate-200 divide-x divide-slate-200">
                     <div className="p-4 text-center flex flex-col justify-center gap-2">
                         <span className="text-xs text-slate-400">特称命题</span>
                         <MathFormula tex="\exists x \in M, p(x)" className="font-medium"/>
                     </div>
                     <div className="p-4 text-center flex flex-col justify-center bg-red-50/10 gap-2">
                         <span className="text-xs text-red-400">全称命题</span>
                         <div className="flex items-center justify-center gap-2">
                             <MathFormula tex="\forall x \in M," />
                             <span className="font-bold text-red-600"><MathFormula tex="\neg p(x)" /></span>
                         </div>
                     </div>
                 </div>
             </div>
             
             <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                 <h5 className="font-bold text-slate-700 text-sm mb-2">常见词语的否定</h5>
                 <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 text-center">
                     <div className="bg-white border rounded p-1">都是 <ArrowRight className="w-3 h-3 inline mx-1" /> 不都是</div>
                     <div className="bg-white border rounded p-1">至少一个 <ArrowRight className="w-3 h-3 inline mx-1" /> 一个也没有</div>
                     <div className="bg-white border rounded p-1">至多一个 <ArrowRight className="w-3 h-3 inline mx-1" /> 至少两个</div>
                     <div className="bg-white border rounded p-1">p且q <ArrowRight className="w-3 h-3 inline mx-1" /> non p 或 non q</div>
                     <div className="bg-white border rounded p-1">p或q <ArrowRight className="w-3 h-3 inline mx-1" /> non p 且 non q</div>
                     <div className="bg-white border rounded p-1">等于 <ArrowRight className="w-3 h-3 inline mx-1" /> 不等于</div>
                 </div>
             </div>
         </div>
      </div>
  )
};