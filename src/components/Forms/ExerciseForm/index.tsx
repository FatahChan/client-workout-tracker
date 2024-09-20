import TextInputField from "@/components/TextInputField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Exercise, ExerciseSchema } from "@/lib/appwrite/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function ExerciseForm({
  defaultValues,
  onSubmit,
  submitButtonText = "Submit",
  className,
  disabled = false,
}: {
  defaultValues?: Exercise;
  onSubmit: (data: Exercise) => void;
  submitButtonText?: string;
  className?: string;
  disabled?: boolean;
}) {
  const form = useForm<Exercise>({
    resolver: zodResolver(ExerciseSchema),
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
          disabled={disabled}
        />
        <TextInputField
          formControl={form.control}
          name="sets"
          placeholder="Sets"
          label="Sets"
          type="number"
          disabled={disabled}
        />
        <TextInputField
          formControl={form.control}
          name="reps"
          placeholder="Reps"
          label="Reps"
          type="number"
          disabled={disabled}
        />
        <TextInputField
          formControl={form.control}
          name="weight"
          placeholder="Weight"
          label="Weight"
          type="number"
          disabled={disabled}
        />

        <Button type="submit" disabled={disabled}>
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

export default ExerciseForm;
