import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { account } from "@/lib/appwrite";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Menu as MenuIcon } from "lucide-react";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const user = await account.get();
    console.log(user);
    if (!user) {
      throw redirect({ to: "/login" });
    }
  },
  component: Layout,
});

function Menu() {
  const { mutate: logout } = useMutation({
    mutationFn: () => account.deleteSession("current"),
    onSuccess: () => {
      throw redirect({ to: "/login" });
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0">
          <MenuIcon />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-4">
          <SheetTitle>Clients Workout Tracker App</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 my-4">
          <Link to="/" className="underline">
            Home
          </Link>
          <Link to="/clients" className="underline">
            Clients
          </Link>
          <span className="text-xl text-muted-foreground font-bold">
            Recents
          </span>
        </div>
        <SheetFooter>
          <Button onClick={() => logout()} variant={"destructive"}>
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Layout() {
  const router = useRouter();

  return (
    <>
      <nav className="flex w-full justify-between items-center px-4">
        <div>
          <Button
            className="p-0"
            onClick={() => router.history.back()}
            variant="ghost"
          >
            <ArrowLeft />
          </Button>
        </div>
        <div>
          <Menu />
        </div>
      </nav>
      <hr className="my-4" />
      <Outlet />,
    </>
  );
}
