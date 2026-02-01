import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/api";

export default function InstructorCourseManage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    difficulty: "",
    estimated_duration: ""
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      const data = res.data.data;
      setForm({
        title: data.title,
        short_description: data.short_description || "",
        description: data.description || "",
        category: data.category || "",
        difficulty: data.difficulty || "Beginner",
        estimated_duration: data.estimated_duration || ""
      });
    } catch { alert("Course not found"); navigate("/instructor"); }
    finally { setLoading(false); }
  }, [courseId, navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/courses/${courseId}`, form);
      alert("Course metadata updated!");
    } catch { alert("Update failed"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("ARE YOU SURE? This will delete all lessons and quizzes associated with this course. This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${courseId}`);
      navigate("/instructor");
    } catch { alert("Delete failed"); }
  };

  if (loading) return <div className="p-20 text-center text-cyan-400 animate-pulse font-black">OPENING MANAGEMENT CONSOLE...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Manage <span className="text-cyan-400">Course</span></h1>
          <p className="text-zinc-500 text-sm mt-1 font-bold uppercase tracking-widest">ID: MODULE-{courseId}</p>
        </div>
        <div className="flex gap-4">
          <Link to={`/instructor/courses/${courseId}/lessons`} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-black transition">CURRICULUM</Link>
          <Link to={`/instructor/courses/${courseId}/quiz`} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-black transition">ASSESSMENT</Link>
          <button onClick={handleDelete} className="px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-xs font-black transition">DELETE COURSE</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Editor */}
        <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-6 glass-card p-10 neon-border">
          <h2 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-4">Course Metadata</h2>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Tagline / Short Description</label>
            <input value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Difficulty</label>
                <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Detailed Description</label>
            <textarea className="h-48" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
          </div>

          <button type="submit" disabled={saving} className="primary w-full py-5 text-sm">
            {saving ? "SYNCING CHANGES..." : "SAVE COURSE UPDATES"}
          </button>
        </form>

        {/* Right Column: Quick Stats/Info */}
        <div className="space-y-6">
            <div className="glass-card p-8 bg-cyan-500/5 border-cyan-500/20">
                <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-4">Quick Insights</h3>
                <div className="space-y-4">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500 text-xs">Estimated Duration</span>
                        <span className="text-white text-xs font-bold">{form.estimated_duration}</span>
                    </div>
                </div>
                <input 
                    className="mt-4 w-full bg-black/40 text-xs p-3 border-zinc-800" 
                    placeholder="Update Duration (e.g. 10h)" 
                    value={form.estimated_duration} 
                    onChange={e => setForm({...form, estimated_duration: e.target.value})}
                />
            </div>
            
            <Link to={`/instructor/courses/${courseId}/analytics`} className="block glass-card p-8 hover:border-zinc-600 transition group text-center">
                <p className="text-zinc-500 font-bold text-[10px] uppercase group-hover:text-cyan-400">View Detailed Analytics</p>
            </Link>
        </div>
      </div>
    </div>
  );
}