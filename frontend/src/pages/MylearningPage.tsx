import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/http";

export default function MyLearningPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("/courses").then(setCourses);
  }, []);

  return (
    <div>
      <h1>My Learning</h1>

      {courses.map((course) => (
        <div key={course.id} style={{ marginBottom: 24 }}>
          <h3>{course.title}</h3>

          <ul>
            {course.lessons?.map((lesson: any) => (
              <li key={lesson.id}>
                <Link
                  to={`/course/${course.id}/lesson/${lesson.id}`}
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
