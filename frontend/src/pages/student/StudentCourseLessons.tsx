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

  // Helper to convert standard YouTube links to Embed links
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  const fetchData = useCallback(async (autoSelectFirst: boolean = false) => {
    try {
      const res = await api.get(`/courses/${courseId}/lessons`);
      const data: Lesson[] = res.data.data || res.data;
      setLessons(data);
      
      // Only set the first lesson as active on the initial page load
      if (autoSelectFirst && data.length > 0) {
        setActiveLesson(data[0]);
      }
    } catch (err) {
      console.error("Failed to load curriculum", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Run once on mount
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      await api.post(`/lessons/${activeLesson.id}/complete`);
      // Refresh list to update checkmarks in sidebar
      await fetchData(false);
      // Update local state for the active view
      setActiveLesson({ ...activeLesson, completed: true });
    } catch (err) {
      console.error("Error marking complete", err);
    }
  };

  if (loading) return <div className="p-20 text-center text-cyan-400 font-black animate-pulse uppercase tracking-widest">Initialising Module...</div>;

  if (lessons.length === 0) return (
    <div className="max-w-2xl mx-auto py-20 text-center glass-card border-dashed border-2 border-zinc-800">
      <p className="text-zinc-500 font-bold uppercase tracking-widest">This course has no published content yet.</p>
      <button onClick={() => navigate('/student')} className="mt-6 text-cyan-400 font-black text-xs hover:text-white transition">← BACK TO DASHBOARD</button>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 pb-20">
      
      {/* LEFT: CONTENT PLAYER */}
      <div className="flex-1 space-y-6">
        {activeLesson?.video_url ? (
          <div className="aspect-video bg-black rounded-[2rem] border border-zinc-800/50 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] neon-border">
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(activeLesson.video_url) || ""}
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-zinc-900/20 rounded-[2rem] border border-zinc-800/50 flex items-center justify-center italic text-zinc-600 font-medium">
            This is a text-based lesson. Read the content below.
          </div>
        )}

        <div className="glass-card p-10 bg-zinc-900/40">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
                {activeLesson?.title}
              </h1>
              <span className="text-[10px] font-black text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 uppercase tracking-widest">
                Current Module
              </span>
            </div>
            
            <button 
              onClick={handleMarkComplete}
              disabled={activeLesson?.completed}
              className={`px-8 py-3 rounded-2xl font-black text-xs transition-all ${
                activeLesson?.completed 
                ? "bg-green-500/10 text-green-400 border border-green-500/30 cursor-default" 
                : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 active:scale-95"
              }`}
            >
              {activeLesson?.completed ? "✓ COMPLETED" : "MARK AS FINISHED"}
            </button>
          </div>

          <div className="prose prose-invert max-w-none text-zinc-400 leading-loose text-lg border-t border-zinc-800 pt-8">
            {activeLesson?.content || "No detailed description provided for this lesson."}
          </div>
        </div>
      </div>

      {/* RIGHT: CURRICULUM SIDEBAR */}
      <div className="w-full lg:w-[380px] shrink-0 space-y-6">
        <div className="glass-card p-8 border-cyan-500/20 sticky top-6">
          <h3 className="text-white font-black text-lg mb-6 flex justify-between items-center tracking-tight">
            CURRICULUM
            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-zinc-700">
              {lessons.filter(l => l.completed).length} / {lessons.length} DONE
            </span>
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${
                  activeLesson?.id === lesson.id
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)]"
                    : "bg-black/40 border-zinc-800/50 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border transition-colors ${
                    lesson.completed 
                    ? "bg-green-500/20 border-green-500/50 text-green-400" 
                    : "bg-zinc-900 border-zinc-800 group-hover:border-zinc-700"
                }`}>
                  {lesson.completed ? "✓" : idx + 1}
                </div>
                <span className="text-sm font-bold truncate tracking-tight">{lesson.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] text-center mb-4">Final Assessment</p>
            <button 
                onClick={() => navigate(`/courses/${courseId}/quiz`)}
                className="w-full py-4 bg-zinc-100 text-black font-black text-xs rounded-2xl hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/10 active:scale-95"
            >
                TAKE CERTIFICATION QUIZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}