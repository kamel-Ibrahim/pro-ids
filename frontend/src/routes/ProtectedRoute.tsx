import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ allow }: { allow?: string[] }) {
  const { user, isAuthenticated, loading } = useAuth();

  // If loading, show a visible spinner so you know the app isn't "stuck"
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allow && user && !allow.includes(user.role)) {
    // Redirect based on role if trying to access unauthorized area
    const homePath = user.role === 'instructor' ? '/instructor' : '/student';
    return <Navigate to={homePath} replace />;
  }

  return <Outlet />;
}