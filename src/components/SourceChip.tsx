// Reuses the existing chip visual language (type-chip, rounded-full,
// border tokens) already established by StatusBadge and the role-type
// filter chips — no new visual primitive introduced for RBAC.
type SourceChipProps = {
  label: string
  variant: 'direct' | 'inherited'
  onClick?: () => void
}

export function SourceChip({ label, variant, onClick }: SourceChipProps) {
  const isDirect = variant === 'direct'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'type-chip self-start rounded-full border px-3 py-1 whitespace-nowrap',
        isDirect ? 'border-primary-main bg-primary-main text-primary-contrast' : 'border-other-border text-text-primary',
        onClick ? 'cursor-pointer hover:bg-action-hover' : 'cursor-default',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
