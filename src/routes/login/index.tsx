import { checkIfUserIsLoggedIn } from "@/lib/appwrite/util";
import {
  createFileRoute,
  lazyRouteComponent,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";

const LoginForm = lazyRouteComponent(
  () => import("@/components/LoginForm"),
  "LoginForm"
);

export const Route = createFileRoute("/login/")({
  beforeLoad: async () => {
    try {
      const user = await checkIfUserIsLoggedIn();
      console.log("user", user);
      if (user?.$id) {
        console.log("redirecting to /");
        throw redirect({ to: "/", throw: true });
      }
    } catch {
      return;
    }
  },
  component: () => <LoginPage />,
});

function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    checkIfUserIsLoggedIn(true).then((data) => {
      if (data?.$id) {
        router.navigate({ to: "/" });
      }
    });
  }, [router]);
  return (
    <div className="flex flex-col justify-center h-screen gap-40 max-w-96 m-auto">
      <h1 className="text-2xl font-extrabold text-center">
        Clients Workout Tracker App
      </h1>
      <LoginForm />
    </div>
  );
}
