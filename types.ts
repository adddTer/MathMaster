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