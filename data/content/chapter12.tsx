
import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { PlanarGeometry } from '../../components/PlanarGeometry';
import { Fingerprint, Calculator, Map, RotateCw, Search, BookOpen } from 'lucide-react';

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

export const Chapter12Content = {
  section12_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-500" /> 1. 复数的概念
            </h4>
            <p className="text-sm text-slate-600 mb-4">
                为了解决负数开方的问题，引入了虚数单位 <MathFormula tex="i" />，规定：
            </p>
            <FormulaCard className="bg-blue-50/20 border-blue-500">
                <MathFormula tex="i^2 = -1" block className="text-2xl font-bold text-blue-800" />
            </FormulaCard>
            <p className="text-sm text-slate-600 mb-4">
                形如 <MathFormula tex="z = a + bi \quad (a, b \in \mathbb{R})" /> 的数叫做复数。
                其中 <MathFormula tex="a" /> 叫做<span className="font-bold">实部</span>，<MathFormula tex="b" /> 叫做<span className="font-bold">虚部</span>。
            </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 复数的分类</h4>
            <div className="overflow-hidden rounded-xl border border-slate-200 text-sm">
                <div className="flex bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <div className="flex-1 p-3 border-r border-slate-200 text-center">复数 <MathFormula tex="z=a+bi" /></div>
                    <div className="flex-1 p-3 text-center">条件</div>
                </div>
                <div className="flex border-b border-slate-100">
                    <div className="flex-1 p-3 border-r border-slate-100 text-center font-bold text-slate-600">实数</div>
                    <div className="flex-1 p-3 text-center"><MathFormula tex="b = 0" /></div>
                </div>
                <div className="flex border-b border-slate-100">
                    <div className="flex-1 p-3 border-r border-slate-100 text-center font-bold text-indigo-600">虚数</div>
                    <div className="flex-1 p-3 text-center"><MathFormula tex="b \ne 0" /></div>
                </div>
                <div className="flex bg-indigo-50/30">
                    <div className="flex-1 p-3 border-r border-slate-100 text-center font-bold text-indigo-800">纯虚数</div>
                    <div className="flex-1 p-3 text-center"><MathFormula tex="a = 0, b \ne 0" /></div>
                </div>
            </div>
            
            <WarningCard title="复数相等">
                <p className="text-sm">
                    两个复数相等的充要条件是它们的实部和虚部分别相等。
                    <br/>
                    <MathFormula tex="a+bi = c+di \iff a=c \text{ 且 } b=d" block className="mt-2 text-center" />
                </p>
            </WarningCard>
        </div>
    </div>
  ),
  section12_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-500" /> 1. 四则运算
            </h4>
            <div className="space-y-4 text-sm">
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-700">加减法 (实部与实部，虚部与虚部)</span>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <MathFormula tex="(a+bi) \pm (c+di) = (a \pm c) + (b \pm d)i" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-700">乘法 (类似多项式乘法，注意 <MathFormula tex="i^2=-1" />)</span>
                    <div className="bg-slate-50 p-3 rounded border border-slate-100">
                        <MathFormula tex="(a+bi)(c+di) = (ac-bd) + (ad+bc)i" />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 共轭复数与除法</h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-2">共轭复数</span>
                    <p className="text-xs text-purple-700 mb-2">实部相等，虚部互为相反数。</p>
                    <MathFormula tex="z = a+bi \implies \bar{z} = a-bi" block className="font-bold text-lg text-purple-800" />
                    <div className="mt-3 pt-3 border-t border-purple-200 text-xs text-purple-800">
                        重要性质：<MathFormula tex="z \bar{z} = |z|^2 = a^2+b^2" /> (实数)
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2">除法法则</span>
                    <p className="text-xs text-slate-500 mb-2">分子分母同时乘以分母的共轭复数（分母实数化）。</p>
                    <MathFormula tex="\frac{a+bi}{c+di} = \frac{(a+bi)(c-di)}{(c+di)(c-di)} = \frac{ac+bd}{c^2+d^2} + \frac{bc-ad}{c^2+d^2}i" block className="text-sm" />
                </div>
            </div>
            
            <div className="mt-4 p-3 border border-slate-200 rounded-lg bg-white text-sm flex items-center gap-3">
                <span className="font-bold bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs">周期性</span>
                <span className="text-slate-600">虚数单位 <MathFormula tex="i" /> 的幂具有周期性 (4为周期)：</span>
                <MathFormula tex="i^1=i, \ i^2=-1, \ i^3=-i, \ i^4=1" />
            </div>
        </div>
    </div>
  ),
  section12_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-500" /> 1. 复平面 (Complex Plane)
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="shrink-0">
                    <PlanarGeometry 
                        items={[
                            { type: 'vector', start: {x:0,y:0}, end: {x:3,y:4}, color: '#3b82f6', label: 'z' },
                            { type: 'point', x:3, y:4, label: 'Z(a,b)', color: '#3b82f6' },
                            { type: 'line', start: {x:3, y:4}, end: {x:3, y:0}, dashed: true, color: '#94a3b8' },
                            { type: 'line', start: {x:3, y:4}, end: {x:0, y:4}, dashed: true, color: '#94a3b8' }
                        ]}
                        xDomain={[-1, 5]}
                        yDomain={[-1, 5]}
                        width={240}
                        height={240}
                        axisLabels={['Re', 'Im']}
                        title="复数 z=a+bi 的几何意义"
                    />
                </div>
                <div className="flex-1 space-y-3">
                    <p className="text-sm text-slate-600">
                        建立平面直角坐标系，x 轴为<span className="font-bold">实轴</span>，y 轴为<span className="font-bold">虚轴</span>。
                    </p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                        <span className="font-bold text-slate-700 block mb-1">一一对应关系</span>
                        复数 <MathFormula tex="z=a+bi" /> <MathFormula tex="\leftrightarrow" /> 点 <MathFormula tex="Z(a, b)" /> <MathFormula tex="\leftrightarrow" /> 向量 <MathFormula tex="\overrightarrow{OZ}" />
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 复数的模与几何运算</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">复数的模 (Modulus)</span>
                    <MathFormula tex="|z| = |\overrightarrow{OZ}| = \sqrt{a^2+b^2}" block className="text-lg" />
                    <div className="text-xs text-slate-500 mt-2">表示复平面上点 Z 到原点的距离。</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">加减法的几何意义</span>
                    <div className="text-xs text-slate-600">
                        复数的加减法运算符合向量加减法的<span className="font-bold">平行四边形法则</span>和<span className="font-bold">三角形法则</span>。
                        <br/>
                        <MathFormula tex="|z_1 - z_2|" /> 表示复平面上两点间的距离。
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section12_4: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-purple-500" /> 1. 复数的三角形式
            </h4>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="shrink-0">
                    <PlanarGeometry 
                        items={[
                            { type: 'circle', center: {x:0, y:0}, radius: 3, dashed: true, color: '#e2e8f0' },
                            { type: 'vector', start: {x:0,y:0}, end: {x:2.12,y:2.12}, color: '#8b5cf6', label: 'z' },
                            { type: 'point', x:2.12, y:2.12, label: 'Z', color: '#8b5cf6' }
                        ]}
                        xDomain={[-4, 4]}
                        yDomain={[-4, 4]}
                        width={240}
                        height={240}
                        axisLabels={['Re', 'Im']}
                        title="模 r 与 辐角 θ"
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-3">
                        设非零复数 <MathFormula tex="z=a+bi" /> 的模为 <MathFormula tex="r" />，辐角为 <MathFormula tex="\theta" />，则：
                    </p>
                    <FormulaCard className="my-0 bg-purple-50/20 border-purple-500">
                        <MathFormula tex="z = r(\cos\theta + i\sin\theta)" block className="text-xl font-bold text-purple-800" />
                    </FormulaCard>
                    <div className="mt-3 text-xs text-slate-500">
                        <ul className="list-disc list-inside space-y-1">
                            <li><MathFormula tex="r = \sqrt{a^2+b^2}" /></li>
                            <li><MathFormula tex="\tan\theta = \frac{b}{a}" /> (注意象限)</li>
                            <li>辐角主值 <MathFormula tex="\arg z \in [0, 2\pi)" /></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">2. 三角形式的运算</h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">乘法 (模相乘，角相加)</span>
                    <MathFormula tex="z_1 z_2 = r_1 r_2 [\cos(\theta_1+\theta_2) + i\sin(\theta_1+\theta_2)]" className="text-sm" />
                    <div className="text-xs text-slate-500 mt-2 italic">几何意义：旋转 + 伸缩</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-2 text-sm">除法 (模相除，角相减)</span>
                    <MathFormula tex="\frac{z_1}{z_2} = \frac{r_1}{r_2} [\cos(\theta_1-\theta_2) + i\sin(\theta_1-\theta_2)]" className="text-sm" />
                </div>
            </div>
        </div>
    </div>
  ),
  inquiry_roots: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" /> 探究：复数的开方与单位根
            </h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                方程 <MathFormula tex="x^n = 1" /> 在复数范围内有 <MathFormula tex="n" /> 个根，这些根叫做 <MathFormula tex="n" /> 次<span className="font-bold text-indigo-600">单位根</span>。
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                    <PlanarGeometry 
                        items={[
                            { type: 'circle', center: {x:0, y:0}, radius: 2, dashed: true, color: '#94a3b8' },
                            { type: 'point', x:2, y:0, label: '1', color: '#ef4444' },
                            { type: 'point', x:-1, y:1.732, label: '\\omega', color: '#ef4444' },
                            { type: 'point', x:-1, y:-1.732, label: '\\omega^2', color: '#ef4444' },
                            { type: 'line', start: {x:2, y:0}, end: {x:-1, y:1.732}, color: '#fca5a5' },
                            { type: 'line', start: {x:-1, y:1.732}, end: {x:-1, y:-1.732}, color: '#fca5a5' },
                            { type: 'line', start: {x:-1, y:-1.732}, end: {x:2, y:0}, color: '#fca5a5' },
                        ]}
                        xDomain={[-2.5, 2.5]}
                        yDomain={[-2.5, 2.5]}
                        width={220}
                        height={220}
                        axisLabels={['Re', 'Im']}
                        title="三次单位根构成正三角形"
                    />
                </div>
                
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <h5 className="font-bold text-slate-700 mb-2 text-sm">代数形式</h5>
                        <MathFormula tex="\omega_k = \cos\frac{2k\pi}{n} + i\sin\frac{2k\pi}{n}" block className="text-indigo-800 mb-2"/>
                        <div className="text-xs text-slate-500 text-center"><MathFormula tex="k = 0, 1, \dots, n-1" /></div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        <h5 className="font-bold text-slate-700 mb-2 text-sm">几何意义</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            这 <MathFormula tex="n" /> 个根对应复平面上单位圆内接<span className="font-bold">正 n 多边形</span>的顶点。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  reading_history: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <BookOpen className="w-48 h-48" />
            </div>
            <h4 className="font-bold text-slate-800 mb-4 text-xl">阅读：复数系是怎样建立的？</h4>
            
            <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed relative z-10">
                <p>
                    复数的发现并非源于对 <MathFormula tex="x^2+1=0" /> 的求解，而是源于对一元三次方程求根公式的探索。
                </p>
                <div className="space-y-4 mt-4">
                    <div className="flex gap-4">
                        <div className="font-bold text-slate-300 text-lg">1545</div>
                        <div>
                            <span className="font-bold text-slate-800">卡尔达诺 (Cardano)</span>
                            <p className="text-xs mt-1">在《大术》中解方程时不得不面对“负数的平方根”，称其为“既微妙又无用”的数。</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="font-bold text-slate-300 text-lg">1637</div>
                        <div>
                            <span className="font-bold text-slate-800">笛卡尔 (Descartes)</span>
                            <p className="text-xs mt-1">首次使用“虚数” (Imaginary Number) 一词，意指虚幻不实。</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="font-bold text-slate-300 text-lg">1777</div>
                        <div>
                            <span className="font-bold text-slate-800">欧拉 (Euler)</span>
                            <p className="text-xs mt-1">引入符号 <MathFormula tex="i" /> 表示 <MathFormula tex="\sqrt{-1}" />，使复数运算得以标准化。</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="font-bold text-slate-300 text-lg">1799</div>
                        <div>
                            <span className="font-bold text-slate-800">高斯 (Gauss) & 阿尔冈 (Argand)</span>
                            <p className="text-xs mt-1">建立了复平面，赋予了复数直观的几何意义，使复数终于被数学界广泛接受。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};
