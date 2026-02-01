import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= AUTH & PUBLIC ================= */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyCertificate from "./pages/public/VerifyCertificate";

/* ================= COURSE DISCOVERY ================= */
import CourseCatalog from "./pages/courses/CourseCatalog";
import CourseDetails from "./pages/courses/CourseDetails";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import StudentCourseLessons from "./pages/student/StudentCourseLessons";
import CourseQuiz from "./pages/student/CourseQuiz";

/* ================= INSTRUCTOR PAGES ================= */
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
      {/* 1. AUTHENTICATION PAGES (Standalone - No Sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. APP SHELL (Everything inside here gets the Sidebar and Topbar) */}
      <Route element={<AppLayout />}>
        
        {/* --- Public Pages within the Shell --- */}
        <Route path="/" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CourseDetails />} />
        <Route path="/verify" element={<VerifyCertificate />} />

        {/* --- Protected Zone (Requires Login) --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* Universal Settings */}
          <Route path="/settings/password" element={<ChangePassword />} />

          {/* -------- STUDENT ONLY ZONE -------- */}
          <Route element={<ProtectedRoute allow={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<MyCourses />} />
            <Route path="/courses/:courseId/lessons" element={<StudentCourseLessons />} />
            <Route path="/courses/:courseId/quiz" element={<CourseQuiz />} />
          </Route>

          {/* -------- INSTRUCTOR ONLY ZONE -------- */}
          <Route element={<ProtectedRoute allow={["instructor"]} />}>
            <Route path="/instructor" element={<InstructorDashboard />} />
            
            {/* New Course Entry */}
            <Route path="/instructor/courses/new" element={<CreateCourse />} />
            
            {/* Management Hub & Curriculum */}
            <Route path="/instructor/courses/:courseId/manage" element={<InstructorCourseManage />} />
            <Route path="/instructor/courses/:courseId/lessons" element={<InstructorCourseLessons />} />
            
            {/* Assessment Builder Flow */}
            <Route path="/instructor/courses/:courseId/quiz" element={<CourseQuizBuilder />} />
            <Route path="/instructor/quizzes/:quizId/questions" element={<QuizQuestionBuilder />} />
            
            {/* Performance Analytics */}
            <Route path="/instructor/courses/:courseId/analytics" element={<CourseAnalytics />} />
          </Route>

        </Route>
      </Route>

      {/* 3. CATCH-ALL REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}