import { useMemo, useState } from 'react'
import { AppShell } from './layouts/AppShell'
import { activities } from './data/activities'
import { createInitialGroupActivityAssignments } from './data/groupActivityAssignments'
import { createInitialGroupMemberships } from './data/groupMemberships'
import { createInitialGroupRoleAssignments } from './data/groupRoleAssignments'
import { createInitialMemberActivityAssignments } from './data/memberActivityAssignments'
import { createInitialRoleActivityAssignments } from './data/roleActivityAssignments'
import { createInitialRoleAssignments } from './data/roleAssignments'
import { staffRoles } from './data/roles'
import { staffGroups } from './data/staffGroups'
import { staffMembers as initialStaffMembers, type StaffMember } from './data/staff'
import { ActivitiesPage } from './pages/ActivitiesPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { RolesPage } from './pages/RolesPage'
import { StaffGroupDetailsPage } from './pages/StaffGroupDetailsPage'
import { StaffGroupsPage } from './pages/StaffGroupsPage'
import { StaffMemberDetailsPage } from './pages/StaffMemberDetailsPage'
import { StaffMemberRolesPage } from './pages/StaffMemberRolesPage'
import { StaffMembersPage } from './pages/StaffMembersPage'
import type { Route } from './types/route'

function toggleInRecord(record: Record<string, Set<string>>, key: string, value: string): Record<string, Set<string>> {
  const current = new Set(record[key] ?? [])
  if (current.has(value)) current.delete(value)
  else current.add(value)
  return { ...record, [key]: current }
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

  // All five RBAC relationship maps are lifted here, same pattern as the
  // original roleAssignments — each survives navigating away and back
  // since the pages that edit them unmount when another section is
  // selected.
  const [roleAssignments, setRoleAssignments] = useState<Record<string, Set<string>>>(createInitialRoleAssignments) // staffId -> roleIds (direct)
  const [memberActivityAssignments, setMemberActivityAssignments] = useState<Record<string, Set<string>>>(createInitialMemberActivityAssignments) // staffId -> activityIds (direct)
  const [groupMemberships] = useState<Record<string, Set<string>>>(createInitialGroupMemberships) // staffId -> groupIds (read-only, no editing UI is designed)
  const [groupRoleAssignments, setGroupRoleAssignments] = useState<Record<string, Set<string>>>(createInitialGroupRoleAssignments) // groupId -> roleIds
  const [groupActivityAssignments, setGroupActivityAssignments] = useState<Record<string, Set<string>>>(createInitialGroupActivityAssignments) // groupId -> activityIds (direct)
  // roleId -> activityIds ("Role mapping") — read-only seed data for now; no
  // editing UI exists since the Role mapping screen was removed.
  const [roleActivityAssignments] = useState<Record<string, Set<string>>>(createInitialRoleActivityAssignments)

  const toggleRoleAssignment = (staffId: string, roleId: string) => setRoleAssignments((prev) => toggleInRecord(prev, staffId, roleId))
  const toggleMemberActivityAssignment = (staffId: string, activityId: string) => setMemberActivityAssignments((prev) => toggleInRecord(prev, staffId, activityId))
  const toggleGroupRoleAssignment = (groupId: string, roleId: string) => setGroupRoleAssignments((prev) => toggleInRecord(prev, groupId, roleId))
  const toggleGroupActivityAssignment = (groupId: string, activityId: string) => setGroupActivityAssignments((prev) => toggleInRecord(prev, groupId, activityId))

  const selectedStaffMember =
    route.section === 'staff-members' && route.selectedStaffId
      ? staffMembers.find((member) => member.id === route.selectedStaffId)
      : undefined

  const selectedStaffGroup =
    route.section === 'staff-groups' && route.selectedGroupId
      ? staffGroups.find((group) => group.id === route.selectedGroupId)
      : undefined

  const navigateToGroup = (groupId: string) => setRoute({ section: 'staff-groups', selectedGroupId: groupId })
  const navigateToStaffMember = (staffId: string) => setRoute({ section: 'staff-members', statusFilter: 'all', selectedStaffId: staffId })

  return (
    <AppShell route={route} onNavigate={setRoute} staffCounts={staffCounts}>
      {route.section === 'staff-members' ? (
        selectedStaffMember ? (
          <StaffMemberDetailsPage
            member={selectedStaffMember}
            staffRoles={staffRoles}
            activities={activities}
            staffGroups={staffGroups}
            groupMemberships={groupMemberships}
            directRoleAssignments={roleAssignments}
            directMemberActivityAssignments={memberActivityAssignments}
            groupRoleAssignments={groupRoleAssignments}
            groupActivityAssignments={groupActivityAssignments}
            roleActivityAssignments={roleActivityAssignments}
            onToggleDirectRole={toggleRoleAssignment}
            onToggleDirectActivity={toggleMemberActivityAssignment}
            onNavigateToGroup={navigateToGroup}
            onUpdateMember={updateStaffMember}
            onBack={() => setRoute({ ...route, selectedStaffId: null })}
          />
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
          <RolesPage activities={activities} roleActivityAssignments={roleActivityAssignments} />
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
          <PlaceholderPage title="Security & RBAC" />
        )
      ) : null}
      {route.section === 'staff-groups' ? (
        selectedStaffGroup ? (
          <StaffGroupDetailsPage
            group={selectedStaffGroup}
            staffRoles={staffRoles}
            activities={activities}
            staffMembers={staffMembers}
            groupRoleAssignments={groupRoleAssignments}
            groupActivityAssignments={groupActivityAssignments}
            roleActivityAssignments={roleActivityAssignments}
            groupMemberships={groupMemberships}
            onToggleGroupRole={toggleGroupRoleAssignment}
            onToggleGroupActivity={toggleGroupActivityAssignment}
            onBack={() => setRoute({ ...route, selectedGroupId: null })}
            onSelectMember={navigateToStaffMember}
          />
        ) : (
          <StaffGroupsPage
            staffMembers={staffMembers}
            groupRoleAssignments={groupRoleAssignments}
            groupMemberships={groupMemberships}
            onSelectGroup={(groupId) => setRoute({ section: 'staff-groups', selectedGroupId: groupId })}
          />
        )
      ) : null}
    </AppShell>
  )
}

export default App
