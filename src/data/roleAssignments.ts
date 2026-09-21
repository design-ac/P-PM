import { staffMembers } from './staff'
import { staffRoles } from './roles'

// A staff-member -> role-id assignment map. This is seed data for the
// Staff Member Roles matrix (AdminHub 67:5251) — a plausible varied
// starting pattern, not real HR data. Each staff member starts with 2
// roles assigned, deterministically spread across the role list.
export function createInitialRoleAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffMembers.forEach((member, index) => {
    const first = staffRoles[index % staffRoles.length]
    const second = staffRoles[(index + 7) % staffRoles.length]
    assignments[member.id] = new Set([first.id, second.id])
  })
  return assignments
}
