import CardTile from "@/components/CardTile";
import ClientForm from "@/components/Forms/ClientForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/appwrite/mutations";
import { listClients } from "@/lib/appwrite/queries";
import { Client } from "@/lib/appwrite/types";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/clients/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: ["clients"],
      queryFn: () => listClients(),
    });
  },
  component: ClientsPage,
});

function AddClientButton() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: Client) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      console.error("Error creating client", error);
    },
  });

  return (
    <Dialog>
      <CardTile>
        <Button asChild>
          <DialogTrigger>Add Client</DialogTrigger>
        </Button>
      </CardTile>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new client to the database.
          </DialogDescription>
        </DialogHeader>
        <ClientForm onSubmit={mutate} />
      </DialogContent>
    </Dialog>
  );
}

function ClientsPage() {
  const { data } = useSuspenseQuery({
    queryKey: ["clients"],
    queryFn: () => listClients(),
  });

  return (
    <>
      <h2 className="text-2xl font-bold pb-4">Clients</h2>
      <div className="flex flex-wrap gap-4">
        <AddClientButton />
        {data?.documents.map((client) => (
          <CardTile key={client.$id}>
            <Button
              variant={"ghost"}
              asChild
              className="w-full h-full flex justify-center items-center"
            >
              <Link to={`/clients/${client.$id}`}>
                <h3 className="text-lg font-bold">{client.name}</h3>
              </Link>
            </Button>
          </CardTile>
        ))}
      </div>
    </>
  );
}
