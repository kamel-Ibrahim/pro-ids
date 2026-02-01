import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Enrollment {
  id: number;
  course: {
    id: number;
    title: string;
  };
}

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Enrollment[]>>("/dashboard").then((res) => {
      setEnrollments(res.data.data);
    });
  }, []);

  return (
    <div>
      {enrollments.map((e) => (
        <div key={e.id}>{e.course.title}</div>
      ))}
    </div>
  );
}