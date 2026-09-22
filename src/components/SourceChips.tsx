import { useState } from 'react'
import type { ActivitySource, RoleSource } from '../logic/permissions'
import { SourceChip } from './SourceChip'

export type SourceDescriptor = { label: string; variant: 'direct' | 'inherited'; groupId?: string }

export function roleSourceDescriptors(sources: RoleSource[]): SourceDescriptor[] {
  return sources.map((source) =>
    source.type === 'direct' ? { label: 'Direct', variant: 'direct' } : { label: `Via Staff Group: ${source.group.name}`, variant: 'inherited', groupId: source.group.id },
  )
}

export function activitySourceDescriptors(sources: ActivitySource[]): SourceDescriptor[] {
  return sources.map((source) => {
    if (source.type === 'direct') return { label: 'Direct', variant: 'direct' }
    if (source.type === 'group-direct') return { label: `Via Staff Group: ${source.group.name}`, variant: 'inherited', groupId: source.group.id }
    return source.group
      ? { label: `Via Role: ${source.role.name} → ${source.group.name}`, variant: 'inherited', groupId: source.group.id }
      : { label: `Via Role: ${source.role.name}`, variant: 'inherited' }
  })
}

// Collapses to a single chip when there's one source, an expandable "N
// sources" chip when there's more than one (per the RBAC proposal — an
// activity or role can have multiple, differently-shaped sources), or a
// dash when there are none. Sources with a groupId navigate to that Staff
// Group's details screen when a handler is provided.
export function SourceChips({
  sources,
  onNavigateToGroup,
  defaultExpanded = false,
}: {
  sources: SourceDescriptor[]
  onNavigateToGroup?: (groupId: string) => void
  /** Skip the collapsed "N sources" state and always show every chip — for contexts with room to spare, like the Get info panel. */
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  if (sources.length === 0) return <span className="type-body-two text-text-secondary">—</span>

  if (sources.length === 1) {
    const source = sources[0]
    return <SourceChip label={source.label} variant={source.variant} onClick={source.groupId && onNavigateToGroup ? () => onNavigateToGroup(source.groupId!) : undefined} />
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="type-chip self-start cursor-pointer rounded-full border border-other-border px-3 py-1 whitespace-nowrap text-text-primary hover:bg-action-hover"
      >
        {sources.length} sources
      </button>
    )
  }

  return (
    <div className="flex flex-wrap gap-1">
      {sources.map((source, index) => (
        <SourceChip key={index} label={source.label} variant={source.variant} onClick={source.groupId && onNavigateToGroup ? () => onNavigateToGroup(source.groupId!) : undefined} />
      ))}
    </div>
  )
}
