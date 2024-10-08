import { useMutation, useQueryClient } from "@tanstack/react-query";
import DestructiveDialogWarning from "../DestructiveDialogWarning";
import { useSectionTable } from "./hook";
import {
  updateExercise,
  createExercise,
  deleteExercise,
} from "@/lib/RxDb/mutations";
import { Pencil, Plus } from "lucide-react";
import DialogTemplate from "../DialogTemplate";
import ExerciseForm from "../Forms/ExerciseForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { ExerciseDocType } from "@/lib/RxDb/schema";
import { ExerciseZodSchemaType } from "@/schema/exercise";
import { toast } from "sonner";

function EditExerciseDialog({
  exercise,
}: {
  exercise: ExerciseDocType;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ExerciseZodSchemaType) => {
      if (!exercise) {
        throw new Error("Exercise not found");
      }
      return updateExercise(exercise.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sectionId] });
      setOpen(false);
      toast.success("Exercise updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <DialogTemplate
      trigger={
        <Button size="sm" disabled={isPending} className="p-2 w-8 h-8">
          <span className="sr-only">Edit Exercise</span>
          <Pencil size={16} />
        </Button>
      }
      content={
        <ExerciseForm
          defaultValues={{
            sectionId,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
          }}
          onSubmit={mutate}
        />
      }
      title="Edit Exercise"
      description="Edit the exercise details and click save."
      open={open}
      setOpen={setOpen}
    />
  );
}

function AddExerciseDialog() {
  const [open, setOpen] = useState(false);
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ExerciseZodSchemaType) => {
      return createExercise(sectionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sectionId] });
      setOpen(false);
      toast.success("Exercise added successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      title="Add Exercise"
      description="Add a new exercise to the section."
      trigger={
        <Button className="w-full">
          <span className="sr-only">Add Exercise</span>
          <Plus />
        </Button>
      }
      content={
        <ExerciseForm
          defaultValues={{
            sectionId,
          }}
          onSubmit={mutate}
          disabled={isPending}
        />
      }
    />
  );
}

function DeleteExerciseDialog({ exercise }: { exercise: ExerciseDocType }) {
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteExercise(exercise.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises", sectionId] });
      toast.success("Exercise deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return <DestructiveDialogWarning onConfirm={mutate} />;
}

export { EditExerciseDialog, AddExerciseDialog, DeleteExerciseDialog };
