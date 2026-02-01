import http from "./http";
import type { ApiResponse } from "../types/api";

export type Lesson = {
  id: number;
  course_id: number;
  title: string;
  content?: string | null;
  video_url?: string | null;
  order?: number;
  created_at?: string;
};

export const getLessons = async (courseId: number): Promise<Lesson[]> => {
  const res = await http.get<ApiResponse<Lesson[]>>(
    `/courses/${courseId}/lessons`
  );
  return res.data.data;
};

export const createLesson = async (
  courseId: number,
  data: Pick<Lesson, "title" | "content" | "video_url"> & { order?: number }
): Promise<Lesson> => {
  const res = await http.post<ApiResponse<Lesson>>(
    `/courses/${courseId}/lessons`,
    data
  );
  return res.data.data;
};