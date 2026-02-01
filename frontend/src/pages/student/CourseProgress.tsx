import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Progress {
  completed_quizzes: number;
  total_quizzes: number;
}

export default function CourseProgress() {
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Progress>>("/progress").then((res) => {
      setProgress(res.data.data);
    });
  }, []);

  if (!progress) return null;

  return (
    <div>
      Progress: {progress.completed_quizzes} / {progress.total_quizzes}
    </div>
  );
}