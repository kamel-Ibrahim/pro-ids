import { useEffect, useState } from "react";
import api, { unwrapList } from "../../api/api";

type CourseLike = {
  id?: number;
  title?: string;
  description?: string;
  instructor?: {
    name?: string;
  };
};

export default function CourseCatalog() {
  const [courses, setCourses] = useState<CourseLike[]>([]);

  useEffect(() => {
    api.get("/courses").then((res) => {
      setCourses(unwrapList(res));
    });
  }, []);

  return (
    <div className="container">
      {courses.map((course, i) => (
        <div key={course.id ?? i} className="card">
          <h3>{course.title ?? "Untitled course"}</h3>
          <p>{course.description}</p>
          <small>
            Instructor: {course.instructor?.name ?? "Unknown"}
          </small>
        </div>
      ))}
    </div>
  );
}