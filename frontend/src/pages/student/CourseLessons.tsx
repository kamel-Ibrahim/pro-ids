import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import http, { ApiError, isApiError, unwrapData } from "../../api/http";

type Lesson = {
  id: number;
  title: string;
  content?: string | null;
  video_url?: string | null;
};

type Course = {
  id: number;
  title: string;
  description?: string | null;
};

export default function CourseLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const id = useMemo(() => Number(courseId), [courseId]);

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) {
      setError("Invalid course id");
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, lessonRes] = await Promise.all([
          http.get(`/courses/${id}`),
          http.get(`/courses/${id}/lessons`),
        ]);

        if (!alive) return;

        setCourse(unwrapData<Course>(courseRes));
        setLessons(unwrapData<Lesson[]>(lessonRes));
      } catch (err: unknown) {
        if (!alive) return;

        const e: ApiError = isApiError(err)
          ? err
          : { status: 0, message: "Something went wrong" };

        // If token expired / not logged in, send to login.
        if (e.status === 401) navigate("/login");
        else setError(e.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-300">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="text-xl font-semibold mb-2">Couldn’t load this course</div>
            <div className="text-slate-300 mb-4">{error}</div>
            <button
              className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold"
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-3xl font-bold tracking-tight">{course?.title ?? "Course"}</div>
            {course?.description ? (
              <div className="text-slate-300 mt-2 max-w-3xl">{course.description}</div>
            ) : null}
          </div>

          <button
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
            onClick={() => navigate("/student/dashboard")}
          >
            Dashboard
          </button>
        </div>

        <div className="mt-8 grid gap-4">
          {lessons.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-slate-300">
              No lessons yet.
            </div>
          ) : (
            lessons.map((l) => (
              <div
                key={l.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{l.title}</div>
                    {l.video_url ? (
                      <a
                        className="text-indigo-300 hover:text-indigo-200 text-sm mt-2 inline-block"
                        href={l.video_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Watch video
                      </a>
                    ) : null}
                  </div>

                  <button
                    className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold"
                    onClick={() => navigate(`/lessons/${l.id}`)}
                  >
                    Open
                  </button>
                </div>

                {l.content ? (
                  <div className="text-slate-300 mt-4 whitespace-pre-wrap">{l.content}</div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
