import LoginForm from "@/components/LoginForm";
import { account } from "@/lib/appwrite";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      const user = await account.get();
      console.log(user);
      if (user) {
        throw redirect({ to: "/" });
      }
    } catch (error) {
      return { error };
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return <LoginForm />;
}
