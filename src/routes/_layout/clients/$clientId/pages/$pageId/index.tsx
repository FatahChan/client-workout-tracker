import CardTile from "@/components/CardTile";
import DialogTemplate from "@/components/DialogTemplate";
import SectionForm from "@/components/Forms/SectionForm";
import { SectionTableWrappedWithContext } from "@/components/SectionTable";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { createSection } from "@/lib/RxDb/mutations";
import { getClient, getPage, listSections } from "@/lib/RxDb/queries";
import { cn } from "@/lib/utils";
import { SectionZodSchemaType } from "@/schema/section";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_layout/clients/$clientId/pages/$pageId/"
)({
  loader: async ({ params, context: { queryClient } }) => {
    const { clientId, pageId } = params;
    queryClient.ensureQueryData({
      queryKey: [`client-${clientId}`],
      queryFn: () => getClient(clientId),
    });
    queryClient.ensureQueryData({
      queryKey: [`page-${pageId}`],
      queryFn: () => getPage(pageId),
    });
  },
  component: Page,
});

function AddSectionCard({ pageId }: { pageId: string }) {
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    onMutate: () => {},
    mutationFn: (data: SectionZodSchemaType) => createSection(pageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections", pageId] });
      toast.success("Section added successfully");
      setOpenForm(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <CardTile className={cn("w-full aspect-[5/1] md:aspect-auto")}>
      <DialogTemplate
        open={openForm}
        setOpen={setOpenForm}
        trigger={<Button>Add Section</Button>}
        content={
          <SectionForm
            onSubmit={mutate}
            disabled={isPending}
            defaultValues={{ pageId }}
          />
        }
        title={"Add Section"}
        description="Add a new section to the page."
      />
    </CardTile>
  );
}

function SectionsGrid({ pageId }: { pageId: string }) {
  const { data: sections } = useQuery({
    queryKey: ["sections", pageId],
    queryFn: () => listSections(pageId),
  });
  return (
    <div className="flex flex-wrap flex-col gap-4 md:flex-row justify-center items-start ">
      {sections?.map((section) => {
        return (
          <SectionTableWrappedWithContext key={section.id} section={section} />
        );
      })}
    </div>
  );
}
function Page() {
  const { clientId, pageId } = Route.useParams();
  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId),
  });
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => getPage(pageId),
  });

  const pageTitle = useMemo(() => {
    if (isLoading) {
      return <Spinner />;
    }
    return `${client?.name}'s Page ${
      page?.createdAt
        ? new Date(page?.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })
        : null
    }`;
  }, [client?.name, page?.createdAt, isLoading]);
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      <AddSectionCard pageId={pageId} />
      <SectionsGrid pageId={pageId} />
    </div>
  );
}
