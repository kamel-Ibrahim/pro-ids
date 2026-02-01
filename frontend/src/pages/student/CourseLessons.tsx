import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { unwrap } from "../../api/api";
import type { ApiError } from "../../api/api";

export default function CourseLessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/courses/${id}/lessons`)
      .then(unwrap)
      .then((data) => setLessons(Array.isArray(data) ? data : []))
      .catch((e: ApiError) => setError(e.message));
  }, [id]);

  if (error) return <p>{error}</p>;

  return <pre>{JSON.stringify(lessons, null, 2)}</pre>;
}