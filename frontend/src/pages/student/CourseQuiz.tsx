import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { unwrap } from "../../api/api";
import type { ApiError } from "../../api/api";

export default function CourseQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/quizzes/${id}`)
      .then(unwrap)
      .then(setQuiz)
      .catch((e: ApiError) => setError(e.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading…</p>;

  return <pre>{JSON.stringify(quiz, null, 2)}</pre>;
}