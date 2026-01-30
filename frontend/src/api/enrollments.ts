import api from "./client";

export type Course = {
  id: number;
  title: string;
  description: string;
  published?: boolean;
};

export async function enroll(courseId: number): Promise<void> {
  await api.post(`/courses/${courseId}/enroll`);
}

export async function myCourses(): Promise<Course[]> {
  const { data } = await api.get("/my-courses");
  return data;
}