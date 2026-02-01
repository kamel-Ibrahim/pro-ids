import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../auth/useAuth";

interface DashboardData {
  enrolled_courses: number;
  completed_lessons: number;
  average_quiz_score: number;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => {
        // Match the Laravel StudentDashboardController response
        setStats(res.data.data);
      })
      .catch((err) => console.error("Dashboard failed to load", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-cyan-400">Loading your progress...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-zinc-400">Here is what's happening with your learning.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-500 text-sm uppercase tracking-wider">Enrolled Courses</div>
          <div className="text-4xl font-black text-cyan-400 mt-2">{stats?.enrolled_courses || 0}</div>
        </div>
        
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-500 text-sm uppercase tracking-wider">Lessons Completed</div>
          <div className="text-4xl font-black text-green-400 mt-2">{stats?.completed_lessons || 0}</div>
        </div>

        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="text-zinc-500 text-sm uppercase tracking-wider">Avg. Quiz Score</div>
          <div className="text-4xl font-black text-purple-400 mt-2">{stats?.average_quiz_score || 0}%</div>
        </div>
      </div>
    </div>
  );
}