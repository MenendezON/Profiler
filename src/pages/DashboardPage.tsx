import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { InterviewItem } from '@/components/interviews/InterviewItem'
import { formatDay } from '@/lib/interviews'
import { Briefcase, Building2, CalendarClock, MapPin, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { unwrap } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { Constants, type Enums } from '@/lib/database.types'
import { Card, PageHeader, Spinner } from '@/components/ui'
import { OPENING_STATUS, STAGE_LABELS } from '@/lib/constants'


function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [openings, stages, applicants, locations, departments] = await Promise.all([
        supabase.from('opening_status_counts').select('*').then(unwrap),
        supabase.from('pipeline_stage_counts').select('*').then(unwrap),
        supabase.from('applicants').select('id', { count: 'exact', head: true }),
        supabase.from('locations').select('id', { count: 'exact', head: true }),
        supabase.from('departments').select('id', { count: 'exact', head: true }),
      ])
      const byStatus = Object.fromEntries((openings ?? []).map((r) => [r.status, r.total ?? 0]))
      const byStage = Object.fromEntries((stages ?? []).map((r) => [r.stage, r.total ?? 0]))
      return {
        openings: byStatus as Partial<Record<Enums<'opening_status'>, number>>,
        stages: byStage as Partial<Record<Enums<'applicant_stage'>, number>>,
        applicants: applicants.count ?? 0,
        locations: locations.count ?? 0,
        departments: departments.count ?? 0,
      }
    },
  })
}

function Stat({ label, value, icon: Icon, to }: { label: string; value: number; icon: typeof Users; to: string }) {
  return (
    <Link to={to} className="group">
      <Card className="flex items-center gap-4 p-5 transition-shadow group-hover:shadow-md">
        <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600"><Icon className="size-5" /></div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold tabular-nums">{value}</p>
        </div>
      </Card>
    </Link>
  )
}

function UpcomingInterviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-upcoming'],
    queryFn: async () =>
      unwrap(
        await supabase
          .from('interview_list')
          .select('*')
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at')
          .limit(5),
      ),
  })
  return (
    <Card>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Upcoming interviews</h2>
        <Link to="/interviews" className="text-xs font-medium text-brand-600 hover:underline">See all</Link>
      </div>
      {isLoading ? (
        <div className="p-5"><Spinner /></div>
      ) : !data?.length ? (
        <p className="flex items-center gap-2 px-5 py-6 text-sm text-slate-500"><CalendarClock className="size-4" />No interviews scheduled.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {data.map((r, i) => {
            const day = formatDay(r.scheduled_at!)
            const newDay = i === 0 || formatDay(data[i - 1].scheduled_at!) !== day
            return (
              <div key={r.id}>
                {newDay && <p className="px-4 pt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">{day}</p>}
                <InterviewItem row={r} />
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export function DashboardPage() {
  const { data: profile } = useProfile()
  const { data, isLoading, error } = useDashboardStats()

  const totalOpenings = data ? Object.values(data.openings).reduce((a, b) => a + (b ?? 0), 0) : 0
  const pipelineMax = data ? Math.max(1, ...Object.values(data.stages).map((v) => v ?? 0)) : 1

  return (
    <>
      <PageHeader
        title={profile ? `Welcome, ${profile.first_name}` : 'Dashboard'}
        description={profile?.company ? `Recruiting overview for ${profile.company.name}` : undefined}
      />

      {isLoading && <Spinner />}
      {error && <p className="text-sm text-red-600">{error.message}</p>}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Job openings" value={totalOpenings} icon={Briefcase} to="/openings" />
            <Stat label="Applicants" value={data.applicants} icon={Users} to="/applications" />
            <Stat label="Locations" value={data.locations} icon={MapPin} to="/settings/locations" />
            <Stat label="Departments" value={data.departments} icon={Building2} to="/settings/departments" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold text-slate-900">Applicant pipeline</h2>
              <ul className="mt-4 space-y-3">
                {Constants.public.Enums.applicant_stage.map((stage) => {
                  const value = data.stages[stage] ?? 0
                  return (
                    <li key={stage} className="grid grid-cols-[7rem_1fr_2.5rem] items-center gap-3 text-sm">
                      <span className="text-slate-600">{STAGE_LABELS[stage]}</span>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-brand-500" style={{ width: `${(value / pipelineMax) * 100}%` }} />
                      </div>
                      <span className="text-right font-medium tabular-nums">{value}</span>
                    </li>
                  )
                })}
              </ul>
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-slate-900">Openings by status</h2>
              <ul className="mt-4 divide-y divide-slate-100">
                {Constants.public.Enums.opening_status.map((status) => (
                  <li key={status} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-slate-600">{OPENING_STATUS[status].label}</span>
                    <span className="font-medium tabular-nums">{data.openings[status] ?? 0}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <UpcomingInterviews />
        </div>
      )}
    </>
  )
}
