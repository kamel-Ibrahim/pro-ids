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

  // FIXED: Removed useless escape characters in the RegEx
  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1` : "";
  };

  const fetchData = useCallback(async (isInitial: boolean) => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      const data = res.data.data || res.data;
      setLessons(data);
      if (isInitial && data.length > 0) setActiveLesson(data[0]);
      if (!isInitial && activeLesson) {
        const updated = data.find((l: Lesson) => l.id === activeLesson.id);
        if (updated) setActiveLesson(updated);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }, [courseId, activeLesson]);

  // FIXED: Included fetchData in the dependency array
  useEffect(() => { 
    fetchData(true); 
  }, [fetchData]);

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    await api.post(`/lessons/${activeLesson.id}/complete`);
    fetchData(false);
  };

  if (loading) return <div className="p-20 text-center text-cyan-400 font-black animate-pulse uppercase tracking-[0.3em]">Initialising Environment...</div>;

  const progressPercent = lessons.length > 0 
    ? Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100) 
    : 0;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* PLAYER AREA */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeLesson?.video_url ? (
            <div className="aspect-video bg-black rounded-[2rem] border border-zinc-800/50 overflow-hidden shadow-2xl neon-border">
              <iframe 
                className="w-full h-full" 
                src={getEmbedUrl(activeLesson.video_url)} 
                allowFullScreen 
                allow="autoplay; encrypted-media; picture-in-picture" 
              />
            </div>
          ) : (
            <div className="aspect-video bg-zinc-900/10 rounded-[2rem] border-2 border-dashed border-zinc-800 flex items-center justify-center italic text-zinc-600 uppercase font-black text-xs tracking-widest">
              Standard Documentation Module
            </div>
          )}

          <div className="glass-card p-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                 <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 uppercase tracking-widest mb-3 inline-block">Current Lesson</span>
                 <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{activeLesson?.title}</h1>
              </div>
              <button 
                onClick={handleMarkComplete}
                disabled={activeLesson?.completed}
                className={`px-10 py-4 rounded-2xl font-black text-xs transition-all tracking-widest ${activeLesson?.completed ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 active:scale-95'}`}
              >
                {activeLesson?.completed ? "✓ COMPLETED" : "MARK AS FINISHED"}
              </button>
            </div>
            <div className="text-zinc-400 text-lg leading-relaxed pt-8 border-t border-zinc-800/50 whitespace-pre-line font-medium">
              {activeLesson?.content}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="glass-card p-8 border-cyan-500/20 bg-black/40 sticky top-8">
            <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
              <h3 className="font-black text-white text-sm uppercase tracking-[0.2em] italic">Progress</h3>
              <span className="text-cyan-400 font-black text-sm">{progressPercent}%</span>
            </div>
            
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {lessons.map((l, i) => (
                <button 
                  key={l.id} 
                  onClick={() => setActiveLesson(l)} 
                  className={`w-full text-left p-5 rounded-2xl text-sm transition-all border flex items-center gap-4 group ${activeLesson?.id === l.id ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.05)]' : 'bg-black/20 border-zinc-800/50 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border transition-all ${l.completed ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 border-zinc-800 group-hover:border-zinc-700'}`}>
                    {l.completed ? "✓" : i + 1}
                  </div>
                  <span className="font-bold truncate italic uppercase tracking-tight">{l.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-zinc-800">
               <button 
                onClick={() => navigate(`/courses/${courseId}/quiz`)} 
                className="w-full py-5 bg-white text-black font-black text-xs rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-xl active:scale-95"
               >
                 Final Assessment
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}