import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Course {
  id: number;
  title: string;
  enrollments_count: number;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get<ApiResponse<{ courses: Course[] }>>("/dashboard").then((res) => {
      setCourses(res.data.data.courses);
    });
  }, []);

  return (
    <div>
      <h1>Instructor Dashboard</h1>
      {courses.map((c) => (
        <div key={c.id}>
          {c.title} ({c.enrollments_count})
        </div>
      ))}
    </div>
  );
}