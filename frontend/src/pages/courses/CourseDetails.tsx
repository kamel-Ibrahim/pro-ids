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
      .then((res) => {
        setCourse(res.data.data || res.data);
      })
      .catch(() => alert("Course not found"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/courses/${courseId}/enroll`);
      alert("Enrolled successfully!");
      navigate('/student');
    } catch{
      alert("You are already enrolled in this course.");
    }
  };

  if (loading) return <div className="p-20 text-center text-cyan-400 font-black animate-pulse">DECRYPTING SYLLABUS...</div>;
  if (!course) return <div className="p-20 text-center text-red-500">Course Error</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Hero Header */}
      <div className="glass-card p-12 neon-border bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex gap-3 mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-black px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest">
              {course.category}
            </span>
            <span className="bg-zinc-800 text-zinc-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {course.difficulty}
            </span>
          </div>
          
          <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
            {course.title}
          </h1>

          <div className="flex gap-10 mb-10">
            <div className="flex flex-col">
                <span className="text-zinc-600 text-[10px] font-bold uppercase">Instructor</span>
                <span className="text-zinc-200 font-bold">{course.instructor?.name}</span>
            </div>
            <div className="flex flex-col border-l border-zinc-800 pl-10">
                <span className="text-zinc-600 text-[10px] font-bold uppercase">Duration</span>
                <span className="text-zinc-200 font-bold">{course.estimated_duration}</span>
            </div>
          </div>

          <button onClick={handleEnroll} className="primary px-16 py-5 shadow-2xl shadow-cyan-500/20">
            ENROLL IN MODULE
          </button>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Description */}
      <div className="glass-card p-12">
        <h2 className="text-zinc-500 font-black text-xs uppercase tracking-[0.3em] mb-8 border-b border-zinc-800 pb-4">
          Course Description
        </h2>
        <div className="text-zinc-300 text-xl leading-relaxed whitespace-pre-line font-medium">
          {course.description}
        </div>
      </div>
    </div>
  );
}