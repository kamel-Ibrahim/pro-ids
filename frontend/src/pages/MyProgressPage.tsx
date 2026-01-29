import { useEffect, useState } from "react";
import { apiRequest } from "../api/http";

export default function MyProgressPage() {
  const [progress, setProgress] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/progress").then(setProgress);
  }, []);

  return (
    <div>
      <h1>My Progress</h1>

      {progress.map((course) => (
        <div key={course.course_id} style={{ marginBottom: 20 }}>
          <h3>{course.title}</h3>
          <div
            style={{
              height: 10,
              background: "#e5e7eb",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${course.percent}%`,
                height: "100%",
                background: "#2f66e6",
              }}
            />
          </div>
          <p>{course.percent}% completed</p>
        </div>
      ))}
    </div>
  );
}
