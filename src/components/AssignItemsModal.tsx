import { Button, Modal, SearchInput } from 'design-system-project'
import { useMemo, useState } from 'react'

type Item = { id: string; label: string }

type AssignItemsModalProps = {
  title: string
  items: Item[]
  isChecked: (id: string) => boolean
  onToggle: (id: string) => void
  onClose: () => void
}

// Generic checkbox-list modal for attaching/detaching things (a group's
// roles, a group's or member's direct activities) — reuses the existing
// Modal + SearchInput + checkbox pattern instead of building a bespoke
// picker per screen.
export function AssignItemsModal({ title, items, isChecked, onToggle, onClose }: AssignItemsModalProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => item.label.toLowerCase().includes(q))
  }, [items, query])

  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <Button variant="solid" onClick={onClose}>
          Done
        </Button>
      }
    >
      <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <span className="type-body-two text-text-secondary">No matches.</span>
        ) : (
          filtered.map((item) => (
            <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-action-hover">
              <input type="checkbox" className="accent-primary-main" checked={isChecked(item.id)} onChange={() => onToggle(item.id)} />
              <span className="type-body-two text-text-primary">{item.label}</span>
            </label>
          ))
        )}
      </div>
    </Modal>
  )
}
