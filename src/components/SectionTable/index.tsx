import { deleteSection, updateSection } from "@/lib/appwrite/mutations";
import { getSection } from "@/lib/appwrite/queries";
import { ExerciseDocument, SectionDocument } from "@/lib/appwrite/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { DataTable } from "../DataTable";
import DestructiveDailogWarning from "../DestructiveDailogWarning";
import DialogTemplate from "../DialogTamplate";
import SectionForm from "../Forms/SectionForm";
import { Button } from "../ui/button";
import { SectionTableProvider } from "./context";
import { useSectionTable } from "./hook";
import {
  AddExerciseDialog,
  EditExerciseDialog,
  DeleteExerciseDailog,
} from "./dialogs";

function SectionTableTitleHeader({ section }: { section: SectionDocument }) {
  const { pageId } = useParams({
    from: "/_protected/clients/$clientId/pages/$pageId/",
  });
  const { exerciseToEdit } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate: deleteSectionMutation } = useMutation({
    mutationFn: () => deleteSection(section.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${section.$id}`] });
      queryClient.invalidateQueries({ queryKey: [`page-${pageId}`] });
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
const columnHelper = createColumnHelper<ExerciseDocument>();

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

function SectionTable({
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
