import { Link, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, unwrap } from '@/lib/utils'
import { OPENING_STATUS, STAGE_LABELS } from '@/lib/constants'
import type { Enums } from '@/lib/database.types'
import { Alert, Badge, Button, Card, Input, PageHeader, Select, Spinner } from '@/components/ui'
import { BarList, ColumnChart, SERIES, SegmentedBar, TableView } from '@/components/charts'

interface Report {
  applications: number
  hires: number
  avg_days_to_hire: number | null
  rejected: number
  in_pipeline: number
  funnel: { stage: Enums<'applicant_stage'>; count: number }[]
  by_week: { week: string; count: number }[]
  by_source: { source: string; count: number; hired: number }[]
  by_opening: { opening_id: string; title: string; code: string; status: Enums<'opening_status'>; total: number; active: number; interviewed: number; hired: number; rejected: number }[]
  interviews: { total: number; scheduled: number; completed: number; cancelled: number; hire: number; maybe: number; no_hire: number }
}

const iso = (d: Date) => d.toISOString().slice(0, 10)
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d) }

const PRESETS: { id: string; label: string; from: () => string }[] = [
  { id: '30', label: 'Last 30 days', from: () => daysAgo(29) },
  { id: '90', label: 'Last 90 days', from: () => daysAgo(89) },
  { id: 'year', label: 'This year', from: () => `${new Date().getFullYear()}-01-01` },
  { id: '365', label: 'Last 12 months', from: () => daysAgo(364) },
]

const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '–')

function downloadCsv(name: string, rows: (string | number | null)[][]) {
  const esc = (v: string | number | null) => {
    const s = v === null ? '' : String(v)
    return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  // BOM so Excel opens accents (é, è) correctly
  const blob = new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export function ReportsPage() {
  const [params, setParams] = useSearchParams()
  const preset = params.get('range') ?? (params.get('from') ? 'custom' : '90')
  const from = preset === 'custom' ? params.get('from') ?? daysAgo(89) : PRESETS.find((p) => p.id === preset)?.from() ?? daysAgo(89)
  const to = preset === 'custom' ? params.get('to') ?? iso(new Date()) : iso(new Date())
  const opening = params.get('opening') ?? ''

  const set = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }

  const openings = useQuery({
    queryKey: ['openings', 'options'],
    queryFn: async () => unwrap(await supabase.from('openings').select('id, title, code').order('created_at', { ascending: false })),
  })

  const report = useQuery({
    queryKey: ['report', from, to, opening],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('report_summary', { p_from: from, p_to: to, ...(opening ? { p_opening: opening } : {}) })
      if (error) throw new Error(error.message)
      return data as unknown as Report
    },
  })

  const r = report.data
  const periodLabel = `${new Date(from).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} – ${new Date(to).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`

  function exportCsv() {
    if (!r) return
    const rows: (string | number | null)[][] = [
      ['Profiler report', periodLabel],
      [],
      ['Applications', r.applications], ['Hires', r.hires], ['Average days to hire', r.avg_days_to_hire], ['In pipeline', r.in_pipeline], ['Rejected', r.rejected],
      [],
      ['Funnel stage', 'Candidates who reached it', '% of applications'],
      ...r.funnel.map((f) => [STAGE_LABELS[f.stage], f.count, pct(f.count, r.applications)]),
      [],
      ['Source', 'Applications', 'Hired'],
      ...r.by_source.map((s) => [s.source, s.count, s.hired]),
      [],
      ['Opening', 'Code', 'Status', 'Applications', 'In pipeline', 'Interviewed+', 'Hired', 'Rejected'],
      ...r.by_opening.map((o) => [o.title, o.code, OPENING_STATUS[o.status].label, o.total, o.active, o.interviewed, o.hired, o.rejected]),
      [],
      ['Week starting', 'Applications'],
      ...r.by_week.map((w) => [w.week, w.count]),
      [],
      ['Interviews', r.interviews.total], ['Feedback given', r.interviews.completed], ['Still scheduled', r.interviews.scheduled], ['Cancelled', r.interviews.cancelled],
      ['Recommended hire', r.interviews.hire], ['Maybe', r.interviews.maybe], ['No hire', r.interviews.no_hire],
    ]
    downloadCsv(`profiler-report-${from}-to-${to}.csv`, rows)
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="How your hiring is going: volume, conversion, sources and speed."
        actions={<Button variant="secondary" onClick={exportCsv} disabled={!r}><Download className="size-4" />Export CSV</Button>}
      />

      {/* filters: one row above the charts */}
      <div className="mb-6 flex flex-wrap items-end gap-2">
        <div className="flex rounded-lg bg-slate-100 p-1" role="group" aria-label="Period">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => set({ range: p.id === '90' ? null : p.id, from: null, to: null })}
              className={cn('rounded-md px-3 py-1.5 text-sm font-medium', preset === p.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Input type="date" className="w-40" value={from} max={to} onChange={(e) => set({ range: 'custom', from: e.target.value, to })} aria-label="From" />
        <Input type="date" className="w-40" value={to} min={from} onChange={(e) => set({ range: 'custom', from, to: e.target.value })} aria-label="To" />
        <Select className="w-64" value={opening} onChange={(e) => set({ opening: e.target.value })} aria-label="Opening">
          <option value="">All openings</option>
          {(openings.data ?? []).map((o) => <option key={o.id} value={o.id}>{o.code} · {o.title}</option>)}
        </Select>
      </div>

      {report.error && <Alert>{report.error.message}</Alert>}
      {report.isLoading && <Card className="p-6"><Spinner /></Card>}

      {r && (
        <div className={cn('space-y-6 transition-opacity', report.isFetching && 'opacity-60')}>
          <p className="-mt-3 text-xs text-slate-500">{periodLabel}</p>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Tile label="Applications" value={r.applications} />
            <Tile label="Hires" value={r.hires} hint={r.applications ? `${pct(r.hires, r.applications)} of applications` : undefined} />
            <Tile label="Avg. time to hire" value={r.avg_days_to_hire === null ? '–' : `${r.avg_days_to_hire} d`} hint="From application to Hired" />
            <Tile label="Still in pipeline" value={r.in_pipeline} />
            <Tile label="Rejected" value={r.rejected} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-sm font-semibold">Hiring funnel</h2>
              <p className="mb-3 text-xs text-slate-500">Candidates who reached each stage (applications in the period)</p>
              <BarList
                label="Hiring funnel"
                rows={r.funnel.map((f) => ({ label: STAGE_LABELS[f.stage], value: f.count, note: `${pct(f.count, r.applications)} of applications` }))}
                suffix={(row) => <span className="text-xs text-slate-400">{pct(row.value, r.applications)}</span>}
              />
              <TableView head={['Stage', 'Reached', '% of applications']} rows={r.funnel.map((f) => [STAGE_LABELS[f.stage], f.count, pct(f.count, r.applications)])} />
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold">Applications per week</h2>
              <p className="mb-3 text-xs text-slate-500">New applications received</p>
              <ColumnChart
                label="Applications per week"
                points={r.by_week.map((w, i, all) => {
                  const d = new Date(`${w.week}T00:00:00`)
                  const prev = i ? new Date(`${all[i - 1].week}T00:00:00`) : null
                  const newMonth = !prev || prev.getMonth() !== d.getMonth()
                  return {
                    label: `Week of ${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`,
                    // month name once, under the first week of each month
                    short: newMonth ? d.toLocaleDateString(undefined, { month: 'short' }) : '',
                    value: w.count,
                  }
                })}
              />
              <TableView head={['Week starting', 'Applications']} rows={r.by_week.map((w) => [w.week, w.count])} />
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold">Sources</h2>
              <p className="mb-3 text-xs text-slate-500">Where applications came from, and how many were hired</p>
              {r.by_source.length ? (
                <>
                  <BarList
                    label="Applications by source"
                    color={SERIES.s1}
                    rows={r.by_source.map((s) => ({ label: s.source, value: s.count, note: `${s.hired} hired` }))}
                    suffix={(row) => {
                      const hired = r.by_source.find((s) => s.source === row.label)?.hired ?? 0
                      return hired ? <Badge tone="green">{hired} hired</Badge> : null
                    }}
                  />
                  <TableView head={['Source', 'Applications', 'Hired']} rows={r.by_source.map((s) => [s.source, s.count, s.hired])} />
                </>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">No applications in this period.</p>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold">Interviews</h2>
              <p className="mb-3 text-xs text-slate-500">{r.interviews.total} interview(s) planned in the period</p>
              <SegmentedBar
                label="Interviews by status"
                parts={[
                  { label: 'Feedback given', value: r.interviews.completed, color: SERIES.s1 },
                  { label: 'Still scheduled', value: r.interviews.scheduled, color: SERIES.s3 },
                  { label: 'Cancelled', value: r.interviews.cancelled, color: SERIES.s2 },
                ]}
              />
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Decision label="Hire" value={r.interviews.hire} tone="green" />
                <Decision label="Maybe" value={r.interviews.maybe} tone="amber" />
                <Decision label="No hire" value={r.interviews.no_hire} tone="red" />
              </div>
              <TableView
                head={['Interviews', 'Count']}
                rows={[['Feedback given', r.interviews.completed], ['Still scheduled', r.interviews.scheduled], ['Cancelled', r.interviews.cancelled],
                       ['Recommended hire', r.interviews.hire], ['Maybe', r.interviews.maybe], ['No hire', r.interviews.no_hire]]}
              />
            </Card>
          </div>

          <Card>
            <div className="border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold">By opening</h2>
              <p className="text-xs text-slate-500">Applications received in the period, by their current stage</p>
            </div>
            {r.by_opening.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-2.5 font-medium">Opening</th>
                      <th className="px-3 py-2.5 text-right font-medium">Applications</th>
                      <th className="px-3 py-2.5 text-right font-medium">In pipeline</th>
                      <th className="px-3 py-2.5 text-right font-medium">Interviewed+</th>
                      <th className="px-3 py-2.5 text-right font-medium">Hired</th>
                      <th className="px-5 py-2.5 text-right font-medium">Rejected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {r.by_opening.map((o) => (
                      <tr key={o.opening_id} className="hover:bg-slate-50">
                        <td className="px-5 py-2.5">
                          <Link to={`/openings/${o.opening_id}`} className="font-medium text-slate-900 hover:text-brand-700 hover:underline">{o.title}</Link>
                          <span className="ml-2 font-mono text-xs text-slate-400">{o.code}</span>
                          <span className="ml-2"><Badge tone={OPENING_STATUS[o.status].tone}>{OPENING_STATUS[o.status].label}</Badge></span>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{o.total}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{o.active}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{o.interviewed}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{o.hired}</td>
                        <td className="px-5 py-2.5 text-right tabular-nums">{o.rejected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="px-5 py-6 text-sm text-slate-400">No openings with applications in this period.</p>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </Card>
  )
}

function Decision({ label, value, tone }: { label: string; value: number; tone: 'green' | 'amber' | 'red' }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <p className="text-xl font-semibold tabular-nums text-slate-900">{value}</p>
      <Badge tone={tone}>{label}</Badge>
    </div>
  )
}
