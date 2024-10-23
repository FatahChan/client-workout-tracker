import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PageZodSchemaType, zodPageSchema } from "@/schema/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function PageForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className,
}: {
  defaultValues?: Partial<PageZodSchemaType>;
  onSubmit: (data: PageZodSchemaType) => void;
  submitButtonText?: string;
  className?: string;
}) {
  const form = useForm<PageZodSchemaType>({
    resolver: zodResolver(zodPageSchema),
    defaultValues: defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid grid-cols-1 gap-8", className)}
      >
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
}

export default PageForm;
