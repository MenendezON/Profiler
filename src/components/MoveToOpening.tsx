import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, FolderOpen, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, unwrap } from '@/lib/utils'
import { initials, invalidateApplications } from '@/lib/applications'
import { Alert, Avatar, Button, Dialog, EmptyState, Field, Input, Select, Spinner } from '@/components/ui'

interface MoveResult { moved: number; skipped: string[] }

function useMoveToOpening() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ ids, openingId }: { ids: string[]; openingId: string }) => {
      const { data, error } = await supabase.rpc('move_to_opening', { p_application_ids: ids, p_opening: openingId })
      if (error) throw new Error(error.message)
      return data as unknown as MoveResult
    },
    onSuccess: () => invalidateApplications(qc),
  })
}

function ResultView({ result, openingTitle, onClose }: { result: MoveResult; openingTitle: string; onClose: () => void }) {
  return (
    <Dialog open onClose={onClose} title="Candidates moved" footer={<Button onClick={onClose}>Done</Button>}>
      <div className="space-y-3 text-center">
        <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
        <p className="text-sm text-slate-700">
          {result.moved ? <><strong>{result.moved}</strong> candidate{result.moved > 1 ? 's' : ''} moved to <strong>{openingTitle}</strong> at the New stage.</> : 'No candidate was moved.'}
        </p>
        {!!result.skipped.length && (
          <p className="rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-800">
            Already in this opening, so left unchanged: {result.skipped.join(', ')}.
          </p>
        )}
      </div>
    </Dialog>
  )
}

/** Choose an opening, then move the given applications into it (from the panel or the bulk bar). */
export function MoveToOpeningDialog({ applicationIds, label, excludeOpeningId, onClose, onMoved }: {
  applicationIds: string[]
  label: string
  excludeOpeningId?: string | null
  onClose: () => void
  onMoved?: () => void
}) {
  const [target, setTarget] = useState('')
  const move = useMoveToOpening()
  const openings = useQuery({
    queryKey: ['openings', 'options-status'],
    queryFn: async () => unwrap(await supabase.from('openings').select('id, title, code, status').order('created_at', { ascending: false })),
  })
  const choices = (openings.data ?? []).filter((o) => o.id !== excludeOpeningId)
  const title = choices.find((o) => o.id === target)?.title ?? ''

  if (move.data) return <ResultView result={move.data} openingTitle={title} onClose={() => { onMoved?.(); onClose() }} />

  return (
    <Dialog
      open
      onClose={onClose}
      title="Move to an opening"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button disabled={!target} loading={move.isPending} onClick={() => move.mutate({ ids: applicationIds, openingId: target })}>Move</Button></>}
    >
      <div className="space-y-3">
        {move.error && <Alert>{move.error.message}</Alert>}
        <p className="text-sm text-slate-600">{label}</p>
        <Field label="Opening" htmlFor="move-opening" hint="The candidate restarts at the New stage of that opening.">
          <Select id="move-opening" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="" disabled>— Select an opening —</option>
            {choices.map((o) => <option key={o.id} value={o.id}>{o.code} · {o.title}{o.status !== 'published' ? ` (${o.status})` : ''}</option>)}
          </Select>
        </Field>
      </div>
    </Dialog>
  )
}

/** Pick candidates from the company talent pool and move them into a given opening. */
export function TalentPoolPicker({ openingId, openingTitle, onClose }: { openingId: string; openingTitle: string; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const move = useMoveToOpening()

  const pool = useQuery({
    queryKey: ['talent-pool', 'list'],
    queryFn: async () =>
      unwrap(await supabase.from('applications').select('*').eq('stage', 'talentpool').order('updated_at', { ascending: false }).limit(500)),
  })

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (pool.data ?? []).filter((r) =>
      !needle ||
      [r.full_name, r.email, r.city, r.opening_title, ...(r.skills ?? [])].some((v) => v?.toLowerCase().includes(needle)),
    )
  }, [pool.data, q])

  if (move.data) return <ResultView result={move.data} openingTitle={openingTitle} onClose={onClose} />

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={`Add from talent pool — ${openingTitle}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected.size} loading={move.isPending} onClick={() => move.mutate({ ids: [...selected], openingId })}>
            Add {selected.size || ''} to this opening
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {(move.error || pool.error) && <Alert>{(move.error ?? pool.error)!.message}</Alert>}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, city, skill" className="pl-9" aria-label="Search talent pool" autoFocus />
        </div>
        {pool.isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : !rows.length ? (
          <EmptyState
            icon={<FolderOpen className="size-5" />}
            title={pool.data?.length ? 'No match' : 'Your talent pool is empty'}
            description={pool.data?.length ? 'Try another search.' : 'Candidates you move to the talent pool, or add without an opening, appear here.'}
          />
        ) : (
          <ul className="max-h-[50vh] divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
            {rows.map((r) => (
              <li key={r.id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-slate-50">
                  <input type="checkbox" className="size-4 accent-brand-600" checked={selected.has(r.id!)} onChange={() => toggle(r.id!)} />
                  <Avatar text={initials(r.first_name, r.last_name)} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{r.full_name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {r.email}{r.city ? ` · ${r.city}` : ''}{r.opening_title ? ` · previously ${r.opening_title}` : ''}
                    </p>
                  </div>
                  <span className="hidden text-xs text-slate-400 sm:block">{formatDate(r.updated_at!)}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  )
}
