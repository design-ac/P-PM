import type { Activity } from '../data/activities'
import type { StaffGroup } from '../data/staffGroups'
import type { StaffRole } from '../data/roles'

export type RoleSource = { type: 'direct' } | { type: 'group'; group: StaffGroup }
export type EffectiveRole = { role: StaffRole; sources: RoleSource[] }

export type ActivitySource =
  | { type: 'direct' }
  | { type: 'group-direct'; group: StaffGroup }
  | { type: 'role'; role: StaffRole; group?: StaffGroup }
export type EffectiveActivity = { activity: Activity; sources: ActivitySource[] }

export type PermissionData = {
  staffRoles: StaffRole[]
  activities: Activity[]
  staffGroups: StaffGroup[]
  groupMemberships: Record<string, Set<string>> // staffId -> groupIds
  directRoleAssignments: Record<string, Set<string>> // staffId -> roleIds
  directMemberActivityAssignments: Record<string, Set<string>> // staffId -> activityIds
  groupRoleAssignments: Record<string, Set<string>> // groupId -> roleIds
  groupActivityAssignments: Record<string, Set<string>> // groupId -> activityIds
  roleActivityAssignments: Record<string, Set<string>> // roleId -> activityIds
}

// Effective roles for a staff member: everything assigned via a Staff
// Group they belong to, plus anything assigned directly to them. Grouped
// by role ID first — a role either appears once with a list of sources, or
// not at all; it never appears twice for the same member.
export function getEffectiveRolesForMember(staffId: string, data: PermissionData): EffectiveRole[] {
  const byRoleId = new Map<string, EffectiveRole>()
  const roleLookup = new Map(data.staffRoles.map((role) => [role.id, role]))
  const groupLookup = new Map(data.staffGroups.map((group) => [group.id, group]))

  const addSource = (roleId: string, source: RoleSource) => {
    const role = roleLookup.get(roleId)
    if (!role) return
    const existing = byRoleId.get(roleId)
    if (existing) existing.sources.push(source)
    else byRoleId.set(roleId, { role, sources: [source] })
  }

  const groupIds = data.groupMemberships[staffId] ?? new Set<string>()
  groupIds.forEach((groupId) => {
    const group = groupLookup.get(groupId)
    if (!group) return
    const roleIds = data.groupRoleAssignments[groupId] ?? new Set<string>()
    roleIds.forEach((roleId) => addSource(roleId, { type: 'group', group }))
  })

  const directRoleIds = data.directRoleAssignments[staffId] ?? new Set<string>()
  directRoleIds.forEach((roleId) => addSource(roleId, { type: 'direct' }))

  return Array.from(byRoleId.values()).sort((a, b) => a.role.name.localeCompare(b.role.name))
}

// Effective activities for a staff member: activities granted by every
// effective role (tagged with how that role reached them), activities a
// Staff Group grants directly, and activities assigned directly to the
// member. Grouped by activity ID first, same dedupe rule as roles.
export function getEffectiveActivitiesForMember(staffId: string, data: PermissionData): EffectiveActivity[] {
  const byActivityId = new Map<string, EffectiveActivity>()
  const activityLookup = new Map(data.activities.map((activity) => [activity.id, activity]))
  const groupLookup = new Map(data.staffGroups.map((group) => [group.id, group]))

  const addSource = (activityId: string, source: ActivitySource) => {
    const activity = activityLookup.get(activityId)
    if (!activity) return
    const existing = byActivityId.get(activityId)
    if (existing) existing.sources.push(source)
    else byActivityId.set(activityId, { activity, sources: [source] })
  }

  const directActivityIds = data.directMemberActivityAssignments[staffId] ?? new Set<string>()
  directActivityIds.forEach((activityId) => addSource(activityId, { type: 'direct' }))

  const effectiveRoles = getEffectiveRolesForMember(staffId, data)
  effectiveRoles.forEach(({ role, sources }) => {
    const activityIds = data.roleActivityAssignments[role.id] ?? new Set<string>()
    activityIds.forEach((activityId) => {
      sources.forEach((roleSource) => {
        addSource(activityId, { type: 'role', role, group: roleSource.type === 'group' ? roleSource.group : undefined })
      })
    })
  })

  const groupIds = data.groupMemberships[staffId] ?? new Set<string>()
  groupIds.forEach((groupId) => {
    const group = groupLookup.get(groupId)
    if (!group) return
    const activityIds = data.groupActivityAssignments[groupId] ?? new Set<string>()
    activityIds.forEach((activityId) => addSource(activityId, { type: 'group-direct', group }))
  })

  return Array.from(byActivityId.values()).sort((a, b) => a.activity.name.localeCompare(b.activity.name))
}

// Effective activities for a Staff Group itself: its own direct activities,
// plus activities granted by every role assigned to the group.
export function getEffectiveActivitiesForGroup(
  groupId: string,
  data: Pick<PermissionData, 'staffRoles' | 'activities' | 'groupRoleAssignments' | 'groupActivityAssignments' | 'roleActivityAssignments'>,
): EffectiveActivity[] {
  const byActivityId = new Map<string, EffectiveActivity>()
  const activityLookup = new Map(data.activities.map((activity) => [activity.id, activity]))
  const roleLookup = new Map(data.staffRoles.map((role) => [role.id, role]))

  const addSource = (activityId: string, source: ActivitySource) => {
    const activity = activityLookup.get(activityId)
    if (!activity) return
    const existing = byActivityId.get(activityId)
    if (existing) existing.sources.push(source)
    else byActivityId.set(activityId, { activity, sources: [source] })
  }

  const directActivityIds = data.groupActivityAssignments[groupId] ?? new Set<string>()
  directActivityIds.forEach((activityId) => addSource(activityId, { type: 'direct' }))

  const roleIds = data.groupRoleAssignments[groupId] ?? new Set<string>()
  roleIds.forEach((roleId) => {
    const role = roleLookup.get(roleId)
    if (!role) return
    const activityIds = data.roleActivityAssignments[roleId] ?? new Set<string>()
    activityIds.forEach((activityId) => addSource(activityId, { type: 'role', role }))
  })

  return Array.from(byActivityId.values()).sort((a, b) => a.activity.name.localeCompare(b.activity.name))
}
