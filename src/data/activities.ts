export type Activity = {
  id: string
  code: string
  name: string
  description: string
  module: string
}

// Placeholder activity catalogue — no per-staff-member or per-role activity
// data exists anywhere in the app, so this is a standalone shared list
// (matching the pattern already used for data/roles.ts).
export const activities: Activity[] = [
  { id: '1', code: '12345A', name: 'View staff record', description: 'View a staff member’s profile and contact details.', module: 'Staff' },
  { id: '2', code: '58210B', name: 'Edit staff record', description: 'Update a staff member’s profile fields and status.', module: 'Staff' },
  { id: '3', code: '90417C', name: 'Assign role', description: 'Assign or remove a role from a staff member.', module: 'Security' },
  { id: '4', code: '33821D', name: 'View schedule', description: 'View appointment schedules and availability.', module: 'Scheduling' },
  { id: '5', code: '77102E', name: 'Manage staff groups', description: 'Create, edit or remove staff groups.', module: 'Staff' },
]
