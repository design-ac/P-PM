import { Breadcrumbs } from 'design-system-project'
import { RolesTable } from '../components/RolesTable'
import type { StaffMember } from '../data/staff'

type StaffMemberDetailsPageProps = {
  member: StaffMember
  onBack: () => void
}

export function StaffMemberDetailsPage({ member, onBack }: StaffMemberDetailsPageProps) {
  const memberLabel = member.title && member.title !== '-' ? `${member.title}. ${member.name}` : member.name

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex shrink-0 flex-col gap-6 pb-6">
        <Breadcrumbs items={[{ label: 'Staff members', onClick: onBack }, { label: memberLabel }]} />
        <div className="h-px w-full bg-other-divider" />
      </div>

      <RolesTable />
    </div>
  )
}
