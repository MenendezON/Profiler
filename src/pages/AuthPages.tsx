import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { Alert, Button, Field, Input } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-full">
      <div className="hidden w-1/2 flex-col justify-between bg-brand-700 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/15">P</span> Profiler
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">Hire the right people, faster.</h2>
          <p className="mt-3 max-w-md text-brand-100">
            Publish openings, track every applicant through your pipeline, and keep your whole recruiting team in one place.
          </p>
        </div>
        <p className="text-sm text-brand-100">Applicant tracking for teams in West Africa and beyond.</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  )
}

export function LoginPage() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  if (session) return <Navigate to={from} replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    })
    setLoading(false)
    if (error) setError(error.message)
    else navigate(from, { replace: true })
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to Profiler."
      footer={<>New to Profiler? <Link to="/signup" className="font-medium text-brand-600 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <Field label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        <Button type="submit" loading={loading} className="w-full">Sign in</Button>
      </form>
    </AuthShell>
  )
}

export function SignupPage() {
  const { session } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  if (session) return <Navigate to="/dashboard" replace />

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email'))
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(f.get('password')),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          first_name: String(f.get('first_name')),
          last_name: String(f.get('last_name')),
          company_name: String(f.get('company_name')),
        },
      },
    })
    setLoading(false)
    if (error) setError(error.message)
    else if (!data.session) setSentTo(email) // email confirmation is on
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a confirmation link to ${sentTo}.`} footer={<Link to="/login" className="font-medium text-brand-600 hover:underline">Back to sign in</Link>}>
        <p className="text-sm text-slate-600">Open the link to activate your account, then sign in.</p>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up Profiler for your organization."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <Alert>{error}</Alert>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="first_name">
            <Input id="first_name" name="first_name" autoComplete="given-name" required />
          </Field>
          <Field label="Last name" htmlFor="last_name">
            <Input id="last_name" name="last_name" autoComplete="family-name" required />
          </Field>
        </div>
        <Field label="Organization" htmlFor="company_name">
          <Input id="company_name" name="company_name" autoComplete="organization" required />
        </Field>
        <Field label="Work email" htmlFor="email">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters.">
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>
    </AuthShell>
  )
}
