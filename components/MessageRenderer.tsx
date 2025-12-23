
import React from 'react';
import { blockRegex, StandardTextBlock } from './blocks/utils';
import { ChoiceBlock, FillInBlock, TrueFalseBlock, QuizBlock } from './blocks/QuestionBlocks';
import { KeypointBlock, StepSolverBlock, ComparisonBlock, CorrectionBlock, ChecklistBlock, TipsBlock, SuggestionsBlock } from './blocks/ContentBlocks';
import { PlotBlock, ChartBlock, ComplexBlock, GeometryBlock } from './blocks/VisualBlocks';
import { ExamConfigBlock, EssayGeneratorBlock } from './blocks/ToolBlocks';
import { EssayDecisionBlock } from './blocks/EssayBlocks';

interface MessageRendererProps {
  content: string;
  onInteract?: (action: string, payload?: any, blockIndex?: number) => void;
  savedState?: Record<number, any>; 
  aiConfig?: any; 
  availableModels?: any; 
}

export { blockRegex }; // Re-export for use in other components like AITutor

export const MessageRenderer: React.FC<MessageRendererProps> = ({ content, onInteract, savedState, aiConfig, availableModels }) => {
  if (!content) return null;

  const parts = content.split(blockRegex);

  return (
    <div className="message-content leading-7 text-[15px] md:text-base break-words space-y-4">
      {parts.map((part, index) => {
        const blockState = savedState ? savedState[index] : undefined;
        const compKey = `${index}-${part.length}`; 
        const interact = (action: string, payload?: any) => onInteract?.(action, payload, index);

        if (part.startsWith(':::quiz')) return <QuizBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::keypoint')) return <KeypointBlock key={compKey} content={part} />;
        if (part.startsWith(':::choice')) return <ChoiceBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::fill_in')) return <FillInBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::true_false')) return <TrueFalseBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::step_solver')) return <StepSolverBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::comparison')) return <ComparisonBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::correction')) return <CorrectionBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::checklist')) return <ChecklistBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::tips')) return <TipsBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::suggestions')) return <SuggestionsBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::plot')) return <PlotBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::chart')) return <ChartBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::complex_plane')) return <ComplexBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::solid_geometry')) return <GeometryBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        
        // Tool Blocks
        if (part.startsWith(':::exam_config')) return <ExamConfigBlock key={compKey} content={part} onInteract={interact} savedState={blockState} aiConfig={aiConfig} availableModels={availableModels} />;
        if (part.startsWith(':::essay_generator')) return <EssayGeneratorBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        if (part.startsWith(':::essay_decisions')) return <EssayDecisionBlock key={compKey} content={part} onInteract={interact} savedState={blockState} />;
        
        if (part.trim() === '' && part !== '\n') return null;
        return <StandardTextBlock key={compKey} content={part} />;
      })}
    </div>
  );
};
