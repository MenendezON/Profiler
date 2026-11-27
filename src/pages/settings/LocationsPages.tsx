import { type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn, unwrap } from '@/lib/utils'
import type { TablesInsert } from '@/lib/database.types'
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner } from '@/components/ui'
import { Can, useRole } from '@/lib/auth'

const KEY = ['locations']

function useLocations() {
  return useQuery({
    queryKey: KEY,
    queryFn: async () => unwrap(await supabase.from('locations').select('*').order('name')),
  })
}

export function LocationsListPage() {
  const qc = useQueryClient()
  const { isAdmin } = useRole()
  const { data, isLoading, error } = useLocations()
  const remove = useMutation({
    mutationFn: async (id: string) => unwrap(await supabase.from('locations').delete().eq('id', id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })

  return (
    <>
      <BackToSettings />
      <PageHeader
        title="Locations"
        description="Offices and sites your openings can be attached to."
        actions={<Can admin><Link to="new"><Button><Plus className="size-4" />Add location</Button></Link></Can>}
      />
      {error && <Alert>{error.message}</Alert>}
      {remove.error && <Alert>{remove.error.message}</Alert>}
      <Card>
        {isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : !data?.length ? (
          <EmptyState
            icon={<MapPin className="size-5" />}
            title="No locations yet"
            description="Add your first office so you can attach it to job openings."
            action={<Can admin><Link to="new"><Button size="sm"><Plus className="size-4" />Add location</Button></Link></Can>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Address</th>
                  <th className="px-5 py-3 font-medium">City</th>
                  <th className="px-5 py-3 font-medium">Country</th>
                  <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">{l.name}</td>
                    <td className="px-5 py-3 text-slate-600">{l.address}</td>
                    <td className="px-5 py-3 text-slate-600">{l.city}{l.state && l.state !== l.city ? `, ${l.state}` : ''}</td>
                    <td className="px-5 py-3 text-slate-600">{l.country}</td>
                    <td className="px-5 py-3">
                      <div className={cn('flex justify-end gap-1', !isAdmin && 'hidden')}>
                        <Link to={`${l.id}/edit`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Edit">
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          title="Delete"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => confirm(`Delete “${l.name}”? Openings at this location will keep existing without one.`) && remove.mutate(l.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  )
}

export function LocationFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()

  const existing = useQuery({
    queryKey: [...KEY, id],
    enabled: isEdit,
    queryFn: async () => unwrap(await supabase.from('locations').select('*').eq('id', id!).single()),
  })

  const save = useMutation({
    mutationFn: async (values: TablesInsert<'locations'>) =>
      isEdit
        ? unwrap(await supabase.from('locations').update(values).eq('id', id!))
        : unwrap(await supabase.from('locations').insert(values)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      navigate('/settings/locations')
    },
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = (k: string) => String(f.get(k) ?? '').trim()
    save.mutate({ name: v('name'), address: v('address'), city: v('city'), state: v('state'), country: v('country'), postal_code: v('postal_code') })
  }

  if (isEdit && existing.isLoading) return <Spinner />
  const l = existing.data

  return (
    <>
      <BackTo to="/settings/locations" label="Locations" />
      <PageHeader title={isEdit ? 'Edit location' : 'New location'} />
      <Card className="max-w-2xl p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {(save.error || existing.error) && <Alert>{(save.error ?? existing.error)!.message}</Alert>}
          <Field label="Name" htmlFor="name">
            <Input id="name" name="name" defaultValue={l?.name} placeholder="Dakar office" required />
          </Field>
          <Field label="Address" htmlFor="address">
            <Input id="address" name="address" defaultValue={l?.address} placeholder="Ngor-Almadies, Lot 35" required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" htmlFor="city">
              <Input id="city" name="city" defaultValue={l?.city} required />
            </Field>
            <Field label="Region / State" htmlFor="state">
              <Input id="state" name="state" defaultValue={l?.state} required />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" name="country" defaultValue={l?.country ?? 'Senegal'} required />
            </Field>
            <Field label="Postal code" htmlFor="postal_code">
              <Input id="postal_code" name="postal_code" defaultValue={l?.postal_code} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Link to="/settings/locations"><Button type="button" variant="secondary">Cancel</Button></Link>
            <Button type="submit" loading={save.isPending}>{isEdit ? 'Save changes' : 'Create location'}</Button>
          </div>
        </form>
      </Card>
    </>
  )
}

export function BackTo({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900">
      <ArrowLeft className="size-4" />{label}
    </Link>
  )
}

const BackToSettings = () => <BackTo to="/settings" label="Settings" />
