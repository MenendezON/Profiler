import type { Enums, Tables } from './database.types'
import { supabase } from './supabase'

export type EmailTemplate = Tables<'email_templates'>
export type TemplateKind = Enums<'email_template_kind'>

export const KIND_LABELS: Record<TemplateKind, string> = {
  acknowledgement: 'Application received',
  interview_invitation: 'Interview invitation',
  interview_cancellation: 'Interview cancelled',
  rejection: 'Rejection',
  offer: 'Job offer',
  custom: 'Other',
}

export const PLACEHOLDERS: { key: string; label: string; sample: string }[] = [
  { key: 'candidate_first_name', label: 'Candidate first name', sample: 'Awa' },
  { key: 'candidate_name', label: 'Candidate full name', sample: 'Awa Diop' },
  { key: 'job_title', label: 'Job title', sample: 'IT Officer' },
  { key: 'company_name', label: 'Company', sample: 'Fabrimetal Senegal' },
  { key: 'sender_name', label: 'Your name', sample: 'Menendez Nelson' },
  { key: 'interview_date', label: 'Interview date', sample: 'Tuesday 2 December 2026' },
  { key: 'interview_time', label: 'Interview time', sample: '10:00' },
  { key: 'interview_duration', label: 'Interview duration', sample: '60 min' },
  { key: 'interview_location', label: 'Interview place / link', sample: 'Siège Dakar, Zone industrielle' },
  { key: 'interviewer_name', label: 'Interviewer', sample: 'Marthe Diatta' },
  { key: 'interview_message', label: 'Interview message', sample: 'Please bring a copy of your ID.' },
]

export type TemplateVars = Partial<Record<string, string | null | undefined>>

export const SAMPLE_VARS: TemplateVars = Object.fromEntries(PLACEHOLDERS.map((p) => [p.key, p.sample]))

/**
 * Replace {{placeholders}}. A line that only contains an empty placeholder is removed,
 * so optional parts (e.g. the interview message) don't leave blank gaps.
 */
export function renderTemplate(text: string, vars: TemplateVars) {
  const lines = text.split('\n')
  const out: string[] = []
  for (const line of lines) {
    const only = line.trim().match(/^\{\{\s*([a-z_]+)\s*\}\}$/)
    if (only && !vars[only[1]]) continue
    out.push(line.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (m, key: string) => (key in vars ? vars[key] ?? '' : m)))
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function mailtoLink(to: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function interviewVars(i: {
  scheduledAt: string
  durationMinutes: number
  type: 'in_person' | 'phone' | 'video'
  venue: string | null
  details: string | null
  interviewerName: string | null
  message: string | null
}, language: string): TemplateVars {
  const d = new Date(i.scheduledAt)
  const locale = language === 'fr' ? 'fr-FR' : 'en-GB'
  const where =
    i.type === 'video' ? (language === 'fr' ? 'Visioconférence : ' : 'Video call: ') + (i.details ?? '')
    : i.type === 'phone' ? (language === 'fr' ? 'Appel téléphonique' : 'Phone call') + (i.details ? ` (${i.details})` : '')
    : [i.venue, i.details].filter(Boolean).join(' — ')
  return {
    interview_date: d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    interview_time: d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
    interview_duration: `${i.durationMinutes} min`,
    interview_location: where,
    interviewer_name: i.interviewerName ?? '',
    interview_message: i.message ?? '',
  }
}

/** Fire-and-forget: record in the candidate timeline that an email was prepared. */
export function logEmailPrepared(applicationId: string, templateName: string, subject: string) {
  void supabase.rpc('log_email_prepared', { p_application_id: applicationId, p_template_name: templateName, p_subject: subject })
}
