import { useEffect, useState } from "react";
import api from "../../api/api";
import type { ApiResponse } from "../../types/api";

interface Analytics {
  enrollments: number;
  avg_score: number;
}

export default function CourseAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    api.get<ApiResponse<Analytics>>("/instructor/analytics").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return null;

  return (
    <div>
      <div>Enrollments: {data.enrollments}</div>
      <div>Average Score: {data.avg_score}</div>
    </div>
  );
}