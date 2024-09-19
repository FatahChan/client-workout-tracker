import { Form } from "@/components/ui/form";
import {
  createExercise,
  deleteExercise,
  updateExercise,
} from "@/lib/appwrite/mutations";
import { getSection } from "@/lib/appwrite/queries";
import { ExerciseDocument, SectionDocument } from "@/lib/appwrite/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "../DataTable";
import TextInputField from "../TextInputField";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { SectionTableProvider } from "./context";
import { useSectionTable } from "./hook";

const columnHelper = createColumnHelper<ExerciseDocument>();

function DeleteExerciseDailog({ exercise }: { exercise: ExerciseDocument }) {
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => deleteExercise(exercise.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="p-2 w-8 h-8">
          <span className="sr-only">Delete Exercise</span>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-md">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => mutate()}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function ActionsCell({ row }: { row: Row<ExerciseDocument> }) {
  const { setExerciseToEdit, setShowEditExerciseForm } = useSectionTable();
  return (
    <div className="flex gap-2 flex-col justify-center items-center">
      <Button
        onClick={() => {
          setExerciseToEdit(row.original);
          setShowEditExerciseForm(true);
        }}
        className="p-2 w-8 h-8"
      >
        <span className="sr-only">Edit Exercise</span>
        <Pencil />
      </Button>
      <DeleteExerciseDailog exercise={row.original} />
    </div>
  );
}
const columns: ColumnDef<ExerciseDocument>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sets",
    header: "Sets",
  },
  {
    accessorKey: "reps",
    header: "Reps",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  }),
];

const exerciseFormSchema = z.object({
  name: z.string().min(1),
  sets: z.coerce.number().min(1),
  reps: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
});

function ExerciseForm({
  defaultValues = {
    name: "",
    sets: 1,
    reps: 1,
    weight: 1,
  },
  onSubmit,
  submitButtonText = "Submit",
}: {
  defaultValues?: Partial<ExerciseDocument>;
  onSubmit: (data: z.infer<typeof exerciseFormSchema>) => void;
  submitButtonText?: string;
}) {
  const form = useForm<z.infer<typeof exerciseFormSchema>>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-8"
      >
        <TextInputField
          formControl={form.control}
          name="name"
          placeholder="Exercise Name"
          label="Name"
        />
        <TextInputField
          formControl={form.control}
          name="sets"
          placeholder="Sets"
          label="Sets"
        />
        <TextInputField
          formControl={form.control}
          name="reps"
          placeholder="Reps"
          label="Reps"
        />
        <TextInputField
          formControl={form.control}
          name="weight"
          placeholder="Weight"
          label="Weight"
        />
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
}

function EditExerciseForm() {
  const {
    exerciseToEdit,
    sectionId,
    setExerciseToEdit,
    setShowEditExerciseForm,
  } = useSectionTable();
  useEffect(() => {
    console.log("exerciseToEdit", exerciseToEdit);
  }, [exerciseToEdit]);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof exerciseFormSchema>) => {
      if (!exerciseToEdit) {
        throw new Error("Exercise not found");
      }
      return updateExercise(exerciseToEdit.$id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setExerciseToEdit(null);
      setShowEditExerciseForm(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <ExerciseForm defaultValues={exerciseToEdit ?? {}} onSubmit={mutate} />
  );
}

function AddExerciseForm() {
  const { sectionId, setShowAddExerciseForm } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: z.infer<typeof exerciseFormSchema>) => {
      console.log("sectionId", sectionId);
      return createExercise(
        sectionId,
        data.name,
        data.sets,
        data.reps,
        data.weight
      );
    },
    onSuccess: () => {
      console.log("success");
      console.log("sectionId", sectionId);
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setShowAddExerciseForm(false);
    },
  });
  return <ExerciseForm onSubmit={mutate} />;
}
export function SectionTable({
  section: IntialSectionData,
}: {
  section: SectionDocument;
}) {
  const {
    showAddExerciseForm,
    setShowAddExerciseForm,
    showEditExerciseForm,
    setShowEditExerciseForm,
  } = useSectionTable();

  const { data: section } = useQuery({
    initialData: IntialSectionData,
    queryKey: [`section-${IntialSectionData.$id}`],
    queryFn: () => getSection(IntialSectionData.$id),
  });

  const handleButtonClick = () => {
    if (showEditExerciseForm) {
      setShowEditExerciseForm(false);
    } else {
      setShowAddExerciseForm((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col gap-2 border rounded-md p-4">
      <h3 className="text-xl font-bold">{section.name}</h3>
      {showEditExerciseForm ? (
        <EditExerciseForm />
      ) : showAddExerciseForm ? (
        <AddExerciseForm />
      ) : (
        <DataTable columns={columns} data={section.exercises} />
      )}
      <Button onClick={() => handleButtonClick()}>
        {showEditExerciseForm || showAddExerciseForm
          ? "Cancel"
          : "Add Exercise"}
      </Button>
    </div>
  );
}

export function SectionTableWrappedWithContext({
  section,
}: {
  section: SectionDocument;
}) {
  return (
    <SectionTableProvider sectionId={section.$id}>
      <SectionTable section={section} />
    </SectionTableProvider>
  );
}
