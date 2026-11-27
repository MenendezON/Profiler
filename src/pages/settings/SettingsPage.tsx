import { Link } from 'react-router'
import { Building2, ClipboardList, History, Mail, MapPin, Users } from 'lucide-react'
import { Badge, Card, PageHeader } from '@/components/ui'
import { CopyField } from '@/components/CopyField'
import { useProfile } from '@/lib/auth'
import { careersUrl } from '@/lib/careers'

const sections = [
  { to: '/settings/locations', title: 'Locations', description: 'Offices and sites for your openings.', icon: MapPin, ready: true },
  { to: '/settings/departments', title: 'Departments', description: 'Teams that own job openings.', icon: Building2, ready: true },
  { to: '/settings/screening-templates', title: 'Screening questions', description: 'Reusable application form templates.', icon: ClipboardList, ready: true },
  { to: '/settings/users', title: 'Users', description: 'Invite recruiters and manage roles.', icon: Users, ready: false },
  { to: '/settings/email-templates', title: 'Email templates', description: 'Messages sent to candidates.', icon: Mail, ready: false },
  { to: '/settings/activity-log', title: 'Activity log', description: 'Who changed what, and when.', icon: History, ready: false },
]

export function SettingsPage() {
  const { data: profile } = useProfile()
  return (
    <>
      <PageHeader title="Settings" description="Configure Profiler for your organization." />
      {profile?.company && (
        <Card className="mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Careers page</h2>
            <p className="mt-1 text-sm text-slate-500">
              Share this link on your website, LinkedIn or WhatsApp. It lists your <strong>published</strong> openings and lets candidates apply with their CV.
            </p>
          </div>
          <div className="sm:w-96"><CopyField value={careersUrl(profile.company.slug)} label="Careers page link" /></div>
        </Card>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(({ to, title, description, icon: Icon, ready }) => {
          const body = (
            <Card className={ready ? 'h-full p-5 transition-shadow hover:shadow-md' : 'h-full p-5 opacity-60'}>
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600"><Icon className="size-5" /></div>
                {!ready && <Badge>Coming soon</Badge>}
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </Card>
          )
          return ready ? <Link key={to} to={to}>{body}</Link> : <div key={to}>{body}</div>
        })}
      </div>
    </>
  )
}
