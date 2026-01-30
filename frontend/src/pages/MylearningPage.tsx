import { useEffect, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";

type CourseProgress = {
  id: number;
  title: string;
  progress: number;
};

export default function MyLearningPage() {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CourseProgress[]>("/my-progress")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCourses(response.data);
        }
      })
      .catch((error: unknown) => {
        console.error("Failed to load courses", error);
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
      {courses.map((course) => (
        <div
          key={course.id}
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 16,
            background: "#ffffff",
          }}
        >
          <h3>{course.title}</h3>

          <div
            style={{
              height: 10,
              background: "#e5e7eb",
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            <div
              style={{
                width: `${course.progress}%`,
                height: "100%",
                background: "#2f66e6",
                borderRadius: 8,
              }}
            />
          </div>

          <p style={{ marginTop: 8 }}>
            {course.progress}% completed
          </p>

          <Link to={`/course/${course.id}`}>
            Continue →
          </Link>
        </div>
      ))}
    </>
  );
}