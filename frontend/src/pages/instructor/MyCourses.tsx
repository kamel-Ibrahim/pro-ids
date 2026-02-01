import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Course {
  id: number;
  title: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get<ApiResponse<{ courses: Course[] }>>("/dashboard").then((res) => {
      setCourses(res.data.data.courses);
    });
  }, []);

  return (
    <div>
      {courses.map((c) => (
        <div key={c.id}>{c.title}</div>
      ))}
    </div>
  );
}