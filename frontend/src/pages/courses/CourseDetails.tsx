import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/useAuth";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_duration: string;
  instructor?: { name: string };
}

export default function CourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courses/${courseId}`)
      .then((res) => setCourse(res.data.data || res.data))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert("Enrolled successfully!");
      navigate('/student');
    } catch {
      alert("Enrollment failed. Are you already enrolled?");
    }
  };

  if (loading) return <div className="p-20 text-cyan-400 font-black animate-pulse uppercase tracking-widest text-center">Opening curriculum...</div>;
  if (!course) return <div className="text-red-500 p-20 text-center font-bold">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Hero Section */}
      <div className="glass-card p-12 mb-8 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-black border-cyan-500/20">
        <div className="relative z-10">
            <span className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">AVAILABLE MODULE</span>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic mb-6">{course.title}</h1>
            
            <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex flex-col">
                    <span className="text-zinc-600 text-[9px] font-bold uppercase mb-1">Instructor</span>
                    <span className="text-zinc-200 font-bold">{course.instructor?.name || "Global Expert"}</span>
                </div>
                <div className="flex flex-col border-l border-zinc-800 pl-6">
                    <span className="text-zinc-600 text-[9px] font-bold uppercase mb-1">Duration</span>
                    <span className="text-zinc-200 font-bold">{course.estimated_duration || "Self-paced"}</span>
                </div>
                <div className="flex flex-col border-l border-zinc-800 pl-6">
                    <span className="text-zinc-600 text-[9px] font-bold uppercase mb-1">Level</span>
                    <span className="text-zinc-200 font-bold">{course.difficulty}</span>
                </div>
            </div>

            <button onClick={handleEnroll} className="primary px-16 py-5 shadow-2xl shadow-cyan-500/20">ENROLL NOW</button>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Description Section */}
      <div className="glass-card p-12">
        <h3 className="text-zinc-500 font-black text-xs uppercase tracking-widest mb-6 pb-4 border-b border-zinc-800">Course Overview</h3>
        <div className="text-zinc-300 text-xl leading-relaxed whitespace-pre-line">
            {course.description}
        </div>
      </div>
    </div>
  );
}