import { useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router'
import { BarChart3, Briefcase, CalendarClock, LayoutDashboard, LogOut, Menu, Settings, Users, X } from 'lucide-react'
import { signOut, useAuth, useProfile } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Spinner } from './ui'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/openings', label: 'Job Openings', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: Users },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <div className="flex h-full items-center justify-center"><Spinner className="size-6" /></div>
  }
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <AppLayout />
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { data: profile } = useProfile()
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5 text-lg font-semibold text-slate-900">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">P</span>
        Profiler
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {(profile?.first_name?.[0] ?? '') + (profile?.last_name?.[0] ?? '') || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{profile ? `${profile.first_name} ${profile.last_name}` : '…'}</p>
            <p className="truncate text-xs text-slate-500">{profile?.company?.name}</p>
          </div>
          <button onClick={signOut} title="Sign out" className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
            <LogOut className="size-4" />
            <span className="sr-only">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function AppLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-full">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-md p-1 text-slate-500 hover:bg-slate-100">
              <X className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100">
            <Menu className="size-5" />
            <span className="sr-only">Open menu</span>
          </button>
          <span className="ml-2 font-semibold">Profiler</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
