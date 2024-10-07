import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
          <Link to="/clients" className="underline">
            Home
          </Link>
          <Link to="/clients" className="underline">
            Clients
          </Link>
        </div>
        <SheetFooter></SheetFooter>
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
