import { checkIfUserIsLoggedIn } from "@/lib/appwrite/util";
import {
  createFileRoute,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router";

const LoginForm = lazyRouteComponent(
  () => import("../components/LoginForm"),
  "LoginForm"
);

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      const user = await checkIfUserIsLoggedIn();
      if (user?.$id) {
        throw redirect({ to: "/" });
      }
    } catch {
      console.log("User is not logged in");
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
