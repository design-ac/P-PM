import { useMemo, useState } from 'react'
import { AppShell } from './layouts/AppShell'
import { createInitialRoleAssignments } from './data/roleAssignments'
import { staffRoles } from './data/roles'
import { staffMembers as initialStaffMembers, type StaffMember } from './data/staff'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { RolesPage } from './pages/RolesPage'
import { StaffGroupsPage } from './pages/StaffGroupsPage'
import { StaffMemberDetailsPage } from './pages/StaffMemberDetailsPage'
import { StaffMemberRolesPage } from './pages/StaffMemberRolesPage'
import { StaffMembersPage } from './pages/StaffMembersPage'
import type { Route } from './types/route'

const RBAC_CHILD_LABELS: Record<string, string> = {
  'staff-member-roles': 'Staff member roles',
  roles: 'Roles',
  activities: 'Activities',
  'role-mapping': 'Role mapping',
}

function App() {
  const [route, setRoute] = useState<Route>({ section: 'staff-members', statusFilter: 'all', selectedStaffId: null })
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffMembers)
  // Lifted above StaffMembersPage so search survives navigating to the
  // details screen and back (StaffMembersPage unmounts while a staff
  // member's details are open).
  const [query, setQuery] = useState('')

  // Lifted above StaffMembersPage so an edit survives navigating away and
  // back (StaffMembersPage unmounts when another section is selected).
  const staffCounts = useMemo(
    () => ({
      total: staffMembers.length,
      active: staffMembers.filter((member) => member.status === 'active').length,
      inactive: staffMembers.filter((member) => member.status === 'inactive').length,
    }),
    [staffMembers],
  )

  const updateStaffMember = (updated: StaffMember) => {
    setStaffMembers((prev) => prev.map((member) => (member.id === updated.id ? updated : member)))
  }

  // Lifted above StaffMemberRolesPage so toggled assignments survive
  // navigating away and back (that page unmounts when another section is selected).
  const [roleAssignments, setRoleAssignments] = useState<Record<string, Set<string>>>(createInitialRoleAssignments)

  const toggleRoleAssignment = (staffId: string, roleId: string) => {
    setRoleAssignments((prev) => {
      const current = new Set(prev[staffId] ?? [])
      if (current.has(roleId)) current.delete(roleId)
      else current.add(roleId)
      return { ...prev, [staffId]: current }
    })
  }

  const selectedStaffMember =
    route.section === 'staff-members' && route.selectedStaffId
      ? staffMembers.find((member) => member.id === route.selectedStaffId)
      : undefined

  return (
    <AppShell route={route} onNavigate={setRoute} staffCounts={staffCounts}>
      {route.section === 'staff-members' ? (
        selectedStaffMember ? (
          <StaffMemberDetailsPage member={selectedStaffMember} onBack={() => setRoute({ ...route, selectedStaffId: null })} />
        ) : (
          <StaffMembersPage
            staffMembers={staffMembers}
            statusFilter={route.statusFilter}
            onStatusFilterChange={(statusFilter) => setRoute({ ...route, statusFilter })}
            onUpdateMember={updateStaffMember}
            query={query}
            onQueryChange={setQuery}
            onSelectMember={(member) => setRoute({ ...route, selectedStaffId: member.id })}
          />
        )
      ) : null}
      {route.section === 'security-rbac' ? (
        route.child === 'roles' ? (
          <RolesPage />
        ) : route.child === 'activities' ? (
          <ActivitiesPage />
        ) : route.child === 'staff-member-roles' ? (
          <StaffMemberRolesPage
            staffMembers={staffMembers}
            roles={staffRoles}
            assignments={roleAssignments}
            onToggleAssignment={toggleRoleAssignment}
          />
        ) : (
          <PlaceholderPage title={route.child ? RBAC_CHILD_LABELS[route.child] : 'Security & RBAC'} />
        )
      ) : null}
      {route.section === 'staff-groups' ? <StaffGroupsPage /> : null}
    </AppShell>
  )
}

export default App
