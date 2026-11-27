import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Check, Copy, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, unwrap } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { Constants } from '@/lib/database.types'
import { KIND_LABELS, logEmailPrepared, mailtoLink, renderTemplate, type EmailTemplate, type TemplateKind, type TemplateVars } from '@/lib/emailTemplates'
import { Button, Dialog, Field, Input, Select, Spinner, Textarea } from '@/components/ui'

const LANG_KEY = 'profiler.emailLanguage'
const readLang = () => { try { return localStorage.getItem(LANG_KEY) ?? 'fr' } catch { return 'fr' } }
const saveLang = (l: string) => { try { localStorage.setItem(LANG_KEY, l) } catch { /* private mode */ } }

export interface EmailRecipient {
  applicationId: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string | null
}

export function SendEmailDialog({ recipient, kind, extraVars, onClose, title = 'Email candidate' }: {
  recipient: EmailRecipient
  kind?: TemplateKind
  extraVars?: (language: string) => TemplateVars
  onClose: () => void
  title?: string
}) {
  const { data: me } = useProfile()
  const [language, setLanguage] = useState(readLang)
  const [templateId, setTemplateId] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [copied, setCopied] = useState(false)

  const templates = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => unwrap(await supabase.from('email_templates').select('*').order('kind').order('name')),
  })

  // `kind` only preselects; every template in the chosen language stays available
  const choices = useMemo(() => (templates.data ?? []).filter((t) => t.language === language), [templates.data, language])

  const vars = useMemo<TemplateVars>(() => ({
    candidate_first_name: recipient.firstName,
    candidate_name: `${recipient.firstName} ${recipient.lastName}`.trim(),
    job_title: recipient.jobTitle ?? (language === 'fr' ? 'le poste' : 'the position'),
    company_name: me?.company?.name ?? '',
    sender_name: me ? `${me.first_name} ${me.last_name}`.trim() : '',
    ...(extraVars?.(language) ?? {}),
  }), [recipient, me, language, extraVars])

  function apply(t: EmailTemplate | undefined) {
    setTemplateId(t?.id ?? '')
    setSubject(t ? renderTemplate(t.subject, vars) : '')
    setBody(t ? renderTemplate(t.body, vars) : '')
  }

  // pick the first matching template whenever the language (or data) changes
  useEffect(() => {
    if (!templates.data) return
    const current = choices.find((t) => t.id === templateId)
    const sameKind = current && choices.find((t) => t.kind === current.kind)
    apply(sameKind ?? choices.find((t) => t.kind === kind) ?? choices[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates.data, language, me])

  const template = choices.find((t) => t.id === templateId)

  function openMail() {
    logEmailPrepared(recipient.applicationId, template?.name ?? 'Custom', subject)
    window.location.href = mailtoLink(recipient.email, subject, body)
  }

  function copy() {
    navigator.clipboard.writeText(`${subject}\n\n${body}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })
  }

  return (
    <Dialog
      open
      size="lg"
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={copy}>{copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}Copy text</Button>
          <Button onClick={openMail} disabled={!subject.trim() || !body.trim()}><Mail className="size-4" />Open in mail app</Button>
        </>
      }
    >
      {templates.isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="Template" htmlFor="tpl">
              <Select id="tpl" value={templateId} onChange={(e) => apply(choices.find((t) => t.id === e.target.value))}>
                {!choices.length && <option value="">No template for this language</option>}
                {Constants.public.Enums.email_template_kind.map((k) => {
                  const group = choices.filter((t) => t.kind === k)
                  return group.length ? (
                    <optgroup key={k} label={KIND_LABELS[k]}>
                      {group.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </optgroup>
                  ) : null
                })}
              </Select>
            </Field>
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">Language</p>
              <div className="flex rounded-lg bg-slate-100 p-1">
                {['fr', 'en'].map((l) => (
                  <button key={l} type="button" onClick={() => { setLanguage(l); saveLang(l) }}
                    className={cn('rounded-md px-3 py-1 text-sm font-medium', language === l ? 'bg-white shadow-sm' : 'text-slate-500')}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500">To: <span className="font-medium text-slate-800">{recipient.email}</span></p>
          <Field label="Subject" htmlFor="mail-subject"><Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
          <Field label="Message" htmlFor="mail-body" hint="You can adjust the text before opening it in your mail app.">
            <Textarea id="mail-body" rows={12} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <p className="text-xs text-slate-400">
            Manage templates in <Link to="/settings/email-templates" className="text-brand-600 hover:underline">Settings → Email templates</Link>.
          </p>
        </div>
      )}
    </Dialog>
  )
}
