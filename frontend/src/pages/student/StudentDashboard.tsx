import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Enrollment {
  id: number;
  progress_percent: number;
  course: {
    id: number;
    title: string;
    category: string;
  };
}

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").then(res => {
      setEnrollments(res.data.enrollments || []);
      setLoading(false);
    });
  }, []);

  const downloadCert = async (courseId: number) => {
    try {
      const res = await api.post(`/courses/${courseId}/certificate/generate`, {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Could not generate certificate yet.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-cyan-400 animate-pulse">LOADING PATH...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-12">My <span className="text-cyan-400">Path</span></h1>
      
      <div className="grid grid-cols-1 gap-6">
        {enrollments.map((item: Enrollment) => (
          <div key={item.id} className="glass-card p-8 flex flex-col md:flex-row justify-between items-center border-l-4 border-l-cyan-500">
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold text-white">{item.course.title}</h3>
              <div className="flex items-center gap-4">
                <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${item.progress_percent}%` }} />
                </div>
                <span className="text-xs font-bold text-zinc-500">{item.progress_percent}% Complete</span>
              </div>
            </div>

            <div className="flex gap-4 mt-6 md:mt-0">
               <button onClick={() => navigate(`/courses/${item.course.id}/lessons`)} className="px-6 py-3 bg-zinc-800 text-white rounded-xl text-xs font-bold">CONTINUE</button>
               {item.progress_percent === 100 && (
                 <button onClick={() => downloadCert(item.course.id)} className="px-6 py-3 bg-cyan-500 text-black rounded-xl text-xs font-black">CERTIFICATE</button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}