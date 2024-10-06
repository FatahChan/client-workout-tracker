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
import { createClient } from "@/lib/RxDb/mutations";
import { listClients } from "@/lib/RxDb/queries";
import { ClientZodSchemaType } from "@/schema/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/clients/")({
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
    mutationFn: (data: ClientZodSchemaType) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (error) => {
      toast.error(error.message);
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
            Add a new client
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
  console.log(data);
  return (
    <>
      <h2 className="text-2xl font-bold pb-4">Clients</h2>
      <div className="flex flex-wrap gap-4">
        <AddClientButton />
        {data?.map((client) => (
          <CardTile key={client.id}>
            <Button
              variant={"ghost"}
              asChild
              className="w-full h-full flex justify-center items-center"
            >
              <Link to={`/clients/${client.id}`}>
                <h3 className="text-lg font-bold">{client.name}</h3>
              </Link>
            </Button>
          </CardTile>
        ))}
      </div>
    </>
  );
}
