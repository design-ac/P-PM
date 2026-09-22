import { IconButton } from 'design-system-project'
import { MoreVertical } from 'iqons-react'
import { useEffect, useRef, useState } from 'react'

type MenuItem = { label: string; onClick: () => void; disabled?: boolean; title?: string }

type RowActionsMenuProps = {
  items: MenuItem[]
  ariaLabel: string
}

// Same dropdown pattern as StatusFilterMenu (click-outside-to-close,
// existing border/radius/shadow tokens) generalized into a per-row "more
// actions" menu, so a row can offer more than one action (e.g. Get info
// and Remove) behind a single three-dot button instead of a dedicated
// icon per action.
export function RowActionsMenu({ items, ariaLabel }: RowActionsMenuProps) {
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
    <div ref={containerRef} className="relative inline-block">
      <IconButton icon={<MoreVertical />} aria-label={ariaLabel} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((prev) => !prev)} />

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-other-border bg-background-white p-1 shadow-[0px_1px_10px_rgba(0,0,0,0.12),0px_4px_5px_rgba(0,0,0,0.14),0px_2px_4px_-1px_rgba(0,0,0,0.12)]"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              title={item.title}
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className="type-body-two flex w-full items-center rounded-md px-3 py-2 text-left text-text-primary hover:bg-action-hover disabled:pointer-events-none disabled:opacity-40"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
