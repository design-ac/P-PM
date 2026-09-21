export type StatusFilter = 'all' | 'active' | 'inactive'

export type RbacChild = 'staff-member-roles' | 'roles' | 'activities' | 'role-mapping'

export type Route =
  // selectedStaffId set = viewing that staff member's details screen;
  // null = viewing the list. Kept on the same route variant (rather than a
  // separate section) so the "Staff Members" nav item and its status filter
  // stay correct and untouched while a details screen is open.
  | { section: 'staff-members'; statusFilter: StatusFilter; selectedStaffId: string | null }
  | { section: 'security-rbac'; child: RbacChild | null }
  | { section: 'staff-groups' }
