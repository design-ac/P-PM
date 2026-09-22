import { staffGroups } from './staffGroups'

// Staff Group -> Roles — the primary attachment point in the RBAC
// hierarchy. Editable from a Staff Group's Roles tab (Assignment is always
// "Direct" there). Front desk and Practice managers deliberately share the
// Assistant role so a member of both (Oliver Weiss) demonstrates a role
// reachable via two different groups.
const seed: Record<string, string[]> = {
  '1': ['19', '2'], // Front desk: Receptionist, Assistant
  '2': ['16', '3', '14'], // Clinical team: Practice Nurse, Clinical Practitioner Access, Health Visitor
  '3': ['1', '15', '2'], // Practice managers: Administrator, Partner, Assistant
  '4': ['17'], // IT support: Privacy Officer 1
  '5': ['6'], // On-call weekend: GP Registrar-A
}

export function createInitialGroupRoleAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffGroups.forEach((group) => {
    assignments[group.id] = new Set(seed[group.id] ?? [])
  })
  return assignments
}
