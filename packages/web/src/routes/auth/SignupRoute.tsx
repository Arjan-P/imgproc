import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router/router";
import { useSignup, SignupForm } from "@/features/auth";

export function SignupRoute() {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  function handleSignup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (data.password !== data.confirmPassword) {
      // show toast/form error
      return;
    }

    signupMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.dashboard, { replace: true });
        },
      },
    );
  }

  return (
    <SignupForm loading={signupMutation.isPending} onSubmit={handleSignup} />
  );
}
