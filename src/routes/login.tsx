import LoginForm from "@/components/LoginForm";
import { account } from "@/lib/appwrite";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      const user = await account.get();
      if (user) {
        throw redirect({ to: "/" });
      }
    } catch {
      return { error: "Failed to get user" };
    }
  },

  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
