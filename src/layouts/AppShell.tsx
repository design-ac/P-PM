import { Admin, Shield, User, UserGroup } from 'iqons-react'
import { NavigationDrawer, Rail, type NavigationDrawerSection } from 'design-system-project'
import type { ReactNode } from 'react'
import type { Route, RbacChild } from '../types/route'

type StaffCounts = { total: number; active: number; inactive: number }

type AppShellProps = {
  route: Route
  onNavigate: (route: Route) => void
  staffCounts: StaffCounts
  children: ReactNode
}

const RBAC_CHILDREN: Array<{ id: RbacChild; label: string }> = [
  { id: 'staff-member-roles', label: 'Staff member roles' },
  { id: 'roles', label: 'Roles' },
  { id: 'activities', label: 'Activities' },
  { id: 'role-mapping', label: 'Role mapping' },
]

export function AppShell({ route, onNavigate, staffCounts, children }: AppShellProps) {
  const sections: NavigationDrawerSection[] = [
    {
      id: 'staff-members',
      icon: <User />,
      label: 'Staff Members',
      count: staffCounts.total,
      // Navigating via the drawer always returns to the list (exits any open details screen).
      onSelect: () => onNavigate({ section: 'staff-members', statusFilter: 'all', selectedStaffId: null }),
      children: [
        {
          id: 'active',
          label: 'Active',
          value: staffCounts.active,
          selected: route.section === 'staff-members' && route.statusFilter === 'active',
          onSelect: () => onNavigate({ section: 'staff-members', statusFilter: 'active', selectedStaffId: null }),
        },
        {
          id: 'inactive',
          label: 'Inactive',
          value: staffCounts.inactive,
          selected: route.section === 'staff-members' && route.statusFilter === 'inactive',
          onSelect: () => onNavigate({ section: 'staff-members', statusFilter: 'inactive', selectedStaffId: null }),
        },
      ],
    },
    {
      id: 'security-rbac',
      icon: <Shield />,
      label: 'Security & RBAC',
      // No roles/activities dataset exists yet — kept as the original
      // reference count rather than inventing one.
      count: 1250,
      children: RBAC_CHILDREN.map((child) => ({
        id: child.id,
        label: child.label,
        selected: route.section === 'security-rbac' && route.child === child.id,
        onSelect: () => onNavigate({ section: 'security-rbac', child: child.id }),
      })),
    },
    {
      id: 'staff-groups',
      icon: <UserGroup />,
      label: 'Staff Groups',
      count: 1250,
      onSelect: () => onNavigate({ section: 'staff-groups' }),
    },
  ]

  return (
    <div className="flex h-screen">
      <Rail userInitials="OP" onHome={() => onNavigate({ section: 'staff-members', statusFilter: 'all', selectedStaffId: null })} />
      <NavigationDrawer
        icon={<Admin />}
        title="Admin Hub"
        subtitle="Staff Management"
        sections={sections}
        selectedSectionId={route.section}
        defaultExpandedIds={['staff-members', 'security-rbac']}
      />
      {/* Fixed-height flex container — each page owns its own padding and decides
          what (if anything) scrolls internally, so a page's header/footer can stay
          pinned to the screen while only its middle content area scrolls. */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background-white">{children}</main>
    </div>
  )
}
