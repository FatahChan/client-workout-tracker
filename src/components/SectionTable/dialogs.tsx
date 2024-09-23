import { useMutation, useQueryClient } from "@tanstack/react-query";
import DestructiveDailogWarning from "../DestructiveDailogWarning";
import { useSectionTable } from "./hook";
import {
  updateExercise,
  createExercise,
  deleteExercise,
} from "@/lib/appwrite/mutations";
import { ExerciseDocument, Exercise } from "@/lib/appwrite/types";
import { Plus } from "lucide-react";
import DialogTemplate from "../DialogTamplate";
import ExerciseForm from "../Forms/ExerciseForm";
import { Button } from "../ui/button";
import { useState } from "react";

function EditExerciseDialog({
  exercise,
  trigger,
}: {
  exercise: ExerciseDocument;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Exercise) => {
      if (!exercise) {
        throw new Error("Exercise not found");
      }
      return updateExercise(exercise.$id, data);
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
    mutationFn: (data: Exercise) => {
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

function DeleteExerciseDailog({ exercise }: { exercise: ExerciseDocument }) {
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteExercise(exercise.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
    },
  });
  return <DestructiveDailogWarning onConfirm={mutate} />;
}

export { EditExerciseDialog, AddExerciseDialog, DeleteExerciseDailog };
