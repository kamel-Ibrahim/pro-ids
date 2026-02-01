import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

// 1. Define exactly what a Course looks like
interface Course {
  id: number;
  title: string;
  enrollments_count: number;
}

// 2. Define the shape of the API response
interface DashboardData {
  courses: Course[];
}

// 3. Define props for the StatCard component
interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

export default function InstructorDashboard() {
  // Use the DashboardData interface instead of 'any'
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            INSTRUCTOR <span className="text-cyan-400">PORTAL</span>
          </h1>
          <p className="text-zinc-500">Manage your courses and track student performance</p>
        </div>
        <Link to="/instructor/courses/new" className="primary px-6 py-2">
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Total Courses" 
          value={data?.courses?.length || 0} 
          color="text-cyan-400" 
        />
        <StatCard 
          title="Active Students" 
          value={data?.courses?.reduce((acc: number, c: Course) => acc + c.enrollments_count, 0) || 0} 
          color="text-green-400" 
        />
        <StatCard 
          title="Avg. Pass Rate" 
          value="84%" 
          color="text-purple-400" 
        />
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Your Courses</h2>
      <div className="grid gap-4">
        {data?.courses?.map((c: Course) => (
          <div 
            key={c.id} 
            className="glass-card p-6 flex justify-between items-center hover:border-cyan-500/50 transition cursor-pointer"
          >
            <div>
              <h3 className="text-lg font-bold text-white">{c.title}</h3>
              <p className="text-sm text-zinc-500">{c.enrollments_count} Students Enrolled</p>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/instructor/courses/${c.id}/lessons`} 
                className="text-xs font-bold p-2 text-zinc-400 hover:text-cyan-400 transition"
              >
                LESSONS
              </Link>
              <Link 
                to={`/instructor/courses/${c.id}/analytics`} 
                className="text-xs font-bold p-2 text-zinc-400 hover:text-cyan-400 transition"
              >
                ANALYTICS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Properly type the helper component
function StatCard({ title, value, color }: StatCardProps) {
  return (
    <div className="glass-card p-6 neon-border">
      <div className="text-zinc-500 text-xs uppercase font-bold tracking-widest">{title}</div>
      <div className={`text-4xl font-black mt-2 ${color}`}>{value}</div>
    </div>
  );
}