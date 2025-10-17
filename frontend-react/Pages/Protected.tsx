import { useAuth } from "@/utils/auth";
import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function Protected({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Chargement…
      </div>
    );
  }

  if (!user)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}
