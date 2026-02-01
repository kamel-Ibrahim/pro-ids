import api from "./api";
import type { Quiz, QuizSubmissionPayload, QuizResult } from "../types/quiz";
import type { ApiResponse } from "../types/api";

export const getQuiz = (quizId: number) =>
  api.get<ApiResponse<Quiz>>(`/quizzes/${quizId}`);

export const submitQuiz = (quizId: number, payload: QuizSubmissionPayload) =>
  api.post<ApiResponse<QuizResult>>(`/quizzes/${quizId}/submit`, payload);