import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

interface Lesson {
  id: number;
  title: string;
  video_url: string | null;
  content: string | null;
  duration?: string;
}

export default function InstructorCourseLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", video_url: "", content: "", order: 1 });

  const fetchLessons = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      // Standardize data check based on Laravel Resource return
      const lessonData = res.data.data || res.data;
      setLessons(Array.isArray(lessonData) ? lessonData : []);
    } catch (err) {
      console.error("Failed to fetch lessons", err);
    }
  }, [courseId]);

  useEffect(() => { 
    fetchLessons(); 
  }, [fetchLessons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/courses/${courseId}/lessons`, form);
      setForm({ title: "", video_url: "", content: "", order: lessons.length + 2 });
      fetchLessons();
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-black mb-6 text-white uppercase">Course <span className="text-cyan-400">Curriculum</span></h2>
        <div className="space-y-3">
          {lessons.length > 0 ? lessons.map((l, i) => (
            <div key={l.id} className="glass-card p-4 flex items-center gap-4 hover:border-zinc-600 transition">
              <span className="text-zinc-700 font-black text-2xl italic">0{i + 1}</span>
              <div className="flex-1">
                <h4 className="font-bold text-white">{l.title}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  {l.video_url ? "Video Lesson" : "Text Lesson"}
                </p>
              </div>
              <button className="text-zinc-600 hover:text-red-400 transition text-xs font-bold">REMOVE</button>
            </div>
          )) : (
            <div className="p-10 text-center border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600 italic">
              No lessons added yet.
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6 h-fit sticky top-6 neon-border bg-zinc-900/80">
        <h3 className="text-lg font-bold mb-6 text-white border-b border-zinc-800 pb-2">Add New Lesson</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Lesson Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Video URL (YouTube)</label>
            <input value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Content / Script</label>
            <textarea 
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-32 focus:ring-2 focus:ring-cyan-500/50 outline-none" 
              value={form.content} 
              onChange={e => setForm({...form, content: e.target.value})} 
            />
          </div>

          <button type="submit" className="primary mt-2" disabled={loading}>
            {loading ? "SAVING..." : "PUBLISH LESSON"}
          </button>
        </form>
      </div>
    </div>
  );
}