import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Lesson {
  id: number;
  title: string;
}

export default function CourseLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    api.get<ApiResponse<Lesson[]>>("/instructor/lessons").then((res) => {
      setLessons(res.data.data);
    });
  }, []);

  return (
    <div>
      {lessons.map((l) => (
        <div key={l.id}>{l.title}</div>
      ))}
    </div>
  );
}