import {
  createExercise,
  deleteExercise,
  deleteSection,
  updateExercise,
  updateSection,
} from "@/lib/appwrite/mutations";
import { getSection } from "@/lib/appwrite/queries";
import {
  Exercise,
  ExerciseDocument,
  SectionDocument,
} from "@/lib/appwrite/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { DataTable } from "../DataTable";
import DestructiveDailogWarning from "../DestructiveDailogWarning";
import DialogTemplate from "../DialogTamplate";
import ExerciseForm from "../Forms/ExerciseForm";
import SectionForm from "../Forms/SectionForm";
import { Button } from "../ui/button";
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
  return <DestructiveDailogWarning onConfirm={mutate} />;
}
function ActionsCell({ row }: { row: Row<ExerciseDocument> }) {
  return (
    <div className="flex gap-2 flex-col justify-center items-center">
      <Button className="p-2 w-8 h-8">
        <span className="sr-only">Edit Exercise</span>
        <Pencil />
      </Button>
      <EditExerciseDialog
        exercise={row.original}
        trigger={
          <Button className="p-2 w-8 h-8">
            <span className="sr-only">Edit Exercise</span>
            <Pencil />
          </Button>
        }
      />

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

function EditExerciseDialog({
  exercise,
  trigger,
}: {
  exercise: ExerciseDocument;
  trigger?: React.ReactNode;
}) {
  const { sectionId } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data: Exercise) => {
      if (!exercise) {
        throw new Error("Exercise not found");
      }
      return updateExercise(exercise.$id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <DialogTemplate
      trigger={trigger ?? <Button>Edit Exercise</Button>}
      content={<ExerciseForm defaultValues={exercise} onSubmit={mutate} />}
    />
  );
}

function AddExerciseDialog() {
  const { sectionId, setShowAddExerciseForm } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Exercise) => {
      return createExercise(sectionId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setShowAddExerciseForm(false);
    },
  });
  return (
    <DialogTemplate
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

export function SectionTableTitleHeader({
  section,
}: {
  section: SectionDocument;
}) {
  const { exerciseToEdit } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate: deleteSectionMutation } = useMutation({
    mutationFn: () => deleteSection(section.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${section.$id}`] });
    },
  });
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: (data: { name: string }) => {
      if (!exerciseToEdit) {
        throw new Error("Exercise not found");
      }
      return updateSection(exerciseToEdit.$id, data);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${section.$id}`] });
    },
  });

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">{section.name}</h3>
      <div className="flex gap-2">
        <DialogTemplate
          trigger={
            <Button size="sm">
              <span className="sr-only">Edit Section</span>
              <Pencil size={16} />
            </Button>
          }
          content={
            <SectionForm
              onSubmit={updateSectionMutation}
              submitButtonText="Update Section"
              defaultValues={{ name: section.name }}
            />
          }
        ></DialogTemplate>
        <DestructiveDailogWarning onConfirm={() => deleteSectionMutation()}>
          <Button variant="destructive" size="sm">
            <span className="sr-only">Delete Section</span>
            <Trash size={16} />
          </Button>
        </DestructiveDailogWarning>
      </div>
    </div>
  );
}
export function SectionTable({
  section: IntialSectionData,
}: {
  section: SectionDocument;
}) {
  const { data: section } = useQuery({
    initialData: IntialSectionData,
    queryKey: [`section-${IntialSectionData.$id}`],
    queryFn: () => getSection(IntialSectionData.$id),
  });

  return (
    <div className="flex flex-col gap-2 border rounded-md p-4 md:min-w-96">
      <SectionTableTitleHeader section={section} />
      <DataTable columns={columns} data={section.exercises} />
      <AddExerciseDialog />
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
