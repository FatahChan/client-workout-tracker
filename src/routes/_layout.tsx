import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { account } from "@/lib/appwrite";
import { checkIfUserIsLoggedIn } from "@/lib/appwrite/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Menu as MenuIcon } from "lucide-react";

export const Route = createFileRoute("/_layout")({
  component: Layout,
});

function Menu() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => checkIfUserIsLoggedIn(),
    throwOnError: (error) => {
      if (error.message === "User is not logged in") {
        return false;
      }
      return true;
    },
  });
  console.log(user);
  const { mutate: logoutMutation } = useMutation({
    onMutate: () => {
      console.log("Logging out...");
    },
    mutationFn: () => account.deleteSession("current"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
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
        <SheetDescription className="sr-only">
          Main navigation menu
        </SheetDescription>
        <div className="flex flex-col gap-4 my-4">
          <SheetClose asChild>
            <Link to="/clients" className="underline">
              Home
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/clients" className="underline">
              Clients
            </Link>
          </SheetClose>
        </div>
        <SheetFooter>
          {user ? (
            <SheetClose asChild>
              <Button variant={"destructive"} onClick={() => logoutMutation}>
                Logout
              </Button>
            </SheetClose>
          ) : (
            <SheetClose asChild>
              <Button asChild>
                <Link to="/login" className="underline">
                  Login
                </Link>
              </Button>
            </SheetClose>
          )}
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
      <Outlet />
    </>
  );
}
