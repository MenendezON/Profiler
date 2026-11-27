import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CalendarPlus, CheckCircle2, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { unwrap, cn } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { Constants, type Tables } from '@/lib/database.types'
import { STAGE_LABELS } from '@/lib/constants'
import type { Stage } from '@/lib/applications'
import {
  DECISIONS, DURATIONS, INTERVIEW_TYPES, cancelMailto, defaultSlot, downloadIcs, formatDateTime, invalidateInterviews,
  inviteMailto, toLocalInput, type InterviewDecision, type InterviewType, type InviteInfo,
} from '@/lib/interviews'
import { Alert, Button, Checkbox, Dialog, Field, Input, Select, Spinner, Stars, Textarea } from '@/components/ui'

export type InterviewRow = Tables<'interview_list'>

export interface CandidateContext {
  applicationId: string
  stage: Stage
  candidateName: string
  candidateEmail: string
  openingTitle: string | null
}

export function inviteFromRow(r: InterviewRow, companyName: string): InviteInfo {
  return {
    id: r.id!,
    scheduledAt: r.scheduled_at!,
    durationMinutes: r.duration_minutes ?? 60,
    type: r.type ?? 'in_person',
    candidateName: r.full_name ?? '',
    candidateEmail: r.email ?? '',
    openingTitle: r.opening_title,
    companyName,
    venue: r.location_name ? [r.location_name, r.location_address, r.location_city].filter(Boolean).join(', ') : null,
    details: r.meeting_details,
    interviewerName: r.interviewer_name,
    message: r.message,
  }
}

function useSchedulingOptions() {
  return useQuery({
    queryKey: ['interview-options'],
    queryFn: async () => {
      const [locations, people] = await Promise.all([
        supabase.from('locations').select('id, name, address, city').order('name').then(unwrap),
        supabase.from('profiles').select('id, first_name, last_name, email').eq('status', 'active').order('first_name').then(unwrap),
      ])
      return { locations, people }
    },
  })
}

// ================================================================ schedule / reschedule

export function ScheduleInterviewDialog({ candidate, interview, onClose }: {
  candidate: CandidateContext
  interview?: InterviewRow
  onClose: () => void
}) {
  const qc = useQueryClient()
  const { data: profile } = useProfile()
  const options = useSchedulingOptions()
  const [type, setType] = useState<InterviewType>(interview?.type ?? 'in_person')
  const [saved, setSaved] = useState<InviteInfo | null>(null)
  const isEdit = !!interview
  const canAdvance = !isEdit && (candidate.stage === 'new' || candidate.stage === 'shortlisted')

  const save = useMutation({
    mutationFn: async (f: FormData) => {
      const s = (k: string) => String(f.get(k) ?? '').trim()
      const when = new Date(s('scheduled_at'))
      if (Number.isNaN(when.getTime())) throw new Error('Pick a date and time.')
      const values = {
        scheduled_at: when.toISOString(),
        duration_minutes: Number(s('duration_minutes')),
        type,
        location_id: type === 'in_person' ? s('location_id') || null : null,
        meeting_details: s('meeting_details') || null,
        interviewer_id: s('interviewer_id') || null,
        message: s('message') || null,
      }
      const row = isEdit
        ? unwrap(await supabase.from('interviews').update({ ...values, status: 'scheduled', cancel_reason: null }).eq('id', interview!.id!).select('id').single())
        : unwrap(await supabase.from('interviews').insert({ ...values, application_id: candidate.applicationId }).select('id').single())
      if (canAdvance && f.get('advance') === 'on') {
        unwrap(await supabase.from('opening_applicants').update({ stage: 'interviewed' }).eq('id', candidate.applicationId))
      }
      const loc = options.data?.locations.find((l) => l.id === values.location_id)
      const who = options.data?.people.find((p) => p.id === values.interviewer_id)
      return {
        id: row.id,
        scheduledAt: values.scheduled_at,
        durationMinutes: values.duration_minutes,
        type,
        candidateName: candidate.candidateName,
        candidateEmail: candidate.candidateEmail,
        openingTitle: candidate.openingTitle,
        companyName: profile?.company?.name ?? '',
        venue: loc ? [loc.name, loc.address, loc.city].filter(Boolean).join(', ') : null,
        details: values.meeting_details,
        interviewerName: who ? `${who.first_name} ${who.last_name}`.trim() : null,
        message: values.message,
      } satisfies InviteInfo
    },
    onSuccess: (info) => { invalidateInterviews(qc); setSaved(info) },
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    save.mutate(new FormData(e.currentTarget))
  }

  if (saved) {
    return (
      <Dialog open onClose={onClose} title={isEdit ? 'Interview updated' : 'Interview scheduled'} footer={<Button onClick={onClose}>Done</Button>}>
        <div className="space-y-4 text-center">
          <CheckCircle2 className="mx-auto size-10 text-emerald-500" />
          <p className="text-sm text-slate-600">
            <strong>{saved.candidateName}</strong> · {formatDateTime(saved.scheduledAt)}
          </p>
          <p className="text-sm text-slate-500">Let the candidate know and add it to your calendar:</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a href={inviteMailto(saved)}><Button variant="secondary" className="w-full"><Mail className="size-4" />Email candidate</Button></a>
            <Button variant="secondary" onClick={() => downloadIcs(saved)}><CalendarPlus className="size-4" />Add to calendar (.ics)</Button>
          </div>
        </div>
      </Dialog>
    )
  }

  // Wait for venues/interviewers: uncontrolled <select> defaults only apply to options present on first render.
  if (options.isLoading || !profile) {
    return (
      <Dialog open size="lg" onClose={onClose} title={isEdit ? 'Reschedule interview' : 'Schedule interview'}>
        <div className="flex justify-center py-10"><Spinner /></div>
      </Dialog>
    )
  }

  const { locations = [], people = [] } = options.data ?? {}
  const meta = INTERVIEW_TYPES[type]

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={isEdit ? `Reschedule interview — ${candidate.candidateName}` : `Schedule interview — ${candidate.candidateName}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="schedule-interview" loading={save.isPending}>{isEdit ? 'Save changes' : 'Schedule'}</Button>
        </>
      }
    >
      <form id="schedule-interview" onSubmit={onSubmit} className="space-y-4">
        {(save.error || options.error) && <Alert>{(save.error ?? options.error)!.message}</Alert>}
        <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
          <Field label="Date & time" htmlFor="scheduled_at">
            <Input
              id="scheduled_at"
              name="scheduled_at"
              type="datetime-local"
              required
              defaultValue={interview?.scheduled_at ? toLocalInput(interview.scheduled_at) : defaultSlot()}
            />
          </Field>
          <Field label="Duration" htmlFor="duration_minutes">
            <Select id="duration_minutes" name="duration_minutes" defaultValue={String(interview?.duration_minutes ?? 60)}>
              {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">Interview type</legend>
          <div className="grid grid-cols-3 gap-2">
            {Constants.public.Enums.interview_type.map((t) => {
              const Icon = INTERVIEW_TYPES[t].icon
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  aria-pressed={type === t}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium',
                    type === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <Icon className="size-4" />{INTERVIEW_TYPES[t].label}
                </button>
              )
            })}
          </div>
        </fieldset>

        {type === 'in_person' && (
          <Field label="Venue" htmlFor="location_id">
            <Select id="location_id" name="location_id" defaultValue={interview?.location_id ?? locations[0]?.id ?? ''}>
              <option value="">— No saved location —</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name} ({l.city})</option>)}
            </Select>
          </Field>
        )}
        <Field label={meta.detailsLabel} htmlFor="meeting_details">
          <Input
            id="meeting_details"
            name="meeting_details"
            key={type}
            type={type === 'video' ? 'url' : 'text'}
            defaultValue={interview?.type === type ? interview.meeting_details ?? '' : ''}
            placeholder={meta.placeholder}
          />
        </Field>

        <Field label="Interviewer" htmlFor="interviewer_id">
          <Select id="interviewer_id" name="interviewer_id" defaultValue={interview?.interviewer_id ?? profile?.id ?? ''}>
            <option value="">— Not assigned —</option>
            {people.map((p) => <option key={p.id} value={p.id}>{`${p.first_name} ${p.last_name}`.trim() || p.email}</option>)}
          </Select>
        </Field>

        <Field label="Message for the candidate (optional)" htmlFor="message" hint="Included in the invitation email.">
          <Textarea id="message" name="message" rows={3} defaultValue={interview?.message ?? ''} placeholder="Please bring a copy of your ID and diplomas." />
        </Field>

        {canAdvance && (
          <Checkbox name="advance" defaultChecked label={<>Move the candidate to <strong>{STAGE_LABELS.interviewed}</strong></>} />
        )}
      </form>
    </Dialog>
  )
}

// ================================================================ feedback

const NEXT_STAGE: Partial<Record<InterviewDecision, Stage>> = { hire: 'offered', no_hire: 'rejected' }

export function FeedbackDialog({ interview, onClose }: { interview: InterviewRow; onClose: () => void }) {
  const qc = useQueryClient()
  const [decision, setDecision] = useState<InterviewDecision | null>(interview.decision)
  const [rating, setRating] = useState(interview.rating ?? 0)
  const next = decision ? NEXT_STAGE[decision] : undefined

  const save = useMutation({
    mutationFn: async (f: FormData) => {
      if (!decision) throw new Error('Choose a recommendation.')
      unwrap(
        await supabase
          .from('interviews')
          .update({ status: 'completed', decision, rating, feedback: String(f.get('feedback') ?? '').trim() || null, feedback_at: new Date().toISOString() })
          .eq('id', interview.id!),
      )
      if (next && f.get('move') === 'on') {
        unwrap(await supabase.from('opening_applicants').update({ stage: next }).eq('id', interview.application_id!))
      }
    },
    onSuccess: () => { invalidateInterviews(qc); onClose() },
  })

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={`Interview feedback — ${interview.full_name}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="interview-feedback" loading={save.isPending}>Save feedback</Button>
        </>
      }
    >
      <form id="interview-feedback" onSubmit={(e) => { e.preventDefault(); save.mutate(new FormData(e.currentTarget)) }} className="space-y-4">
        {save.error && <Alert>{save.error.message}</Alert>}
        <p className="text-sm text-slate-500">{formatDateTime(interview.scheduled_at!)}{interview.opening_title ? ` · ${interview.opening_title}` : ''}</p>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">Recommendation</legend>
          <div className="grid grid-cols-3 gap-2">
            {Constants.public.Enums.interview_decision.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDecision(d)}
                aria-pressed={decision === d}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium',
                  decision === d
                    ? d === 'hire' ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : d === 'no_hire' ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                )}
              >
                {DECISIONS[d].label}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <p className="mb-1.5 text-sm font-medium text-slate-700">Rating</p>
          <Stars value={rating} onChange={setRating} size="md" />
        </div>
        <Field label="Remarks" htmlFor="feedback">
          <Textarea id="feedback" name="feedback" rows={5} defaultValue={interview.feedback ?? ''} placeholder="Strengths, concerns, salary expectations, availability…" required />
        </Field>
        {next && (
          <Checkbox key={next} name="move" defaultChecked label={<>Move the candidate to <strong>{STAGE_LABELS[next]}</strong></>} />
        )}
      </form>
    </Dialog>
  )
}

// ================================================================ cancel

export function CancelInterviewDialog({ interview, onClose }: { interview: InterviewRow; onClose: () => void }) {
  const qc = useQueryClient()
  const { data: profile } = useProfile()
  const [done, setDone] = useState(false)

  const cancel = useMutation({
    mutationFn: async (reason: string) =>
      unwrap(await supabase.from('interviews').update({ status: 'cancelled', cancel_reason: reason || null }).eq('id', interview.id!)),
    onSuccess: () => { invalidateInterviews(qc); setDone(true) },
  })

  if (done) {
    return (
      <Dialog open onClose={onClose} title="Interview cancelled" footer={<Button onClick={onClose}>Done</Button>}>
        <div className="space-y-3 text-center">
          <p className="text-sm text-slate-600">Let {interview.full_name} know:</p>
          <a href={cancelMailto(inviteFromRow(interview, profile?.company?.name ?? ''))}>
            <Button variant="secondary"><Mail className="size-4" />Email candidate</Button>
          </a>
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Cancel interview?"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Keep it</Button>
          <Button variant="danger" type="submit" form="cancel-interview" loading={cancel.isPending}>Cancel interview</Button>
        </>
      }
    >
      <form
        id="cancel-interview"
        onSubmit={(e) => { e.preventDefault(); cancel.mutate(String(new FormData(e.currentTarget).get('reason') ?? '').trim()) }}
        className="space-y-3"
      >
        {cancel.error && <Alert>{cancel.error.message}</Alert>}
        <p className="text-sm text-slate-600">{interview.full_name} · {formatDateTime(interview.scheduled_at!)}</p>
        <Field label="Reason (optional, internal)" htmlFor="reason">
          <Input id="reason" name="reason" placeholder="Candidate unavailable, position on hold…" />
        </Field>
      </form>
    </Dialog>
  )
}
