import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { MailCheck, ShieldAlert } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { signOut, useAuth } from '@/lib/auth'
import type { Enums } from '@/lib/database.types'
import { Alert, Button, Card, Field, Input, Spinner } from '@/components/ui'
import { ROLE_INFO } from './settings/UsersPage'

interface InvitationInfo {
  email: string
  role: Enums<'user_role'>
  company_name: string
  state: 'pending' | 'accepted' | 'revoked' | 'expired'
}

const STATE_TEXT: Record<Exclude<InvitationInfo['state'], 'pending'>, string> = {
  accepted: 'This invitation has already been used. Sign in with the account you created.',
  revoked: 'This invitation was cancelled. Ask your administrator for a new one.',
  expired: 'This invitation has expired. Ask your administrator for a new one.',
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2 text-lg font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">P</span>Profiler
        </div>
        <Card className="p-6">{children}</Card>
      </div>
    </div>
  )
}

export function AcceptInvitePage() {
  const { token = '' } = useParams()
  const { session } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmSent, setConfirmSent] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['invitation', token],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_invitation', { p_token: token })
      if (error) throw new Error(error.message)
      return data as unknown as InvitationInfo | null
    },
  })

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!data) return
    const f = new FormData(e.currentTarget)
    setLoading(true)
    setError(null)
    const { data: res, error } = await supabase.auth.signUp({
      email: data.email,
      password: String(f.get('password')),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { invite_token: token, first_name: String(f.get('first_name')).trim(), last_name: String(f.get('last_name')).trim() },
      },
    })
    setLoading(false)
    if (error) {
      // the database trigger rejects invalid invitations; Supabase surfaces that as a generic message
      setError(error.message.includes('Database error') ? 'This invitation could not be used. It may have expired or already been accepted.' : error.message)
      return
    }
    if (res.session) navigate('/dashboard', { replace: true })
    else setConfirmSent(true)
  }

  if (isLoading) return <Shell><div className="flex justify-center py-6"><Spinner /></div></Shell>

  if (!data) {
    return (
      <Shell>
        <div className="text-center">
          <ShieldAlert className="mx-auto size-10 text-slate-400" />
          <h1 className="mt-3 text-lg font-semibold">Invitation not found</h1>
          <p className="mt-1 text-sm text-slate-500">Check that you copied the whole link.</p>
        </div>
      </Shell>
    )
  }

  if (data.state !== 'pending') {
    return (
      <Shell>
        <div className="text-center">
          <ShieldAlert className="mx-auto size-10 text-slate-400" />
          <h1 className="mt-3 text-lg font-semibold">Invitation to {data.company_name}</h1>
          <p className="mt-1 text-sm text-slate-500">{STATE_TEXT[data.state]}</p>
          <Link to="/login" className="mt-5 inline-block"><Button variant="secondary">Go to sign in</Button></Link>
        </div>
      </Shell>
    )
  }

  if (session) {
    return (
      <Shell>
        <h1 className="text-lg font-semibold">Invitation to {data.company_name}</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are signed in as <strong>{session.user.email}</strong>. This invitation is for <strong>{data.email}</strong> — sign out first to accept it.
        </p>
        <Button className="mt-5 w-full" variant="secondary" onClick={signOut}>Sign out</Button>
      </Shell>
    )
  }

  if (confirmSent) {
    return (
      <Shell>
        <div className="text-center">
          <MailCheck className="mx-auto size-10 text-emerald-500" />
          <h1 className="mt-3 text-lg font-semibold">Confirm your email</h1>
          <p className="mt-1 text-sm text-slate-500">We sent a confirmation link to {data.email}. Open it, then sign in.</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <h1 className="text-xl font-semibold">Join {data.company_name}</h1>
      <p className="mt-1 text-sm text-slate-500">
        You've been invited as <strong>{ROLE_INFO[data.role].label}</strong> — {ROLE_INFO[data.role].hint.toLowerCase()}.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && <Alert>{error}</Alert>}
        <Field label="Email" htmlFor="email"><Input id="email" value={data.email} readOnly disabled /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="first_name"><Input id="first_name" name="first_name" autoComplete="given-name" required /></Field>
          <Field label="Last name" htmlFor="last_name"><Input id="last_name" name="last_name" autoComplete="family-name" required /></Field>
        </div>
        <Field label="Choose a password" htmlFor="password" hint="At least 8 characters.">
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Button type="submit" className="w-full" loading={loading}>Create my account</Button>
        <p className="text-center text-xs text-slate-500">Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:underline">Sign in</Link></p>
      </form>
    </Shell>
  )
}
