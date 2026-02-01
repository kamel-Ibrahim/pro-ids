import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Lesson {
  id: number;
  title: string;
}

interface Quiz {
  id: number;
  title: string;
  passing_score: number;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export default function InstructorCourseManage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      // Handle both { data: ... } and direct objects
      const data = res.data.data || res.data;
      setCourse(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  if (loading) return <div className="p-10 text-cyan-400 animate-pulse font-black">LOADING...</div>;
  if (!course) return <div className="p-10 text-red-500 text-center glass-card">Course data unavailable.</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-start mb-10 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                {course.category}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase bg-zinc-800 px-3 py-1 rounded-full">
                {course.difficulty}
            </span>
          </div>
          <h1 className="text-5xl font-black text-white mt-4 tracking-tighter uppercase italic">{course.title}</h1>
        </div>
        <button onClick={() => navigate('/instructor')} className="text-zinc-500 hover:text-white text-xs font-bold transition">BACK</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Curriculum List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Lessons</h2>
            <Link to={`/instructor/courses/${courseId}/lessons`} className="text-cyan-400 text-xs font-black">+ ADD</Link>
          </div>
          <div className="space-y-3">
            {/* The ?? [] prevents the "map of undefined" crash */}
            {(course.lessons ?? []).length > 0 ? (course.lessons ?? []).map((lesson, idx) => (
              <div key={lesson.id} className="glass-card p-4 flex items-center gap-4 border border-zinc-800">
                <span className="text-zinc-700 font-black italic">0{idx + 1}</span>
                <h4 className="flex-1 text-sm font-bold text-zinc-200">{lesson.title}</h4>
              </div>
            )) : (
              <p className="text-zinc-600 italic text-sm p-4">No lessons added to this course yet.</p>
            )}
          </div>
        </section>

        {/* Quizzes List */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Quizzes</h2>
            <Link to={`/instructor/courses/${courseId}/quiz`} className="text-cyan-400 text-xs font-black">+ NEW</Link>
          </div>
          <div className="space-y-3">
            {(course.quizzes ?? []).length > 0 ? (course.quizzes ?? []).map((quiz) => (
              <div key={quiz.id} className="glass-card p-6 border-l-4 border-l-cyan-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">{quiz.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Pass Score: {quiz.passing_score}%</p>
                  </div>
                  <Link to={`/instructor/quizzes/${quiz.id}/questions`} className="text-cyan-400 text-[10px] font-black hover:text-white transition">
                    MANAGE QUESTIONS
                  </Link>
                </div>
              </div>
            )) : (
              <p className="text-zinc-600 italic text-sm p-4">No assessment created for this course.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}