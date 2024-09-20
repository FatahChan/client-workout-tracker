import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Page, PageSchema } from "@/lib/appwrite/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function PageForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className,
}: {
  defaultValues: Page;
  onSubmit: (data: Page) => void;
  submitButtonText?: string;
  className?: string;
}) {
  const form = useForm<Page>({
    resolver: zodResolver(PageSchema),
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
