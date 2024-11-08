import TextInputField from "@/components/TextInputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ClientZodSchemaType, zodClientSchema } from "@/schema/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function ClientForm({
  defaultValues = {},
  onSubmit,
  submitButton,
  className,
}: {
  defaultValues?: Partial<ClientZodSchemaType>;
  onSubmit: (data: ClientZodSchemaType) => void;
  submitButton?: React.ReactNode;
  className?: string;
}) {
  const form = useForm<ClientZodSchemaType>({
    resolver: zodResolver(zodClientSchema),
    defaultValues: {
      name: "",
      age: 0,
      bodyType: "",
      goal: "",
      ...defaultValues,
    },
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
          placeholder="Name"
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

        {submitButton ? submitButton : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}

export default ClientForm;
