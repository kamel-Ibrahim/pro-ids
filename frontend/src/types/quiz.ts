export interface QuizOption {
  id: number;
  text: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

export interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizSubmissionPayload {
  answers: Record<number, number>;
}

export interface QuizResult {
  score: number;
  total: number;
}