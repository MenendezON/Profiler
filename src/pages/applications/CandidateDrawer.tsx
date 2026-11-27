import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Briefcase, Calendar, CalendarPlus, Check, Copy, Download, ExternalLink, FileText, FolderOpen, Mail, MapPin, MoreHorizontal,
  Pencil, Phone, Repeat, Trash2, Upload, UserMinus, X,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, unwrap } from '@/lib/utils'
import { Can, useProfile, useRole } from '@/lib/auth'
import { Constants, type Json, type TablesUpdate } from '@/lib/database.types'
import { STAGE_LABELS, questionTypeLabel } from '@/lib/constants'
import {
  RESUME_ACCEPT, STAGE_TONES, deleteApplicantFiles, initials, invalidateApplications, signedFileUrl,
  uploadApplicantFile, validateResume, type Stage,
} from '@/lib/applications'
import { Alert, Avatar, Badge, Button, Dialog, Field, Input, Select, Spinner, Stars, Textarea } from '@/components/ui'
import { ScheduleInterviewDialog } from '@/components/interviews/InterviewDialogs'
import { InterviewItem } from '@/components/interviews/InterviewItem'
import { ActivityItem } from '@/components/ActivityTimeline'
import { SendEmailDialog } from '@/components/SendEmailDialog'

export function CandidateDrawer({ applicationId, onClose, onOpen }: {
  applicationId: string
  onClose: () => void
  onOpen: (id: string) => void
}) {
  const qc = useQueryClient()
  const { data: profile } = useProfile()
  const { canEdit } = useRole()
  const fileInput = useRef<HTMLInputElement>(null)
  const [menu, setMenu] = useState(false)
  const [dialog, setDialog] = useState<'edit' | 'move' | 'schedule' | 'email' | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !dialog && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, dialog])

  const { data, isLoading, error } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: async () => {
      const app = unwrap(
        await supabase
          .from('opening_applicants')
          .select(`*,
            applicant:applicants(*),
            opening:openings(id, title, code, status, template:screening_templates(questions(id, title, type, position)))`)
          .eq('id', applicationId)
          .single(),
      )
      const others = unwrap(
        await supabase
          .from('opening_applicants')
          .select('id, stage, created_at, opening:openings(title, code)')
          .eq('applicant_id', app.applicant_id)
          .neq('id', applicationId)
          .order('created_at', { ascending: false }),
      )
      const interviews = unwrap(
        await supabase.from('interview_list').select('*').eq('application_id', applicationId).order('scheduled_at', { ascending: false }),
      )
      const activity = unwrap(
        await supabase.from('activity_feed').select('*').eq('applicant_id', app.applicant_id).order('created_at', { ascending: false }).limit(50),
      )
      return { app, others, interviews, activity }
    },
  })

  const app = data?.app
  const a = app?.applicant
  const done = () => invalidateApplications(qc)

  const patchApp = useMutation({
    mutationFn: async (values: { stage?: Stage; rating?: number; notes?: string | null }) =>
      unwrap(await supabase.from('opening_applicants').update(values).eq('id', applicationId)),
    onSuccess: done,
  })

  const replaceCv = useMutation({
    mutationFn: async (file: File) => {
      const invalid = validateResume(file)
      if (invalid) throw new Error(invalid)
      const path = await uploadApplicantFile(profile!.company_id, a!.id, file, 'resume')
      unwrap(await supabase.from('applicants').update({ resume_path: path }).eq('id', a!.id))
      if (a!.resume_path) await supabase.storage.from('resumes').remove([a!.resume_path])
    },
    onSuccess: done,
  })

  const removeApplication = useMutation({
    mutationFn: async () => unwrap(await supabase.from('opening_applicants').delete().eq('id', applicationId)),
    onSuccess: () => { done(); data?.others[0] ? onOpen(data.others[0].id) : onClose() },
  })

  const deleteCandidate = useMutation({
    mutationFn: async () => {
      await deleteApplicantFiles(profile!.company_id, a!)
      unwrap(await supabase.from('applicants').delete().eq('id', a!.id))
    },
    onSuccess: () => { done(); onClose() },
  })

  async function openCv(download: boolean) {
    if (!a?.resume_path) return
    try {
      window.open(await signedFileUrl(a.resume_path, download), '_blank', 'noopener')
    } catch (e) {
      alert((e as Error).message)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const err = error ?? patchApp.error ?? replaceCv.error ?? removeApplication.error ?? deleteCandidate.error
  const questions = [...(app?.opening?.template?.questions ?? [])].sort((x, y) => x.position - y.position)
  const answers = (app?.answers ?? {}) as Record<string, Json>

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Candidate">
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div className="flex items-center gap-1">
            <button onClick={copyLink} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100" title="Copy link to this candidate">
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
          <div className="relative flex items-center gap-1">
            {canEdit && <button onClick={() => setMenu((m) => !m)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="More actions" aria-expanded={menu}>
              <MoreHorizontal className="size-5" />
            </button>}
            {menu && app && (
              <div className="absolute right-8 top-9 z-10 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg" onMouseLeave={() => setMenu(false)}>
                <MenuItem icon={Pencil} onClick={() => { setMenu(false); setDialog('edit') }}>Edit profile</MenuItem>
                <MenuItem icon={Repeat} onClick={() => { setMenu(false); setDialog('move') }}>Move to another opening</MenuItem>
                <MenuItem icon={FolderOpen} onClick={() => { setMenu(false); patchApp.mutate({ stage: 'talentpool' }) }}>Move to talent pool</MenuItem>
                {!!data?.others.length && (
                  <MenuItem icon={UserMinus} onClick={() => { setMenu(false); confirm('Remove this application? The candidate keeps their other applications.') && removeApplication.mutate() }}>
                    Remove this application
                  </MenuItem>
                )}
                <div className="my-1 border-t border-slate-100" />
                <MenuItem
                  icon={Trash2}
                  danger
                  onClick={() => {
                    setMenu(false)
                    if (confirm(`Permanently delete ${a?.first_name} ${a?.last_name}, all their applications and files? This cannot be undone.`)) deleteCandidate.mutate()
                  }}
                >
                  Delete candidate
                </MenuItem>
              </div>
            )}
            <button onClick={onClose} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && <div className="p-6"><Spinner /></div>}
          {err && <div className="p-5 pb-0"><Alert>{err.message}</Alert></div>}

          {app && a && (
            <div className="space-y-6 p-5">
              {/* identity */}
              <div className="flex items-start gap-4">
                <Avatar text={initials(a.first_name, a.last_name)} className="size-14 text-lg" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">{a.first_name} {a.last_name}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {app.opening ? (
                      <Link to={`/openings/${app.opening.id}`} className="hover:text-brand-600 hover:underline">
                        {app.opening.code} · {app.opening.title}
                      </Link>
                    ) : 'No opening'}
                  </p>
                  <div className="mt-2"><Stars value={app.rating} size="md" onChange={canEdit ? (rating) => patchApp.mutate({ rating }) : undefined} disabled={patchApp.isPending} /></div>
                </div>
                <Can edit>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => setDialog('schedule')}><CalendarPlus className="size-4" />Schedule interview</Button>
                    <Button size="sm" variant="secondary" onClick={() => setDialog('email')}><Mail className="size-4" />Email</Button>
                  </div>
                </Can>
              </div>

              {/* stage */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Stage</p>
                <div className="flex flex-wrap gap-1.5">
                  {Constants.public.Enums.applicant_stage.map((s) => (
                    <button
                      key={s}
                      disabled={patchApp.isPending || !canEdit}
                      onClick={() => s !== app.stage && patchApp.mutate({ stage: s })}
                      className={
                        s === app.stage
                          ? 'rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white'
                          : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 enabled:hover:bg-slate-200 disabled:cursor-default'
                      }
                    >
                      {STAGE_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* contact */}
              <dl className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <Info icon={Mail}><a href={`mailto:${a.email}`} className="text-brand-700 hover:underline">{a.email}</a></Info>
                <Info icon={Phone}>{a.phone ? <a href={`tel:${a.phone}`} className="hover:underline">{a.phone}</a> : '—'}</Info>
                <Info icon={MapPin}>{a.city || '—'}</Info>
                <Info icon={Briefcase}>{a.experience} year(s) of experience</Info>
                <Info icon={Calendar}>Applied {formatDate(app.created_at)}</Info>
                <Info icon={FolderOpen}>Source: {app.source}</Info>
              </dl>

              {!!a.skills.length && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Skills</p>
                  <div className="flex flex-wrap gap-1.5">{a.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>
                </div>
              )}

              {/* CV */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">CV</p>
                <input
                  ref={fileInput}
                  type="file"
                  accept={RESUME_ACCEPT}
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) replaceCv.mutate(f); e.target.value = '' }}
                />
                {a.resume_path ? (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <FileText className="size-8 text-brand-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.resume_path.split('/').pop()}</p>
                      <p className="text-xs text-slate-500">Private file — links expire after 10 minutes</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => openCv(false)}><ExternalLink className="size-4" />Open</Button>
                    <button onClick={() => openCv(true)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title="Download"><Download className="size-4" /></button>
                    {canEdit && <button onClick={() => fileInput.current?.click()} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" title="Replace"><Upload className="size-4" /></button>}
                  </div>
                ) : !canEdit ? (
                  <p className="text-sm text-slate-400">No CV uploaded.</p>
                ) : (
                  <Button variant="secondary" size="sm" loading={replaceCv.isPending} onClick={() => fileInput.current?.click()}>
                    <Upload className="size-4" />Upload CV
                  </Button>
                )}
                {replaceCv.isPending && a.resume_path && <p className="mt-2 text-xs text-slate-500">Uploading…</p>}
              </div>

              {/* interviews */}
              {!!data?.interviews.length && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Interviews</p>
                  <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {data.interviews.map((iv) => <InterviewItem key={iv.id} row={iv} compact />)}
                  </div>
                </div>
              )}

              {/* notes */}
              <NotesEditor key={app.id} readOnly={!canEdit} initial={app.notes ?? ''} saving={patchApp.isPending} onSave={(notes) => patchApp.mutate({ notes: notes || null })} />

              {/* screening answers */}
              {!!questions.length && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Screening answers</p>
                  <dl className="space-y-3 text-sm">
                    {questions.map((q) => {
                      const v = answers[q.id]
                      return (
                        <div key={q.id}>
                          <dt className="text-slate-500">{q.title} <span className="text-xs text-slate-400">({questionTypeLabel(q.type)})</span></dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {v === undefined || v === null || v === '' ? <span className="font-normal text-slate-400">Not answered</span> : Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              )}

              {/* activity */}
              {!!data?.activity.length && (
                <details className="group" open={data.activity.length <= 6}>
                  <summary className="mb-1 cursor-pointer list-none text-xs font-medium uppercase tracking-wide text-slate-500 hover:text-slate-700">
                    Activity ({data.activity.length}) <span className="group-open:hidden">▸</span><span className="hidden group-open:inline">▾</span>
                  </summary>
                  <ul className="divide-y divide-slate-100">{data.activity.map((r) => <ActivityItem key={r.id} row={r} compact />)}</ul>
                </details>
              )}

              {/* other applications */}
              {!!data?.others.length && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Other applications</p>
                  <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                    {data.others.map((o) => (
                      <li key={o.id}>
                        <button onClick={() => onOpen(o.id)} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50">
                          <span className="truncate">{o.opening ? `${o.opening.code} · ${o.opening.title}` : 'No opening'}</span>
                          <Badge tone={STAGE_TONES[o.stage]}>{STAGE_LABELS[o.stage]}</Badge>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {dialog === 'edit' && a && <EditProfileDialog applicant={a} onClose={() => setDialog(null)} onSaved={() => { done(); setDialog(null) }} />}
      {dialog === 'schedule' && app && a && (
        <ScheduleInterviewDialog
          candidate={{
            applicationId: app.id,
            stage: app.stage,
            firstName: a.first_name,
            lastName: a.last_name,
            candidateName: `${a.first_name} ${a.last_name}`,
            candidateEmail: a.email,
            openingTitle: app.opening?.title ?? null,
          }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'email' && app && a && (
        <SendEmailDialog
          kind={app.stage === 'rejected' ? 'rejection' : app.stage === 'offered' ? 'offer' : undefined}
          recipient={{ applicationId: app.id, firstName: a.first_name, lastName: a.last_name, email: a.email, jobTitle: app.opening?.title ?? null }}
          onClose={() => { setDialog(null); qc.invalidateQueries({ queryKey: ['application', applicationId] }) }}
        />
      )}
      {dialog === 'move' && app && (
        <MoveDialog
          applicationId={app.id}
          currentOpeningId={app.opening_id}
          onClose={() => setDialog(null)}
          onSaved={() => { done(); setDialog(null) }}
        />
      )}
    </div>
  )
}

function MenuItem({ icon: Icon, children, onClick, danger }: { icon: typeof Pencil; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 ${danger ? 'text-red-600' : 'text-slate-700'}`}>
      <Icon className="size-4" />{children}
    </button>
  )
}

function Info({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-slate-700">
      <Icon className="size-4 shrink-0 text-slate-400" />
      <span className="truncate">{children}</span>
    </div>
  )
}

function NotesEditor({ initial, onSave, saving, readOnly }: { initial: string; onSave: (v: string) => void; saving: boolean; readOnly?: boolean }) {
  const [value, setValue] = useState(initial)
  if (readOnly) {
    return (
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Notes</p>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{initial || <span className="text-slate-400">No notes.</span>}</p>
      </div>
    )
  }
  const dirty = value.trim() !== initial.trim()
  return (
    <div>
      <label htmlFor="notes" className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">Notes</label>
      <Textarea id="notes" rows={3} value={value} onChange={(e) => setValue(e.target.value)} placeholder="Interview impressions, salary expectations, availability…" />
      {dirty && (
        <div className="mt-2 flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setValue(initial)}>Discard</Button>
          <Button size="sm" loading={saving} onClick={() => onSave(value.trim())}>Save notes</Button>
        </div>
      )}
    </div>
  )
}

function EditProfileDialog({ applicant, onClose, onSaved }: {
  applicant: { id: string; first_name: string; last_name: string; email: string; phone: string; city: string; experience: number; skills: string[] }
  onClose: () => void
  onSaved: () => void
}) {
  const save = useMutation({
    mutationFn: async (values: TablesUpdate<'applicants'>) => unwrap(await supabase.from('applicants').update(values).eq('id', applicant.id)),
    onSuccess: onSaved,
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const s = (k: string) => String(f.get(k) ?? '').trim()
    save.mutate({
      first_name: s('first_name'),
      last_name: s('last_name'),
      email: s('email').toLowerCase(),
      phone: s('phone'),
      city: s('city'),
      experience: Number(s('experience') || 0),
      skills: s('skills').split(',').map((x) => x.trim()).filter(Boolean),
    })
  }

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title="Edit profile"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="edit-profile" loading={save.isPending}>Save</Button></>}
    >
      <form id="edit-profile" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        {save.error && <div className="sm:col-span-2"><Alert>{friendlyError(save.error.message)}</Alert></div>}
        <Field label="First name" htmlFor="e-first"><Input id="e-first" name="first_name" defaultValue={applicant.first_name} required /></Field>
        <Field label="Last name" htmlFor="e-last"><Input id="e-last" name="last_name" defaultValue={applicant.last_name} required /></Field>
        <Field label="Email" htmlFor="e-email"><Input id="e-email" name="email" type="email" defaultValue={applicant.email} required /></Field>
        <Field label="Phone" htmlFor="e-phone"><Input id="e-phone" name="phone" type="tel" defaultValue={applicant.phone} /></Field>
        <Field label="City" htmlFor="e-city"><Input id="e-city" name="city" defaultValue={applicant.city} /></Field>
        <Field label="Years of experience" htmlFor="e-exp"><Input id="e-exp" name="experience" type="number" min={0} max={60} defaultValue={applicant.experience} /></Field>
        <div className="sm:col-span-2">
          <Field label="Skills" htmlFor="e-skills" hint="Separate with commas.">
            <Input id="e-skills" name="skills" defaultValue={applicant.skills.join(', ')} />
          </Field>
        </div>
      </form>
    </Dialog>
  )
}

function MoveDialog({ applicationId, currentOpeningId, onClose, onSaved }: {
  applicationId: string
  currentOpeningId: string | null
  onClose: () => void
  onSaved: () => void
}) {
  const openings = useQuery({
    queryKey: ['openings', 'options'],
    queryFn: async () => unwrap(await supabase.from('openings').select('id, title, code').order('created_at', { ascending: false })),
  })
  const [target, setTarget] = useState('')
  const move = useMutation({
    mutationFn: async () =>
      unwrap(await supabase.from('opening_applicants').update({ opening_id: target || null, stage: 'new' }).eq('id', applicationId)),
    onSuccess: onSaved,
  })
  const choices = (openings.data ?? []).filter((o) => o.id !== currentOpeningId)

  return (
    <Dialog
      open
      onClose={onClose}
      title="Move to another opening"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => move.mutate()} disabled={!target} loading={move.isPending}>Move</Button></>}
    >
      <div className="space-y-3">
        {move.error && <Alert>{friendlyError(move.error.message)}</Alert>}
        <Field label="Opening" htmlFor="move-target" hint="The application restarts at the New stage.">
          <Select id="move-target" value={target} onChange={(e) => setTarget(e.target.value)}>
            <option value="" disabled>— Select an opening —</option>
            {choices.map((o) => <option key={o.id} value={o.id}>{o.code} · {o.title}</option>)}
          </Select>
        </Field>
      </div>
    </Dialog>
  )
}

export function friendlyError(message: string) {
  if (message.includes('applicants_company_email_key')) return 'Another candidate already uses this email address.'
  if (message.includes('opening_applicants_opening_applicant_key')) return 'This candidate has already applied to that opening.'
  return message
}
