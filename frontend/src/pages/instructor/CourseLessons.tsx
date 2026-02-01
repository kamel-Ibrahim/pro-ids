import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Lesson {
  id: number;
  title: string;
  video_url: string | null;
  content: string | null;
}

export default function InstructorCourseLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", video_url: "", content: "" });

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      setLessons(res.data.data || res.data);
    } catch (err) { console.error(err); }
  }, [courseId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setForm({ title: lesson.title, video_url: lesson.video_url || "", content: lesson.content || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Remove this lesson?")) return;
    try {
        await api.delete(`/lessons/${id}`);
        fetchData();
    } catch { alert("Delete failed"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/lessons/${editingId}`, form);
      } else {
        await api.post(`/courses/${courseId}/lessons`, form);
      }
      setForm({ title: "", video_url: "", content: "" });
      setEditingId(null);
      fetchData();
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white uppercase italic">Module <span className="text-cyan-400">Builder</span></h2>
        <button onClick={() => navigate(-1)} className="text-zinc-500 font-bold text-xs">BACK TO HUB</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {lessons.map((l, i) => (
            <div key={l.id} className="glass-card p-6 flex items-center gap-6 hover:border-cyan-500/50 transition group">
              <span className="text-zinc-700 font-black text-3xl italic">0{i + 1}</span>
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg">{l.title}</h4>
              </div>
              <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(l)} className="text-cyan-400 font-black text-[10px] uppercase">Edit</button>
                <button onClick={() => handleDelete(l.id)} className="text-red-500 font-black text-[10px] uppercase">Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 h-fit sticky top-6 neon-border bg-zinc-900/50">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">
            {editingId ? 'Modify Lesson' : 'Create Lesson'}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input placeholder="Lesson Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">YouTube Iframe Code</label>
              <textarea 
                className="h-28 text-[10px] font-mono leading-tight bg-black" 
                placeholder='Paste <iframe...> here' 
                value={form.video_url} 
                onChange={e => setForm({...form, video_url: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Content</label>
              <textarea className="h-40 text-sm" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            </div>

            <button type="submit" className="primary py-4" disabled={loading}>
              {loading ? "PROCESSING..." : editingId ? "SAVE CHANGES" : "PUBLISH CONTENT"}
            </button>
            
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setForm({title:"", video_url:"", content:""})}} className="text-[10px] font-bold text-zinc-600 uppercase text-center mt-2">Cancel Edit</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}