import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

interface QuizOption { id: number; option_text: string; }
interface QuizQuestion { id: number; text: string; options: QuizOption[]; }
interface QuizData { id: number; title: string; time_limit: number; questions: QuizQuestion[]; }
interface QuizResult { score: number; correct_answers: number; total_questions: number; passed: boolean; }

export default function CourseQuiz() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  
  // Use a ref to prevent multiple auto-submissions
  const isSubmitting = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting.current || result || !quiz) return;
    isSubmitting.current = true;
    try {
      const res = await api.post(`/quizzes/${quiz.id}/submit`, { answers });
      setResult(res.data.data);
    } catch (err) {
      console.error("Submission failed", err);
      isSubmitting.current = false;
    }
  }, [quiz, answers, result]);

  // Load Quiz
  useEffect(() => {
    api.get(`/courses/${courseId}`).then(res => {
      const q = res.data.data.quizzes[0];
      if (q) {
        api.get(`/quizzes/${q.id}`).then(r => {
          setQuiz(r.data.data);
          setTimeLeft(r.data.data.time_limit * 60);
        });
      }
    });
  }, [courseId]);

  // Timer Logic - FIXED: No cascading renders
  useEffect(() => {
    if (timeLeft === null || result) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // This is now safe because it's inside the interval callback
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, result, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (result) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <div className="glass-card p-12 neon-border">
        <div className={`text-7xl font-black mb-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.score}%</div>
        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{result.passed ? "CERTIFIED" : "ASSESSMENT FAILED"}</h2>
        <div className="flex gap-4 mt-10">
          <button onClick={() => navigate('/student')} className="flex-1 bg-zinc-800 py-4 rounded-2xl font-bold text-xs uppercase">Dashboard</button>
          {!result.passed && <button onClick={() => window.location.reload()} className="flex-1 primary py-4 text-xs">Try Again</button>}
        </div>
      </div>
    </div>
  );

  if (!quiz) return <div className="p-20 text-center text-cyan-400 animate-pulse font-black uppercase tracking-widest">Loading Assessment...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-10 sticky top-0 z-30 bg-black/60 backdrop-blur-md p-6 rounded-3xl border border-zinc-800/50">
        <h1 className="text-xl font-black text-white uppercase italic tracking-tight">{quiz.title}</h1>
        <div className={`px-6 py-2 rounded-xl font-mono font-bold border-2 ${timeLeft !== null && timeLeft < 60 ? 'border-red-500 text-red-500 animate-pulse' : 'border-cyan-500 text-cyan-400'}`}>
          {formatTime(timeLeft || 0)}
        </div>
      </div>

      <div className="space-y-8">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="glass-card p-10 bg-zinc-900/20">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Question {idx + 1}</span>
            <h3 className="text-2xl font-bold text-white mt-3 mb-8 tracking-tight">{q.text}</h3>
            <div className="grid grid-cols-1 gap-4">
              {q.options.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setAnswers({...answers, [q.id]: opt.id})}
                  className={`p-6 rounded-[1.5rem] text-left border-2 transition-all duration-300 flex items-center gap-4 ${answers[q.id] === opt.id ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-zinc-800/50 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 transition-colors ${answers[q.id] === opt.id ? 'border-cyan-400 bg-cyan-400' : 'border-zinc-700'}`} />
                  {opt.option_text}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleSubmit} className="primary w-full py-6 text-lg shadow-2xl shadow-cyan-500/20">SUBMIT FINAL ANSWERS</button>
      </div>
    </div>
  );
}