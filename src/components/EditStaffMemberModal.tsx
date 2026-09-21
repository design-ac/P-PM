import { useState } from 'react'
import { Button, Modal, TextField } from 'design-system-project'
import type { StaffMember, StaffStatus } from '../data/staff'

type EditStaffMemberModalProps = {
  member: StaffMember
  onCancel: () => void
  onSave: (member: StaffMember) => void
}

const STATUS_OPTIONS: Array<{ value: StaffStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// Status pill colors mirror StatusBadge's own mapping (success-dark /
// secondary-main+contrast) so the selected state here reads as the same
// status shown in the table, rather than inventing a new toggle style.
export function EditStaffMemberModal({ member, onCancel, onSave }: EditStaffMemberModalProps) {
  const [draft, setDraft] = useState(member)

  return (
    <Modal
      title={`Edit ${member.name}`}
      onClose={onCancel}
      footer={
        <>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </>
      }
    >
      <TextField label="Title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
      <TextField label="Name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
      <TextField label="Username" value={draft.username} onChange={(event) => setDraft({ ...draft, username: event.target.value })} />
      <TextField
        label="Display name"
        value={draft.displayName}
        onChange={(event) => setDraft({ ...draft, displayName: event.target.value })}
      />

      <div className="flex flex-col gap-1">
        <span className="type-body-two text-text-secondary">Status</span>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((option) => {
            const selected = draft.status === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setDraft({ ...draft, status: option.value })}
                className={[
                  'type-chip rounded-full border px-3 py-1',
                  selected && option.value === 'active' ? 'border-success-dark bg-success-dark text-success-contrast' : '',
                  selected && option.value === 'inactive' ? 'border-secondary-main bg-secondary-main text-secondary-contrast' : '',
                  !selected ? 'border-other-border text-text-secondary hover:bg-action-hover' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
