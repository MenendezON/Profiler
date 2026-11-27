import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { unwrap } from '@/lib/utils'
import { useProfile } from '@/lib/auth'
import { Alert, Badge, Button, Card, Field, Input, PageHeader, Spinner } from '@/components/ui'
import { BackTo } from './LocationsPages'
import { ROLE_INFO } from './UsersPage'

export function ProfilePage() {
  const qc = useQueryClient()
  const { data: me, isLoading } = useProfile()
  const [saved, setSaved] = useState(false)
  const [pwDone, setPwDone] = useState(false)

  const save = useMutation({
    mutationFn: async (values: { first_name: string; last_name: string; designation: string }) =>
      unwrap(await supabase.from('profiles').update(values).eq('id', me!.id)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['profile'] }); qc.invalidateQueries({ queryKey: ['team'] }); setSaved(true) },
  })

  const password = useMutation({
    mutationFn: async ({ pw, confirm }: { pw: string; confirm: string }) => {
      if (pw !== confirm) throw new Error('The two passwords do not match.')
      const { error } = await supabase.auth.updateUser({ password: pw })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => setPwDone(true),
  })

  if (isLoading || !me) return <Spinner />

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader title="My profile" />
      <div className="grid max-w-3xl gap-6">
        <Card className="p-6">
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const f = new FormData(e.currentTarget)
              setSaved(false)
              save.mutate({
                first_name: String(f.get('first_name')).trim(),
                last_name: String(f.get('last_name')).trim(),
                designation: String(f.get('designation')).trim(),
              })
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {save.error && <div className="sm:col-span-2"><Alert>{save.error.message}</Alert></div>}
            <Field label="First name" htmlFor="p-first"><Input id="p-first" name="first_name" defaultValue={me.first_name} required /></Field>
            <Field label="Last name" htmlFor="p-last"><Input id="p-last" name="last_name" defaultValue={me.last_name} required /></Field>
            <Field label="Job title" htmlFor="p-title"><Input id="p-title" name="designation" defaultValue={me.designation} placeholder="HR Officer" /></Field>
            <Field label="Email" htmlFor="p-email" hint="Used to sign in."><Input id="p-email" value={me.email} disabled readOnly /></Field>
            <div className="flex items-center justify-between sm:col-span-2">
              <span className="text-sm text-slate-500">
                Role: <Badge tone={ROLE_INFO[me.role].tone}>{ROLE_INFO[me.role].label}</Badge>
              </span>
              <div className="flex items-center gap-3">
                {saved && <span className="text-sm text-emerald-600">Saved</span>}
                <Button type="submit" loading={save.isPending}>Save</Button>
              </div>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold">Change password</h2>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const form = e.currentTarget
              const f = new FormData(form)
              setPwDone(false)
              password.mutate({ pw: String(f.get('pw')), confirm: String(f.get('confirm')) }, { onSuccess: () => form.reset() })
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {password.error && <div className="sm:col-span-2"><Alert>{password.error.message}</Alert></div>}
            <Field label="New password" htmlFor="pw"><Input id="pw" name="pw" type="password" autoComplete="new-password" minLength={8} required /></Field>
            <Field label="Repeat new password" htmlFor="pw2"><Input id="pw2" name="confirm" type="password" autoComplete="new-password" minLength={8} required /></Field>
            <div className="flex items-center justify-end gap-3 sm:col-span-2">
              {pwDone && <span className="text-sm text-emerald-600">Password updated</span>}
              <Button type="submit" variant="secondary" loading={password.isPending}>Update password</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
