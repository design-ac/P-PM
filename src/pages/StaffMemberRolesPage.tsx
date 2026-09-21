import { Button, PageHeader, SearchInput, Text } from 'design-system-project'
import { Fragment, useMemo, useState } from 'react'
import type { StaffRole } from '../data/roles'
import type { StaffMember } from '../data/staff'

type StaffMemberRolesPageProps = {
  staffMembers: StaffMember[]
  roles: StaffRole[]
  assignments: Record<string, Set<string>>
  onToggleAssignment: (staffId: string, roleId: string) => void
}

type Tab = 'current' | 'history'
type Mode = 'view' | 'edit'
type RoleTypeFilter = 'vision' | 'smartcard'

const ROLE_TYPE_OPTIONS: Array<{ value: RoleTypeFilter; label: string }> = [
  { value: 'vision', label: 'Vision roles' },
  { value: 'smartcard', label: 'Smartcard roles' },
]

// Reached via Security & RBAC > Staff member roles. This is a permission
// matrix, not a list table like the other RBAC screens — cells are real
// toggleable state (see App.tsx, which owns and persists roleAssignments
// across navigation), but nothing downstream consumes a change yet since
// no permission system exists to enforce it.
//
// Cross-checked against the dedicated "Security & RBAC" Figma file
// (250:52408) rather than the AdminHub-main-screens one used originally —
// that revealed three things the first pass missed:
//  - the page title is "Staff member roles" (matching the nav label), not
//    the "Security & RBAC" text the other file happened to show here
//  - a role-type heading ("Vision roles" / "Smartcard roles") sits above
//    the matrix, tracking whichever chip is selected
//  - a rotated "Staff members" label runs along the matrix's left edge
//  - a footer holds a legend (filled cell = "assigned {type} roles")
//
// The role-type chips still don't actually filter columns (no such
// classification exists on role data), but they do drive the heading/
// legend text now, which is a real, well-defined connection. "Find" has
// no defined behaviour, so it stays inert. "Role history" has no backing
// data, so it stays a placeholder tab.
//
// View/edit mode (per your request): the grid starts read-only; "Edit" in
// the footer switches it to an editable state where cells become
// toggleable, and the button becomes "Done" to switch back. The two states
// are visually distinct, not just disabled-vs-not: view mode shows plain
// borderless cells (a display grid), edit mode adds cell borders + hover +
// a highlighted primary-colored border around the whole matrix panel.
export function StaffMemberRolesPage({ staffMembers, roles, assignments, onToggleAssignment }: StaffMemberRolesPageProps) {
  const [tab, setTab] = useState<Tab>('current')
  const [mode, setMode] = useState<Mode>('view')
  const [query, setQuery] = useState('')
  const [roleType, setRoleType] = useState<RoleTypeFilter>('vision')

  const filteredStaff = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staffMembers
    return staffMembers.filter((member) => member.name.toLowerCase().includes(q))
  }, [staffMembers, query])

  const roleTypeLabel = ROLE_TYPE_OPTIONS.find((option) => option.value === roleType)?.label ?? ''
  const isEditing = mode === 'edit'

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="shrink-0 pb-6">
        <PageHeader title="Staff member roles" />
      </div>

      <div
        className={[
          'flex min-h-0 flex-1 flex-col gap-4 rounded-lg border p-4 transition-colors',
          isEditing ? 'border-2 border-primary-main' : 'border border-other-border',
        ].join(' ')}
      >
        <div className="flex shrink-0 items-end justify-between gap-8">
          <div className="flex items-end gap-4" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'current'}
              onClick={() => setTab('current')}
              className={['flex flex-col gap-1 px-2 py-1', tab === 'current' ? 'text-primary-main' : 'text-text-primary'].join(' ')}
            >
              <span className="type-button-medium">Current roles</span>
              <span className={['h-px w-full', tab === 'current' ? 'bg-primary-main' : 'bg-other-border'].join(' ')} />
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'history'}
              onClick={() => setTab('history')}
              className={['flex flex-col gap-1 px-2 py-1', tab === 'history' ? 'text-primary-main' : 'text-text-primary'].join(' ')}
            >
              <span className="type-button-medium">Role history</span>
              <span className={['h-px w-full', tab === 'history' ? 'bg-primary-main' : 'bg-other-border'].join(' ')} />
            </button>
          </div>

          {tab === 'current' ? (
            <div className="flex items-center gap-4">
              <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} label="Search staff members" />
              <div className="flex items-center gap-2">
                {ROLE_TYPE_OPTIONS.map((option) => {
                  const selected = option.value === roleType
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setRoleType(option.value)}
                      className={[
                        'type-chip rounded-full border px-3 py-1',
                        selected ? 'border-primary-main bg-primary-main text-primary-contrast' : 'border-other-border text-text-primary hover:bg-action-hover',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
              <Button>Find</Button>
            </div>
          ) : null}
        </div>

        {tab === 'history' ? (
          <Text as="p" variant="body-one" className="text-text-secondary">
            Role history isn't available yet — no historical role-change data exists for this prototype.
          </Text>
        ) : (
          <>
            <Text as="p" variant="h1" className="shrink-0 pl-12 text-center">
              {roleTypeLabel}
            </Text>

            <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
              <div className="relative w-8 shrink-0">
                <Text
                  as="p"
                  variant="h1"
                  className="absolute top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-center"
                >
                  Staff members
                </Text>
              </div>

              <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
                <div className="grid h-max w-max gap-x-2 gap-y-2" style={{ gridTemplateColumns: `200px repeat(${roles.length}, 40px)` }}>
                  <div className="h-[140px]" />
                  {roles.map((role) => (
                    <div key={role.id} className="relative h-[140px] w-[40px]">
                      <div className="absolute bottom-2 left-3 origin-bottom-left -rotate-45 whitespace-nowrap">
                        <span className="type-overline text-text-primary">{role.name}</span>
                      </div>
                    </div>
                  ))}

                  {filteredStaff.map((member) => {
                    const label = member.title && member.title !== '-' ? `${member.title} ${member.name}` : member.name
                    return (
                      <Fragment key={member.id}>
                        <div className="flex items-center justify-end pr-2">
                          <span className="type-overline whitespace-nowrap text-text-primary">{label}</span>
                        </div>
                        {roles.map((role) => {
                          const checked = assignments[member.id]?.has(role.id) ?? false
                          return (
                            <button
                              key={role.id}
                              type="button"
                              role="checkbox"
                              aria-checked={checked}
                              aria-label={`${checked ? 'Remove' : 'Assign'} ${role.name} for ${label}`}
                              disabled={!isEditing}
                              onClick={() => onToggleAssignment(member.id, role.id)}
                              className={[
                                'flex h-[40px] w-[40px] items-center justify-center rounded-lg border bg-background-white transition-colors',
                                isEditing ? 'cursor-pointer border-other-border hover:bg-action-hover' : 'cursor-default border-transparent',
                              ].join(' ')}
                            >
                              {checked ? <span className="h-6 w-6 rounded bg-primary-main" /> : null}
                            </button>
                          )
                        })}
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="flex h-[40px] w-[40px] items-center justify-center rounded-lg border border-other-border bg-background-white">
                  <span className="h-6 w-6 rounded bg-primary-main" />
                </span>
                <span className="type-overline text-text-primary">Assigned {roleTypeLabel.toLowerCase()}</span>
              </div>
              <Button variant="solid" onClick={() => setMode(isEditing ? 'view' : 'edit')}>
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
