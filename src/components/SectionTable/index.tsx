import { Form } from "@/components/ui/form";
import {
  createExercise,
  deleteExercise,
  deleteSection,
  updateExercise,
  updateSection,
} from "@/lib/appwrite/mutations";
import { getSection } from "@/lib/appwrite/queries";
import { ExerciseDocument, SectionDocument } from "@/lib/appwrite/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DataTable } from "../DataTable";
import DestructiveDailogWarning from "../DestructiveDailogWarning";
import TextInputField from "../TextInputField";
import { Button } from "../ui/button";
import { SectionTableProvider } from "./context";
import { useSectionTable } from "./hook";
import { useState } from "react";
import { Input } from "../ui/input";

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
      return createExercise(
        sectionId,
        data.name,
        data.sets,
        data.reps,
        data.weight
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${sectionId}`] });
      setShowAddExerciseForm(false);
    },
  });
  return <ExerciseForm onSubmit={mutate} />;
}

export function SectionTableTitleHeader({
  section,
}: {
  section: SectionDocument;
}) {
  const [editSectionName, setEditSectionName] = useState(false);
  const [sectionName, setSectionName] = useState(section.name);
  const { exerciseToEdit } = useSectionTable();
  const queryClient = useQueryClient();
  const { mutate: deleteSectionMutation } = useMutation({
    mutationFn: () => deleteSection(section.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${section.$id}`] });
    },
  });
  const { mutate: updateSectionMutation } = useMutation({
    mutationFn: () => {
      if (!exerciseToEdit) {
        throw new Error("Exercise not found");
      }
      return updateSection(exerciseToEdit.$id);
    },
    onError: (error) => {
      console.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`section-${section.$id}`] });
      setEditSectionName(false);
      setSectionName(section.name);
    },
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <form onSubmit={() => updateSectionMutation()}>
          <Input
            className="text-xl font-bold"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
          />
        </form>
        <h3 className="text-xl font-bold">{section.name}</h3>
        <div className="flex gap-2">
          <Button size="sm">
            <span className="sr-only">Edit Section</span>
            <Pencil size={16} />
          </Button>
          <DestructiveDailogWarning
            onConfirm={() => deleteSectionMutation()}
          ></DestructiveDailogWarning>
        </div>
      </div>
    </>
  );
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
    <div className="flex flex-col gap-2 border rounded-md p-4 md:min-w-96">
      <SectionTableTitleHeader section={section} />
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
