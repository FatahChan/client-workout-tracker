import { ExerciseDocType } from "@/lib/RxDb/schema";
import React from "react";
import { createContext, useState, type Dispatch } from "react";

type SectionTableContextType = {
  sectionId: string;
  showAddExerciseForm: boolean;
  setShowAddExerciseForm: Dispatch<React.SetStateAction<boolean>>;
  showEditExerciseForm: boolean;
  setShowEditExerciseForm: Dispatch<React.SetStateAction<boolean>>;
  exerciseToEdit: ExerciseDocType | null;
  setExerciseToEdit: Dispatch<React.SetStateAction<ExerciseDocType | null>>;
};
export const SectionTableContext =
  createContext<SectionTableContextType | null>(null);

export const SectionTableProvider = ({
  children,
  sectionId,
}: {
  children: React.ReactNode;
  sectionId: string;
}) => {
  const [showAddExerciseForm, setShowAddExerciseForm] = useState(false);
  const [showEditExerciseForm, setShowEditExerciseForm] = useState(false);
  const [exerciseToEdit, setExerciseToEdit] = useState<ExerciseDocType | null>(
    null
  );
  return (
    <SectionTableContext.Provider
      value={{
        sectionId,
        showAddExerciseForm,
        setShowAddExerciseForm,
        showEditExerciseForm,
        setShowEditExerciseForm,
        exerciseToEdit,
        setExerciseToEdit,
      }}
    >
      {children}
    </SectionTableContext.Provider>
  );
};
