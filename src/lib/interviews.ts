import type { QueryClient } from '@tanstack/react-query'
import { MapPin, Phone, Video } from 'lucide-react'
import type { Enums } from './database.types'

export type InterviewType = Enums<'interview_type'>
export type InterviewStatus = Enums<'interview_status'>
export type InterviewDecision = Enums<'interview_decision'>

export const INTERVIEW_TYPES: Record<InterviewType, { label: string; icon: typeof MapPin; detailsLabel: string; placeholder: string }> = {
  in_person: { label: 'In person', icon: MapPin, detailsLabel: 'Room / address details', placeholder: 'Meeting room 2, 1st floor' },
  phone: { label: 'Phone', icon: Phone, detailsLabel: 'Phone number to call', placeholder: '+221 77 000 00 00' },
  video: { label: 'Video call', icon: Video, detailsLabel: 'Meeting link', placeholder: 'https://teams.microsoft.com/… or https://meet.google.com/…' },
}

export const DECISIONS: Record<InterviewDecision, { label: string; tone: 'green' | 'amber' | 'red' }> = {
  hire: { label: 'Hire', tone: 'green' },
  maybe: { label: 'Maybe', tone: 'amber' },
  no_hire: { label: 'No hire', tone: 'red' },
}

export const STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Feedback given',
  cancelled: 'Cancelled',
}

export const DURATIONS = [15, 30, 45, 60, 90, 120]

export function invalidateInterviews(qc: QueryClient) {
  for (const key of ['interviews', 'interview-counts', 'application', 'applications', 'dashboard-upcoming', 'stage-counts', 'dashboard-stats']) {
    qc.invalidateQueries({ queryKey: [key] })
  }
}

/** ISO → value for <input type="datetime-local"> in the browser's time zone. */
export function toLocalInput(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** Next full hour tomorrow at 10:00 local — a sensible default slot. */
export function defaultSlot() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(10, 0, 0, 0)
  return toLocalInput(d.toISOString())
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const formatTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

export const formatDay = (iso: string) => {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
}

export interface InviteInfo {
  id: string
  scheduledAt: string
  durationMinutes: number
  type: InterviewType
  candidateName: string
  candidateEmail: string
  openingTitle: string | null
  companyName: string
  venue: string | null // location name + address
  details: string | null // room, phone or link
  interviewerName: string | null
  message: string | null
}

function whereText(i: InviteInfo) {
  if (i.type === 'video') return i.details ? `Video call: ${i.details}` : 'Video call (link to follow)'
  if (i.type === 'phone') return i.details ? `Phone call: ${i.details}` : 'Phone call'
  return [i.venue, i.details].filter(Boolean).join(' — ') || 'In person'
}

export function inviteMailto(i: InviteInfo) {
  const role = i.openingTitle ? ` for the ${i.openingTitle} position` : ''
  const subject = `Interview invitation${i.openingTitle ? ` – ${i.openingTitle}` : ''} – ${i.companyName}`
  const lines = [
    `Dear ${i.candidateName},`,
    '',
    `Thank you for your interest in ${i.companyName}. We would like to invite you to an interview${role}.`,
    '',
    `When: ${formatDateTime(i.scheduledAt)} (${i.durationMinutes} min)`,
    `Where: ${whereText(i)}`,
    ...(i.interviewerName ? [`With: ${i.interviewerName}`] : []),
    ...(i.message ? ['', i.message] : []),
    '',
    'Please confirm your availability by replying to this email.',
    '',
    'Best regards,',
    i.companyName,
  ]
  return `mailto:${encodeURIComponent(i.candidateEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}

export function cancelMailto(i: InviteInfo) {
  const subject = `Interview cancelled${i.openingTitle ? ` – ${i.openingTitle}` : ''} – ${i.companyName}`
  const body = [
    `Dear ${i.candidateName},`,
    '',
    `We regret to inform you that the interview planned on ${formatDateTime(i.scheduledAt)} has been cancelled. We will contact you again if a new date is set.`,
    '',
    'Best regards,',
    i.companyName,
  ].join('\n')
  return `mailto:${encodeURIComponent(i.candidateEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** iCalendar escaping (RFC 5545 §3.3.11) */
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

export function buildIcs(i: InviteInfo, method: 'REQUEST' | 'CANCEL' = 'REQUEST') {
  const start = new Date(i.scheduledAt)
  const end = new Date(start.getTime() + i.durationMinutes * 60_000)
  const summary = `Interview: ${i.candidateName}${i.openingTitle ? ` – ${i.openingTitle}` : ''}`
  const description = [
    `Candidate: ${i.candidateName} <${i.candidateEmail}>`,
    i.openingTitle ? `Position: ${i.openingTitle}` : null,
    i.interviewerName ? `Interviewer: ${i.interviewerName}` : null,
    i.message,
  ].filter(Boolean).join('\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Profiler//Interviews//EN',
    `METHOD:${method === 'CANCEL' ? 'CANCEL' : 'PUBLISH'}`,
    'BEGIN:VEVENT',
    `UID:${i.id}@profiler`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${esc(summary)}`,
    `LOCATION:${esc(whereText(i))}`,
    `DESCRIPTION:${esc(description)}`,
    ...(i.type === 'video' && i.details?.startsWith('http') ? [`URL:${i.details}`] : []),
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(i: InviteInfo) {
  const blob = new Blob([buildIcs(i)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `interview-${i.candidateName.replace(/\s+/g, '-').toLowerCase()}.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
