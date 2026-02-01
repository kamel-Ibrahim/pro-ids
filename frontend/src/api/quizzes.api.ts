import http, { unwrapData } from "./http";

export type Quiz = {
  id: number;
  course_id: number;
  passing_score: number;
};

export const getQuiz = (id: number) =>
  http.get<Quiz>(`/quizzes/${id}`).then(unwrapData);

export const submitQuizAttempt = (quizId: number, answers: unknown[]) =>
  http
    .post<{ score: number }>(`/student/quizzes/${quizId}/attempt`, { answers })
    .then(unwrapData);