import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { unwrap } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { Constants, type Json, type Tables } from '@/lib/database.types'
import { STAGE_LABELS } from '@/lib/constants'
import { RESUME_ACCEPT, invalidateApplications, uploadApplicantFile, validateResume, type Stage } from '@/lib/applications'
import { Alert, Button, Card, Checkbox, Field, Input, PageHeader, Select, Spinner, Textarea } from '@/components/ui'
import { BackTo } from '../settings/LocationsPages'
import { SOURCES } from './ApplicationsPage'
import { friendlyError } from './CandidateDrawer'

type Question = Pick<Tables<'questions'>, 'id' | 'title' | 'type' | 'required' | 'options' | 'position'>

export function AddCandidatePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: profile } = useProfile()
  const [openingId, setOpeningId] = useState(params.get('opening') ?? '')
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const openings = useQuery({
    queryKey: ['openings', 'with-questions'],
    queryFn: async () =>
      unwrap(
        await supabase
          .from('openings')
          .select('id, title, code, status, template:screening_templates(questions(id, title, type, required, options, position))')
          .order('created_at', { ascending: false }),
      ),
  })

  const opening = openings.data?.find((o) => o.id === openingId)
  const questions: Question[] = [...(opening?.template?.questions ?? [])].sort((a, b) => a.position - b.position)

  const save = useMutation({
    mutationFn: async (form: FormData) => {
      if (!profile) throw new Error('Profile not loaded yet')
      const s = (k: string) => String(form.get(k) ?? '').trim()
      const email = s('email').toLowerCase()

      // 1. reuse an existing candidate with the same email, otherwise create one
      const existing = unwrap(await supabase.from('applicants').select('id').eq('email', email).maybeSingle())
      let applicantId = existing?.id
      const created = !applicantId
      if (!applicantId) {
        const row = unwrap(
          await supabase
            .from('applicants')
            .insert({
              first_name: s('first_name'),
              last_name: s('last_name'),
              email,
              phone: s('phone'),
              city: s('city'),
              experience: Number(s('experience') || 0),
              skills: s('skills').split(',').map((x) => x.trim()).filter(Boolean),
              source: s('source'),
            })
            .select('id')
            .single(),
        )
        applicantId = row.id
      }

      try {
        // 2. files
        const fileUpdate: { resume_path?: string; cover_letter_path?: string } = {}
        if (resume) fileUpdate.resume_path = await uploadApplicantFile(profile.company_id, applicantId, resume, 'resume')
        if (coverLetter) fileUpdate.cover_letter_path = await uploadApplicantFile(profile.company_id, applicantId, coverLetter, 'cover-letter')
        if (Object.keys(fileUpdate).length) unwrap(await supabase.from('applicants').update(fileUpdate).eq('id', applicantId))

        // 3. application
        const answers: Record<string, Json> = {}
        for (const q of questions) {
          if (q.type === 'multiple_choice') answers[q.id] = form.getAll(`q_${q.id}`).map(String)
          else if (q.type === 'yes_no') { const v = form.get(`q_${q.id}`); if (v) answers[q.id] = v === 'yes' }
          else if (q.type === 'number') { const v = s(`q_${q.id}`); if (v) answers[q.id] = Number(v) }
          else if (q.type !== 'file') { const v = s(`q_${q.id}`); if (v) answers[q.id] = v }
        }
        const app = unwrap(
          await supabase
            .from('opening_applicants')
            .insert({
              applicant_id: applicantId,
              opening_id: openingId || null,
              stage: s('stage') as Stage,
              source: s('source'),
              notes: s('notes') || null,
              answers,
            })
            .select('id')
            .single(),
        )
        return { applicationId: app.id, reused: !created }
      } catch (e) {
        // roll back a candidate we just created so a retry doesn't hit the duplicate-email rule
        if (created) await supabase.from('applicants').delete().eq('id', applicantId)
        throw e
      }
    },
    onSuccess: ({ applicationId }) => {
      invalidateApplications(qc)
      navigate(`/applications?stage=all&application=${applicationId}`)
    },
  })

  function pickFile(set: (f: File | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null
      const invalid = f ? validateResume(f) : null
      setFileError(invalid)
      set(invalid ? null : f)
      e.target.value = ''
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    save.mutate(new FormData(e.currentTarget))
  }

  if (openings.isLoading) return <Spinner />

  return (
    <>
      <BackTo to="/applications" label="Applications" />
      <PageHeader title="Add candidate" description="Record a candidate who applied by email, in person or through a referral." />

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {(save.error || openings.error || fileError) && <Alert>{fileError ?? friendlyError((save.error ?? openings.error)!.message)}</Alert>}

          <Card className="grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="text-sm font-semibold sm:col-span-2">Candidate</h2>
            <Field label="First name" htmlFor="first_name"><Input id="first_name" name="first_name" autoComplete="off" required /></Field>
            <Field label="Last name" htmlFor="last_name"><Input id="last_name" name="last_name" autoComplete="off" required /></Field>
            <Field label="Email" htmlFor="email" hint="If this email already exists, the new application is added to that candidate.">
              <Input id="email" name="email" type="email" autoComplete="off" required />
            </Field>
            <Field label="Mobile" htmlFor="phone"><Input id="phone" name="phone" type="tel" placeholder="+221 77 000 00 00" /></Field>
            <Field label="Current city" htmlFor="city"><Input id="city" name="city" placeholder="Dakar" /></Field>
            <Field label="Years of experience" htmlFor="experience"><Input id="experience" name="experience" type="number" min={0} max={60} defaultValue={0} /></Field>
            <div className="sm:col-span-2">
              <Field label="Skills" htmlFor="skills" hint="Separate with commas.">
                <Input id="skills" name="skills" placeholder="Microsoft 365, UniFi, Fortinet" />
              </Field>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="text-sm font-semibold">Documents</h2>
            <FilePicker label="CV / Resume" file={resume} onPick={pickFile(setResume)} onClear={() => setResume(null)} />
            <FilePicker label="Cover letter (optional)" file={coverLetter} onPick={pickFile(setCoverLetter)} onClear={() => setCoverLetter(null)} />
            <p className="text-xs text-slate-500">PDF, Word or image, up to 10 MB. Files are stored privately and only your team can open them.</p>
          </Card>

          {!!questions.length && (
            <Card className="space-y-4 p-6">
              <div>
                <h2 className="text-sm font-semibold">Screening questions</h2>
                <p className="text-xs text-slate-500">From this opening's application form. Optional when you add a candidate yourself.</p>
              </div>
              {questions.map((q) => <QuestionInput key={q.id} q={q} />)}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <h2 className="text-sm font-semibold">Application</h2>
            <Field label="Opening" htmlFor="opening">
              <Select id="opening" value={openingId} onChange={(e) => setOpeningId(e.target.value)}>
                <option value="">— No opening (talent pool) —</option>
                {(openings.data ?? []).map((o) => <option key={o.id} value={o.id}>{o.code} · {o.title}</option>)}
              </Select>
            </Field>
            <Field label="Stage" htmlFor="stage">
              <Select id="stage" name="stage" key={openingId ? 'with' : 'without'} defaultValue={openingId ? 'new' : 'talentpool'}>
                {Constants.public.Enums.applicant_stage.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </Select>
            </Field>
            <Field label="Source" htmlFor="source">
              <Select id="source" name="source" defaultValue="Dashboard">
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Notes" htmlFor="notes">
              <Textarea id="notes" name="notes" rows={4} placeholder="Referred by…, available from…" />
            </Field>
          </Card>
          <div className="flex gap-2">
            <Link to="/applications" className="flex-1"><Button type="button" variant="secondary" className="w-full">Cancel</Button></Link>
            <Button type="submit" className="flex-1" loading={save.isPending}>Add candidate</Button>
          </div>
        </div>
      </form>
    </>
  )
}

function FilePicker({ label, file, onPick, onClear }: { label: string; file: File | null; onPick: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
          <FileText className="size-6 text-brand-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={onClear} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label={`Remove ${label}`}><X className="size-4" /></button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 hover:border-brand-400 hover:bg-brand-50/40 hover:text-brand-700">
          <Upload className="size-4" />Choose a file
          <input type="file" accept={RESUME_ACCEPT} className="sr-only" onChange={onPick} />
        </label>
      )}
    </div>
  )
}

function QuestionInput({ q }: { q: Question }) {
  const id = `q_${q.id}`
  const label = q.title
  switch (q.type) {
    case 'long_text':
      return <Field label={label} htmlFor={id}><Textarea id={id} name={id} rows={3} /></Field>
    case 'number':
      return <Field label={label} htmlFor={id}><Input id={id} name={id} type="number" /></Field>
    case 'date':
      return <Field label={label} htmlFor={id}><Input id={id} name={id} type="date" /></Field>
    case 'yes_no':
      return (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name={id} value="yes" className="accent-brand-600" />Yes</label>
            <label className="flex items-center gap-2"><input type="radio" name={id} value="no" className="accent-brand-600" />No</label>
          </div>
        </fieldset>
      )
    case 'dropdown':
      return (
        <Field label={label} htmlFor={id}>
          <Select id={id} name={id} defaultValue="">
            <option value="">— Select —</option>
            {q.options.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
      )
    case 'multiple_choice':
      return (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">{q.options.map((o) => <Checkbox key={o} name={id} value={o} label={o} />)}</div>
        </fieldset>
      )
    case 'file':
      return <p className="text-sm text-slate-500">{label} <span className="text-xs">(file questions are answered by candidates on the careers page)</span></p>
    default:
      return <Field label={label} htmlFor={id}><Input id={id} name={id} /></Field>
  }
}
