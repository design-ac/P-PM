import { PageHeader, Text } from 'design-system-project'

type PlaceholderPageProps = {
  title: string
}

// Security & RBAC's sub-pages and Staff Groups have no design or backing
// data yet — this keeps their nav items real destinations (correct shell,
// active state, no dead clicks) without inventing content for screens that
// haven't been designed.
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-8 py-6">
      <PageHeader title={title} />
      <Text as="p" variant="body-one" className="text-text-secondary">
        This section hasn't been designed yet.
      </Text>
    </div>
  )
}
