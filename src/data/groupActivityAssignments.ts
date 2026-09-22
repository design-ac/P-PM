import { staffGroups } from './staffGroups'

// Staff Group -> Activities assigned directly (i.e. not via a Role).
// On-call weekend's direct "View schedule" is deliberately redundant with
// what GP Registrar-A already grants that group via a role, to demonstrate
// the "already granted another way" edge case.
const seed: Record<string, string[]> = {
  '4': ['5'], // IT support: Manage staff groups (direct)
  '5': ['4'], // On-call weekend: View schedule (direct, redundant with GP Registrar-A)
}

export function createInitialGroupActivityAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffGroups.forEach((group) => {
    assignments[group.id] = new Set(seed[group.id] ?? [])
  })
  return assignments
}
