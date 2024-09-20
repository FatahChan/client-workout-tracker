import CardTile from "@/components/CardTile";
import DialogTemplate from "@/components/DialogTamplate";
import SectionForm from "@/components/Forms/SectionForm";
import { SectionTableWrappedWithContext } from "@/components/SectionTable";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { createSection } from "@/lib/appwrite/mutations";
import { getClient, getPage } from "@/lib/appwrite/queries";
import { Section } from "@/lib/appwrite/types";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute(
  "/_protected/clients/$clientId/pages/$pageId/"
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
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: Section) => createSection(pageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`page-${pageId}`] });
    },
  });
  return (
    <CardTile className={cn("w-full aspect-[5/1] md:aspect-auto")}>
      <DialogTemplate
        trigger={<Button>Add Section</Button>}
        content={<SectionForm onSubmit={mutate} disabled={isPending} />}
      />
      ∏
    </CardTile>
  );
}

function Page() {
  const { clientId, pageId } = Route.useParams();
  const { data: client } = useQuery({
    queryKey: [`client-${clientId}`],
    queryFn: () => getClient(clientId),
  });
  const { data: page, isLoading } = useQuery({
    queryKey: [`page-${pageId}`],
    queryFn: () => getPage(pageId),
  });

  const pageTitle = useMemo(() => {
    if (isLoading) {
      return <Spinner />;
    }
    return `${client?.name}'s Page ${
      page?.$createdAt
        ? new Date(page?.$createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })
        : null
    }`;
  }, [client?.name, page?.$createdAt, isLoading]);
  return (
    <div className="flex flex-col gap-4 md:justify-center md:items-center">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      <AddSectionCard pageId={pageId} />
      <div className="flex flex-wrap flex-col gap-4 md:flex-row justify-center items-center ">
        {page?.sections.map((section) => {
          return (
            <SectionTableWrappedWithContext
              key={section.$id}
              section={section}
            />
          );
        })}
      </div>
    </div>
  );
}
