import { DataTable, ListToolbar, PageHeader, SearchInput, type DataTableColumn } from 'design-system-project'
import { ChevronRight } from 'iqons-react'
import { useMemo, useState } from 'react'
import { activities, type Activity } from '../data/activities'

const columns: DataTableColumn<Activity>[] = [
  { key: 'code', header: 'Code' },
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'module', header: 'Module' },
]

// Reached via Security & RBAC > Activities (AdminHub 67:5278). Row selection
// checkboxes are real (toggleable, select-all works) but there's no bulk
// action bar anywhere in the design for them to drive — no business action
// was invented for what a selection would do.
export function ActivitiesPage() {
  const [query, setQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activities
    return activities.filter((activity) =>
      [activity.code, activity.name, activity.description, activity.module].some((value) => value.toLowerCase().includes(q)),
    )
  }, [query])

  const toggleRow = (activity: Activity) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(activity.id)) next.delete(activity.id)
      else next.add(activity.id)
      return next
    })
  }

  const allSelected = filtered.length > 0 && filtered.every((activity) => selectedIds.has(activity.id))

  const toggleAll = () => {
    setSelectedIds((prev) => {
      if (allSelected) {
        const next = new Set(prev)
        filtered.forEach((activity) => next.delete(activity.id))
        return next
      }
      const next = new Set(prev)
      filtered.forEach((activity) => next.add(activity.id))
      return next
    })
  }

  return (
    <div className="flex h-full flex-col gap-6 px-8 py-6">
      <PageHeader title="Activities" />

      <ListToolbar resultCount={filtered.length} totalCount={activities.length}>
        <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
      </ListToolbar>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <DataTable
          columns={columns}
          rows={filtered}
          getRowKey={(row) => row.id}
          emptyMessage="No activities match your search."
          renderExpand={() => <ChevronRight className="h-5 w-5 text-text-secondary" />}
          selection={{
            isSelected: (row) => selectedIds.has(row.id),
            onToggleRow: toggleRow,
            allSelected,
            onToggleAll: toggleAll,
          }}
        />
      </div>
    </div>
  )
}
