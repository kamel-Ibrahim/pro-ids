import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ allow }: { allow?: string[] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="bg-black h-screen" />; // Loading state

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allow && user && !allow.includes(user.role)) {
    return <Navigate to={user.role === 'instructor' ? '/instructor' : '/student'} replace />;
  }

  // MUST RETURN OUTLET, NOT CHILDREN
  return <Outlet />;
}