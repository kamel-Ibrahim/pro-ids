import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

type Course = {
  id: number;
  title: string;
  description?: string;
};

export default function InstructorCreateEditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing course if editing
  useEffect(() => {
    if (!id) return;

    api
      .get<Course[]>("/instructor/courses")
      .then((response) => {
        const course = response.data.find(
          (c) => c.id === Number(id)
        );

        if (course) {
          setTitle(course.title);
          setDescription(course.description ?? "");
        }
      })
      .catch(() => {
        // optional: show error UI
      });
  }, [id]);

  async function handleSubmit() {
    if (!title.trim()) return;

    setLoading(true);

    try {
      if (id) {
        // EDIT
        await api.put(`/instructor/courses/${id}`, {
          title,
          description,
        });
      } else {
        // CREATE
        await api.post("/instructor/courses", {
          title,
          description,
        });
      }

      navigate("/instructor/courses");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>
        {id ? "Edit Course" : "Create Course"}
      </h1>

      <div style={{ marginBottom: 16 }}>
        <label>Course Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 4,
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            width: "100%",
            padding: 12,
            marginTop: 4,
            minHeight: 120,
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading
          ? "Saving…"
          : id
          ? "Save Changes"
          : "Create Course"}
      </button>
    </div>
  );
}