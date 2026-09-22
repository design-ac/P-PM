import { Breadcrumbs, Button, DataTable, Footer, type DataTableColumn } from 'design-system-project'
import { Add } from 'iqons-react'
import { useMemo, useState } from 'react'
import { AssignItemsModal } from '../components/AssignItemsModal'
import { EditStaffMemberModal } from '../components/EditStaffMemberModal'
import { RowActionsMenu } from '../components/RowActionsMenu'
import { RowInfoModal } from '../components/RowInfoModal'
import { activitySourceDescriptors, roleSourceDescriptors } from '../components/SourceChips'
import { StaffMemberBanner } from '../components/StaffMemberBanner'
import { Tabs } from '../components/Tabs'
import type { Activity } from '../data/activities'
import type { StaffGroup } from '../data/staffGroups'
import type { StaffMember } from '../data/staff'
import type { StaffRole } from '../data/roles'
import { getEffectiveActivitiesForMember, getEffectiveRolesForMember, type EffectiveActivity, type EffectiveRole } from '../logic/permissions'

type Tab = 'roles' | 'activities' | 'groups'

type StaffMemberDetailsPageProps = {
  member: StaffMember
  staffRoles: StaffRole[]
  activities: Activity[]
  staffGroups: StaffGroup[]
  groupMemberships: Record<string, Set<string>>
  directRoleAssignments: Record<string, Set<string>>
  directMemberActivityAssignments: Record<string, Set<string>>
  groupRoleAssignments: Record<string, Set<string>>
  groupActivityAssignments: Record<string, Set<string>>
  roleActivityAssignments: Record<string, Set<string>>
  onToggleDirectRole: (staffId: string, roleId: string) => void
  onToggleDirectActivity: (staffId: string, activityId: string) => void
  onNavigateToGroup: (groupId: string) => void
  onUpdateMember: (member: StaffMember) => void
  onBack: () => void
}

// Reworked per the RBAC proposal — this used to render the exact same
// generic role list for every staff member (RolesTable), not connected to
// any real assignment data. Now shows tabs of *effective* permissions,
// computed by the shared pure functions in logic/permissions.ts. Each
// row's Source(s) (Direct / Via Staff Group: X / Via Role: X) live in the
// row's "Get info" panel rather than their own column.
export function StaffMemberDetailsPage({
  member,
  staffRoles,
  activities,
  staffGroups,
  groupMemberships,
  directRoleAssignments,
  directMemberActivityAssignments,
  groupRoleAssignments,
  groupActivityAssignments,
  roleActivityAssignments,
  onToggleDirectRole,
  onToggleDirectActivity,
  onNavigateToGroup,
  onUpdateMember,
  onBack,
}: StaffMemberDetailsPageProps) {
  const [tab, setTab] = useState<Tab>('roles')
  const [assigningRoles, setAssigningRoles] = useState(false)
  const [assigningActivities, setAssigningActivities] = useState(false)
  const [infoRole, setInfoRole] = useState<EffectiveRole | null>(null)
  const [infoActivity, setInfoActivity] = useState<EffectiveActivity | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const memberLabel = member.title && member.title !== '-' ? `${member.title}. ${member.name}` : member.name

  const permissionData = { staffRoles, activities, staffGroups, groupMemberships, directRoleAssignments, directMemberActivityAssignments, groupRoleAssignments, groupActivityAssignments, roleActivityAssignments }

  const effectiveRoles = useMemo(() => getEffectiveRolesForMember(member.id, permissionData), [member.id, permissionData])
  const effectiveActivities = useMemo(() => getEffectiveActivitiesForMember(member.id, permissionData), [member.id, permissionData])
  const directRoleIds = directRoleAssignments[member.id] ?? new Set<string>()
  const directActivityIds = directMemberActivityAssignments[member.id] ?? new Set<string>()

  const roleColumns: DataTableColumn<EffectiveRole>[] = [
    { key: 'code', header: 'Code', render: (row) => row.role.code },
    { key: 'name', header: 'Name', render: (row) => row.role.name },
    { key: 'description', header: 'Description', render: (row) => row.role.description },
    { key: 'activityCount', header: 'Activities', render: (row) => String(roleActivityAssignments[row.role.id]?.size ?? 0) },
  ]

  const activityColumns: DataTableColumn<EffectiveActivity>[] = [
    { key: 'code', header: 'Code', render: (row) => row.activity.code },
    { key: 'name', header: 'Name', render: (row) => row.activity.name },
    { key: 'description', header: 'Description', render: (row) => row.activity.description },
    { key: 'module', header: 'Module', render: (row) => row.activity.module },
  ]

  const memberGroupIds = groupMemberships[member.id] ?? new Set<string>()
  const memberGroups = useMemo(() => staffGroups.filter((group) => memberGroupIds.has(group.id)), [staffGroups, memberGroupIds])

  const groupColumns: DataTableColumn<StaffGroup>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'creationDate', header: 'Creation date' },
  ]

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex shrink-0 flex-col gap-6 pb-6">
        <Breadcrumbs items={[{ label: 'Staff members', onClick: onBack }, { label: memberLabel }]} />
        <StaffMemberBanner member={member} onEdit={() => setIsEditing(true)} />
        <div className="h-px w-full bg-other-divider" />
      </div>

      <div className="shrink-0 pb-4">
        <Tabs
          tabs={[
            { value: 'roles', label: 'Roles' },
            { value: 'activities', label: 'Activities' },
            { value: 'groups', label: 'Staff groups' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'roles' ? (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DataTable
              columns={roleColumns}
              rows={effectiveRoles}
              getRowKey={(row) => row.role.id}
              emptyMessage={`${memberLabel} has no roles yet — directly or via a Staff Group.`}
              renderRowActions={(row) => {
                const removable = row.sources.some((source) => source.type === 'direct')
                return (
                  <RowActionsMenu
                    ariaLabel={`${row.role.name} actions`}
                    items={[
                      { label: 'Get info', onClick: () => setInfoRole(row) },
                      {
                        label: 'Remove',
                        onClick: () => onToggleDirectRole(member.id, row.role.id),
                        disabled: !removable,
                        title: removable ? undefined : 'Inherited via a Staff Group — remove it from the group, not here',
                      },
                    ]}
                  />
                )
              }}
            />
          </div>
          <Footer
            rightActions={
              <Button variant="solid" icon={<Add />} onClick={() => setAssigningRoles(true)}>
                Assign role
              </Button>
            }
          />
        </>
      ) : null}

      {tab === 'activities' ? (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DataTable
              columns={activityColumns}
              rows={effectiveActivities}
              getRowKey={(row) => row.activity.id}
              emptyMessage={`${memberLabel} has no activities yet — directly, via a role, or via a Staff Group.`}
              renderRowActions={(row) => {
                const removable = row.sources.some((source) => source.type === 'direct')
                return (
                  <RowActionsMenu
                    ariaLabel={`${row.activity.name} actions`}
                    items={[
                      { label: 'Get info', onClick: () => setInfoActivity(row) },
                      {
                        label: 'Remove',
                        onClick: () => onToggleDirectActivity(member.id, row.activity.id),
                        disabled: !removable,
                        title: removable ? undefined : 'Inherited via a role or Staff Group — remove it at its source, not here',
                      },
                    ]}
                  />
                )
              }}
            />
          </div>
          <Footer
            rightActions={
              <Button variant="solid" icon={<Add />} onClick={() => setAssigningActivities(true)}>
                Assign activity
              </Button>
            }
          />
        </>
      ) : null}

      {tab === 'groups' ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <DataTable
            columns={groupColumns}
            rows={memberGroups}
            getRowKey={(row) => row.id}
            emptyMessage={`${memberLabel} doesn't belong to any Staff Groups yet.`}
            onRowClick={(group) => onNavigateToGroup(group.id)}
          />
        </div>
      ) : null}

      {infoRole ? (
        <RowInfoModal
          title={infoRole.role.name}
          sources={roleSourceDescriptors(infoRole.sources)}
          onNavigateToGroup={onNavigateToGroup}
          onClose={() => setInfoRole(null)}
        />
      ) : null}

      {infoActivity ? (
        <RowInfoModal
          title={infoActivity.activity.name}
          sources={activitySourceDescriptors(infoActivity.sources)}
          onNavigateToGroup={onNavigateToGroup}
          onClose={() => setInfoActivity(null)}
        />
      ) : null}

      {isEditing ? (
        <EditStaffMemberModal
          member={member}
          onCancel={() => setIsEditing(false)}
          onSave={(updated) => {
            onUpdateMember(updated)
            setIsEditing(false)
          }}
        />
      ) : null}

      {assigningRoles ? (
        <AssignItemsModal
          title={`Assign roles directly to ${memberLabel}`}
          items={staffRoles.map((role) => ({ id: role.id, label: role.name }))}
          isChecked={(roleId) => directRoleIds.has(roleId)}
          onToggle={(roleId) => onToggleDirectRole(member.id, roleId)}
          onClose={() => setAssigningRoles(false)}
        />
      ) : null}

      {assigningActivities ? (
        <AssignItemsModal
          title={`Assign activities directly to ${memberLabel}`}
          items={activities.map((activity) => ({ id: activity.id, label: activity.name }))}
          isChecked={(activityId) => directActivityIds.has(activityId)}
          onToggle={(activityId) => onToggleDirectActivity(member.id, activityId)}
          onClose={() => setAssigningActivities(false)}
        />
      ) : null}
    </div>
  )
}
