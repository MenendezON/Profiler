import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, Briefcase, CheckCircle2, FileText, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Json } from '@/lib/database.types'
import { RESUME_ACCEPT, validateResume } from '@/lib/applications'
import { fetchPublicOpening, uploadApplicationFile, type PublicQuestion } from '@/lib/careers'
import { formatDate } from '@/lib/utils'
import { Alert, Badge, Button, Card, Checkbox, EmptyState, Field, Input, Select, Spinner, Textarea } from '@/components/ui'
import { CareersShell, OpeningMeta } from './CareersPage'

export function JobPage() {
  const { slug = '', openingId = '' } = useParams()
  const [resume, setResume] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState<File | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-opening', slug, openingId],
    queryFn: () => fetchPublicOpening(slug, openingId),
  })

  const apply = useMutation({
    mutationFn: async (form: FormData) => {
      if (!data) throw new Error('This position is no longer available.')
      const s = (k: string) => String(form.get(k) ?? '').trim()
      const answers = collectAnswers(data.questions, form)
      const missing = data.questions.find((q) => q.required && isEmpty(answers[q.id]))
      if (missing) throw new Error(`Please answer: ${missing.title}`)
      if (!resume) throw new Error('Please attach your CV.')

      const folder = crypto.randomUUID()
      const resumePath = await uploadApplicationFile(data.company.id, folder, resume, 'resume')
      const coverPath = coverLetter ? await uploadApplicationFile(data.company.id, folder, coverLetter, 'cover-letter') : undefined

      const { error } = await supabase.rpc('submit_application', {
        p_opening_id: data.opening.id,
        p_first_name: s('first_name'),
        p_last_name: s('last_name'),
        p_email: s('email'),
        p_phone: s('phone'),
        p_city: s('city'),
        p_experience: Number(s('experience') || 0),
        p_resume_path: resumePath,
        p_cover_letter_path: coverPath,
        p_answers: answers,
      })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  })

  function pick(set: (f: File | null) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] ?? null
      const invalid = f ? validateResume(f) : null
      setFormError(invalid)
      set(invalid ? null : f)
      e.target.value = ''
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    apply.mutate(new FormData(e.currentTarget))
  }

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner className="size-6" /></div>

  if (error || !data) {
    return (
      <CareersShell slug={slug}>
        <Card>
          <EmptyState
            icon={<Briefcase className="size-5" />}
            title="This position is no longer available"
            description="It may have been filled or closed."
            action={<Link to={`/careers/${slug}`}><Button variant="secondary" size="sm">See open positions</Button></Link>}
          />
        </Card>
      </CareersShell>
    )
  }

  const { company, opening, questions } = data

  if (apply.isSuccess) {
    return (
      <CareersShell companyName={company.name} slug={slug} website={company.website}>
        <Card className="p-10 text-center">
          <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-semibold">Application sent</h1>
          <p className="mx-auto mt-2 max-w-md text-slate-600">
            Thank you for applying for <strong>{opening.title}</strong>. The {company.name} team will review your application and contact you if your profile matches.
          </p>
          <Link to={`/careers/${slug}`} className="mt-6 inline-block"><Button variant="secondary">See other positions</Button></Link>
        </Card>
      </CareersShell>
    )
  }

  return (
    <CareersShell companyName={company.name} slug={slug} website={company.website}>
      <Link to={`/careers/${slug}`} className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="size-4" />All positions
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{opening.title}</h1>
          {opening.experience && <Badge>{opening.experience}</Badge>}
        </div>
        <div className="mt-3"><OpeningMeta o={opening} /></div>
        <p className="mt-2 text-xs text-slate-400">Ref. {opening.code} · posted {formatDate(opening.created_at)}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <Card className="p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">About the role</h2>
            {opening.description.trim() ? (
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">{opening.description}</div>
            ) : (
              <p className="text-slate-500">Apply to learn more about this position.</p>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2" aria-labelledby="apply-heading">
          <Card className="p-6 lg:sticky lg:top-6">
            <h2 id="apply-heading" className="text-lg font-semibold">Apply for this position</h2>
            <form onSubmit={onSubmit} className="mt-4 space-y-4">
              {(formError || apply.error) && <Alert>{formError ?? apply.error!.message}</Alert>}
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name *" htmlFor="first_name"><Input id="first_name" name="first_name" autoComplete="given-name" required maxLength={100} /></Field>
                <Field label="Last name *" htmlFor="last_name"><Input id="last_name" name="last_name" autoComplete="family-name" required maxLength={100} /></Field>
              </div>
              <Field label="Email *" htmlFor="email"><Input id="email" name="email" type="email" autoComplete="email" required /></Field>
              <Field label="Mobile *" htmlFor="phone"><Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+221 77 000 00 00" required minLength={6} maxLength={30} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Current city *" htmlFor="city"><Input id="city" name="city" autoComplete="address-level2" required maxLength={100} /></Field>
                <Field label="Experience (years) *" htmlFor="experience"><Input id="experience" name="experience" type="number" min={0} max={60} required /></Field>
              </div>

              <FilePick label="CV *" file={resume} onPick={pick(setResume)} onClear={() => setResume(null)} />
              <FilePick label="Cover letter" file={coverLetter} onPick={pick(setCoverLetter)} onClear={() => setCoverLetter(null)} />
              <p className="-mt-2 text-xs text-slate-500">PDF, Word or image, up to 10 MB.</p>

              {questions.map((q) => <PublicQuestionInput key={q.id} q={q} />)}

              <div className="rounded-lg bg-slate-50 p-3">
                <Checkbox
                  name="consent"
                  required
                  label={<span className="text-xs text-slate-600">I agree that {company.name} stores and processes my personal data to assess my application.</span>}
                />
              </div>

              <Button type="submit" className="w-full" loading={apply.isPending}>Submit application</Button>
            </form>
          </Card>
        </section>
      </div>
    </CareersShell>
  )
}

function FilePick({ label, file, onPick, onClear }: { label: string; file: File | null; onPick: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">{label}</p>
      {file ? (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
          <FileText className="size-5 text-brand-600" />
          <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
          <button type="button" onClick={onClear} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label={`Remove ${label}`}><X className="size-4" /></button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-3 py-4 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-700">
          <Upload className="size-4" />Choose a file
          <input type="file" accept={RESUME_ACCEPT} className="sr-only" onChange={onPick} />
        </label>
      )}
    </div>
  )
}

function PublicQuestionInput({ q }: { q: PublicQuestion }) {
  const id = `q_${q.id}`
  const label = `${q.title}${q.required ? ' *' : ''}`
  switch (q.type) {
    case 'long_text':
      return <Field label={label} htmlFor={id}><Textarea id={id} name={id} rows={3} required={q.required} maxLength={5000} /></Field>
    case 'number':
      return <Field label={label} htmlFor={id}><Input id={id} name={id} type="number" required={q.required} /></Field>
    case 'date':
      return <Field label={label} htmlFor={id}><Input id={id} name={id} type="date" required={q.required} /></Field>
    case 'yes_no':
      return (
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">{label}</legend>
          <div className="flex gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="radio" name={id} value="yes" required={q.required} className="accent-brand-600" />Yes</label>
            <label className="flex items-center gap-2"><input type="radio" name={id} value="no" className="accent-brand-600" />No</label>
          </div>
        </fieldset>
      )
    case 'dropdown':
      return (
        <Field label={label} htmlFor={id}>
          <Select id={id} name={id} defaultValue="" required={q.required}>
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
    default:
      return <Field label={label} htmlFor={id}><Input id={id} name={id} required={q.required} maxLength={5000} /></Field>
  }
}

function collectAnswers(questions: PublicQuestion[], form: FormData): Record<string, Json> {
  const out: Record<string, Json> = {}
  for (const q of questions) {
    const key = `q_${q.id}`
    if (q.type === 'multiple_choice') {
      const v = form.getAll(key).map(String)
      if (v.length) out[q.id] = v
    } else if (q.type === 'yes_no') {
      const v = form.get(key)
      if (v) out[q.id] = v === 'yes'
    } else if (q.type === 'number') {
      const v = String(form.get(key) ?? '').trim()
      if (v) out[q.id] = Number(v)
    } else {
      const v = String(form.get(key) ?? '').trim()
      if (v) out[q.id] = v
    }
  }
  return out
}

const isEmpty = (v: Json | undefined) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)
