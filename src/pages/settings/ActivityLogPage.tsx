import { useSearchParams } from 'react-router'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { History } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { unwrap } from '@/lib/utils'
import { Alert, Button, Card, EmptyState, Input, PageHeader, Select, Spinner } from '@/components/ui'
import { ActivityItem, type ActivityRow } from '@/components/ActivityTimeline'
import { BackTo } from './LocationsPages'

const PAGE = 50

const TYPES: { value: string; label: string; entities: string[] }[] = [
  { value: '', label: 'All activity', entities: [] },
  { value: 'pipeline', label: 'Candidates & applications', entities: ['application', 'candidate'] },
  { value: 'interview', label: 'Interviews', entities: ['interview'] },
  { value: 'opening', label: 'Job openings', entities: ['opening'] },
  { value: 'team', label: 'Team & invitations', entities: ['user', 'invitation'] },
  { value: 'settings', label: 'Settings', entities: ['template', 'email template', 'location', 'department'] },
]

export function ActivityLogPage() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') ?? ''
  const actor = params.get('actor') ?? ''
  const from = params.get('from') ?? ''
  const to = params.get('to') ?? ''

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const members = useQuery({
    queryKey: ['team'],
    queryFn: async () => unwrap(await supabase.from('profiles').select('*').order('created_at')),
  })

  const feed = useInfiniteQuery({
    queryKey: ['activity', type, actor, from, to],
    initialPageParam: 0,
    getNextPageParam: (last: ActivityRow[], all) => (last.length === PAGE ? all.length * PAGE : undefined),
    queryFn: async ({ pageParam }) => {
      let q = supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).order('id', { ascending: false })
      const entities = TYPES.find((t) => t.value === type)?.entities ?? []
      if (entities.length) q = q.in('entity_type', entities)
      if (actor === 'none') q = q.is('actor_id', null)
      else if (actor) q = q.eq('actor_id', actor)
      if (from) q = q.gte('created_at', new Date(`${from}T00:00:00`).toISOString())
      if (to) q = q.lt('created_at', new Date(new Date(`${to}T00:00:00`).getTime() + 86_400_000).toISOString())
      return unwrap(await q.range(pageParam, pageParam + PAGE - 1))
    },
  })

  const rows = feed.data?.pages.flat() ?? []
  const groups = new Map<string, ActivityRow[]>()
  for (const r of rows) {
    const day = new Date(r.created_at!).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    groups.set(day, [...(groups.get(day) ?? []), r])
  }

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader title="Activity log" description="Everything that happened in your account, recorded automatically. Entries can't be edited or deleted." />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={type} onChange={(e) => set('type', e.target.value)} aria-label="Type">
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
        <Select value={actor} onChange={(e) => set('actor', e.target.value)} aria-label="Person">
          <option value="">Everyone</option>
          {(members.data ?? []).map((m) => <option key={m.id} value={m.id}>{`${m.first_name} ${m.last_name}`.trim() || m.email}</option>)}
          <option value="none">Candidates & system</option>
        </Select>
        <Input type="date" value={from} onChange={(e) => set('from', e.target.value)} aria-label="From date" />
        <Input type="date" value={to} onChange={(e) => set('to', e.target.value)} aria-label="To date" />
      </div>

      {feed.error && <Alert>{feed.error.message}</Alert>}

      {feed.isLoading ? (
        <Card className="p-6"><Spinner /></Card>
      ) : !rows.length ? (
        <Card><EmptyState icon={<History className="size-5" />} title="No activity" description="Nothing matches these filters yet." /></Card>
      ) : (
        <div className="space-y-4">
          {[...groups.entries()].map(([day, items]) => (
            <Card key={day}>
              <h2 className="border-b border-slate-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</h2>
              <ul className="divide-y divide-slate-100">{items.map((r) => <ActivityItem key={r.id} row={r} />)}</ul>
            </Card>
          ))}
          {feed.hasNextPage && (
            <div className="text-center">
              <Button variant="secondary" loading={feed.isFetchingNextPage} onClick={() => feed.fetchNextPage()}>Load more</Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
