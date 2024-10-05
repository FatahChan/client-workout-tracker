import CardTile from '@/components/CardTile'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <>
      <Link to="/clients">
        <CardTile>
          <h3 className="text-lg font-bold">Clients</h3>
        </CardTile>
      </Link>
    </>
  )
}
