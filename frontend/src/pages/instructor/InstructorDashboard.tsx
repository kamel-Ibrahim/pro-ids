import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  category: string;
  enrollments_count: number;
  difficulty: string;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setCourses(res.data.courses || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic">
            Instructor <span className="text-cyan-400">Hub</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">You have {courses.length} active courses published.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/courses/new')} 
          className="primary px-10 shadow-lg shadow-cyan-500/20"
        >
          CREATE NEW COURSE
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-600 animate-pulse font-bold tracking-widest text-center py-20">FETCHING YOUR DATA...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {courses.length > 0 ? courses.map(course => (
            <div 
              key={course.id} 
              className="glass-card p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center border-l-4 border-l-cyan-500 hover:translate-x-1 transition-transform"
            >
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.2em] bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {course.category}
                  </span>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] bg-zinc-800 px-2 py-0.5 rounded">
                    {course.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{course.title}</h2>
                <p className="text-zinc-500 text-sm font-medium">{course.enrollments_count} students enrolled in this curriculum</p>
              </div>
              
              <div className="flex items-center gap-4 mt-6 lg:mt-0 w-full lg:w-auto">
                <Link 
                  to={`/instructor/courses/${course.id}/manage`} 
                  className="flex-1 lg:flex-none text-center px-8 py-3 bg-white text-black rounded-xl text-xs font-black hover:bg-cyan-400 transition"
                >
                  MANAGE COURSE
                </Link>
                <Link 
                  to={`/instructor/courses/${course.id}/analytics`} 
                  className="p-3 bg-zinc-900 text-zinc-400 rounded-xl hover:text-cyan-400 border border-zinc-800 transition"
                  title="View Analytics"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </Link>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
               <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">No courses found in your library</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}