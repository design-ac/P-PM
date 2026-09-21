import { PageHeader } from 'design-system-project'
import { RolesTable } from '../components/RolesTable'

// Reached via Security & RBAC > Roles (AdminHub 67:5271) — same table as the
// Staff Member Details roles tab, just under a plain page title instead of
// a breadcrumb, since this isn't scoped to one staff member.
export function RolesPage() {
  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="shrink-0 pb-6">
        <PageHeader title="Roles" />
      </div>

      <RolesTable />
    </div>
  )
}
