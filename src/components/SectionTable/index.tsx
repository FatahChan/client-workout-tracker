import { deleteSection, updateSection } from "@/lib/RxDb/mutations";
import { getSection, listExercises } from "@/lib/RxDb/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { DataTable } from "../DataTable";
import DestructiveDialogWarning from "../DestructiveDialogWarning";
import DialogTemplate from "../DialogTemplate";
import SectionForm from "../Forms/SectionForm";
import { Button } from "../ui/button";
import { SectionTableProvider } from "./context";
import {
  AddExerciseDialog,
  DeleteExerciseDialog,
  EditExerciseDialog,
} from "./dialogs";
import { ExerciseDocType, SectionDocType } from "@/lib/RxDb/schema";
import { toast } from "sonner";

function SectionTableTitleHeader({ section }: { section: SectionDocType }) {
  const { pageId } = useParams({
    from: "/_layout/clients/$clientId/pages/$pageId/",
  });
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: deleteSectionMutation } = useMutation({
    mutationFn: () => deleteSection(section.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", pageId] });
      toast.success("Section deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: (data: { name: string }) => {
      return updateSection(section.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["section", section.id] });
      setOpenForm(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-bold">{section.name}</h3>
      <div className="flex gap-2">
        <DialogTemplate
          open={openForm}
          setOpen={setOpenForm}
          trigger={
            <Button size="sm">
              <span className="sr-only">Edit Section</span>
              <Pencil size={16} />
            </Button>
          }
          title="Edit Section"
          description="Edit the section"
          content={
            <SectionForm
              onSubmit={updateSectionMutation}
              submitButtonText="Update Section"
              defaultValues={{ pageId, name: section.name }}
            />
          }
        ></DialogTemplate>
        <DestructiveDialogWarning onConfirm={() => deleteSectionMutation()}>
          <Button variant="destructive" size="sm">
            <span className="sr-only">Delete Section</span>
            <Trash size={16} />
          </Button>
        </DestructiveDialogWarning>
      </div>
    </div>
  );
}

function ActionsCell({ row }: { row: Row<ExerciseDocType> }) {
  return (
    <div className="flex gap-2 flex-col justify-center items-center">
      <EditExerciseDialog exercise={row.original} />

      <DeleteExerciseDialog exercise={row.original} />
    </div>
  );
}
const columnHelper = createColumnHelper<ExerciseDocType>();

const columns: ColumnDef<ExerciseDocType>[] = [
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
  section: initialSectionData,
}: {
  section: SectionDocType;
}) {
  const { data: section } = useQuery({
    queryKey: ["section", initialSectionData.id],
    queryFn: () => getSection(initialSectionData.id),
  });

  const { data: exercises } = useQuery({
    enabled: !!section,
    queryKey: ["exercises", section?.id],
    queryFn: () => {
      if (!section) throw new Error("Section not found");
      return listExercises(section.id);
    },
  });

  if (!section) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2 border rounded-md p-4 md:min-w-96">
      <SectionTableTitleHeader section={section} />
      <DataTable columns={columns} data={exercises} />
      <AddExerciseDialog />
    </div>
  );
}

export function SectionTableWrappedWithContext({
  section,
}: {
  section: SectionDocType;
}) {
  return (
    <SectionTableProvider sectionId={section.id}>
      <SectionTable section={section} />
    </SectionTableProvider>
  );
}
