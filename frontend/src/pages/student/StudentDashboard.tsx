import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

interface Enrollment {
  id: number;
  progress_percent: number;
  course: { id: number; title: string; category: string; };
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
      const response = await api.get(`/courses/${courseId}/certificate/generate`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${courseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Certificate not ready. Ensure all modules are 100% complete.");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-cyan-400 animate-pulse">LOADING DASHBOARD...</div>;

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-12">Level <span className="text-cyan-400">Up</span></h1>
      <div className="grid grid-cols-1 gap-6">
        {enrollments.map((item) => (
          <div key={item.id} className="glass-card p-8 flex flex-col md:flex-row justify-between items-center border-l-4 border-l-cyan-500">
            <div className="flex-1 w-full md:w-auto">
              <h3 className="text-2xl font-bold text-white mb-4 uppercase">{item.course.title}</h3>
              <div className="flex items-center gap-6">
                <div className="flex-1 max-w-md h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${item.progress_percent}%` }} />
                </div>
                <span className="text-sm font-black text-cyan-400">{item.progress_percent}%</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8 md:mt-0 w-full md:w-auto">
               <button onClick={() => navigate(`/courses/${item.course.id}/lessons`)} className="px-10 py-4 bg-zinc-800 text-white rounded-2xl text-xs font-black">RESUME</button>
               {item.progress_percent === 100 && (
                 <button onClick={() => downloadCert(item.course.id)} className="px-10 py-4 bg-white text-black rounded-2xl text-xs font-black hover:bg-cyan-400">CLAIM CERTIFICATE</button>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}