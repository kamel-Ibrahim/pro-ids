import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Lesson {
  id: number;
  title: string;
}

export default function CourseLessons() {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get<ApiResponse<Lesson[]>>(`/courses/${id}/lessons`)
      .then((res) => {
        setLessons(res.data.data);
      })
      .catch(() => {
        setError("Failed to load lessons");
      });
  }, [id]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      {lessons.map((l) => (
        <div key={l.id}>{l.title}</div>
      ))}
    </div>
  );
}