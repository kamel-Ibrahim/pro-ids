import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/api";

interface Option {
  id?: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  text: string;
  options: { id: number; option_text: string; is_correct: boolean }[];
}

export default function QuizQuestionBuilder() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingQuestions, setExistingQuestions] = useState<Question[]>([]);
  
  const [questionText, setQuestionText] = useState("");
  const [type, setType] = useState("MCQ");
  const [options, setOptions] = useState<Option[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const fetchExistingQuestions = useCallback(async () => {
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      // Accessing res.data.data based on standard Laravel API Resource wrapping
      setExistingQuestions(res.data.data?.questions || res.data.questions || []);
    } catch (err) {
      console.error("Could not fetch questions", err);
    }
  }, [quizId]);

  useEffect(() => {
    fetchExistingQuestions();
  }, [fetchExistingQuestions]);

  const updateOption = (index: number, fields: Partial<Option>) => {
    const newOptions = [...options];
    if (fields.is_correct && (type === "MCQ" || type === "TF")) {
      newOptions.forEach(opt => opt.is_correct = false);
    }
    newOptions[index] = { ...newOptions[index], ...fields };
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    if (!questionText) return alert("Enter a question");
    if (!options.some(o => o.is_correct)) return alert("Mark at least one correct answer");

    setLoading(true);
    try {
      await api.post(`/quizzes/${quizId}/questions`, {
        text: questionText,
        type: type,
        options: options
      });
      setQuestionText("");
      setOptions([{ text: "", is_correct: false }, { text: "", is_correct: false }]);
      fetchExistingQuestions(); // Refresh list
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Failed to save");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-white uppercase italic">
          Quiz <span className="text-cyan-400">Designer</span>
        </h1>
        <button onClick={() => navigate('/instructor')} className="text-zinc-500 hover:text-white font-bold transition">DONE</button>
      </div>

      {/* SECTION 1: ADD NEW QUESTION */}
      <div className="glass-card p-8 neon-border flex flex-col gap-8 bg-zinc-900/50">
        <h2 className="text-sm font-bold text-cyan-400 uppercase tracking-[0.2em]">Add New Question</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Question Text</label>
            <textarea 
              className="bg-black border border-zinc-800 rounded-xl p-4 text-white h-24 focus:ring-2 focus:ring-cyan-500/50 outline-none"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="bg-black border border-zinc-800 rounded-xl p-4 h-24">
              <option value="MCQ">Single Choice</option>
              <option value="MSQ">Multiple Select</option>
              <option value="TF">True / False</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Answer Options</label>
          {options.map((opt, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex items-center justify-center bg-black border border-zinc-800 rounded-xl px-4">
                <input 
                  type="checkbox" 
                  checked={opt.is_correct} 
                  onChange={e => updateOption(index, { is_correct: e.target.checked })}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
              </div>
              <input 
                className="flex-1 bg-black border border-zinc-800"
                value={opt.text}
                onChange={e => updateOption(index, { text: e.target.value })}
                placeholder={`Option ${index + 1}`}
                disabled={type === "TF"}
              />
            </div>
          ))}
          {type !== "TF" && (
            <button onClick={() => setOptions([...options, { text: "", is_correct: false }])} className="text-cyan-400 text-[10px] font-bold uppercase">+ Add Choice</button>
          )}
        </div>

        <button onClick={handleSaveQuestion} className="primary py-4" disabled={loading}>
          {loading ? "SAVING..." : "PUBLISH QUESTION"}
        </button>
      </div>

      {/* SECTION 2: EXISTING QUESTIONS PREVIEW */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest border-l-4 border-cyan-400 pl-4">Existing Questions ({existingQuestions.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {existingQuestions.map((q, idx) => (
            <div key={q.id} className="glass-card p-6 bg-zinc-900/30 border-zinc-800">
              <p className="text-white font-medium mb-4"><span className="text-zinc-600 mr-2">#{idx+1}</span> {q.text}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((opt) => (
                  <div key={opt.id} className={`text-xs p-3 rounded-lg border ${opt.is_correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-black/40 border-zinc-800 text-zinc-500'}`}>
                    {opt.option_text} {opt.is_correct && "✓"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}