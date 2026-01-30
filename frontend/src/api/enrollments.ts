import api from "./client";
import { Course } from "./courses";

export async function myCourses(): Promise<Course[]> {
  const { data } = await api.get("/my-courses");
  return data;
}