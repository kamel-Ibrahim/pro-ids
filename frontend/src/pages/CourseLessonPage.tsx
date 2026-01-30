import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

type Lesson = {
  id: number;
  title: string;
  content: string;
  order: number;
};

export default function CourseLessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const response = await api.get<Lesson>(`/lessons/${lessonId}`);
        setLesson(response.data);
      } catch {
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [lessonId]);

  async function markComplete() {
    if (!lesson) return;

    try {
      await api.post(`/lessons/${lesson.id}/complete`);
      setCompleted(true);
    } catch {
      alert("Failed to mark lesson complete");
    }
  }

  if (loading) {
    return <div style={{ padding: 32 }}>Loading lesson…</div>;
  }

  if (error || !lesson) {
    return (
      <div style={{ padding: 32, color: "red" }}>
        {error || "Lesson not found"}
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 32,
        background: "#ffffff",
        borderRadius: 16,
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
        {lesson.title}
      </h1>

      <div
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: "#334155",
          marginBottom: 32,
        }}
      >
        {lesson.content}
      </div>

      <button
        onClick={markComplete}
        disabled={completed}
        style={{
          padding: "14px 22px",
          borderRadius: 12,
          background: completed ? "#16a34a" : "#2f66e6",
          color: "white",
          fontWeight: 700,
          border: "none",
          cursor: completed ? "default" : "pointer",
        }}
      >
        {completed ? "Lesson Completed ✓" : "Mark Lesson Complete"}
      </button>
    </div>
  );
}