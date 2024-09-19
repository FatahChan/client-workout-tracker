import LoginForm from "@/components/LoginForm";
import { account } from "@/lib/appwrite";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const user = await account.get();
    if (user) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
