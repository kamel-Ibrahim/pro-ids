import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to use its error type
import api from "../../api/api";

export default function CourseQuizBuilder() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    passing_score: "70", 
    time_limit: "30",    
    shuffle_questions: false
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      passing_score: parseInt(form.passing_score) || 0,
      time_limit: parseInt(form.time_limit) || 0,
      shuffle_questions: form.shuffle_questions
    };

    try {
  const res = await api.post(`/courses/${courseId}/quizzes`, payload);
  const newQuizId = res.data.data.id; // Get the ID of the quiz just created
  navigate(`/instructor/quizzes/${newQuizId}/questions`); // Go to Question Builder
} catch (err: unknown) {
      // 1. Check if the error is an Axios error
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "Error saving quiz.";
        console.error("Quiz Error Details:", err.response?.data);
        alert(message);
      } else {
        // 2. Handle non-axios errors
        console.error("An unexpected error occurred:", err);
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-4xl font-black text-white mb-10 uppercase italic">
        Quiz <span className="text-cyan-400">Settings</span>
      </h1>

      <form onSubmit={handleCreate} className="glass-card p-8 flex flex-col gap-6 neon-border">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Quiz Name</label>
          <input 
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            placeholder="e.g. Week 1 Assessment" 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Passing Score %</label>
            <input 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
              type="number" 
              value={form.passing_score} 
              onChange={e => setForm({...form, passing_score: e.target.value})} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Limit (Mins)</label>
            <input 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none"
              type="number" 
              value={form.time_limit} 
              onChange={e => setForm({...form, time_limit: e.target.value})} 
            />
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-black/50 rounded-xl border border-zinc-800">
          <input 
            type="checkbox" 
            id="shuffle"
            className="w-5 h-5 accent-cyan-400 cursor-pointer"
            checked={form.shuffle_questions} 
            onChange={e => setForm({...form, shuffle_questions: e.target.checked})} 
          />
          <label htmlFor="shuffle" className="text-sm font-bold text-zinc-400 cursor-pointer select-none">
            Shuffle Questions
          </label>
        </div>

        <button type="submit" className="primary py-4 mt-2" disabled={loading}>
          {loading ? "SAVING CONFIG..." : "CREATE QUIZ"}
        </button>
      </form>
    </div>
  );
}