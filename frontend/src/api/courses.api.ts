import http, { unwrapData } from "./http";
import type { LaravelPaginated } from "./http";

export type Course = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
};

export const getCourses = () =>
  http
    .get<LaravelPaginated<Course>>("/courses")
    .then(unwrapData);

export const getCourse = (id: number) =>
  http.get<Course>(`/courses/${id}`).then(unwrapData);

export const createCourse = (data: Partial<Course>) =>
  http.post<Course>("/courses", data).then(unwrapData);