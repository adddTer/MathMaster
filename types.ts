
import { ReactNode } from 'react';

export type SubjectType = 'math' | 'chinese' | 'english' | 'physics' | 'chemistry' | 'biology';

export interface SubTopic {
  id: string;
  title: string;
  content: ReactNode;
  tags?: ('hard' | 'important' | 'high-school' | 'extension' | 'tool')[];
}

export interface Topic {
  id: string;
  category: string;
  title: string;
  icon: ReactNode;
  description: string;
  subtopics: SubTopic[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  componentState?: Record<number, any>; 
  // Multi-agent support
  sender?: {
    name: string;
    avatar?: string;
    role?: 'admin' | 'logic' | 'rhetoric' | 'history' | 'reality';
    color?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
  isPinned?: boolean;
}

export enum ViewState {
  LEARN = 'LEARN',
  PRACTICE = 'PRACTICE'
}

export type AIProvider = 'gemini' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string; 
  modelId?: string;
}

// --- Exam Types ---

export type QuestionType = 'single_choice' | 'multiple_choice' | 'fill_in' | 'true_false' | 'subjective';

export interface QuestionBlueprint {
  index: number;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  knowledgePoint: string; // Specific sub-topic or concept to test
  score: number;
  designIntent: string; // Brief note on what this tests
  preSetAnswer?: string; // Pre-assigned answer to force distribution (e.g. "C", "AB")
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  content: string; // The question text (supports LaTeX)
  options?: string[]; // For choice questions
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  knowledgePoint?: string; // Metadata for reporting
  
  // AI Generation Data
  correctAnswer: string | boolean | string[]; // The standard answer
  gradingCriteria: string; // Instructions for the AI grader
  analysis?: string; // Explanation

  // Visual Component Data
  visual?: {
      type: 'planar' | 'solid';
      data: any; // Props for PlanarGeometry or SolidGeometry
  };

  // User Interaction Data
  userAnswer?: string | boolean | string[];
  isGraded: boolean;
  obtainedScore?: number;
  feedback?: string;
  gradingError?: boolean; // If grading API failed
}

export interface ExamConfig {
  topic: string;
  title: string;
  questionCount: number;
  difficultyDistribution: string; // e.g., "30% Easy, 50% Medium, 20% Hard"
  totalScore: number;
  requirements?: string;
}

export interface ExamSession {
  id: string;
  config: ExamConfig;
  createdAt: number;
  updatedAt: number;
  status: 'generating' | 'ready' | 'in_progress' | 'submitted' | 'graded';
  questions: ExamQuestion[];
  currentQuestionIndex: number;
}

// --- Essay Types ---

export interface EssayConfig {
    topic: string; // Material or Topic
    requirements?: string; // Now optional or merged
    wordCount?: number | string;
    style?: string;
    // New fields for structured workflow
    selectedAngle?: string; 
    outline?: string[]; 
    materials?: string[]; 
}

export interface EssayAdvisorSuggestion {
    role: 'logic' | 'rhetoric' | 'history' | 'reality'; 
    name: string;
    avatar: string;
    content: string;
}

export interface EditorCard {
    id: string;
    title: string;
    tags: string[];
    content: string; 
    reasoning: string; 
}

export interface EssaySession {
    id: string;
    title: string; 
    config: EssayConfig;
    history: ChatMessage[]; 
    currentText: string; 
    advisors: EssayAdvisorSuggestion[]; 
    cards: EditorCard[]; 
    createdAt: number;
    updatedAt: number;
    lastModelId?: string;
    isPinned?: boolean;
    // Core Workflow State
    mode: 'auto' | 'proxy'; 
    groupState: 'analyzing' | 'discussing' | 'writing' | 'reviewing'; // Phases
    subState?: 'discussion' | 'decision' | 'approval'; // Internal flow within a phase
}
