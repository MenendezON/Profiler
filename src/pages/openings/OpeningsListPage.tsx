import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Building2, Globe, MapPin, Plus, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, unwrap } from '@/lib/utils'
import { Constants, type Enums } from '@/lib/database.types'
import { OPENING_STATUS } from '@/lib/constants'
import { Can, useRole } from '@/lib/auth'
import { Alert, Badge, Button, Card, EmptyState, Input, PageHeader, Spinner } from '@/components/ui'

type StatusFilter = Enums<'opening_status'> | 'all'

export const OPENINGS_KEY = ['openings']

export function OpeningsListPage() {
  const [params, setParams] = useSearchParams()
  const { canEdit } = useRole()
  const status = (params.get('status') ?? 'all') as StatusFilter
  const q = params.get('q') ?? ''

  const counts = useQuery({
    queryKey: ['opening-status-counts'],
    queryFn: async () => unwrap(await supabase.from("opening_status_counts").select("*")),
  })

  const openings = useQuery({
    queryKey: [...OPENINGS_KEY, status],
    queryFn: async () => {
      let query = supabase
        .from('openings')
        .select('id, title, code, status, type, remote, created_at, location:locations(name, city), department:departments(name), opening_applicants(count)')
        .order('created_at', { ascending: false })
      if (status !== 'all') query = query.eq('status', status)
      return unwrap(await query)
    },
  })

  const countFor = (s: StatusFilter) =>
    s === 'all'
      ? (counts.data ?? []).reduce((a, r) => a + (r.total ?? 0), 0)
      : (counts.data ?? []).find((r) => r.status === s)?.total ?? 0

  const needle = q.trim().toLowerCase()
  const rows = (openings.data ?? []).filter(
    (o) => !needle || o.title.toLowerCase().includes(needle) || o.code.toLowerCase().includes(needle),
  )

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || (key === 'status' && value === 'all')) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const tabs: StatusFilter[] = ['all', ...Constants.public.Enums.opening_status]

  return (
    <>
      <PageHeader
        title="Job openings"
        description="Create and manage the positions you're hiring for."
        actions={<Can edit><Link to="/openings/new"><Button><Plus className="size-4" />New opening</Button></Link></Can>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-1 rounded-lg bg-slate-100 p-1" aria-label="Filter by status">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setParam('status', t)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                status === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {t === 'all' ? 'All' : OPENING_STATUS[t].label}
              <span className="ml-1.5 text-xs text-slate-400 tabular-nums">{countFor(t)}</span>
            </button>
          ))}
        </nav>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search title or code" className="pl-9" aria-label="Search openings" />
        </div>
      </div>

      {openings.error && <Alert>{openings.error.message}</Alert>}

      <Card>
        {openings.isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : !rows.length ? (
          <EmptyState
            icon={<Briefcase className="size-5" />}
            title={needle ? 'No matching openings' : status === 'all' ? 'No openings yet' : `No ${OPENING_STATUS[status].label.toLowerCase()} openings`}
            description={needle ? 'Try a different search.' : 'Create an opening to start receiving applications.'}
            action={!needle && canEdit ? <Link to="/openings/new"><Button size="sm"><Plus className="size-4" />New opening</Button></Link> : undefined}
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.map((o) => {
              const st = OPENING_STATUS[o.status]
              return (
                <li key={o.id}>
                  <Link to={`/openings/${o.id}`} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-slate-900">{o.title}</p>
                        <Badge tone={st.tone}>{st.label}</Badge>
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="font-mono">{o.code}</span>
                        {o.department && <span className="inline-flex items-center gap-1"><Building2 className="size-3" />{o.department.name}</span>}
                        {o.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{o.location.name}</span>}
                        {o.remote && <span className="inline-flex items-center gap-1"><Globe className="size-3" />Remote</span>}
                        <span>{o.type}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold tabular-nums">{o.opening_applicants[0]?.count ?? 0}</p>
                      <p className="text-xs text-slate-500">applicants</p>
                    </div>
                    <p className="w-28 text-right text-xs text-slate-500">{formatDate(o.created_at)}</p>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </>
  )
}
