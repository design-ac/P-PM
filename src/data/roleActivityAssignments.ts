import { staffRoles } from './roles'

// Role -> Activities ("Role mapping"). This is what makes "a role is a
// collection of activities" real instead of just a sentence. Same
// Record<id, Set<id>> shape as roleAssignments.ts, edited from the Role
// mapping screen. Plausible seed spread across the 5 activities — no real
// permission model exists anywhere in the app.
const seed: Record<string, string[]> = {
  '1': ['1', '2', '3', '4', '5'], // Administrator
  '2': ['1', '4'], // Assistant
  '3': ['1', '4'], // Clinical Practitioner Access
  '4': ['1', '4'], // Community Nurse
  '5': ['1'], // Federated Practitioner Access
  '6': ['1', '4'], // GP Registrar-A
  '7': ['1', '4'], // GP Registrar-B
  '8': ['1', '4'], // GP Registrar-C
  '9': ['1'], // Health Care Assistant-A
  '10': ['1'], // Health Care Assistant-B
  '11': ['1'], // Health Care Access Role-A
  '12': ['1'], // Health Care Access Role-B
  '13': ['1'], // Health Care Access Role-C
  '14': ['1', '4'], // Health Visitor
  '15': ['1', '2', '3', '4', '5'], // Partner
  '16': ['1', '4'], // Practice Nurse
  '17': ['2', '3'], // Privacy Officer 1
  '18': ['2', '3'], // Privacy Officer 2
  '19': ['1', '4'], // Receptionist
  '20': ['1'], // Social Prescriber
}

export function createInitialRoleActivityAssignments(): Record<string, Set<string>> {
  const assignments: Record<string, Set<string>> = {}
  staffRoles.forEach((role) => {
    assignments[role.id] = new Set(seed[role.id] ?? [])
  })
  return assignments
}
