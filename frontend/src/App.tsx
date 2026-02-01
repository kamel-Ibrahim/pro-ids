import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import VerifyCertificate from "./pages/public/VerifyCertificate"

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* PUBLIC PAGES (WITH SIDEBAR) */
import CourseCatalog from "./pages/courses/CourseCatalog";
import CourseDetails from "./pages/courses/CourseDetails";

/* STUDENT PAGES */
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import StudentCourseLessons from "./pages/student/StudentCourseLessons";
import CourseQuiz from "./pages/student/CourseQuiz";

/* INSTRUCTOR PAGES */
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CreateCourse from "./pages/instructor/CreateCourse";
import InstructorCourseManage from "./pages/instructor/InstructorCourseManage";
import InstructorCourseLessons from "./pages/instructor/CourseLessons";
import CourseQuizBuilder from "./pages/instructor/CourseQuizBuilder";
import QuizQuestionBuilder from "./pages/instructor/QuizQuestionBuilder";
import CourseAnalytics from "./pages/instructor/CourseAnalytics";

export default function App() {
  return (
    <Routes>
      {/* 1. AUTH PAGES (NO SIDEBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. ALL DASHBOARD PAGES (NESTED IN LAYOUT TO PREVENT DOUBLE LOADING) */}
      <Route element={<AppLayout />}>
        
        {/* Public viewable pages within the app shell */}
        <Route path="/" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/verify" element={<VerifyCertificate />} />

        {/* AUTHENTICATION WRAPPER */}
        <Route element={<ProtectedRoute />}>
          
          {/* STUDENT ONLY ZONE */}
          <Route element={<ProtectedRoute allow={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/courses/:courseId/lessons" element={<StudentCourseLessons />} />
            <Route path="/courses/:courseId/quiz" element={<CourseQuiz />} />
          </Route>

          {/* INSTRUCTOR ONLY ZONE */}
          <Route element={<ProtectedRoute allow={["instructor"]} />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            
            {/* Course Creation */}
            <Route path="/instructor/courses/new" element={<CreateCourse />} />
            
            {/* Specific Course Management */}
            <Route path="/instructor/courses/:courseId/manage" element={<InstructorCourseManage />} />
            <Route path="/instructor/courses/:courseId/lessons" element={<InstructorCourseLessons />} />
            <Route path="/instructor/courses/:courseId/quiz" element={<CourseQuizBuilder />} />
            <Route path="/instructor/courses/:courseId/analytics" element={<CourseAnalytics />} />
            
            {/* Quiz Question Detail Builder */}
            <Route path="/instructor/quizzes/:quizId/questions" element={<QuizQuestionBuilder />} />
          </Route>

        </Route>
      </Route>

      {/* CATCH-ALL REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}