import { staffMembers } from './staff'
import { staffRoles } from './roles'

// A staff-member -> role-id assignment map — the "direct role" path in the
// RBAC hierarchy (staff members can be assigned roles directly, in addition
// to inheriting roles via Staff Group membership). This is seed data for
// the Staff Member Roles matrix (AdminHub 67:5251) — a plausible varied
// starting pattern, not real HR data. Each staff member starts with 2
// roles assigned, deterministically spread across the role list.
export function createInitialRoleAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffMembers.forEach((member, index) => {
    const first = staffRoles[index % staffRoles.length]
    const second = staffRoles[(index + 7) % staffRoles.length]
    assignments[member.id] = new Set([first.id, second.id])
  })
  // Jennie Henderson (2) is in the Clinical team group, which already
  // grants Practice Nurse (16) — assigning it directly too demonstrates the
  // "already granted another way" redundant-grant edge case.
  assignments['2']?.add('16')
  return assignments
}
