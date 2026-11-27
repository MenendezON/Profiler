import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Ban, CalendarClock, CalendarDays, ClipboardCheck, ClipboardList } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, unwrap } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { formatDay } from '@/lib/interviews'
import { Alert, Card, Checkbox, EmptyState, PageHeader, Spinner } from '@/components/ui'
import { InterviewItem } from '@/components/interviews/InterviewItem'
import type { InterviewRow } from '@/components/interviews/InterviewDialogs'

type Tab = 'upcoming' | 'feedback' | 'completed' | 'cancelled'

const TABS: { id: Tab; label: string; icon: typeof CalendarClock; empty: string }[] = [
  { id: 'upcoming', label: 'Upcoming', icon: CalendarClock, empty: 'No upcoming interviews. Schedule one from a candidate’s panel in Applications.' },
  { id: 'feedback', label: 'Pending feedback', icon: ClipboardList, empty: 'Every past interview has feedback. Nice work.' },
  { id: 'completed', label: 'Feedback given', icon: ClipboardCheck, empty: 'No feedback recorded yet.' },
  { id: 'cancelled', label: 'Cancelled', icon: Ban, empty: 'No cancelled interviews.' },
]

function scoped(tab: Tab, nowIso: string, mine: string | null) {
  let q = supabase.from('interview_list').select('*')
  if (tab === 'upcoming') q = q.eq('status', 'scheduled').gte('scheduled_at', nowIso)
  if (tab === 'feedback') q = q.eq('status', 'scheduled').lt('scheduled_at', nowIso)
  if (tab === 'completed') q = q.eq('status', 'completed')
  if (tab === 'cancelled') q = q.eq('status', 'cancelled')
  if (mine) q = q.eq('interviewer_id', mine)
  return q
}

export function InterviewsPage() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') ?? 'upcoming') as Tab
  const onlyMine = params.get('mine') === '1'
  const { data: profile } = useProfile()
  const mine = onlyMine ? profile?.id ?? null : null

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const counts = useQuery({
    queryKey: ['interview-counts', mine],
    queryFn: async () => {
      const now = new Date().toISOString()
      const results = await Promise.all(
        TABS.map(async (t) => {
          let q = supabase.from('interview_list').select('id', { count: 'exact', head: true })
          if (t.id === 'upcoming') q = q.eq('status', 'scheduled').gte('scheduled_at', now)
          if (t.id === 'feedback') q = q.eq('status', 'scheduled').lt('scheduled_at', now)
          if (t.id === 'completed') q = q.eq('status', 'completed')
          if (t.id === 'cancelled') q = q.eq('status', 'cancelled')
          if (mine) q = q.eq('interviewer_id', mine)
          const { count, error } = await q
          if (error) throw new Error(error.message)
          return [t.id, count ?? 0] as const
        }),
      )
      return Object.fromEntries(results) as Record<Tab, number>
    },
  })

  const list = useQuery({
    queryKey: ['interviews', tab, mine],
    queryFn: async () => {
      const now = new Date().toISOString()
      return unwrap(await scoped(tab, now, mine).order('scheduled_at', { ascending: tab === 'upcoming' }).limit(300))
    },
  })

  const rows = list.data ?? []
  const groups = groupByDay(rows)
  const current = TABS.find((t) => t.id === tab)!

  return (
    <>
      <PageHeader title="Interviews" description="Upcoming interviews and the feedback your team still owes." />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => set('tab', id === 'upcoming' ? null : id)}
            className={cn(
              'flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition-colors',
              tab === id ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <span className={cn('rounded-lg p-2', id === 'feedback' && (counts.data?.feedback ?? 0) > 0 ? 'bg-amber-50 text-amber-600' : 'bg-brand-50 text-brand-600')}>
              <Icon className="size-5" />
            </span>
            <span>
              <span className="block text-2xl font-semibold tabular-nums">{counts.data?.[id] ?? '–'}</span>
              <span className="block text-xs text-slate-500">{label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">{current.label}</h2>
        <Checkbox checked={onlyMine} onChange={(e) => set('mine', e.target.checked ? '1' : null)} label="Only my interviews" />
      </div>

      {list.error && <Alert>{list.error.message}</Alert>}

      {list.isLoading ? (
        <Card className="p-6"><Spinner /></Card>
      ) : !rows.length ? (
        <Card><EmptyState icon={<CalendarDays className="size-5" />} title="Nothing here" description={current.empty} /></Card>
      ) : (
        <div className="space-y-4">
          {groups.map(([day, items]) => (
            <Card key={day}>
              <h3 className="border-b border-slate-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{day}</h3>
              <div className="divide-y divide-slate-100">
                {items.map((r) => <InterviewItem key={r.id} row={r} />)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

function groupByDay(rows: InterviewRow[]) {
  const map = new Map<string, InterviewRow[]>()
  for (const r of rows) {
    const key = formatDay(r.scheduled_at!)
    map.set(key, [...(map.get(key) ?? []), r])
  }
  return [...map.entries()]
}
