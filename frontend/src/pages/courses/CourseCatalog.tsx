import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Course {
  id: number;
  title: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Course[]>>("/courses").then((res) => {
      setCourses(res.data.data);
    });
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      {courses.map((c) => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  );
}