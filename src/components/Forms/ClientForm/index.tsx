import TextInputField from "@/components/TextInputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Client, ClientSchema } from "@/lib/appwrite/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function ClientForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className,
}: {
  defaultValues: Client;
  onSubmit: (data: Client) => void;
  submitButtonText?: string;
  className?: string;
}) {
  const form = useForm<Client>({
    resolver: zodResolver(ClientSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid grid-cols-1 gap-8", className)}
      >
        <TextInputField
          formControl={form.control}
          name="name"
          placeholder="Exercise Name"
          label="Name"
        />
        <TextInputField
          formControl={form.control}
          name="age"
          placeholder="Age"
          label="Age"
          type="number"
        />
        <TextInputField
          formControl={form.control}
          name="bodyType"
          placeholder="Body Type"
          label="Body Type"
        />
        <TextInputField
          formControl={form.control}
          name="goal"
          placeholder="Goal"
          label="Goal"
        />

        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
}

export default ClientForm;
