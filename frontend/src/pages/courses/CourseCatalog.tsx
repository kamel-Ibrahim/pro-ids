import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../auth/useAuth";

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
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      // We add public=1 to ensure even instructors can see the full list in the catalog
      // while their private "My Courses" stays filtered in the dashboard.
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

  const handleViewDetails = (courseId: number) => {
    if (user?.role === 'instructor') {
      // If Instructor, go to Management Hub
      navigate(`/instructor/courses/${courseId}/manage`);
    } else {
      // If Student or Guest, go to Public Details
      navigate(`/courses/${courseId}`);
    }
  };

  if (loading) return <div className="p-20 text-center text-cyan-500 font-black animate-pulse uppercase tracking-widest">Accessing Database...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 px-4">
        <div className="flex-1">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Explore <span className="text-cyan-400">Library</span></h1>
          <p className="text-zinc-500 mt-2 font-bold uppercase tracking-widest text-xs">Filter through our technical curriculum.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            className="flex-1 md:w-64" 
            placeholder="Search keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
          />
          <select 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 text-xs font-bold uppercase text-zinc-400 focus:ring-2 focus:ring-cyan-500/50 outline-none"
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
        {courses.length > 0 ? (
          courses.map(course => (
            <div key={course.id} className="glass-card group hover:border-cyan-500/30 flex flex-col h-[400px]">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20 uppercase tracking-widest">
                    {course.category}
                  </span>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    {course.difficulty}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition mb-3 uppercase italic tracking-tight">
                  {course.title}
                </h2>
                <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
                  {course.short_description}
                </p>
              </div>
              <div className="p-8 pt-0 mt-auto">
                <button 
                  onClick={() => handleViewDetails(course.id)} 
                  className="w-full py-4 bg-white text-black hover:bg-cyan-400 rounded-2xl text-[10px] font-black uppercase transition-all tracking-widest shadow-xl active:scale-95"
                >
                  {user?.role === 'instructor' ? 'Manage Module' : 'View Details'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-600 font-bold uppercase tracking-[0.3em]">No matching modules found</p>
          </div>
        )}
      </div>
    </div>
  );
}