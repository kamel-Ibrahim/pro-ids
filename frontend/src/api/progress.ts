import api from "./client";

export async function completeLesson(lessonId: number): Promise<void> {
  await api.post(`/lessons/${lessonId}/complete`);
}

export async function courseProgress(courseId: number) {
  const { data } = await api.get(`/courses/${courseId}/progress`);
  return data;
}