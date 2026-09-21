import { Button, DataTable, Footer, IconButton, ListToolbar, PageHeader, SearchInput, type DataTableColumn } from 'design-system-project'
import { ChevronRight, Filter, MoreVertical } from 'iqons-react'
import { useMemo, useState } from 'react'
import { staffGroups, type StaffGroup } from '../data/staffGroups'

const columns: DataTableColumn<StaffGroup>[] = [
  { key: 'code', header: 'Code' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'creationDate', header: 'Creation date' },
]

// Reached via the "Staff Groups" nav item (AdminHub 67:23279). The
// "Filters" button has no defined filterable field in this data (unlike
// Staff Members' status), so it's rendered but inert — same reasoning as
// the other ambiguous controls flagged in earlier passes. Row selection is
// real (matches the Activities page) but has no bulk action to drive.
// "Create staff group" is rendered but not wired to a creation flow, since
// none is designed.
export function StaffGroupsPage() {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staffGroups
    return staffGroups.filter((group) => [group.code, group.name, group.description].some((value) => value.toLowerCase().includes(q)))
  }, [query])

  const toggleRow = (group: StaffGroup) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(group.id)) next.delete(group.id)
      else next.add(group.id)
      return next
    })
  }

  const allSelected = filtered.length > 0 && filtered.every((group) => selectedIds.has(group.id))

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filtered.forEach((group) => (allSelected ? next.delete(group.id) : next.add(group.id)))
      return next
    })
  }

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="shrink-0 pb-6">
        <PageHeader title="Staff groups" />
      </div>

      <div className="shrink-0 pb-4">
        <ListToolbar resultCount={filtered.length} totalCount={staffGroups.length}>
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
          <Button icon={<Filter />}>Filters</Button>
        </ListToolbar>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          emptyMessage="No staff groups match your search."
          renderExpand={() => <ChevronRight className="h-5 w-5 text-text-secondary" />}
          selection={{
            isSelected: (row) => selectedIds.has(row.id),
            onToggleRow: toggleRow,
            allSelected,
            onToggleAll: toggleAll,
          }}
          renderRowActions={() => <IconButton icon={<MoreVertical />} aria-label="Group actions" />}
        />
      </div>

      <Footer rightActions={<Button variant="solid">Create staff group</Button>} />
    </div>
  )
}
