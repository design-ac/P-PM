export type StaffGroup = {
  id: string
  code: string
  name: string
  description: string
  creationDate: string
}

// Placeholder staff group catalogue — no group-membership data exists
// anywhere in the app (matching the pattern already used for
// data/roles.ts and data/activities.ts).
export const staffGroups: StaffGroup[] = [
  { id: '1', code: '12345A', name: 'Front desk', description: 'Reception and check-in staff across all locations.', creationDate: '03-Jan-2024' },
  { id: '2', code: '58210B', name: 'Clinical team', description: 'Clinicians and nursing staff providing patient care.', creationDate: '17-Feb-2024' },
  { id: '3', code: '90417C', name: 'Practice managers', description: 'Staff responsible for day-to-day practice operations.', creationDate: '02-Mar-2024' },
  { id: '4', code: '33821D', name: 'IT support', description: 'Staff handling systems, devices and access issues.', creationDate: '21-Apr-2024' },
  { id: '5', code: '77102E', name: 'On-call weekend', description: 'Staff rostered for weekend and out-of-hours cover.', creationDate: '09-Jun-2024' },
]
