export type StaffStatus = 'active' | 'inactive'

export type StaffMember = {
  id: string
  title: string
  name: string
  username: string
  displayName: string
  status: StaffStatus
}

// Expanded from the original 7-row/1-inactive sample to a realistic mix
// (7 active / 5 inactive) so the Active/Inactive filters actually have
// something to demonstrate on both sides.
export const staffMembers: StaffMember[] = [
  { id: '1', title: 'Miss', name: 'Ava Green', username: 'agre@test2.com', displayName: 'Ava Green', status: 'active' },
  { id: '2', title: 'Dr', name: 'Jennie Henderson', username: 'jhen@test2.com', displayName: 'Jennie Henderson', status: 'active' },
  { id: '3', title: 'Dr', name: 'Carl Hobbs', username: 'chob@test2.com', displayName: 'Carl Hobbs', status: 'inactive' },
  { id: '4', title: 'Dr', name: 'Alison Rowan', username: 'arow@test2.com', displayName: 'Alison Rowan', status: 'active' },
  { id: '5', title: '-', name: 'Louisa Sharp', username: 'lsha@test2.com', displayName: 'Louisa Sharp', status: 'active' },
  { id: '6', title: 'Dr', name: 'Eddie Smith', username: 'esmi@test2.com', displayName: 'Eddie Smith', status: 'inactive' },
  { id: '7', title: 'Mr', name: 'Oliver Weiss', username: 'owei@test2.com', displayName: 'Oliver Weiss', status: 'active' },
  { id: '8', title: 'Mrs', name: 'Priya Kapoor', username: 'pkap@test2.com', displayName: 'Priya Kapoor', status: 'active' },
  { id: '9', title: 'Ms', name: 'Grace Mitchell', username: 'gmit@test2.com', displayName: 'Grace Mitchell', status: 'inactive' },
  { id: '10', title: 'Dr', name: 'Samuel Osei', username: 'sose@test2.com', displayName: 'Samuel Osei', status: 'active' },
  { id: '11', title: 'Mr', name: 'Daniel Fitzgerald', username: 'dfit@test2.com', displayName: 'Daniel Fitzgerald', status: 'inactive' },
  { id: '12', title: 'Miss', name: 'Chloe Bennett', username: 'cben@test2.com', displayName: 'Chloe Bennett', status: 'inactive' },
]
