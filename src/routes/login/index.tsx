import { checkIfUserIsLoggedIn } from "@/lib/appwrite/util";
import {
  createFileRoute,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";

const LoginForm = lazyRouteComponent(
  () => import("@/components/Forms/LoginForm"),
  "LoginForm"
);

export const Route = createFileRoute("/login/")({
  beforeLoad: async () => {
    try {
      const user = await checkIfUserIsLoggedIn();
      if (user?.$id) {
        throw new Error("User is already logged in");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "User is already logged in"
      ) {
        throw redirect({ to: "/" });
      }
      return;
    }
  },
  component: () => <LoginPage />,
});

function LoginPage() {
  return (
    <div className="flex flex-col justify-center h-screen gap-40 max-w-96 m-auto">
      <h1 className="text-2xl font-extrabold text-center">
        Clients Workout Tracker App
      </h1>
      <LoginForm />
    </div>
  );
}
