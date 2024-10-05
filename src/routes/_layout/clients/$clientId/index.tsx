import CardTile from '@/components/CardTile'
import DestructiveDailogWarning from '@/components/DestructiveDailogWarning'
import DialogTemplate from '@/components/DialogTamplate'
import ClientForm from '@/components/Forms/ClientForm'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import {
  createPage,
  deleteClient,
  deletePage,
  updateClient,
} from '@/lib/appwrite/mutations'
import { getClient } from '@/lib/appwrite/queries'
import { Client, ClientDocument, PageDocument } from '@/lib/appwrite/types'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_layout/clients/$clientId/')({
  loader: ({ context: { queryClient }, params: { clientId } }) => {
    queryClient.ensureQueryData({
      queryKey: [`client-${clientId}`],
      queryFn: () => getClient(clientId),
    })
  },
  component: ClientPage,
})

function AddPageCard({ clientId }: { clientId: string }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: () => createPage(clientId),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: [`client-${clientId}`] })
      navigate({
        to: '/clients/$clientId/pages/$pageId',
        params: {
          clientId,
          pageId: page.$id,
        },
      })
    },
  })
  return (
    <CardTile>
      <Button disabled={isPending} onClick={() => mutate()}>
        Add Page
      </Button>
    </CardTile>
  )
}

function PageCard({
  clientId,
  page,
}: {
  clientId: string
  page: PageDocument
}) {
  const queryClient = useQueryClient()
  const { mutate: deletePageMutate } = useMutation({
    mutationFn: () => deletePage(page.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`client-${clientId}`] })
    },
  })
  return (
    <CardTile className="relative">
      <DestructiveDailogWarning onConfirm={deletePageMutate}>
        <Button
          variant="destructive"
          className="p-2 w-8 h-8 absolute top-2 right-2"
        >
          <span className="sr-only">Delete</span>
          <Trash size={16} />
        </Button>
      </DestructiveDailogWarning>
      <Button variant={'ghost'} asChild>
        <Link
          to={`/clients/${clientId}/pages/${page.$id}`}
          params={{
            clientId,
            pageId: page.$id,
          }}
          className="w-full h-full flex justify-center items-center"
        >
          {new Date(page.$createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: '2-digit',
          })}
        </Link>
      </Button>
    </CardTile>
  )
}

function ActionsCell({ clientDocument }: { clientDocument: ClientDocument }) {
  const queryClient = useQueryClient()
  const [openForm, setOpenForm] = useState(false)
  const navigate = useNavigate()
  const { mutate: deleteClientMutate } = useMutation({
    mutationFn: () => deleteClient(clientDocument.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`client-${clientDocument.$id}`],
      })
      navigate({ to: '/clients' })
    },
  })
  const { mutate: updateClientMutate } = useMutation({
    mutationFn: (client: Client) => updateClient(clientDocument.$id, client),
    onSuccess: () => {
      setOpenForm(false)
      queryClient.invalidateQueries({
        queryKey: [`client-${clientDocument.$id}`],
      })
    },
  })
  return (
    <div className="flex gap-2 justify-center items-center">
      <DialogTemplate
        open={openForm}
        setOpen={setOpenForm}
        trigger={
          <Button size="sm" className="p-2 w-8 h-8">
            <span className="sr-only">Edit Client</span>
            <Pencil size={16} />
          </Button>
        }
        title="Edit Client"
        description={`Edit information about ${clientDocument.name}`}
        content={
          <ClientForm
            defaultValues={clientDocument}
            onSubmit={updateClientMutate}
            submitButton={
              <DialogClose asChild>
                <Button>Save</Button>
              </DialogClose>
            }
          />
        }
      />

      <DestructiveDailogWarning
        onConfirm={deleteClientMutate}
      ></DestructiveDailogWarning>
    </div>
  )
}

function ClientPage() {
  const { clientId } = Route.useParams()
  const { data } = useSuspenseQuery({
    queryKey: [`client-${clientId}`],
    queryFn: () => getClient(clientId),
  })
  const { name, age, bodyType, goal, pages } = data
  return (
    <>
      <Table className="w-full border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Body Type</TableHead>
            <TableHead>Goal</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{age}</TableCell>
            <TableCell>{bodyType}</TableCell>
            <TableCell>{goal}</TableCell>
            <TableCell>
              <ActionsCell clientDocument={data} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <hr className="my-4" />
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <div className="flex flex-wrap gap-4">
        <AddPageCard clientId={clientId} />
        {pages.map((page) => (
          <PageCard key={page.$id} clientId={clientId} page={page} />
        ))}
      </div>
    </>
  )
}
