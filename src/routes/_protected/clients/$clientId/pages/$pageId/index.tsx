import CardTile from "@/components/CardTile";
import { SectionTableWrappedWithContext } from "@/components/SectionTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { createSection } from "@/lib/appwrite/mutations";
import { getClient, getPage } from "@/lib/appwrite/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

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
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => createSection(pageId, name),
    onSuccess: () => {
      setShowForm(false);
      setName("");
      queryClient.invalidateQueries({ queryKey: [`page-${pageId}`] });
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };
  return (
    <CardTile className="w-full aspect-[5/1]">
      {!showForm ? (
        <Button disabled={isPending} onClick={() => setShowForm(true)}>
          Add Section
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" disabled={isPending}>
            Add Section
          </Button>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
        </form>
      )}
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
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{pageTitle}</h1>
      <AddSectionCard pageId={pageId} />
      {page?.sections.map((section) => {
        return (
          <SectionTableWrappedWithContext key={section.$id} section={section} />
        );
      })}
    </div>
  );
}
