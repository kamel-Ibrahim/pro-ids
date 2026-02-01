import { useState } from "react";
import api from "../../api/api";

export default function CourseQuizBuilder() {
  const [title, setTitle] = useState("");

  const createQuiz = async () => {
    await api.post("/instructor/quizzes", { title });
    setTitle("");
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title"
      />
      <button onClick={createQuiz}>Create Quiz</button>
    </div>
  );
}