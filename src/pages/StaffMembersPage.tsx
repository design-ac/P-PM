import { DataTable, IconButton, ListToolbar, PageHeader, SearchInput, StatusBadge, type DataTableColumn } from 'design-system-project'
import { MoreVertical } from 'iqons-react'
import { useMemo, useState } from 'react'
import { EditStaffMemberModal } from '../components/EditStaffMemberModal'
import { StatusFilterMenu } from '../components/StatusFilterMenu'
import type { StaffMember } from '../data/staff'
import type { StatusFilter } from '../types/route'

type StaffMembersPageProps = {
  staffMembers: StaffMember[]
  statusFilter: StatusFilter
  onStatusFilterChange: (status: StatusFilter) => void
  onUpdateMember: (member: StaffMember) => void
  query: string
  onQueryChange: (query: string) => void
  onSelectMember: (member: StaffMember) => void
}

const columns: DataTableColumn<StaffMember>[] = [
  { key: 'title', header: 'Title' },
  { key: 'name', header: 'Name' },
  { key: 'username', header: 'Username' },
  { key: 'displayName', header: 'Display name' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
]

export function StaffMembersPage({
  staffMembers,
  statusFilter,
  onStatusFilterChange,
  onUpdateMember,
  query,
  onQueryChange,
  onSelectMember,
}: StaffMembersPageProps) {
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null)
  // Checkbox column added per your request to standardize expand/select
  // across every table — real (toggleable, select-all works) but, same as
  // every other table with checkboxes in this app, there's no bulk action
  // bar to drive with the selection.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Status (from the nav drawer or the Filters menu) and search compose
    // with AND, so neither one overrides the other.
    return staffMembers.filter((member) => {
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter
      const matchesQuery = !q || [member.name, member.username, member.displayName].some((value) => value.toLowerCase().includes(q))
      return matchesStatus && matchesQuery
    })
  }, [staffMembers, statusFilter, query])

  const toggleRow = (member: StaffMember) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(member.id)) next.delete(member.id)
      else next.add(member.id)
      return next
    })
  }

  const allSelected = filtered.length > 0 && filtered.every((member) => selectedIds.has(member.id))

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filtered.forEach((member) => (allSelected ? next.delete(member.id) : next.add(member.id)))
      return next
    })
  }

  return (
    <div className="flex h-full flex-col gap-6 px-8 py-6">
      <PageHeader title="Staff members" />

      <ListToolbar resultCount={filtered.length} totalCount={staffMembers.length}>
        <SearchInput value={query} onChange={(event) => onQueryChange(event.target.value)} />
        <StatusFilterMenu value={statusFilter} onChange={onStatusFilterChange} />
      </ListToolbar>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          emptyMessage="No staff members match your filters."
          onRowClick={onSelectMember}
          selection={{
            isSelected: (row) => selectedIds.has(row.id),
            onToggleRow: toggleRow,
            allSelected,
            onToggleAll: toggleAll,
          }}
          renderRowActions={(row) => <IconButton icon={<MoreVertical />} aria-label={`${row.name} actions`} onClick={() => setEditingMember(row)} />}
        />
      </div>

      {editingMember ? (
        <EditStaffMemberModal
          member={editingMember}
          onCancel={() => setEditingMember(null)}
          onSave={(updated) => {
            onUpdateMember(updated)
            setEditingMember(null)
          }}
        />
      ) : null}
    </div>
  )
}
