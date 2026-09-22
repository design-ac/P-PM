import { staffMembers } from './staff'

// Staff Member -> Activities assigned directly (i.e. not via a Role or a
// Staff Group). Chloe Bennett (12, in zero groups) gets a clean direct-only
// grant. Eddie Smith (6, in IT support) gets a direct "Edit staff record"
// that's deliberately redundant with what Privacy Officer 1 already grants
// him via his group, to demonstrate the "already granted another way" case.
const seed: Record<string, string[]> = {
  '6': ['2'],
  '12': ['5'],
}

export function createInitialMemberActivityAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffMembers.forEach((member) => {
    assignments[member.id] = new Set(seed[member.id] ?? [])
  })
  return assignments
}
