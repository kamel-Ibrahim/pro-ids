import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Quiz {
  id: number;
  title: string;
  passing_score: number;
  time_limit: number;
  shuffle_questions: boolean;
}

interface QuizForm {
  id: number | null;
  title: string;
  passing_score: string;
  time_limit: string;
  shuffle_questions: boolean;
}

export default function CourseQuizBuilder() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState<QuizForm>({
    id: null,
    title: "",
    passing_score: "70",
    time_limit: "30",
    shuffle_questions: false
  });

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      // Accessing res.data.data.quizzes based on CourseController@show
      setQuizzes(res.data.data?.quizzes || []);
    } catch (err) {
      console.error("Failed to load quizzes", err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleEditClick = (quiz: Quiz) => {
    setForm({
      id: quiz.id,
      title: quiz.title,
      passing_score: quiz.passing_score.toString(),
      time_limit: quiz.time_limit.toString(),
      shuffle_questions: quiz.shuffle_questions
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      passing_score: parseInt(form.passing_score),
      time_limit: parseInt(form.time_limit),
      shuffle_questions: form.shuffle_questions
    };

    try {
      if (form.id) {
        await api.put(`/quizzes/${form.id}`, payload);
        alert("Quiz updated successfully");
      } else {
        const res = await api.post(`/courses/${courseId}/quizzes`, payload);
        alert("Quiz created!");
        navigate(`/instructor/quizzes/${res.data.data.id}/questions`);
      }
      setForm({ id: null, title: "", passing_score: "70", time_limit: "30", shuffle_questions: false });
      fetchQuizzes();
    } catch  {
      alert("Failed to save quiz settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? All questions in this quiz will be deleted.")) return;
    try {
      await api.delete(`/quizzes/${id}`);
      fetchQuizzes();
    } catch  {
      alert("Failed to delete quiz.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          Assessment <span className="text-cyan-400">Manager</span>
        </h1>
        <button onClick={() => navigate(-1)} className="text-zinc-500 font-bold text-xs">BACK</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* List of Quizzes */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-4">Active Modules</h2>
          {quizzes.length > 0 ? quizzes.map(q => (
            <div key={q.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center border-l-4 border-cyan-500 hover:border-cyan-400 transition group">
               <div>
                  <h4 className="text-white font-bold text-lg">{q.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Pass: {q.passing_score}% • Limit: {q.time_limit}m</p>
               </div>
               <div className="flex gap-3 mt-4 md:mt-0">
                  <button onClick={() => handleEditClick(q)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-[10px] font-black rounded-lg uppercase">Settings</button>
                  <button onClick={() => navigate(`/instructor/quizzes/${q.id}/questions`)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black rounded-lg uppercase">Questions</button>
                  <button onClick={() => handleDelete(q.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[10px] font-black rounded-lg uppercase transition-colors">Delete</button>
               </div>
            </div>
          )) : (
            <div className="p-10 border-2 border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600 italic">
              No quizzes created for this course.
            </div>
          )}
        </div>

        {/* Create / Edit Form */}
        <div className="glass-card p-8 h-fit sticky top-6 neon-border bg-zinc-900/50">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">
            {form.id ? 'Update Configuration' : 'Create New Assessment'}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Quiz Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Final Certification" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Pass Score %</label>
                    <input type="number" value={form.passing_score} onChange={e => setForm({...form, passing_score: e.target.value})} required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Time (Mins)</label>
                    <input type="number" value={form.time_limit} onChange={e => setForm({...form, time_limit: e.target.value})} required />
                </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-zinc-800">
                <input 
                    type="checkbox" 
                    checked={form.shuffle_questions} 
                    onChange={e => setForm({...form, shuffle_questions: e.target.checked})}
                    className="w-4 h-4 accent-cyan-400"
                />
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Shuffle Question Order</span>
            </div>

            <button type="submit" className="primary py-4" disabled={loading}>
                {loading ? "SYNCING..." : form.id ? "SAVE UPDATES" : "INITIALIZE QUIZ"}
            </button>
            {form.id && (
                <button type="button" onClick={() => setForm({ id: null, title: "", passing_score: "70", time_limit: "30", shuffle_questions: false })} className="text-[10px] font-black text-zinc-600 uppercase">Cancel Edit</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}