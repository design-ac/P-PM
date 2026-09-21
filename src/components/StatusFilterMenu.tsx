import { useEffect, useRef, useState } from 'react'
import { Button } from 'design-system-project'
import { Filter } from 'iqons-react'
import type { StatusFilter } from '../types/route'

type StatusFilterMenuProps = {
  value: StatusFilter
  onChange: (value: StatusFilter) => void
}

const OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// Status is the only field this screen's data/design actually supports
// filtering by (no Role or other enum column exists) — this menu mirrors
// the nav drawer's Active/Inactive filter so there's a way to reach the
// same filter, plus an explicit "All" to reset it, from within the table
// toolbar itself. No dropdown/menu exists in the reference design, so
// this reuses existing border/radius/shadow/hover tokens rather than
// inventing a new pattern.
export function StatusFilterMenu({ value, onChange }: StatusFilterMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <Button icon={<Filter />} onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-haspopup="true">
        Filters
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-44 rounded-lg border border-other-border bg-background-white p-1 shadow-[0px_1px_10px_rgba(0,0,0,0.12),0px_4px_5px_rgba(0,0,0,0.14),0px_2px_4px_-1px_rgba(0,0,0,0.12)]"
        >
          {OPTIONS.map((option) => {
            const selected = option.value === value
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={[
                  'type-body-two flex w-full items-center rounded-md px-3 py-2 text-left',
                  selected ? 'bg-secondary-hover-background text-primary-dark' : 'text-text-primary hover:bg-action-hover',
                ].join(' ')}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
