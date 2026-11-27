import { Construction } from 'lucide-react'
import { Card, EmptyState, PageHeader } from '@/components/ui'

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        <EmptyState
          icon={<Construction className="size-5" />}
          title="Being ported from the Laravel app"
          description={`${title} will move to React + Supabase in an upcoming step of the migration.`}
        />
      </Card>
    </>
  )
}
