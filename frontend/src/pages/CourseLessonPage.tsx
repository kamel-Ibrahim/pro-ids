import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/http";

type Lesson = {
  id: number;
  title: string;
  content: string;
};

export default function CourseLessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    apiRequest(`/lessons/${lessonId}`).then((data) => {
      setLesson(data);
      // mark complete
      apiRequest(`/lessons/${lessonId}/complete`, {
        method: "POST",
      }).catch(() => {});
    });
  }, [lessonId]);

  if (!lesson) return <p>Loading lesson…</p>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>
    </div>
  );
}
