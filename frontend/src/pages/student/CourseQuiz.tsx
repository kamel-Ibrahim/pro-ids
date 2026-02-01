import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import http, { ApiError, isApiError, unwrapData } from "../../api/http";

type QuizOption = {
  id: number;
  option_text: string;
};

type QuizQuestion = {
  id: number;
  question_text: string;
  options: QuizOption[];
};

type Quiz = {
  id: number;
  passing_score?: number | null;
  questions: QuizQuestion[];
};

export default function CourseQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const numericCourseId = useMemo(() => Number(courseId), [courseId]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // NOTE: Your backend route file currently exposes: GET /quizzes/{quiz}
        // Your frontend routes use /courses/:courseId/quiz, so this assumes quiz id == courseId.
        // If that is NOT true in your backend, add a backend route: GET /courses/{course}/quiz.
        const res = await http.get(`/quizzes/${numericCourseId}`);
        const q = unwrapData<Quiz>(res);
        setQuiz(q);
      } catch (err: unknown) {
        const e: ApiError = isApiError(err)
          ? err
          : { status: 0, message: "Failed to load quiz" };
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (Number.isFinite(numericCourseId) && numericCourseId > 0) run();
    else {
      setLoading(false);
      setError("Invalid course id");
    }
  }, [numericCourseId]);

  const canSubmit = useMemo(() => {
    if (!quiz) return false;
    if (!quiz.questions?.length) return false;
    return quiz.questions.every((q) => Boolean(answers[q.id]));
  }, [quiz, answers]);

  const submitAttempt = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setError(null);
    try {
      // Backend route: POST /student/quizzes/{quiz}/attempt
      const payload = {
        answers,
      };
      await http.post(`/student/quizzes/${quiz.id}/attempt`, payload);
      navigate(`/courses/${numericCourseId}`);
    } catch (err: unknown) {
      const e: ApiError = isApiError(err)
        ? err
        : { status: 0, message: "Failed to submit attempt" };
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading quiz…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="text-red-600 font-semibold mb-2">{error}</div>
          <button
            className="px-4 py-2 rounded bg-slate-900 text-white"
            onClick={() => navigate(-1)}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container">
        <div className="card">Quiz not found.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Quiz</h1>
        <p className="text-sm text-slate-600 mb-6">
          Answer all questions, then submit.
        </p>

        <div className="space-y-6">
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded border border-slate-200">
              <div className="font-medium mb-3">
                {idx + 1}. {q.question_text}
              </div>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const checked = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${
                        checked ? "border-slate-900 bg-slate-50" : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={checked}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                      />
                      <span>{opt.option_text}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            className="px-4 py-2 rounded border border-slate-300"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Back
          </button>

          <button
            className={`px-4 py-2 rounded text-white ${
              canSubmit ? "bg-slate-900" : "bg-slate-400 cursor-not-allowed"
            }`}
            disabled={!canSubmit || submitting}
            onClick={submitAttempt}
          >
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
