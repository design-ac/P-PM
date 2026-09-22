import { StatusBadge, Text } from 'design-system-project'
import { RowActionsMenu } from './RowActionsMenu'
import type { StaffMember } from '../data/staff'

type StaffMemberBannerProps = {
  member: StaffMember
  onEdit: () => void
}

// Repurposed from appointments-chat's PatientBanner (name + a couple of
// identifying facts + status chip + a "more actions" kebab), swapped onto
// staff-member fields instead of clinical ones. The kebab reuses our own
// RowActionsMenu instead of that project's bespoke dropdown, and status
// uses our existing StatusBadge instead of its AllergyChip — no new visual
// language, just the same "identity banner at the top of a profile" shape.
export function StaffMemberBanner({ member, onEdit }: StaffMemberBannerProps) {
  const memberLabel = member.title && member.title !== '-' ? `${member.title}. ${member.name}` : member.name

  return (
    <div className="flex items-center gap-4 rounded-lg border border-other-border bg-background-default p-4">
      <div className="min-w-0 flex-1">
        <Text as="p" variant="subheading-one" className="truncate text-text-primary">
          {memberLabel}
        </Text>
        <div className="type-body-two flex flex-wrap items-center gap-2 text-text-secondary">
          <span>Username: {member.username}</span>
          <span className="opacity-50">·</span>
          <span>Display name: {member.displayName}</span>
        </div>
      </div>

      <StatusBadge status={member.status} />

      <RowActionsMenu ariaLabel={`${memberLabel} actions`} items={[{ label: 'Edit', onClick: onEdit }]} />
    </div>
  )
}
