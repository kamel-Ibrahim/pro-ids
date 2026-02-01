import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Course {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  short_description: string;
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses?search=${search}&category=${category}`);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    } catch (err) {
      console.error("Catalog fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchCourses]);

  if (loading) return <div className="p-20 text-center text-cyan-500 font-black animate-pulse">FILTERING...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 px-4">
        <div className="flex-1">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Explore <span className="text-cyan-400">Library</span></h1>
          <p className="text-zinc-500 mt-2">Filter through our technical curriculum.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            className="flex-1 md:w-64" 
            placeholder="Search keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
          <select 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-xs font-bold uppercase text-zinc-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Categories</option>
            <option value="Web Dev">Web Dev</option>
            <option value="AI">AI</option>
            <option value="Mobile">Mobile</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {courses.map(course => (
          <div key={course.id} className="glass-card group hover:border-cyan-500/30 flex flex-col">
            <div className="p-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20 uppercase tracking-widest">{course.category}</span>
                <span className="text-[9px] font-black text-zinc-600 uppercase">{course.difficulty}</span>
              </div>
              <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition mb-3">{course.title}</h2>
              <p className="text-zinc-500 text-sm line-clamp-2">{course.short_description}</p>
            </div>
            <div className="p-8 pt-0 mt-auto">
              <button onClick={() => navigate(`/courses/${course.id}`)} className="w-full py-4 bg-zinc-800 hover:bg-white hover:text-black rounded-2xl text-[10px] font-black uppercase transition-all">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}