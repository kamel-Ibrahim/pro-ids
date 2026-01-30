import { useEffect, useState } from "react";
import api from "../api/client";

type Progress = {
  id: number;
  title: string;
  total_lessons: number;
  completed_lessons: number;
  progress: number;
};

export default function MyProgressPage() {
  const [data, setData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Progress[]>("/my-progress")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load progress", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {data.map((course) => (
        <div
          key={course.id}
          style={{
            marginTop: 20,
            padding: 20,
            borderRadius: 16,
            background: "#ffffff",
          }}
        >
          <h3>{course.title}</h3>

          <p>
            {course.completed_lessons} / {course.total_lessons} lessons completed
          </p>

          <div
            style={{
              height: 12,
              background: "#e5e7eb",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            <div
              style={{
                width: `${course.progress}%`,
                height: "100%",
                background: "#16a34a",
                borderRadius: 8,
              }}
            />
          </div>

          <strong>{course.progress}%</strong>
        </div>
      ))}
    </>
  );
}