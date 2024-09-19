import CardTile from "@/components/CardTile";
import TextInputField from "@/components/TextInputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { createClient } from "@/lib/appwrite/mutations";
import { listClients } from "@/lib/appwrite/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/_protected/clients/")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: ["clients"],
      queryFn: () => listClients(),
    });
  },
  component: ClientsPage,
});

const clientFormSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(6),
  bodyType: z.string().min(1),
  goal: z.string().min(1),
});

function AddClientButton() {
  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      age: 0,
      bodyType: "",
      goal: "",
    },
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof clientFormSchema>) =>
      createClient(data.name, data.age, data.bodyType, data.goal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      form.reset();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="grid grid-cols-1 gap-8"
          >
            <TextInputField
              formControl={form.control}
              name="name"
              placeholder="Client Name"
              label="Name"
            />
            <TextInputField
              formControl={form.control}
              name="age"
              placeholder="Client Age"
              label="Age"
              type="number"
            />
            <TextInputField
              formControl={form.control}
              name="bodyType"
              placeholder="Client Body Type"
              label="Body Type"
            />
            <TextInputField
              formControl={form.control}
              name="goal"
              placeholder="Client Goal"
              label="Goal"
            />
            <DialogFooter className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">Submit</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
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
            <Button variant={"ghost"} asChild>
              <Link to={`/clients/${client.$id}`}>
                <h3 className="text-lg font-bold w-full">{client.name}</h3>
              </Link>
            </Button>
          </CardTile>
        ))}
      </div>
    </>
  );
}
