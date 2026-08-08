import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="p-4 text-text-primary">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
