import { useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Building2, ChevronRight, Globe, MapPin, Search } from 'lucide-react'
import { fetchCareersPage, type PublicOpeningSummary } from '@/lib/careers'
import { formatDate } from '@/lib/utils'
import { Badge, Card, EmptyState, Input, Select, Spinner } from '@/components/ui'

export function CareersShell({ companyName, slug, website, children }: { companyName?: string; slug?: string; website?: string | null; children: ReactNode }) {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to={slug ? `/careers/${slug}` : '#'} className="flex items-center gap-2 font-semibold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">{companyName?.[0] ?? '·'}</span>
            {companyName ?? 'Careers'}
          </Link>
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-slate-900">
              Website ↗
            </a>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</main>
      <footer className="pb-10 text-center text-xs text-slate-400">Powered by Profiler</footer>
    </div>
  )
}

export function OpeningMeta({ o }: { o: PublicOpeningSummary }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
      {o.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{o.location.city}, {o.location.country}</span>}
      {o.remote && <span className="inline-flex items-center gap-1"><Globe className="size-3.5" />Remote possible</span>}
      {o.department && <span className="inline-flex items-center gap-1"><Building2 className="size-3.5" />{o.department}</span>}
      <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{o.type}</span>
    </p>
  )
}

export function CareersPage() {
  const { slug = '' } = useParams()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['careers', slug],
    queryFn: () => fetchCareersPage(slug),
  })

  const cities = useMemo(
    () => [...new Set((data?.openings ?? []).map((o) => o.location?.city).filter(Boolean) as string[])].sort(),
    [data],
  )
  const needle = q.trim().toLowerCase()
  const openings = (data?.openings ?? []).filter(
    (o) =>
      (!needle || o.title.toLowerCase().includes(needle) || (o.department ?? '').toLowerCase().includes(needle)) &&
      (!city || o.location?.city === city),
  )

  if (isLoading) return <div className="flex h-full items-center justify-center"><Spinner className="size-6" /></div>

  if (error || !data) {
    return (
      <CareersShell>
        <Card>
          <EmptyState icon={<Briefcase className="size-5" />} title="Careers page not found" description="Check the link you were given, or contact the company directly." />
        </Card>
      </CareersShell>
    )
  }

  return (
    <CareersShell companyName={data.company.name} slug={slug} website={data.company.website}>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Join {data.company.name}</h1>
        <p className="mt-2 text-slate-600">
          {data.openings.length
            ? `${data.openings.length} open position${data.openings.length > 1 ? 's' : ''}. Find the one that fits you and apply in a few minutes.`
            : 'There are no open positions right now. Please check back soon.'}
        </p>
      </div>

      {data.openings.length > 3 && (
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_12rem]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search positions" className="pl-9" aria-label="Search positions" />
          </div>
          {cities.length > 1 && (
            <Select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
              <option value="">All locations</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </Select>
          )}
        </div>
      )}

      {!!data.openings.length && (
        <Card>
          {openings.length ? (
            <ul className="divide-y divide-slate-100">
              {openings.map((o) => (
                <li key={o.id}>
                  <Link to={`jobs/${o.id}`} className="group flex items-center gap-4 px-5 py-5 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-slate-900 group-hover:text-brand-700">{o.title}</h2>
                        {o.experience && <Badge>{o.experience}</Badge>}
                      </div>
                      <div className="mt-1.5"><OpeningMeta o={o} /></div>
                    </div>
                    <span className="hidden text-xs text-slate-400 sm:block">Posted {formatDate(o.created_at)}</span>
                    <ChevronRight className="size-5 text-slate-300 group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={<Search className="size-5" />} title="No matching positions" description="Try another search or location." />
          )}
        </Card>
      )}
    </CareersShell>
  )
}
