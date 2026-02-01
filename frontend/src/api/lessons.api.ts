import http, { unwrapData } from "./http";

export type Lesson = {
  id: number;
  course_id: number;
  title: string;
  content?: string | null;
  video_url?: string | null;
  // Some older frontend screens used "order". Your DB schema doesn't have it,
  // so we keep it optional to avoid crashes if older API responses include it.
  order?: number;
  created_at?: string;
};

export const getLessons = async (courseId: number): Promise<Lesson[]> => {
  const res = await http.get(`/courses/${courseId}/lessons`);
  return unwrapData<Lesson[]>(res);
};

export const createLesson = async (
  courseId: number,
  data: Pick<Lesson, "title" | "content" | "video_url"> & { order?: number }
): Promise<Lesson> => {
  const res = await http.post(`/courses/${courseId}/lessons`, data);
  return unwrapData<Lesson>(res);
};
