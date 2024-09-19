import { useContext } from "react";
import { SectionTableContext } from "./context";

export const useSectionTable = () => {
  const context = useContext(SectionTableContext);

  if (context === null || context === undefined) {
    throw new Error(
      "useSectionTable must be used within a SectionTableProvider"
    );
  }
  return context;
};
