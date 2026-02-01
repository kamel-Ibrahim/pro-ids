import { useEffect, useState } from "react";
import api from "../../api/api";

interface Enrollment {
  id: number;
  course: {
    id: number;
    title: string;
  };
}

export default function MyCourses() {
  // 1. Initialize as empty array to prevent immediate crash
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => {
        // 2. Laravel returns { enrollments: [...] }, so we access res.data.enrollments
        // We use || [] as a safety net
        setEnrollments(res.data.enrollments || []);
      })
      .catch((err) => console.error("Load failed", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading courses...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Enrolled Courses</h1>
      <div className="grid gap-4">
        {enrollments.length > 0 ? (
          enrollments.map((e) => (
            <div key={e.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              {e.course?.title || "Untitled Course"}
            </div>
          ))
        ) : (
          <p className="text-zinc-500">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
}