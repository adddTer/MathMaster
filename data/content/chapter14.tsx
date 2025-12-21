import React from 'react';
import { MathFormula } from '../../components/MathFormula';
import { ChartComponent } from '../../components/ChartComponent';
import { BarChart3, PieChart, TrendingUp, Users, Target, Activity, Table } from 'lucide-react';

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

export const Chapter14Content = {
  section14_1: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" /> 1. 基本概念
            </h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2">调查方式</h5>
                    <div className="space-y-3 text-sm">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-1">普查 (Census)</span>
                            <span className="text-slate-600">对每一个调查对象都进行调查。</span>
                            <div className="text-xs text-slate-400 mt-1">优点：准确；缺点：耗时费力，有时不可行（如破坏性测试）。</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <span className="font-bold text-indigo-700 block mb-1">抽样调查 (Sample Survey)</span>
                            <span className="text-slate-600">从总体中抽取一部分进行调查，用样本估计总体。</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-slate-700 mb-2">核心术语</h5>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><span className="font-bold text-slate-800">总体：</span>调查对象的全体。</li>
                        <li><span className="font-bold text-slate-800">个体：</span>组成总体的每一个调查对象。</li>
                        <li><span className="font-bold text-slate-800">样本：</span>从总体中抽取的那部分个体。</li>
                        <li><span className="font-bold text-slate-800">样本容量：</span>样本中包含个体的数量（<span className="text-red-500">不带单位</span>）。</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  ),
  section14_2: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> 2. 常用抽样方法
            </h4>
            
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                    <div className="md:w-1/4 shrink-0 font-bold text-emerald-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-xs">1</span>
                        简单随机抽样
                    </div>
                    <div className="flex-1 text-sm text-slate-700">
                        <p className="mb-2">从总体 N 个个体中逐个不放回地抽取 n 个个体。</p>
                        <div className="flex gap-2">
                            <span className="bg-white px-2 py-1 rounded border border-emerald-200 text-xs text-emerald-700">抽签法 (N较小)</span>
                            <span className="bg-white px-2 py-1 rounded border border-emerald-200 text-xs text-emerald-700">随机数表法 (N较大)</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="md:w-1/4 shrink-0 font-bold text-blue-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs">2</span>
                        分层抽样 (重点)
                    </div>
                    <div className="flex-1 text-sm text-slate-700">
                        <p className="mb-2">将总体分成差异明显的几层，按比例抽取。适用于<span className="font-bold">个体差异较大</span>的情况。</p>
                        <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                            <span className="text-xs text-slate-500 block mb-1">抽样比公式</span>
                            <MathFormula tex="\frac{n_i}{N_i} = \frac{n}{N} = k \quad (\text{抽样比})" className="text-base font-bold text-blue-900" />
                            <div className="text-xs text-slate-400 mt-1">即：各层抽取的比例相同</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <div className="md:w-1/4 shrink-0 font-bold text-purple-800 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs">3</span>
                        系统抽样
                    </div>
                    <div className="flex-1 text-sm text-slate-700">
                        <p>将总体均分，按预定规则抽取。适用于<span className="font-bold">总体容量很大</span>且无明显差异的情况。</p>
                        <div className="mt-2 text-xs text-purple-700">间隔 <MathFormula tex="k = \frac{N}{n}" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section14_3: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> 3. 频率分布直方图
            </h4>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <ChartComponent 
                        type="histogram"
                        data={[
                            { label: "[0,10)", value: 0.05 },
                            { label: "[10,20)", value: 0.15 },
                            { label: "[20,30)", value: 0.35 },
                            { label: "[30,40)", value: 0.25 },
                            { label: "[40,50]", value: 0.20 }
                        ]}
                        title="频率分布示例"
                        yLabel="频率/组距"
                        xLabel="数据分组"
                        color="blue"
                        height={220}
                    />
                    <p className="text-center text-xs text-slate-500 mt-2">横轴：数据分组 | 纵轴：频率/组距</p>
                </div>
                <div className="flex-1 space-y-4">
                    <WarningCard title="核心特征 (必考)">
                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-2">
                            <li>
                                <span className="font-bold">小矩形面积 = 频率</span>
                                <br/>
                                <MathFormula tex="\text{面积} = \text{组距} \times \frac{\text{频率}}{\text{组距}} = \text{频率}" />
                            </li>
                            <li>
                                <span className="font-bold">所有小矩形面积之和 = 1</span>
                            </li>
                        </ul>
                    </WarningCard>
                </div>
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 text-lg">4. 总体特征数的估计</h4>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 className="font-bold text-slate-700 text-sm mb-3">集中趋势 (平均水平)</h5>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span>众数</span>
                            <span className="text-slate-400 text-xs">最高矩形底边中点</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span>中位数</span>
                            <span className="text-slate-400 text-xs">左右面积各为 0.5 的分界点</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                            <span>平均数</span>
                            <span className="text-slate-400 text-xs">每个小矩形底边中点 <MathFormula tex="\times" /> 面积 之和</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold text-slate-700 text-sm mb-3">离散程度 (稳定性)</h5>
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <span className="font-bold text-indigo-900 block mb-1">样本方差 <MathFormula tex="s^2" /></span>
                        <MathFormula tex="s^2 = \frac{1}{n}\sum_{i=1}^n (x_i - \bar{x})^2" block className="text-lg" />
                        <div className="mt-2 text-xs text-indigo-700">标准差 <MathFormula tex="s = \sqrt{s^2}" />。数据越分散，方差越大。</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  ),
  section14_app: (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" /> 应用：阶梯电价的设计
            </h4>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                为了促进节能减排，电力公司通常采用“阶梯电价”。如何确定各阶梯的用电量分界点？这就需要用到统计中的<span className="font-bold text-orange-600">百分位数</span>。
            </p>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-3 text-sm">设计思路</h5>
                <ol className="list-decimal list-inside text-sm text-slate-700 space-y-3">
                    <li>
                        <span className="font-bold">数据收集：</span>随机抽取若干住户的月用电量。
                    </li>
                    <li>
                        <span className="font-bold">分析分布：</span>绘制频率分布直方图，了解用电量分布情况。
                    </li>
                    <li>
                        <span className="font-bold">确定分位点：</span>
                        <div className="mt-2 ml-4 p-3 bg-white rounded border border-slate-200 text-xs space-y-1">
                            <div>• 第一档（基本需求）：覆盖 80% 的用户 <MathFormula tex="\to" /> <span className="font-bold text-orange-600">80% 分位数</span></div>
                            <div>• 第二档（合理需求）：覆盖 95% 的用户 <MathFormula tex="\to" /> <span className="font-bold text-orange-600">95% 分位数</span></div>
                            <div>• 第三档（过度消费）：超过 95% 分位数的部分，电价较高。</div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    </div>
  ),
  reading_engel: (
    <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-4 text-xl flex items-center gap-2">
                <PieChart className="w-6 h-6 text-indigo-600" /> 阅读：恩格尔系数
            </h4>
            <div className="prose prose-slate prose-sm text-slate-600 leading-relaxed">
                <p>
                    19世纪德国统计学家恩格尔（Engel）发现了一个规律：一个家庭收入越少，家庭收入中（或总支出中）用来购买食物的支出所占的比例就越大。
                </p>
                <div className="bg-white p-4 rounded-xl border border-indigo-100 text-center my-4 shadow-sm">
                    <MathFormula tex="E = \frac{\text{食物支出金额}}{\text{消费总支出金额}} \times 100\%" block className="text-xl font-bold text-indigo-800" />
                </div>
                <p>
                    <span className="font-bold text-slate-800">恩格尔系数 (Engel Coefficient)</span> 已成为衡量一个国家或地区人民生活水平的重要统计指标。
                </p>
                <ul className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-center">
                    <li className="bg-red-50 text-red-700 p-2 rounded"> > 60% : 贫穷</li>
                    <li className="bg-orange-50 text-orange-700 p-2 rounded"> 50% - 60% : 温饱</li>
                    <li className="bg-blue-50 text-blue-700 p-2 rounded"> 40% - 50% : 小康</li>
                    <li className="bg-emerald-50 text-emerald-700 p-2 rounded"> &lt; 30% : 最富裕</li>
                </ul>
            </div>
        </div>
    </div>
  )
};