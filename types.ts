import { ReactNode } from 'react';

export interface SubTopic {
  id: string;
  title: string;
  content: ReactNode;
  tags?: ('hard' | 'important' | 'high-school' | 'extension')[];
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
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  content: string; // The question text (supports LaTeX)
  options?: string[]; // For choice questions
  score: number;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // AI Generation Data
  correctAnswer: string | boolean | string[]; // The standard answer
  gradingCriteria: string; // Instructions for the AI grader
  analysis?: string; // Explanation

  // User Interaction Data
  userAnswer?: string | boolean | string[];
  isGraded: boolean;
  obtainedScore?: number;
  feedback?: string;
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