import CardTile from "@/components/CardTile";
import DialogTemplate from "@/components/DialogTemplate";
import ClientForm from "@/components/Forms/ClientForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/RxDb/mutations";
import { listClients } from "@/lib/RxDb/queries";
import { ClientZodSchemaType } from "@/schema/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/clients/")({
  component: ClientsPage,
});

function AddClientButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: ClientZodSchemaType) => createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
      toast.success("Client added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <CardTile>
      <DialogTemplate
        open={open}
        setOpen={setOpen}
        trigger={<Button>Add Client</Button>}
        content={<ClientForm onSubmit={mutate} />}
        title="Add Client"
        description="Add a new client"
      />
    </CardTile>
  );
}

function ClientsPage() {
  const { data } = useQuery({
    queryKey: ["clients"],
    queryFn: () => listClients(),
  });

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
