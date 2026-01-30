import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";

type Course = {
  id: number;
  title: string;
  description?: string;
};

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCourses() {
    setLoading(true);
    const { data } = await api.get("/instructor/courses");
      setCourses(data);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      await loadCourses();
    })();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this course?")) return;
    await api.get(`/instructor/courses/${id}`, {
      method: "DELETE",
    });
    loadCourses();
  }

  if (loading) return <p>Loading courses…</p>;

  return (
    <div>
      <h1>My Courses</h1>

      <Link to="/instructor/courses/new">
        + Create New Course
      </Link>

      {courses.length === 0 && (
        <p style={{ marginTop: 16 }}>
          No courses yet.
        </p>
      )}

      {courses.map((course) => (
        <div
          key={course.id}
          style={{
            marginTop: 20,
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
          }}
        >
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <div style={{ marginTop: 8 }}>
            <Link
              to={`/instructor/courses/${course.id}/edit`}
            >
              Edit
            </Link>
            {" · "}
            <button
              onClick={() => handleDelete(course.id)}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
