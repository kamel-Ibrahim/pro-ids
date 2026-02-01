import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz, submitQuiz } from "../../api/quizzes.api";
import type { Quiz } from "../../types/quiz";

export default function QuizTake() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    getQuiz(Number(quizId)).then((res) => {
      setQuiz(res.data.data);
    });
  }, [quizId]);

  const submit = async () => {
    if (!quizId) return;

    setSubmitting(true);
    await submitQuiz(Number(quizId), { answers });
    setSubmitting(false);
  };

  if (!quiz) return null;

  return (
    <div>
      <h1>{quiz.title}</h1>

      {quiz.questions.map((q) => (
        <div key={q.id}>
          <p>{q.text}</p>

          {q.options.map((o) => (
            <label key={o.id}>
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === o.id}
                onChange={() =>
                  setAnswers((prev) => ({ ...prev, [q.id]: o.id }))
                }
              />
              {o.text}
            </label>
          ))}
        </div>
      ))}

      <button disabled={submitting} onClick={submit}>
        Submit
      </button>
    </div>
  );
}