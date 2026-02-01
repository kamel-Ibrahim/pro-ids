import http from "./http";
import type { ApiResponse } from "../types/api";

export type Course = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
};

export const getCourses = () =>
  http
    .get<ApiResponse<Course[]>>("/courses")
    .then((res) => res.data.data);

export const getCourse = (id: number) =>
  http
    .get<ApiResponse<Course>>(`/courses/${id}`)
    .then((res) => res.data.data);

export const createCourse = (data: Partial<Course>) =>
  http
    .post<ApiResponse<Course>>("/courses", data)
    .then((res) => res.data.data);