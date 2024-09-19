import CardTile from "@/components/CardTile";
import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { createPage } from "@/lib/appwrite/mutations";
import { getClient } from "@/lib/appwrite/queries";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/clients/$clientId/")({
  loader: ({ context: { queryClient }, params: { clientId } }) => {
    queryClient.ensureQueryData({
      queryKey: [`client-${clientId}`],
      queryFn: () => getClient(clientId),
    });
  },
  component: ClientPage,
});

function AddPageCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => createPage(clientId),
    onSuccess: (page) => {
      console.log(page);
      queryClient.invalidateQueries({ queryKey: [`client-${clientId}`] });
      navigate({
        to: "/clients/$clientId/pages/$pageId",
        params: {
          clientId,
          pageId: page.$id,
        },
      });
    },
  });
  return (
    <CardTile>
      <Button disabled={isPending} onClick={() => mutate()}>
        Add Page
      </Button>
    </CardTile>
  );
}

function ClientPage() {
  const { clientId } = Route.useParams();
  const { data } = useSuspenseQuery({
    queryKey: [`client-${clientId}`],
    queryFn: () => getClient(clientId),
  });
  const { name, age, bodyType, goal, pages } = data;
  return (
    <>
      <Table className="w-full border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Body Type</TableHead>
            <TableHead>Goal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{age}</TableCell>
            <TableCell>{bodyType}</TableCell>
            <TableCell>{goal}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <hr className="my-4" />
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <div className="flex flex-wrap gap-4">
        <AddPageCard clientId={clientId} />
        {pages.map((page) => (
          <CardTile key={page.$id}>
            <Button variant={"ghost"} asChild>
              <Link
                to={`/clients/${clientId}/pages/${page.$id}`}
                params={{
                  clientId,
                  pageId: page.$id,
                }}
                className="w-full h-full flex justify-center items-center"
              >
                {new Date(page.$createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "2-digit",
                })}
              </Link>
            </Button>
          </CardTile>
        ))}
      </div>
    </>
  );
}
