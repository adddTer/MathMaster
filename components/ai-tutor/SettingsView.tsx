import React, { useState, useEffect } from 'react';
import { Settings, Sparkles, Bot, Loader2, RefreshCcw, CheckCircle2, XCircle, Save, Construction } from 'lucide-react';
import { AIConfig, AIProvider } from '../../types';
import { fetchOpenAIModels, testGeminiConnection } from '../../services/geminiService';

interface ModelOption {
    id: string;
    name: string;
}

interface SettingsViewProps {
    config: AIConfig;
    onSave: (newConfig: AIConfig) => void;
    onClose: () => void;
    availableModels: { gemini: ModelOption[], openai: ModelOption[] };
    onUpdateModels: (provider: AIProvider, models: ModelOption[]) => void;
    systemEnvKey: string;
    useEnvKey: boolean;
    onToggleDebugMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
    config, 
    onSave, 
    onClose, 
    availableModels, 
    onUpdateModels, 
    systemEnvKey, 
    useEnvKey, 
    onToggleDebugMode 
}) => {
    const [draftConfig, setDraftConfig] = useState<AIConfig>(config);
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');

    useEffect(() => {
        setDraftConfig(config);
        setTestStatus('idle');
    }, [config]);

    const getDraftEffectiveConfig = () => {
        if (useEnvKey && systemEnvKey) {
            return {
                ...draftConfig,
                apiKey: systemEnvKey
            };
        }
        return draftConfig;
    };

    const handleProviderChange = (provider: AIProvider) => {
        const modelList = provider === 'gemini' ? availableModels.gemini : availableModels.openai;
        const defaultModel = modelList.length > 0 ? modelList[0].id : '';
        
        setDraftConfig({
            ...draftConfig,
            provider,
            modelId: defaultModel
        });
        setTestStatus('idle');
    };

    const handleTestAndFetch = async () => {
        const effectiveTestConfig = getDraftEffectiveConfig();
  
        if (!effectiveTestConfig.apiKey) {
            setTestStatus('error');
            setTestMessage('未找到 API Key');
            return;
        }
        
        setIsTesting(true);
        setTestStatus('idle');
        setTestMessage('');
  
        try {
            if (effectiveTestConfig.provider === 'openai') {
                const models = await fetchOpenAIModels(effectiveTestConfig);
                if (models.length > 0) {
                    onUpdateModels('openai', models);
                    // Force update draft config with first model immediately
                    setDraftConfig(prev => ({ ...prev, modelId: models[0].id }));
                    
                    setTestStatus('success');
                    setTestMessage(`成功！获取 ${models.length} 个模型`);
                } else {
                     setTestStatus('success');
                     setTestMessage('连接成功，但模型列表为空');
                }
            } else {
                await testGeminiConnection(effectiveTestConfig.apiKey);
                setTestStatus('success');
                setTestMessage('连接成功！');
            }
        } catch (error: any) {
            setTestStatus('error');
            setTestMessage(error.message || '连接失败');
        } finally {
            setIsTesting(false);
        }
    };

    const handleSave = () => {
        onSave(draftConfig);
    };

    // Calculate current models based on DRAFT provider, not prop config provider
    const currentModelList = draftConfig.provider === 'gemini' ? availableModels.gemini : availableModels.openai;

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
             <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-slate-800">
                    <Settings className="w-5 h-5" />
                    <h2 className="font-semibold text-sm">AI 配置</h2>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <span className="text-xs">关闭 (不保存)</span>
                </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-5 max-w-2xl mx-auto relative">
                    
                    {systemEnvKey && (
                        <div className="absolute top-5 right-5">
                            <button 
                                onClick={onToggleDebugMode}
                                className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full transition-colors border ${useEnvKey ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                            >
                                <Construction className="w-3 h-3" />
                                {useEnvKey ? 'Dev Mode: ON' : 'Dev Mode: OFF'}
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">服务商</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleProviderChange('gemini')}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                                    draftConfig.provider === 'gemini' 
                                    ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Sparkles className="w-5 h-5" />
                                Google Gemini
                            </button>
                            <button 
                                onClick={() => handleProviderChange('openai')}
                                className={`p-3 rounded-lg border text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                                    draftConfig.provider === 'openai' 
                                    ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Bot className="w-5 h-5" />
                                OpenAI
                            </button>
                        </div>
                    </div>

                    <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200 mt-6 leading-relaxed">
                        <h4 className="font-bold text-slate-700 mb-2">关于试卷功能</h4>
                        <p className="mb-2">试卷功能正处于测试阶段，AI 出题可能存在格式错误或逻辑偏差，建议人工复核。</p>
                        <p>请选择具备深度思考能力的模型（如 Pro/Plus 版本），以确保试题质量。</p>
                    </div>

                    <div className={useEnvKey ? 'opacity-50 pointer-events-none grayscale' : ''}>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
                            <span>API Key</span>
                            {useEnvKey && <span className="text-amber-600 text-xs font-bold">正在使用系统环境变量 Key</span>}
                        </label>
                        <input 
                            type="password" 
                            value={useEnvKey ? 'SYSTEM_ENV_KEY_ACTIVE' : draftConfig.apiKey}
                            onChange={(e) => setDraftConfig({...draftConfig, apiKey: e.target.value})}
                            placeholder={draftConfig.provider === 'gemini' ? "AIzaSy..." : "sk-..."}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            disabled={useEnvKey}
                        />
                    </div>

                    {draftConfig.provider === 'openai' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Base URL (可选)</label>
                            <input 
                                type="text" 
                                value={draftConfig.baseUrl || ''}
                                onChange={(e) => setDraftConfig({...draftConfig, baseUrl: e.target.value})}
                                placeholder="https://api.openai.com/v1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleTestAndFetch}
                            disabled={(!draftConfig.apiKey && !useEnvKey) || isTesting}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                            测试连接
                        </button>
                        {testStatus !== 'idle' && (
                            <span className={`text-xs flex items-center gap-1 ${testStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {testStatus === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {testMessage}
                            </span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">选择模型</label>
                        <div className="relative">
                            <select 
                                value={draftConfig.modelId} 
                                onChange={(e) => setDraftConfig({...draftConfig, modelId: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                            >
                                {currentModelList.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                                {currentModelList.length === 0 && (
                                    <option disabled>请先配置 Key 并测试连接以加载模型</option>
                                )}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        保存配置
                    </button>
                </div>
            </div>
        </div>
    );
};
