import { ArrowRightLeft, Briefcase, CalendarClock, ClipboardList, FileText, Mail, MapPin, Star, UserCog, UserPlus, Users } from 'lucide-react'
import type { Tables } from '@/lib/database.types'
import { cn } from '@/lib/utils'

export type ActivityRow = Tables<'activity_feed'>

const ICONS: Record<string, typeof Briefcase> = {
  opening: Briefcase,
  application: ArrowRightLeft,
  candidate: FileText,
  interview: CalendarClock,
  user: UserCog,
  invitation: UserPlus,
  template: ClipboardList,
  'email template': Mail,
  email: Mail,
  location: MapPin,
  department: Users,
}

const TONES: Record<string, string> = {
  hired: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-red-50 text-red-600',
  deleted: 'bg-red-50 text-red-600',
  cancelled: 'bg-red-50 text-red-600',
  deactivated: 'bg-red-50 text-red-600',
  applied: 'bg-sky-50 text-sky-600',
  feedback: 'bg-amber-50 text-amber-600',
  rated: 'bg-amber-50 text-amber-600',
}

export function relativeTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  if (diff < 7 * 86400) return `${Math.floor(diff / 86400)} d ago`
  return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
}

function toneFor(r: ActivityRow) {
  const to = (r.details as { to?: string } | null)?.to
  if (r.action === 'stage_changed' && to && TONES[to]) return TONES[to]
  return TONES[r.action ?? ''] ?? 'bg-slate-100 text-slate-500'
}

export function ActivityItem({ row, compact }: { row: ActivityRow; compact?: boolean }) {
  const Icon = row.action === 'rated' ? Star : ICONS[row.entity_type ?? ''] ?? ClipboardList
  const who = row.actor_name ?? row.actor_email ?? (row.entity_type === 'application' && row.action === 'applied' ? 'Candidate (careers page)' : 'System')
  return (
    <li className={cn('flex gap-3', compact ? 'py-2' : 'px-5 py-3')}>
      <span className={cn('mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full', toneFor(row))}>
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-800">{row.summary}</p>
        <p className="mt-0.5 text-xs text-slate-500">
          {who} · <time dateTime={row.created_at ?? undefined} title={new Date(row.created_at!).toLocaleString()}>{relativeTime(row.created_at!)}</time>
        </p>
      </div>
    </li>
  )
}
