import { staffMembers } from './staff'

// Staff Member -> Staff Group(s). Source of truth for group membership
// (read-only for now — no membership-editing UI is designed anywhere, per
// the RBAC proposal). Chloe Bennett (12) is deliberately in zero groups to
// demonstrate the "member has no group" edge case; Oliver Weiss (7) is
// deliberately in two groups that share a role (Front desk + Practice
// managers both grant Assistant) to demonstrate the "same role via two
// groups" dedupe case.
const seed: Record<string, string[]> = {
  '1': ['1'],
  '2': ['2'],
  '3': ['2'],
  '4': ['2', '3'],
  '5': ['1'],
  '6': ['4'],
  '7': ['1', '3'],
  '8': ['2'],
  '9': ['1'],
  '10': ['5'],
  '11': ['4'],
  '12': [],
}

export function createInitialGroupMemberships(): Record<string, Set<string>> {
  const memberships: Record<string, Set<string>> = {}
  staffMembers.forEach((member) => {
    memberships[member.id] = new Set(seed[member.id] ?? [])
  })
  return memberships
}
