import { PageHeader } from 'design-system-project'
import { RolesTable } from '../components/RolesTable'
import type { Activity } from '../data/activities'

type RolesPageProps = {
  activities: Activity[]
  roleActivityAssignments: Record<string, Set<string>>
}

// Reached via Security & RBAC > Roles (AdminHub 67:5271).
export function RolesPage({ activities, roleActivityAssignments }: RolesPageProps) {
  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="shrink-0 pb-6">
        <PageHeader title="Roles" />
      </div>

      <RolesTable activities={activities} roleActivityAssignments={roleActivityAssignments} />
    </div>
  )
}
