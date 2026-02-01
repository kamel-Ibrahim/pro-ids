import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    short_description: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    estimated_duration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/courses", form);
      navigate("/instructor");
    } catch (err) {
      console.error(err);
      alert("Failed to create course. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white">CREATE <span className="text-cyan-400">COURSE</span></h1>
        <p className="text-zinc-500 mt-2">Fill in the metadata as per project specifications.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Basic Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Course Title</label>
            <input 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="e.g. Advanced Laravel Architecture" required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Short Description</label>
            <input 
              value={form.short_description} 
              onChange={e => setForm({...form, short_description: e.target.value})} 
              placeholder="A one-sentence summary" required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</label>
              <input 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                placeholder="Web Dev" required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Difficulty</label>
              <select 
                value={form.difficulty} 
                onChange={e => setForm({...form, difficulty: e.target.value})}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Est. Duration</label>
            <input 
              value={form.estimated_duration} 
              onChange={e => setForm({...form, estimated_duration: e.target.value})} 
              placeholder="e.g. 12 Hours" required
            />
          </div>
        </div>

        {/* Right Column: Full Description */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 h-full">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Description</label>
            <textarea 
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 h-[280px] focus:ring-2 focus:ring-cyan-500/50 outline-none"
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              placeholder="What will students learn in this course?" required
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end gap-4 mt-6">
          <button 
            type="button" 
            onClick={() => navigate('/instructor')}
            className="px-8 py-3 rounded-xl font-bold text-zinc-400 hover:text-white transition"
          >
            CANCEL
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="primary px-12 py-3"
          >
            {loading ? "SAVING..." : "PUBLISH COURSE"}
          </button>
        </div>
      </form>
    </div>
  );
}