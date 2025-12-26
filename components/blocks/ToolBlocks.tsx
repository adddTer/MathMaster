
import React from 'react';
import { ExternalLink, Feather, Sparkles } from 'lucide-react';
import { ExamGeneratorBlock } from '../exam/ExamGenerator';
import { safeParseJSON, ErrorBlock } from './utils';

export const ExamConfigBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any; aiConfig: any; availableModels?: any }> = ({ content, onInteract, savedState, aiConfig, availableModels }) => {
    const rawJson = content.replace(/^:::exam_config\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;
    
    // We render the interactive generator block here
    return (
        <ExamGeneratorBlock 
            config={data} 
            aiConfig={aiConfig}
            availableModels={availableModels || { gemini: [], openai: [] }}
            onExamCreated={(exam) => onInteract?.('start_exam', { exam })} 
            savedState={savedState} // Passed down to restore view
            onUpdateState={(state) => onInteract?.('update_state', { state })} // Persist progress
        />
    );
};

export const EssayGeneratorBlock: React.FC<{ content: string; onInteract?: (a:string, p?:any) => void; savedState?: any }> = ({ content, onInteract, savedState }) => {
    const rawJson = content.replace(/^:::essay_generator\s*/, '').replace(/\s*:::$/, '');
    const { data, error } = safeParseJSON(rawJson);
    
    if (!data) return <ErrorBlock content={rawJson} errorMsg={error || "Parse error"} onInteract={onInteract} savedState={savedState} />;

    return (
        <div className="my-6 bg-white border border-orange-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div className="bg-gradient-to-r from-orange-50 to-white px-5 py-4 border-b border-orange-100 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                    <Feather className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">{data.title || "AI 作文生成"}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{data.description || "点击下方按钮打开写作工具"}</p>
                </div>
            </div>
            <div className="p-5">
                <button 
                    onClick={() => onInteract?.('open_essay_tool')}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                    <ExternalLink className="w-4 h-4" />
                    打开写作助手
                </button>
                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400 justify-center">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    <span>多智能体协作生成</span>
                </div>
            </div>
        </div>
    );
};
