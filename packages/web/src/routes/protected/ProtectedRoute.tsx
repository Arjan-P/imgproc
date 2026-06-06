import { useAuthStore } from "@/features/auth";
import { ROUTES } from "@/app/router/router";

import { Navigate, Outlet } from "react-router-dom";

export function ProtectedLayout() {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }
  return <Outlet />;
}
