import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Paperclip, Plus, Search, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, unwrap } from '@/lib/utils'
import { Constants } from '@/lib/database.types'
import { STAGE_LABELS } from '@/lib/constants'
import { ACTIVE_STAGES, STAGE_TONES, initials, invalidateApplications, useMoveStage, type Stage } from '@/lib/applications'
import { Alert, Avatar, Badge, Button, Card, EmptyState, Input, PageHeader, Select, Spinner, Stars } from '@/components/ui'
import { CandidateDrawer } from './CandidateDrawer'
import { Can, useRole } from '@/lib/auth'

const PAGE_SIZE = 25
export const SOURCES = ['Dashboard', 'Career page', 'Referral', 'LinkedIn', 'Email', 'Walk-in', 'Other']

type StageFilter = 'active' | 'all' | Stage

/** Strip characters that have meaning inside a PostgREST or() filter. */
const sanitize = (s: string) => s.replace(/[,()*%\\]/g, ' ').trim()

function stagesFor(f: StageFilter): Stage[] | null {
  if (f === 'all') return null
  if (f === 'active') return ACTIVE_STAGES
  return [f]
}

export function ApplicationsPage() {
  const [params, setParams] = useSearchParams()
  const stage = (params.get('stage') ?? 'active') as StageFilter
  const opening = params.get('opening') ?? ''
  const source = params.get('source') ?? ''
  const minRating = Number(params.get('rating') ?? 0)
  const page = Math.max(1, Number(params.get('page') ?? 1))
  const q = params.get('q') ?? ''
  const openId = params.get('application')

  const [search, setSearch] = useState(q)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const qc = useQueryClient()
  const move = useMoveStage()
  const { canEdit } = useRole()

  function update(changes: Record<string, string | null>, resetPage = true) {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    }
    if (resetPage && !('page' in changes)) next.delete('page')
    setParams(next, { replace: true })
  }

  // debounce search box → URL
  useEffect(() => {
    const t = setTimeout(() => { if (search !== q) update({ q: search || null }) }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // clear the selection whenever the result set changes
  const filterKey = `${stage}|${opening}|${source}|${minRating}|${q}|${page}`
  useEffect(() => setSelected(new Set()), [filterKey])

  const openings = useQuery({
    queryKey: ['openings', 'options'],
    queryFn: async () => unwrap(await supabase.from('openings').select('id, title, code').order('created_at', { ascending: false })),
  })

  const counts = useQuery({
    queryKey: ['stage-counts', opening],
    queryFn: async () => {
      const rows = opening
        ? unwrap(await supabase.from('opening_pipeline_counts').select('stage, total').eq('opening_id', opening))
        : unwrap(await supabase.from('pipeline_stage_counts').select('stage, total'))
      return Object.fromEntries(rows.map((r) => [r.stage, r.total ?? 0])) as Partial<Record<Stage, number>>
    },
  })

  const list = useQuery({
    queryKey: ['applications', filterKey],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let query = supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
      const st = stagesFor(stage)
      if (st) query = query.in('stage', st)
      if (opening) query = query.eq('opening_id', opening)
      if (source) query = query.eq('source', source)
      if (minRating) query = query.gte('rating', minRating)
      const needle = sanitize(q)
      if (needle) query = query.or(`full_name.ilike.%${needle}%,email.ilike.%${needle}%,opening_title.ilike.%${needle}%,city.ilike.%${needle}%`)
      const { data, count, error } = await query
      if (error) throw new Error(error.message)
      return { rows: data, total: count ?? 0 }
    },
  })

  const rate = useMutation({
    mutationFn: async ({ id, rating }: { id: string; rating: number }) =>
      unwrap(await supabase.from('opening_applicants').update({ rating }).eq('id', id)),
    onSuccess: () => invalidateApplications(qc),
  })

  const rows = list.data?.rows ?? []
  const total = list.data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id!))
  const countOf = (f: StageFilter) => {
    const c: Partial<Record<Stage, number>> = counts.data ?? {}
    const st: readonly Stage[] = stagesFor(f) ?? Constants.public.Enums.applicant_stage
    return st.reduce((sum, s) => sum + (c[s] ?? 0), 0)
  }
  const tabs: StageFilter[] = ['active', ...Constants.public.Enums.applicant_stage, 'all']
  const filtersActive = !!(opening || source || minRating || q)
  const ids = useMemo(() => rows.map((r) => r.id!), [rows])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every candidate across your openings and talent pool."
        actions={<Can edit><Link to="/applications/new"><Button><Plus className="size-4" />Add candidate</Button></Link></Can>}
      />

      {/* stage tabs */}
      <nav className="-mx-1 mb-4 flex gap-1 overflow-x-auto px-1 pb-1" aria-label="Filter by stage">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => update({ stage: t === 'active' ? null : t })}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              stage === t ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900',
            )}
          >
            {t === 'active' ? 'Active pipeline' : t === 'all' ? 'All' : STAGE_LABELS[t]}
            <span className={cn('ml-1.5 text-xs tabular-nums', stage === t ? 'text-brand-100' : 'text-slate-400')}>{countOf(t)}</span>
          </button>
        ))}
      </nav>

      {/* filters */}
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_10rem_9rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, city or job" className="pl-9" aria-label="Search applications" />
        </div>
        <Select value={opening} onChange={(e) => update({ opening: e.target.value })} aria-label="Opening">
          <option value="">All openings</option>
          {(openings.data ?? []).map((o) => <option key={o.id} value={o.id}>{o.code} · {o.title}</option>)}
        </Select>
        <Select value={source} onChange={(e) => update({ source: e.target.value })} aria-label="Source">
          <option value="">All sources</option>
          {SOURCES.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={String(minRating)} onChange={(e) => update({ rating: e.target.value === '0' ? null : e.target.value })} aria-label="Minimum rating">
          <option value="0">Any rating</option>
          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{'★'.repeat(n)}{n < 5 ? ' & up' : ''}</option>)}
        </Select>
        {filtersActive && (
          <Button variant="ghost" onClick={() => { setSearch(''); update({ opening: null, source: null, rating: null, q: null }) }}>
            <X className="size-4" />Clear
          </Button>
        )}
      </div>

      {(list.error || move.error || rate.error) && <div className="mb-4"><Alert>{(list.error ?? move.error ?? rate.error)!.message}</Alert></div>}

      {/* bulk bar */}
      {selected.size > 0 && (
        <div className="sticky top-0 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          <span className="font-medium">{selected.size} selected</span>
          <span className="mx-1 text-slate-500">·</span>
          <span className="text-slate-300">Move to</span>
          {Constants.public.Enums.applicant_stage.map((s) => (
            <button
              key={s}
              disabled={move.isPending}
              onClick={() => move.mutate({ ids: [...selected], stage: s }, { onSuccess: () => setSelected(new Set()) })}
              className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium hover:bg-white/20 disabled:opacity-50"
            >
              {STAGE_LABELS[s]}
            </button>
          ))}
          <button onClick={() => setSelected(new Set())} className="ml-auto rounded-md p-1 text-slate-300 hover:bg-white/10" aria-label="Clear selection">
            <X className="size-4" />
          </button>
        </div>
      )}

      <Card>
        {list.isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : !rows.length ? (
          <EmptyState
            icon={<Users className="size-5" />}
            title={filtersActive ? 'No candidates match these filters' : 'No candidates here yet'}
            description={filtersActive ? 'Try clearing a filter or searching for something else.' : 'Add a candidate manually, or share an opening to start receiving applications.'}
            action={!filtersActive && canEdit ? <Link to="/applications/new"><Button size="sm"><Plus className="size-4" />Add candidate</Button></Link> : undefined}
          />
        ) : (
          <div className={cn('overflow-x-auto transition-opacity', list.isFetching && 'opacity-60')}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className={cn('w-10 px-4 py-3', !canEdit && 'hidden')}>
                    <input
                      type="checkbox"
                      className="size-4 accent-brand-600"
                      checked={allChecked}
                      onChange={() => setSelected(allChecked ? new Set() : new Set(ids))}
                      aria-label="Select all on this page"
                    />
                  </th>
                  <th className="px-3 py-3 font-medium">Candidate</th>
                  <th className="px-3 py-3 font-medium">Opening</th>
                  <th className="px-3 py-3 font-medium">Stage</th>
                  <th className="px-3 py-3 font-medium">Rating</th>
                  <th className="hidden px-3 py-3 font-medium md:table-cell">Source</th>
                  <th className="px-3 py-3 text-right font-medium">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => update({ application: r.id }, false)}
                    className={cn('cursor-pointer hover:bg-slate-50', selected.has(r.id!) && 'bg-brand-50/60', openId === r.id && 'bg-brand-50')}
                  >
                    <td className={cn('px-4 py-3', !canEdit && 'hidden')} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="size-4 accent-brand-600" checked={selected.has(r.id!)} onChange={() => toggle(r.id!)} aria-label={`Select ${r.full_name}`} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar text={initials(r.first_name, r.last_name)} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 font-medium text-slate-900">
                            <span className="truncate">{r.full_name}</span>
                            {r.resume_path && <Paperclip className="size-3 shrink-0 text-slate-400" aria-label="Has CV" />}
                          </p>
                          <p className="truncate text-xs text-slate-500">{r.email}{r.city ? ` · ${r.city}` : ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {r.opening_id ? (
                        <>
                          <p className="truncate text-slate-800">{r.opening_title}</p>
                          <p className="font-mono text-xs text-slate-400">{r.opening_code}</p>
                        </>
                      ) : (
                        <span className="text-slate-400">No opening</span>
                      )}
                    </td>
                    <td className="px-3 py-3"><Badge tone={STAGE_TONES[r.stage!]}>{STAGE_LABELS[r.stage!]}</Badge></td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Stars value={r.rating ?? 0} onChange={canEdit ? (rating) => rate.mutate({ id: r.id!, rating }) : undefined} disabled={rate.isPending} />
                    </td>
                    <td className="hidden px-3 py-3 text-slate-600 md:table-cell">{r.source}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right text-xs text-slate-500">{formatDate(r.created_at!)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
            </span>
            <div className="flex gap-1">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => update({ page: String(page - 1) }, false)} aria-label="Previous page">
                <ChevronLeft className="size-4" />
              </Button>
              <Button size="sm" variant="secondary" disabled={page >= pages} onClick={() => update({ page: String(page + 1) }, false)} aria-label="Next page">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {openId && <CandidateDrawer applicationId={openId} onClose={() => update({ application: null }, false)} onOpen={(id) => update({ application: id }, false)} />}
    </>
  )
}
