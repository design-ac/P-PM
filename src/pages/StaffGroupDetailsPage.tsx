import { Breadcrumbs, Button, DataTable, Footer, type DataTableColumn } from 'design-system-project'
import { Add } from 'iqons-react'
import { useMemo, useState } from 'react'
import { AssignItemsModal } from '../components/AssignItemsModal'
import { RowActionsMenu } from '../components/RowActionsMenu'
import { RowInfoModal } from '../components/RowInfoModal'
import { activitySourceDescriptors, type SourceDescriptor } from '../components/SourceChips'
import { Tabs } from '../components/Tabs'
import type { Activity } from '../data/activities'
import type { StaffGroup } from '../data/staffGroups'
import type { StaffMember } from '../data/staff'
import type { StaffRole } from '../data/roles'
import { getEffectiveActivitiesForGroup, type EffectiveActivity } from '../logic/permissions'

type Tab = 'roles' | 'activities' | 'members'

type StaffGroupDetailsPageProps = {
  group: StaffGroup
  staffRoles: StaffRole[]
  activities: Activity[]
  staffMembers: StaffMember[]
  groupRoleAssignments: Record<string, Set<string>>
  groupActivityAssignments: Record<string, Set<string>>
  roleActivityAssignments: Record<string, Set<string>>
  groupMemberships: Record<string, Set<string>>
  onToggleGroupRole: (groupId: string, roleId: string) => void
  onToggleGroupActivity: (groupId: string, activityId: string) => void
  onBack: () => void
  onSelectMember: (staffId: string) => void
}

// New screen — the RBAC proposal's biggest structural gap: Staff Groups
// previously had no drill-in at all, even though they're the crux of the
// hierarchy (Roles attach here; Staff Members inherit through here).
export function StaffGroupDetailsPage({
  group,
  staffRoles,
  activities,
  staffMembers,
  groupRoleAssignments,
  groupActivityAssignments,
  roleActivityAssignments,
  groupMemberships,
  onToggleGroupRole,
  onToggleGroupActivity,
  onBack,
  onSelectMember,
}: StaffGroupDetailsPageProps) {
  const [tab, setTab] = useState<Tab>('roles')
  const [assigningRoles, setAssigningRoles] = useState(false)
  const [assigningActivities, setAssigningActivities] = useState(false)
  const [infoRole, setInfoRole] = useState<StaffRole | null>(null)
  const [infoActivity, setInfoActivity] = useState<EffectiveActivity | null>(null)

  const assignedRoleIds = groupRoleAssignments[group.id] ?? new Set<string>()
  const assignedRoles = useMemo(() => staffRoles.filter((role) => assignedRoleIds.has(role.id)), [staffRoles, assignedRoleIds])

  const effectiveActivities = useMemo(
    () => getEffectiveActivitiesForGroup(group.id, { staffRoles, activities, groupRoleAssignments, groupActivityAssignments, roleActivityAssignments }),
    [group.id, staffRoles, activities, groupRoleAssignments, groupActivityAssignments, roleActivityAssignments],
  )

  const members = useMemo(
    () => staffMembers.filter((member) => groupMemberships[member.id]?.has(group.id)),
    [staffMembers, groupMemberships, group.id],
  )

  const roleColumns: DataTableColumn<StaffRole>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
    { key: 'activityCount', header: 'Activities', render: (role) => String(roleActivityAssignments[role.id]?.size ?? 0) },
  ]

  const memberColumns: DataTableColumn<StaffMember>[] = [
    { key: 'title', header: 'Title' },
    { key: 'name', header: 'Name' },
    { key: 'username', header: 'Username' },
    { key: 'displayName', header: 'Display name' },
  ]

  const activityColumns: DataTableColumn<EffectiveActivity>[] = [
    { key: 'code', header: 'Code', render: (row) => row.activity.code },
    { key: 'name', header: 'Name', render: (row) => row.activity.name },
    { key: 'description', header: 'Description', render: (row) => row.activity.description },
    { key: 'module', header: 'Module', render: (row) => row.activity.module },
  ]

  // A group's own assigned roles are always "Direct" (this is the
  // attachment point in the hierarchy) — a constant single-source
  // descriptor for the Get info panel, same shape as the computed ones.
  const directSource: SourceDescriptor[] = [{ label: 'Direct', variant: 'direct' }]

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex shrink-0 flex-col gap-6 pb-6">
        <Breadcrumbs items={[{ label: 'Staff groups', onClick: onBack }, { label: group.name }]} />
        <div className="h-px w-full bg-other-divider" />
      </div>

      <div className="shrink-0 pb-4">
        <Tabs
          tabs={[
            { value: 'roles', label: 'Roles' },
            { value: 'activities', label: 'Activities' },
            { value: 'members', label: 'Members' },
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
              rows={assignedRoles}
              getRowKey={(row) => row.id}
              emptyMessage="No roles are assigned to this group yet."
              renderRowActions={(role) => (
                <RowActionsMenu
                  ariaLabel={`${role.name} actions`}
                  items={[
                    { label: 'Get info', onClick: () => setInfoRole(role) },
                    { label: 'Remove', onClick: () => onToggleGroupRole(group.id, role.id) },
                  ]}
                />
              )}
            />
          </div>
          <Footer rightActions={<Button variant="solid" icon={<Add />} onClick={() => setAssigningRoles(true)}>Assign role</Button>} />
        </>
      ) : null}

      {tab === 'activities' ? (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DataTable
              columns={activityColumns}
              rows={effectiveActivities}
              getRowKey={(row) => row.activity.id}
              emptyMessage="This group has no activities yet — directly or via a role."
              renderRowActions={(row) => {
                const removable = row.sources.some((source) => source.type === 'direct')
                return (
                  <RowActionsMenu
                    ariaLabel={`${row.activity.name} actions`}
                    items={[
                      { label: 'Get info', onClick: () => setInfoActivity(row) },
                      {
                        label: 'Remove',
                        onClick: () => onToggleGroupActivity(group.id, row.activity.id),
                        disabled: !removable,
                        title: removable ? undefined : 'Inherited via a role — remove it from the role, not here',
                      },
                    ]}
                  />
                )
              }}
            />
          </div>
          <Footer rightActions={<Button variant="solid" icon={<Add />} onClick={() => setAssigningActivities(true)}>Assign activity</Button>} />
        </>
      ) : null}

      {tab === 'members' ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <DataTable
            columns={memberColumns}
            rows={members}
            getRowKey={(row) => row.id}
            emptyMessage="No staff members belong to this group yet."
            onRowClick={(member) => onSelectMember(member.id)}
          />
        </div>
      ) : null}

      {infoRole ? <RowInfoModal title={infoRole.name} sources={directSource} onClose={() => setInfoRole(null)} /> : null}

      {infoActivity ? (
        <RowInfoModal title={infoActivity.activity.name} sources={activitySourceDescriptors(infoActivity.sources)} onClose={() => setInfoActivity(null)} />
      ) : null}

      {assigningRoles ? (
        <AssignItemsModal
          title={`Assign roles to ${group.name}`}
          items={staffRoles.map((role) => ({ id: role.id, label: role.name }))}
          isChecked={(roleId) => assignedRoleIds.has(roleId)}
          onToggle={(roleId) => onToggleGroupRole(group.id, roleId)}
          onClose={() => setAssigningRoles(false)}
        />
      ) : null}

      {assigningActivities ? (
        <AssignItemsModal
          title={`Assign activities directly to ${group.name}`}
          items={activities.map((activity) => ({ id: activity.id, label: activity.name }))}
          isChecked={(activityId) => (groupActivityAssignments[group.id] ?? new Set()).has(activityId)}
          onToggle={(activityId) => onToggleGroupActivity(group.id, activityId)}
          onClose={() => setAssigningActivities(false)}
        />
      ) : null}
    </div>
  )
}
