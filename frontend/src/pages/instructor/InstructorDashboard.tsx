import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  category: string;
  enrollments_count: number;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").then((res) => setCourses(res.data.courses || []));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Instructor <span className="text-cyan-400">Hub</span></h1>
        <button onClick={() => navigate('/instructor/courses/new')} className="primary px-8">Create New Course</button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map(course => (
          <div key={course.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-l-cyan-500">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded">{course.category}</span>
              <h2 className="text-xl font-bold text-white mt-2">{course.title}</h2>
              <p className="text-zinc-500 text-sm">{course.enrollments_count} active students</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Link to={`/instructor/courses/${course.id}/lessons`} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition">CURRICULUM</Link>
              <Link to={`/instructor/courses/${course.id}/quiz`} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition">QUIZ BUILDER</Link>
              <Link to={`/instructor/courses/${course.id}/analytics`} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold transition">ANALYTICS</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}