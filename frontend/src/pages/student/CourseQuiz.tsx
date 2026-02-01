import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface QuizOption {
  id: number;
  text: string;
}

interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

interface Quiz {
  id: number;
  title: string;
  questions: QuizQuestion[];
}

export default function CourseQuiz() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    api
      .get<ApiResponse<Quiz>>(`/quizzes/${id}`)
      .then((res) => {
        setQuiz(res.data.data);
      })
      .catch(() => {
        setError("Failed to load quiz");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading…</p>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>
          {q.options.map((o) => (
            <div key={o.id}>{o.text}</div>
          ))}
        </div>
      ))}
    </div>
  );
}