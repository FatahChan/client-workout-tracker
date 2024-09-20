import TextInputField from "@/components/TextInputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Section, SectionSchema } from "@/lib/appwrite/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function SectionForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className,
  disabled = false,
}: {
  defaultValues?: Section;
  onSubmit: (data: Section) => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
}) {
  const form = useForm<Section>({
    resolver: zodResolver(SectionSchema),
    defaultValues: defaultValues ?? {
      name: "",
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
          placeholder="Section Name"
          label="Name"
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

export default SectionForm;
