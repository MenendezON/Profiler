import { useState } from 'react'
import { Link } from 'react-router'
import { Ban, CalendarClock, CalendarPlus, ClipboardCheck, Mail, MoreHorizontal, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { DECISIONS, INTERVIEW_TYPES, downloadIcs, formatDateTime, formatTime, inviteMailto } from '@/lib/interviews'
import { Badge, Button, Stars } from '@/components/ui'
import { CancelInterviewDialog, FeedbackDialog, ScheduleInterviewDialog, inviteFromRow, type InterviewRow } from './InterviewDialogs'

/** One interview with its actions. `compact` hides the candidate (used inside the candidate panel). */
export function InterviewItem({ row, compact }: { row: InterviewRow; compact?: boolean }) {
  const { data: profile } = useProfile()
  const [dialog, setDialog] = useState<'reschedule' | 'feedback' | 'cancel' | null>(null)
  const [menu, setMenu] = useState(false)
  const type = INTERVIEW_TYPES[row.type ?? 'in_person']
  const Icon = type.icon
  const past = new Date(row.scheduled_at!).getTime() < Date.now()
  const needsFeedback = row.status === 'scheduled' && past
  const invite = inviteFromRow(row, profile?.company?.name ?? '')
  const where =
    row.type === 'in_person' ? [row.location_name, row.meeting_details].filter(Boolean).join(' · ') || 'In person' : row.meeting_details || type.label

  return (
    <div className={cn('flex gap-4 px-4 py-3', row.status === 'cancelled' && 'opacity-60')}>
      <div className="w-[4.5rem] shrink-0 text-center">
        <p className={cn('whitespace-nowrap text-sm font-semibold tabular-nums', row.status === 'cancelled' && 'line-through')}>{formatTime(row.scheduled_at!)}</p>
        <p className="text-xs text-slate-400">{row.duration_minutes} min</p>
      </div>
      <div className="min-w-0 flex-1">
        {compact ? (
          <p className="text-sm font-medium text-slate-900">{formatDateTime(row.scheduled_at!)}</p>
        ) : (
          <p className="text-sm">
            <Link to={`/applications?stage=all&application=${row.application_id}`} className="font-medium text-slate-900 hover:text-brand-700 hover:underline">
              {row.full_name}
            </Link>
            {row.opening_title && <span className="text-slate-500"> · {row.opening_title}</span>}
          </p>
        )}
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
          <span className="inline-flex min-w-0 items-center gap-1">
            <Icon className="size-3.5 shrink-0" />
            {row.type === 'video' && row.meeting_details?.startsWith('http') ? (
              <a href={row.meeting_details} target="_blank" rel="noopener noreferrer" className="truncate text-brand-700 hover:underline">Join call</a>
            ) : (
              <span className="truncate">{where}</span>
            )}
          </span>
          {row.interviewer_name && <span className="inline-flex items-center gap-1"><User className="size-3.5" />{row.interviewer_name}</span>}
        </p>
        {row.status === 'completed' && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {row.decision && <Badge tone={DECISIONS[row.decision].tone}>{DECISIONS[row.decision].label}</Badge>}
            {!!row.rating && <Stars value={row.rating} />}
            {row.feedback && <p className="w-full text-xs text-slate-600 line-clamp-2">{row.feedback}</p>}
          </div>
        )}
        {row.status === 'cancelled' && <p className="mt-1 text-xs text-slate-500">Cancelled{row.cancel_reason ? ` — ${row.cancel_reason}` : ''}</p>}
      </div>

      <div className="flex shrink-0 items-start gap-1">
        {needsFeedback && (
          <Button size="sm" onClick={() => setDialog('feedback')}><ClipboardCheck className="size-4" />Feedback</Button>
        )}
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Interview actions" aria-expanded={menu}>
            <MoreHorizontal className="size-4" />
          </button>
          {menu && (
            <div className="absolute right-0 top-8 z-20 w-52 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg" onMouseLeave={() => setMenu(false)}>
              {row.status === 'scheduled' && (
                <>
                  <MenuLink href={inviteMailto(invite)} icon={Mail} onClick={() => setMenu(false)}>Email invitation</MenuLink>
                  <MenuButton icon={CalendarPlus} onClick={() => { setMenu(false); downloadIcs(invite) }}>Add to calendar</MenuButton>
                  <MenuButton icon={CalendarClock} onClick={() => { setMenu(false); setDialog('reschedule') }}>Reschedule</MenuButton>
                  <MenuButton icon={ClipboardCheck} onClick={() => { setMenu(false); setDialog('feedback') }}>Give feedback</MenuButton>
                  <MenuButton icon={Ban} danger onClick={() => { setMenu(false); setDialog('cancel') }}>Cancel interview</MenuButton>
                </>
              )}
              {row.status === 'completed' && (
                <MenuButton icon={ClipboardCheck} onClick={() => { setMenu(false); setDialog('feedback') }}>Edit feedback</MenuButton>
              )}
              {row.status === 'cancelled' && (
                <MenuButton icon={CalendarClock} onClick={() => { setMenu(false); setDialog('reschedule') }}>Schedule again</MenuButton>
              )}
            </div>
          )}
        </div>
      </div>

      {dialog === 'reschedule' && (
        <ScheduleInterviewDialog
          interview={row}
          candidate={{ applicationId: row.application_id!, stage: row.stage!, candidateName: row.full_name ?? '', candidateEmail: row.email ?? '', openingTitle: row.opening_title }}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'feedback' && <FeedbackDialog interview={row} onClose={() => setDialog(null)} />}
      {dialog === 'cancel' && <CancelInterviewDialog interview={row} onClose={() => setDialog(null)} />}
    </div>
  )
}

function MenuButton({ icon: Icon, children, onClick, danger }: { icon: typeof Mail; children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn('flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50', danger ? 'text-red-600' : 'text-slate-700')}>
      <Icon className="size-4" />{children}
    </button>
  )
}

function MenuLink({ href, icon: Icon, children, onClick }: { href: string; icon: typeof Mail; children: React.ReactNode; onClick: () => void }) {
  return (
    <a href={href} onClick={onClick} className="flex w-full items-center gap-2 px-3 py-2 text-left text-slate-700 hover:bg-slate-50">
      <Icon className="size-4" />{children}
    </a>
  )
}
