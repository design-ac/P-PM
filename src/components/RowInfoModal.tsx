import { Button, Modal, Text } from 'design-system-project'
import type { ReactNode } from 'react'
import { SourceChips, type SourceDescriptor } from './SourceChips'

type RowInfoModalProps = {
  title: string
  sources: SourceDescriptor[]
  onNavigateToGroup?: (groupId: string) => void
  onClose: () => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Text as="p" variant="overline" className="text-text-secondary">
        {label}
      </Text>
      {children}
    </div>
  )
}

// "Get info" — reached from a row's three-dot menu. Shows where a grant
// came from (the Source chips that used to sit in their own table column)
// plus a couple of fields the user asked to reserve space for. Creation
// date / Created by have no backing data anywhere in this app yet — no
// assignment (role, activity, or membership) records who made it or when
// — so they're shown as empty rather than invented.
export function RowInfoModal({ title, sources, onNavigateToGroup, onClose }: RowInfoModalProps) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <Button variant="solid" onClick={onClose}>
          Close
        </Button>
      }
    >
      <Field label="Source">
        <SourceChips sources={sources} onNavigateToGroup={onNavigateToGroup} defaultExpanded />
      </Field>
      <Field label="Creation date">
        <span className="type-body-two text-text-secondary">—</span>
      </Field>
      <Field label="Created by">
        <span className="type-body-two text-text-secondary">—</span>
      </Field>
    </Modal>
  )
}
