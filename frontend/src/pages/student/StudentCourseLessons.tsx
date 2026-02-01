import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string | null;
  completed: boolean;
}

export default function StudentCourseLessons() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (initial: boolean) => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      const data: Lesson[] = res.data.data || res.data;
      setLessons(data);
      
      if (initial && data.length > 0) {
        setActiveLesson(data[0]);
      } else if (!initial && activeLesson) {
        const updated = data.find(l => l.id === activeLesson.id);
        if (updated) setActiveLesson(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId, activeLesson]);

  useEffect(() => {
    fetchData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]); 

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.post(`/lessons/${activeLesson.id}/complete`);
      await fetchData(false); 
    } catch {
      alert("Error saving progress");
    }
  };

  if (loading) return <div className="p-20 text-center text-cyan-400 font-black animate-pulse">SYNCING CURRICULUM...</div>;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {activeLesson?.video_url ? (
            <div 
                className="aspect-video bg-black rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl video-iframe-container"
                dangerouslySetInnerHTML={{ __html: activeLesson.video_url }}
            />
          ) : (
            <div className="aspect-video bg-zinc-900/10 rounded-[2rem] border-2 border-dashed border-zinc-800 flex items-center justify-center italic text-zinc-600 uppercase font-black text-xs">
              Module Documentation
            </div>
          )}

          <div className="glass-card p-10">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-8">
              <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{activeLesson?.title}</h1>
              <button 
                onClick={handleMarkComplete}
                disabled={activeLesson?.completed}
                className={`px-10 py-4 rounded-2xl font-black text-xs transition-all ${activeLesson?.completed ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg'}`}
              >
                {activeLesson?.completed ? "✓ COMPLETED" : "MARK FINISHED"}
              </button>
            </div>
            <div className="text-zinc-400 text-lg font-medium pt-4 whitespace-pre-line">
              {activeLesson?.content}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="glass-card p-8 sticky top-8 bg-black/40 border-cyan-500/20">
            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-8 italic">Module Progress</h3>
            <div className="space-y-2">
              {lessons.map((l, i) => (
                <button 
                  key={l.id} 
                  onClick={() => setActiveLesson(l)} 
                  className={`w-full text-left p-4 rounded-2xl text-sm transition-all border flex items-center gap-4 ${activeLesson?.id === l.id ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-xl' : 'bg-black/20 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${l.completed ? 'bg-green-500 text-black' : 'bg-zinc-900'}`}>{l.completed ? "✓" : i + 1}</div>
                  <span className="truncate italic font-bold uppercase tracking-tight">{l.title}</span>
                </button>
              ))}
            </div>
            <button onClick={() => navigate(`/courses/${courseId}/quiz`)} className="w-full py-5 bg-white text-black font-black text-xs rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-xl mt-10">TAKE ASSESSMENT</button>
          </div>
        </div>
      </div>
    </div>
  );
}