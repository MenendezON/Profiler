import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, unwrap } from '@/lib/utils'
import { Can, useRole } from '@/lib/auth'
import { Constants } from '@/lib/database.types'
import { KIND_LABELS, PLACEHOLDERS, SAMPLE_VARS, renderTemplate, type TemplateKind } from '@/lib/emailTemplates'
import { Alert, Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, Spinner, Textarea } from '@/components/ui'
import { BackTo } from './LocationsPages'

const KEY = ['email-templates']

export function EmailTemplatesListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => unwrap(await supabase.from('email_templates').select('*').order('kind').order('language').order('name')),
  })

  const byKind = new Map<TemplateKind, NonNullable<typeof data>>()
  for (const t of data ?? []) byKind.set(t.kind, [...(byKind.get(t.kind) ?? []), t])

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader
        title="Email templates"
        description="Messages you send to candidates. Placeholders like {{candidate_first_name}} are filled in automatically."
        actions={<Can edit><Link to="new"><Button><Plus className="size-4" />New template</Button></Link></Can>}
      />
      {error && <Alert>{error.message}</Alert>}
      {isLoading ? (
        <Card className="p-6"><Spinner /></Card>
      ) : !data?.length ? (
        <Card><EmptyState icon={<Mail className="size-5" />} title="No templates" description="Create your first template." /></Card>
      ) : (
        <div className="space-y-4">
          {Constants.public.Enums.email_template_kind.filter((k) => byKind.has(k)).map((kind) => (
            <Card key={kind}>
              <h2 className="border-b border-slate-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{KIND_LABELS[kind]}</h2>
              <ul className="divide-y divide-slate-100">
                {byKind.get(kind)!.map((t) => (
                  <li key={t.id}>
                    <Link to={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                      <Badge tone={t.language === 'fr' ? 'violet' : 'blue'}>{t.language.toUpperCase()}</Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{t.name}</p>
                        <p className="truncate text-xs text-slate-500">{t.subject}</p>
                      </div>
                      <span className="hidden text-xs text-slate-400 sm:block">Updated {formatDate(t.updated_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export function EmailTemplateEditorPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { canEdit } = useRole()
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const subjectRef = useRef<HTMLInputElement>(null)
  const [lastFocus, setLastFocus] = useState<'subject' | 'body'>('body')
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null)

  const existing = useQuery({
    queryKey: [...KEY, id],
    enabled: !isNew,
    queryFn: async () => unwrap(await supabase.from('email_templates').select('*').eq('id', id!).single()),
  })
  const t = existing.data
  const subject = draft?.subject ?? t?.subject ?? ''
  const body = draft?.body ?? t?.body ?? ''

  const save = useMutation({
    mutationFn: async (values: { name: string; kind: TemplateKind; language: string; subject: string; body: string }) =>
      isNew
        ? unwrap(await supabase.from('email_templates').insert(values).select('id').single())
        : unwrap(await supabase.from('email_templates').update(values).eq('id', id!).select('id').single()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); navigate('/settings/email-templates') },
  })
  const remove = useMutation({
    mutationFn: async () => unwrap(await supabase.from('email_templates').delete().eq('id', id!)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); navigate('/settings/email-templates') },
  })

  function insertPlaceholder(key: string) {
    const token = `{{${key}}}`
    const el = lastFocus === 'subject' ? subjectRef.current : bodyRef.current
    const current = lastFocus === 'subject' ? subject : body
    const start = el?.selectionStart ?? current.length
    const end = el?.selectionEnd ?? current.length
    const next = current.slice(0, start) + token + current.slice(end)
    setDraft({ subject: lastFocus === 'subject' ? next : subject, body: lastFocus === 'body' ? next : body })
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + token.length, start + token.length) })
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    save.mutate({
      name: String(f.get('name')).trim(),
      kind: String(f.get('kind')) as TemplateKind,
      language: String(f.get('language')),
      subject: subject.trim(),
      body: body.trim(),
    })
  }

  if (!isNew && existing.isLoading) return <Spinner />

  return (
    <>
      <BackTo to="/settings/email-templates" label="Email templates" />
      <PageHeader
        title={isNew ? 'New email template' : t?.name ?? 'Template'}
        actions={!isNew && canEdit ? (
          <Button variant="ghost" className="text-red-600 hover:bg-red-50" loading={remove.isPending} onClick={() => confirm('Delete this template?') && remove.mutate()}>
            <Trash2 className="size-4" />Delete
          </Button>
        ) : undefined}
      />
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-6">
          {(save.error || existing.error || remove.error) && <Alert>{(save.error ?? existing.error ?? remove.error)!.message}</Alert>}
          <Field label="Name" htmlFor="t-name"><Input id="t-name" name="name" defaultValue={t?.name} required disabled={!canEdit} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Used for" htmlFor="t-kind">
              <Select id="t-kind" name="kind" defaultValue={t?.kind ?? 'custom'} disabled={!canEdit}>
                {Constants.public.Enums.email_template_kind.map((k) => <option key={k} value={k}>{KIND_LABELS[k]}</option>)}
              </Select>
            </Field>
            <Field label="Language" htmlFor="t-lang">
              <Select id="t-lang" name="language" defaultValue={t?.language ?? 'fr'} disabled={!canEdit}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </Select>
            </Field>
          </div>
          <Field label="Subject" htmlFor="t-subject">
            <Input id="t-subject" ref={subjectRef} value={subject} onFocus={() => setLastFocus('subject')} onChange={(e) => setDraft({ subject: e.target.value, body })} required maxLength={300} disabled={!canEdit} />
          </Field>
          <Field label="Message" htmlFor="t-body">
            <Textarea id="t-body" ref={bodyRef} rows={16} value={body} onFocus={() => setLastFocus('body')} onChange={(e) => setDraft({ subject, body: e.target.value })} required className="font-mono text-[13px]" disabled={!canEdit} />
          </Field>
          {canEdit && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-600">Insert a placeholder</p>
              <div className="flex flex-wrap gap-1.5">
                {PLACEHOLDERS.map((p) => (
                  <button key={p.key} type="button" onClick={() => insertPlaceholder(p.key)} title={`{{${p.key}}}`}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-brand-300 hover:bg-brand-50">
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {canEdit && (
            <div className="flex justify-end gap-2 pt-2">
              <Link to="/settings/email-templates"><Button type="button" variant="secondary">Cancel</Button></Link>
              <Button type="submit" loading={save.isPending}>{isNew ? 'Create template' : 'Save changes'}</Button>
            </div>
          )}
        </Card>

        <Card className="h-fit p-6 lg:sticky lg:top-6">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Preview with sample data</p>
          <div className="mt-3 rounded-lg border border-slate-200">
            <div className="border-b border-slate-100 px-4 py-2.5 text-sm">
              <span className="text-slate-500">To:</span> awa.diop@gmail.com
              <br />
              <span className="text-slate-500">Subject:</span> <strong>{renderTemplate(subject, SAMPLE_VARS) || '—'}</strong>
            </div>
            <div className="whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-slate-800">{renderTemplate(body, SAMPLE_VARS) || <span className="text-slate-400">Your message will appear here.</span>}</div>
          </div>
        </Card>
      </form>
    </>
  )
}
