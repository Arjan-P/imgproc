import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router/router";
import { useLogin, LoginForm } from "@/features/auth";

export function LoginRoute() {
  const navigate = useNavigate();

  const loginMutation = useLogin();

  function handleLogin(data: { email: string; password: string }) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate(ROUTES.dashboard, { replace: true });
      },
    });
  }

  return <LoginForm loading={loginMutation.isPending} onSubmit={handleLogin} />;
}
