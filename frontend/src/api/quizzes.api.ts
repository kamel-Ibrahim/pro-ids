import api, { unwrap } from "./api";

/**
 * Get a quiz by ID
 * No Quiz type exists → return unknown
 */
export const getQuiz = (id: number) =>
  api.get(`/quizzes/${id}`).then(unwrap);

/**
 * Submit quiz answers
 */
export const submitQuiz = (id: number, payload: unknown) =>
  api.post(`/quizzes/${id}/submit`, payload).then(unwrap);