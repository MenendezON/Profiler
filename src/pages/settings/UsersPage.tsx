import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Ban, Check, Copy, Mail, RotateCcw, UserPlus, Users, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, formatDate, unwrap } from '@/lib/utils'
import { useProfile, useRole } from '@/lib/auth'
import { Constants, type Enums, type Tables } from '@/lib/database.types'
import { initials } from '@/lib/applications'
import { Alert, Avatar, Badge, Button, Card, Dialog, EmptyState, Field, Input, PageHeader, Select, Spinner } from '@/components/ui'
import { BackTo } from './LocationsPages'

type Role = Enums<'user_role'>
type Invitation = Tables<'invitations'>

export const ROLE_INFO: Record<Role, { label: string; hint: string; tone: 'violet' | 'blue' | 'slate' }> = {
  admin: { label: 'Admin', hint: 'Everything, including users, locations and departments', tone: 'violet' },
  recruiter: { label: 'Recruiter', hint: 'Openings, candidates, interviews and screening templates', tone: 'blue' },
  viewer: { label: 'Viewer', hint: 'Read-only access', tone: 'slate' },
}

export const inviteUrl = (token: string) => `${window.location.origin}/invite/${token}`

function inviteMailto(inv: Pick<Invitation, 'email' | 'role' | 'token'>, companyName: string, inviter: string) {
  const subject = `Join ${companyName} on Profiler`
  const body = [
    'Hello,',
    '',
    `${inviter} invited you to join ${companyName} on Profiler as ${ROLE_INFO[inv.role].label}.`,
    '',
    'Create your account with this link (valid for 14 days):',
    inviteUrl(inv.token),
    '',
    'See you soon!',
  ].join('\n')
  return `mailto:${encodeURIComponent(inv.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function friendly(message: string) {
  if (message.includes('invitations_one_pending_per_email')) return 'There is already a pending invitation for this email.'
  return message
}

export function UsersPage() {
  const qc = useQueryClient()
  const { data: me } = useProfile()
  const { isAdmin } = useRole()
  const [inviting, setInviting] = useState(false)

  const members = useQuery({
    queryKey: ['team'],
    queryFn: async () => unwrap(await supabase.from('profiles').select('*').order('created_at')),
  })

  const invitations = useQuery({
    queryKey: ['invitations'],
    enabled: isAdmin,
    queryFn: async () => unwrap(await supabase.from('invitations').select('*').eq('status', 'pending').order('created_at', { ascending: false })),
  })

  const updateMember = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: { role?: Role; status?: string } }) =>
      unwrap(await supabase.from('profiles').update(values).eq('id', id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['team'] }); qc.invalidateQueries({ queryKey: ['profile'] }) },
  })

  const revoke = useMutation({
    mutationFn: async (id: string) => unwrap(await supabase.from('invitations').update({ status: 'revoked' }).eq('id', id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })

  const err = members.error ?? invitations.error ?? updateMember.error ?? revoke.error
  const company = me?.company?.name ?? ''
  const inviter = me ? `${me.first_name} ${me.last_name}`.trim() : ''

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader
        title="Users"
        description={isAdmin ? 'Invite your colleagues and choose what each person can do.' : 'People in your organization.'}
        actions={isAdmin ? <Button onClick={() => setInviting(true)}><UserPlus className="size-4" />Invite user</Button> : undefined}
      />
      {err && <div className="mb-4"><Alert>{err.message}</Alert></div>}

      <Card className="mb-6">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold">Team members</h2>
        </div>
        {members.isLoading ? (
          <div className="p-5"><Spinner /></div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(members.data ?? []).map((m) => {
              const self = m.id === me?.id
              const inactive = m.status !== 'active'
              return (
                <li key={m.id} className={cn('flex flex-wrap items-center gap-3 px-5 py-3', inactive && 'opacity-60')}>
                  <Avatar text={initials(m.first_name, m.last_name)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {`${m.first_name} ${m.last_name}`.trim() || m.email}
                      {self && <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>}
                    </p>
                    <p className="truncate text-xs text-slate-500">{m.email} · joined {formatDate(m.created_at)}</p>
                  </div>
                  {inactive && <Badge tone="red">Deactivated</Badge>}
                  {isAdmin ? (
                    <Select
                      aria-label={`Role of ${m.email}`}
                      className="h-8 w-36"
                      value={m.role}
                      disabled={updateMember.isPending || inactive}
                      onChange={(e) => {
                        const role = e.target.value as Role
                        if (self && role !== 'admin' && !confirm('You will lose admin rights, including access to this page. Continue?')) return
                        updateMember.mutate({ id: m.id, values: { role } })
                      }}
                    >
                      {Constants.public.Enums.user_role.map((r) => <option key={r} value={r}>{ROLE_INFO[r].label}</option>)}
                    </Select>
                  ) : (
                    <Badge tone={ROLE_INFO[m.role].tone}>{ROLE_INFO[m.role].label}</Badge>
                  )}
                  {isAdmin && !self && (
                    inactive ? (
                      <Button size="sm" variant="secondary" onClick={() => updateMember.mutate({ id: m.id, values: { status: 'active' } })}>
                        <RotateCcw className="size-4" />Reactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => confirm(`Deactivate ${m.email}? They will immediately lose access to Profiler.`) && updateMember.mutate({ id: m.id, values: { status: 'inactive' } })}
                      >
                        <Ban className="size-4" />Deactivate
                      </Button>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {isAdmin && (
        <Card>
          <div className="border-b border-slate-100 px-5 py-3">
            <h2 className="text-sm font-semibold">Pending invitations</h2>
          </div>
          {invitations.isLoading ? (
            <div className="p-5"><Spinner /></div>
          ) : !invitations.data?.length ? (
            <EmptyState
              icon={<Users className="size-5" />}
              title="No pending invitations"
              description="Invite recruiters to share the work, or viewers such as hiring managers who only need to follow candidates."
              action={<Button size="sm" onClick={() => setInviting(true)}><UserPlus className="size-4" />Invite user</Button>}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {invitations.data.map((inv) => {
                const expired = new Date(inv.expires_at).getTime() < Date.now()
                return (
                  <li key={inv.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{inv.email}</p>
                      <p className="text-xs text-slate-500">
                        {expired ? <span className="text-red-600">Expired {formatDate(inv.expires_at)}</span> : `Expires ${formatDate(inv.expires_at)}`}
                      </p>
                    </div>
                    <Badge tone={ROLE_INFO[inv.role].tone}>{ROLE_INFO[inv.role].label}</Badge>
                    {!expired && <CopyButton text={inviteUrl(inv.token)} />}
                    {!expired && (
                      <a href={inviteMailto(inv, company, inviter)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Email invitation">
                        <Mail className="size-4" />
                      </a>
                    )}
                    <button
                      onClick={() => confirm(`Revoke the invitation for ${inv.email}?`) && revoke.mutate(inv.id)}
                      className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title={expired ? 'Remove' : 'Revoke'}
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>
      )}

      {inviting && <InviteDialog company={company} inviter={inviter} onClose={() => setInviting(false)} />}
    </>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500) })}
      className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      title="Copy invitation link"
    >
      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
    </button>
  )
}

function InviteDialog({ company, inviter, onClose }: { company: string; inviter: string; onClose: () => void }) {
  const qc = useQueryClient()
  const [role, setRole] = useState<Role>('recruiter')
  const [created, setCreated] = useState<Invitation | null>(null)

  const invite = useMutation({
    mutationFn: async (email: string) =>
      unwrap(await supabase.from('invitations').insert({ email: email.trim().toLowerCase(), role }).select('*').single()),
    onSuccess: (row) => { qc.invalidateQueries({ queryKey: ['invitations'] }); setCreated(row) },
  })

  if (created) {
    return (
      <Dialog open onClose={onClose} title="Invitation created" footer={<Button onClick={onClose}>Done</Button>}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Send this link to <strong>{created.email}</strong>. They will create their password and join {company} as{' '}
            <strong>{ROLE_INFO[created.role].label}</strong>. The link works once and expires in 14 days.
          </p>
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 pl-3">
            <input readOnly value={inviteUrl(created.token)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" onFocus={(e) => e.currentTarget.select()} aria-label="Invitation link" />
            <CopyButton text={inviteUrl(created.token)} />
          </div>
          <a href={inviteMailto(created, company, inviter)} className="block">
            <Button variant="secondary" className="w-full"><Mail className="size-4" />Email the invitation</Button>
          </a>
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title="Invite a user"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" form="invite-user" loading={invite.isPending}>Create invitation</Button></>}
    >
      <form
        id="invite-user"
        onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); invite.mutate(String(new FormData(e.currentTarget).get('email') ?? '')) }}
        className="space-y-4"
      >
        {invite.error && <Alert>{friendly(invite.error.message)}</Alert>}
        <Field label="Work email" htmlFor="invite-email">
          <Input id="invite-email" name="email" type="email" required autoFocus placeholder="colleague@company.sn" />
        </Field>
        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-sm font-medium text-slate-700">Role</legend>
          {Constants.public.Enums.user_role.map((r) => (
            <label key={r} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-0.5 accent-brand-600" />
              <span>
                <span className="block text-sm font-medium">{ROLE_INFO[r].label}</span>
                <span className="block text-xs text-slate-500">{ROLE_INFO[r].hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </form>
    </Dialog>
  )
}
