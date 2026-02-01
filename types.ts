export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ChatStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface Note {
  id: string;
  content: string;
  createdAt: number;
}

export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}