import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, ClipboardList, Globe, MapPin, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, unwrap } from '@/lib/utils'
import { Constants, type Enums } from '@/lib/database.types'
import { OPENING_STATUS, STAGE_LABELS, questionTypeLabel } from '@/lib/constants'
import { Alert, Badge, Button, Card, PageHeader, Spinner } from '@/components/ui'
import { BackTo } from '../settings/LocationsPages'
import { CopyField } from '@/components/CopyField'
import { Can, useProfile } from '@/lib/auth'
import { jobUrl } from '@/lib/careers'
import { OPENINGS_KEY } from './OpeningsListPage'

export function OpeningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const key = [...OPENINGS_KEY, 'detail', id]
  const { data: profile } = useProfile()

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
            <Link to="edit"><Button variant="secondary"><Pencil className="size-4" />Edit</Button></Link>
            <Button
              variant="ghost"
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
              <Trash2 className="size-4" />Delete
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
              <span className="text-sm text-slate-500">{totalApplicants} applicant(s)</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {Constants.public.Enums.applicant_stage.map((s) => (
                <Link
                  key={s}
                  to={`/applications?opening=${o.id}&stage=${s}`}
                  className="rounded-lg border border-slate-200 p-3 text-center hover:border-brand-300 hover:bg-brand-50"
                >
                  <p className="text-xl font-semibold tabular-nums">{counts[s] ?? 0}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{STAGE_LABELS[s]}</p>
                </Link>
              ))}
            </div>
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
