import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor?: { name: string };
}

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses")
      .then((res) => {
        // Laravel's CourseController index returns the array directly
        const data = Array.isArray(res.data) ? res.data : [];
        setCourses(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-cyan-400">Browsing courses...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-black mb-10 tracking-tight">
        Available <span className="text-cyan-400">Courses</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.id} 
              className="group p-1 rounded-2xl bg-gradient-to-br from-zinc-800 to-transparent hover:from-cyan-500/50 transition-all duration-500"
            >
              <div className="bg-black p-6 rounded-[calc(1rem-1px)] h-full flex flex-col">
                <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition">{course.title}</h2>
                <p className="text-zinc-500 text-sm line-clamp-3 mb-6 flex-1">
                  {course.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-zinc-600 italic">By {course.instructor?.name || 'Instructor'}</span>
                  <button 
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition"
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-500">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}