import { useEffect, useState } from "react";
import api from "../../api/api";

interface Course {
  id: number;
  title: string;
}

export default function CourseCatalog() {
  // Always initialize with an empty array []
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses")
      .then((res) => {
        // Laravel returns the array directly as res.data
        // We use Array.isArray as a safety check
        const data = Array.isArray(res.data) ? res.data : [];
        setCourses(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading Catalog...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((c) => (
            <div key={c.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-cyan-500/50 transition">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <button className="mt-4 text-sm text-cyan-400 font-medium">View Details →</button>
            </div>
          ))
        ) : (
          <p className="text-zinc-500">No courses available yet.</p>
        )}
      </div>
    </div>
  );
}