import { Button, DataTable, Footer, IconButton, ListToolbar, SearchInput, type DataTableColumn } from 'design-system-project'
import { ChevronRight, MoreVertical } from 'iqons-react'
import { useMemo, useState } from 'react'
import { staffRoles, type StaffRole } from '../data/roles'

type RoleTypeFilter = 'all' | 'vision' | 'smartcard'

const ROLE_TYPE_OPTIONS: Array<{ value: RoleTypeFilter; label: string }> = [
  { value: 'all', label: 'All roles' },
  { value: 'vision', label: 'Vision roles' },
  { value: 'smartcard', label: 'Smartcard roles' },
]

const columns: DataTableColumn<StaffRole>[] = [
  { key: 'code', header: 'Code' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
]

// Shared between the standalone Roles screen (Security & RBAC > Roles) and
// the Staff Member Details roles tab, since both use the identical table
// (AdminHub 67:5271 and 73:26590 render the same "AdminHub-table/roles"
// component with the same content) — extracted once instead of duplicated.
//
// The role-type chips reflect selection visually but don't filter, since
// the mock roles (data/roles.ts) have no vision/smartcard classification to
// filter by — there's no per-role-type data anywhere in the app.
//
// Expand chevron moved to DataTable's renderExpand prop (was previously a
// plain column, which put it after the selection checkbox — wrong order,
// per the Staff Groups table where both exist together). Selection is real
// (toggleable, select-all works) but has no bulk action to drive, same
// caveat as every other table with checkboxes in this app.
export function RolesTable() {
  const [query, setQuery] = useState('')
  const [roleType, setRoleType] = useState<RoleTypeFilter>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staffRoles
    return staffRoles.filter((role) => [role.code, role.name, role.description].some((value) => value.toLowerCase().includes(q)))
  }, [query])

  const toggleRow = (role: StaffRole) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(role.id)) next.delete(role.id)
      else next.add(role.id)
      return next
    })
  }

  const allSelected = filteredRoles.length > 0 && filteredRoles.every((role) => selectedIds.has(role.id))

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredRoles.forEach((role) => (allSelected ? next.delete(role.id) : next.add(role.id)))
      return next
    })
  }

  return (
    <>
      <div className="shrink-0 pb-4">
        <ListToolbar resultCount={filteredRoles.length} totalCount={staffRoles.length}>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
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
                    selected ? 'border-primary-main text-primary-main' : 'border-other-border text-text-primary hover:bg-action-hover',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </ListToolbar>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          rows={filteredRoles}
          getRowKey={(row) => row.id}
          emptyMessage="No roles match your search."
          renderExpand={() => <ChevronRight className="h-5 w-5 text-text-secondary" />}
          selection={{
            isSelected: (row) => selectedIds.has(row.id),
            onToggleRow: toggleRow,
            allSelected,
            onToggleAll: toggleAll,
          }}
          renderRowActions={() => <IconButton icon={<MoreVertical />} aria-label="Role actions" />}
        />
      </div>

      <Footer rightActions={<Button variant="solid">Add role</Button>} />
    </>
  )
}
