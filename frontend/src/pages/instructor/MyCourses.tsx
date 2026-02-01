import { useEffect, useState } from "react";
import api from "../../api/api";

interface Course {
  id: number;
  title: string;
}

export default function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get("/dashboard").then((res) => {
      // Access res.data.courses based on your DashboardController logic
      setCourses(res.data.courses || []);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Created Courses</h1>
      <div className="grid gap-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            {c.title}
          </div>
        ))}
      </div>
    </div>
  );
}