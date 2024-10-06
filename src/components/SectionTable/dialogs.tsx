import { useMutation, useQueryClient } from "@tanstack/react-query";
import DestructiveDialogWarning from "../DestructiveDialogWarning";
import { useSectionTable } from "./hook";
import {
  updateExercise,
  createExercise,
  deleteExercise,
} from "@/lib/RxDb/mutations";
import { Plus } from "lucide-react";
import DialogTemplate from "../DialogTemplate";
import ExerciseForm from "../Forms/ExerciseForm";
import { Button } from "../ui/button";
import { useState } from "react";
import { ExerciseDocType } from "@/lib/RxDb/schema";
import { ExerciseZodSchemaType } from "@/schema/exercise";

function EditExerciseDialog({
  exercise,
  trigger,
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
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <DialogTemplate
      trigger={trigger ?? <Button disabled={isPending}>Edit Exercise</Button>}
      content={<ExerciseForm defaultValues={exercise} onSubmit={mutate} />}
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
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setOpen(false);
    },
  });
  return (
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      trigger={
        <Button className="w-full">
          <span className="sr-only">Add Exercise</span>
          <Plus />
        </Button>
      }
      content={<ExerciseForm onSubmit={mutate} disabled={isPending} />}
    />
  );
}

function DeleteExerciseDialog({ exercise }: { exercise: ExerciseDocType }) {
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteExercise(exercise.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
    },
  });
  return <DestructiveDialogWarning onConfirm={mutate} />;
}

export { EditExerciseDialog, AddExerciseDialog, DeleteExerciseDialog };
