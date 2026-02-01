import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Quiz {
  id: number;
  title: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  quizzes: Quiz[];
}

export default function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;

    api.get<ApiResponse<Course>>(`/courses/${courseId}`).then((res) => {
      setCourse(res.data.data);
    });
  }, [courseId]);

  const enroll = async () => {
    if (!courseId) return;
    await api.post(`/courses/${courseId}/enroll`);
  };

  if (!course) return null;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <button onClick={enroll}>Enroll</button>

      <h2>Quizzes</h2>
      {course.quizzes.map((q) => (
        <div key={q.id}>{q.title}</div>
      ))}
    </div>
  );
}