import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

interface AnalyticsData {
  courses_created: number;
  total_enrollments: number;
  quiz_averages: Array<{ quiz_id: number; average_score: string }>;
  top_quizzes: Array<{ quiz_id: number; average_score: string }>;
}

export default function CourseAnalytics() {
  const { courseId } = useParams();
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/instructor/analytics`)
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-10 text-cyan-400 animate-pulse">Analyzing data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-white uppercase tracking-tighter">
        Course <span className="text-cyan-400">Analytics</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-l-4 border-l-cyan-500">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Enrollments</p>
          <p className="text-4xl font-black text-white mt-2">{stats?.total_enrollments || 0}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-purple-500">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Courses Created</p>
          <p className="text-4xl font-black text-white mt-2">{stats?.courses_created || 0}</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Avg. Pass Rate</p>
          <p className="text-4xl font-black text-white mt-2">82%</p>
        </div>
      </div>

      <div className="glass-card p-8 neon-border">
        <h3 className="font-bold text-lg mb-6 text-white">Quiz Performance Details</h3>
        <div className="space-y-4">
          {stats?.quiz_averages.map((quiz) => (
            <div key={quiz.quiz_id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-zinc-800">
              <span className="text-zinc-300 font-medium text-sm">Quiz #{quiz.quiz_id}</span>
              <span className="text-cyan-400 font-bold">{parseFloat(quiz.average_score).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}