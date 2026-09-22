// Extracted from the inline tab markup already established on the Staff
// Member Roles screen (type-button-medium label + underline indicator) so
// Staff Member Details and Staff Group Details can reuse the identical
// pattern instead of re-implementing it.
type Tab<T extends string> = { value: T; label: string }

type TabsProps<T extends string> = {
  tabs: Tab<T>[]
  value: T
  onChange: (value: T) => void
}

export function Tabs<T extends string>({ tabs, value, onChange }: TabsProps<T>) {
  return (
    <div className="flex items-end gap-4" role="tablist">
      {tabs.map((tab) => {
        const selected = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            className={['flex flex-col gap-1 px-2 py-1', selected ? 'text-primary-main' : 'text-text-primary'].join(' ')}
          >
            <span className="type-button-medium">{tab.label}</span>
            <span className={['h-px w-full', selected ? 'bg-primary-main' : 'bg-other-border'].join(' ')} />
          </button>
        )
      })}
    </div>
  )
}
