import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, ClipboardList, ExternalLink, FolderOpen, Globe, MapPin, Paperclip, Pencil, Plus, Trash2, UserPlus, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, unwrap } from '@/lib/utils'
import { Constants, type Enums } from '@/lib/database.types'
import { OPENING_STATUS, STAGE_LABELS, questionTypeLabel } from '@/lib/constants'
import { Alert, Avatar, Badge, Button, Card, EmptyState, PageHeader, Spinner, Stars } from '@/components/ui'
import { STAGE_TONES, initials, type Stage } from '@/lib/applications'
import { CandidateDrawer } from '../applications/CandidateDrawer'
import { TalentPoolPicker } from '@/components/MoveToOpening'
import { BackTo } from '../settings/LocationsPages'
import { CopyField } from '@/components/CopyField'
import { Can, useProfile, useRole } from '@/lib/auth'
import { jobUrl } from '@/lib/careers'
import { OPENINGS_KEY } from './OpeningsListPage'

// Talent pool is company-wide (card on the right), so the opening's pipeline shows the six hiring stages.
const PIPELINE_STAGES: Stage[] = ['new', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected']

export function OpeningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const key = [...OPENINGS_KEY, 'detail', id]
  const { data: profile } = useProfile()
  const { canEdit } = useRole()
  const [params, setParams] = useSearchParams()
  const openId = params.get('application')
  const [stageFilter, setStageFilter] = useState<Stage | 'all'>('all')
  const [picking, setPicking] = useState(false)
  const setApplication = (appId: string | null) => {
    const next = new URLSearchParams(params)
    if (appId) next.set('application', appId)
    else next.delete('application')
    setParams(next, { replace: true })
  }

  const candidates = useQuery({
    queryKey: ['opening-candidates', id],
    queryFn: async () => unwrap(await supabase.from('applications').select('*').eq('opening_id', id!).order('created_at', { ascending: false })),
  })

  // company-wide talent pool (distinct candidates)
  const pool = useQuery({
    queryKey: ['talent-pool', 'count'],
    queryFn: async () => new Set(unwrap(await supabase.from('applications').select('applicant_id').eq('stage', 'talentpool')).map((r) => r.applicant_id)).size,
  })

  const { data: o, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () =>
      unwrap(
        await supabase
          .from('openings')
          .select(`*,
            location:locations(name, address, city, country),
            department:departments(name),
            template:screening_templates(id, name, questions(id, title, type, required, position)),
            author:profiles(first_name, last_name)`)
          .eq('id', id!)
          .single(),
      ),
  })

  const pipeline = useQuery({
    queryKey: ['opening-pipeline', id],
    queryFn: async () => unwrap(await supabase.from('opening_pipeline_counts').select('stage, total').eq('opening_id', id!)) ?? [],
  })

  const invalidateLists = () => {
    qc.invalidateQueries({ queryKey: OPENINGS_KEY })
    qc.invalidateQueries({ queryKey: ['opening-status-counts'] })
    qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
  }

  const setStatus = useMutation({
    mutationFn: async (status: Enums<'opening_status'>) => unwrap(await supabase.from('openings').update({ status }).eq('id', id!)),
    onSuccess: invalidateLists,
  })

  const remove = useMutation({
    mutationFn: async () => unwrap(await supabase.from('openings').delete().eq('id', id!)),
    onSuccess: () => { invalidateLists(); navigate('/openings') },
  })

  if (isLoading) return <Spinner />
  if (error || !o) return <Alert>{error?.message ?? 'Opening not found'}</Alert>

  const counts = Object.fromEntries((pipeline.data ?? []).map((r) => [r.stage, r.total ?? 0])) as Partial<Record<Enums<'applicant_stage'>, number>>
  const totalApplicants = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0)
  const visible = (candidates.data ?? []).filter((c) => stageFilter === 'all' || c.stage === stageFilter)
  const questions = [...(o.template?.questions ?? [])].sort((a, b) => a.position - b.position)
  const st = OPENING_STATUS[o.status]

  return (
    <>
      <BackTo to="/openings" label="Job openings" />
      <PageHeader
        title={o.title}
        description={`${o.code} · created ${formatDate(o.created_at)}${o.author ? ` by ${o.author.first_name} ${o.author.last_name}` : ''}`}
        actions={
          <Can edit>
            <Link to={`/applications/new?opening=${o.id}`}><Button><UserPlus className="size-4" />Add candidate</Button></Link>
            <Link to="/openings/new"><Button variant="secondary"><Plus className="size-4" />New opening</Button></Link>
            <Link to="edit"><Button variant="secondary"><Pencil className="size-4" />Edit</Button></Link>
            <Button
              variant="ghost"
              title="Delete opening"
              className="text-red-600 hover:bg-red-50"
              loading={remove.isPending}
              onClick={() =>
                confirm(
                  totalApplicants
                    ? `Delete “${o.title}”? Its ${totalApplicants} application(s) will be removed from this opening (candidates stay in your database).`
                    : `Delete “${o.title}”?`,
                ) && remove.mutate()
              }
            >
              <Trash2 className="size-4" /><span className="sr-only">Delete</span>
            </Button>
          </Can>
        }
      />
      {(setStatus.error || remove.error) && <div className="mb-4"><Alert>{(setStatus.error ?? remove.error)!.message}</Alert></div>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Pipeline</h2>
              <Link to={`/applications?opening=${o.id}&stage=all`} className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline">
                Open in Applications <ExternalLink className="size-3" />
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {PIPELINE_STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStageFilter(stageFilter === s ? 'all' : s)}
                  aria-pressed={stageFilter === s}
                  className={cn(
                    'rounded-lg border p-3 text-center transition-colors',
                    stageFilter === s ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/50',
                  )}
                >
                  <p className="text-xl font-semibold tabular-nums">{counts[s] ?? 0}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{STAGE_LABELS[s]}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
              <h2 className="text-sm font-semibold">
                Candidates{stageFilter !== 'all' && <> · {STAGE_LABELS[stageFilter]}</>}
                <span className="ml-1.5 font-normal text-slate-400">{visible.length}</span>
              </h2>
              <div className="flex items-center gap-2">
                {stageFilter !== 'all' && <Button size="sm" variant="ghost" onClick={() => setStageFilter('all')}>Show all</Button>}
                <Can edit>
                  <Link to={`/applications/new?opening=${o.id}`}><Button size="sm" variant="secondary"><UserPlus className="size-4" />Add candidate</Button></Link>
                </Can>
              </div>
            </div>
            {candidates.isLoading ? (
              <div className="p-5"><Spinner /></div>
            ) : !visible.length ? (
              <EmptyState
                icon={<Users className="size-5" />}
                title={stageFilter === 'all' ? 'No candidates yet' : `No candidates at ${STAGE_LABELS[stageFilter]}`}
                description={stageFilter === 'all' ? 'Add a candidate, pick people from your talent pool, or share the application link.' : 'Choose another stage above.'}
                action={stageFilter === 'all' && canEdit ? (
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link to={`/applications/new?opening=${o.id}`}><Button size="sm"><UserPlus className="size-4" />Add candidate</Button></Link>
                    <Button size="sm" variant="secondary" onClick={() => setPicking(true)}><FolderOpen className="size-4" />Add from talent pool</Button>
                  </div>
                ) : undefined}
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {visible.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => setApplication(c.id!)} className={cn('flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50', openId === c.id && 'bg-brand-50')}>
                      <Avatar text={initials(c.first_name, c.last_name)} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                          <span className="truncate">{c.full_name}</span>
                          {c.resume_path && <Paperclip className="size-3 shrink-0 text-slate-400" aria-label="Has CV" />}
                        </p>
                        <p className="truncate text-xs text-slate-500">{c.email}{c.city ? ` · ${c.city}` : ''} · {c.source}</p>
                      </div>
                      <span className="hidden sm:block"><Stars value={c.rating ?? 0} /></span>
                      <Badge tone={STAGE_TONES[c.stage!]}>{STAGE_LABELS[c.stage!]}</Badge>
                      <span className="hidden w-24 text-right text-xs text-slate-400 md:block">{formatDate(c.created_at!)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold">Description</h2>
            {o.description.trim() ? (
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{o.description}</div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">No description yet.</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-brand-50 p-2 text-brand-600"><FolderOpen className="size-5" /></span>
              <div className="flex-1">
                <h2 className="text-sm font-semibold">Talent pool</h2>
                <p className="mt-0.5 text-sm text-slate-600">
                  <span className="text-lg font-semibold tabular-nums text-slate-900">{pool.data ?? '–'}</span> candidate{pool.data === 1 ? '' : 's'} kept for future roles
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Can edit>
                <Button size="sm" onClick={() => setPicking(true)} disabled={!pool.data}><Plus className="size-4" />Add from talent pool</Button>
              </Can>
              <Link to="/applications?stage=talentpool"><Button size="sm" variant="ghost">View pool</Button></Link>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold">Status</h2>
            <div className="mt-3"><Badge tone={st.tone}>{st.label}</Badge></div>
            <p className="mt-2 text-xs text-slate-500">{st.hint}</p>
            {o.status === 'published' && profile?.company && (
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-medium text-slate-600">Application link</p>
                <CopyField value={jobUrl(profile.company.slug, o.id)} label="Application link" />
              </div>
            )}
            <Can edit><div className="mt-4 flex flex-wrap gap-2">
              {Constants.public.Enums.opening_status.filter((s) => s !== o.status).map((s) => (
                <Button key={s} size="sm" variant="secondary" loading={setStatus.isPending && setStatus.variables === s} onClick={() => setStatus.mutate(s)}>
                  Make {OPENING_STATUS[s].label.toLowerCase()}
                </Button>
              ))}
            </div></Can>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold">Details</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <Row label="Department" icon={Building2}>{o.department?.name ?? '—'}</Row>
              <Row label="Location" icon={MapPin}>{o.location ? `${o.location.name}, ${o.location.city}` : '—'}</Row>
              <Row label="Remote" icon={Globe}>{o.remote ? 'Yes' : 'No'}</Row>
              <Row label="Type">{o.type}</Row>
              <Row label="Experience">{o.experience || '—'}</Row>
              <Row label="Industry">{o.industry || '—'}</Row>
            </dl>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Screening questions</h2>
              {o.template && (
                <Link to={`/settings/screening-templates/${o.template.id}`} className="text-xs font-medium text-brand-600 hover:underline">Edit</Link>
              )}
            </div>
            {!o.template ? (
              <p className="mt-3 text-sm text-slate-500">Standard application form only.</p>
            ) : (
              <>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><ClipboardList className="size-3" />{o.template.name}</p>
                <ol className="mt-3 space-y-2">
                  {questions.map((q, i) => (
                    <li key={q.id} className="text-sm">
                      <span className="text-slate-400">{i + 1}.</span> {q.title}
                      {q.required && <span className="text-red-500"> *</span>}
                      <span className="ml-1 text-xs text-slate-400">({questionTypeLabel(q.type)})</span>
                    </li>
                  ))}
                  {!questions.length && <li className="text-sm text-slate-400">This template has no questions yet.</li>}
                </ol>
              </>
            )}
          </Card>
        </div>
      </div>
      {openId && <CandidateDrawer applicationId={openId} onClose={() => setApplication(null)} onOpen={setApplication} />}
      {picking && <TalentPoolPicker openingId={o.id} openingTitle={o.title} onClose={() => setPicking(false)} />}
    </>
  )
}

function Row({ label, icon: Icon, children }: { label: string; icon?: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className={cn('flex items-center gap-1.5 text-slate-500')}>{Icon && <Icon className="size-3.5" />}{label}</dt>
      <dd className="text-right font-medium text-slate-800">{children}</dd>
    </div>
  )
}
