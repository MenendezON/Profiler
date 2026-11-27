import { type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, unwrap } from '@/lib/utils'
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner } from '@/components/ui'
import { BackTo } from './LocationsPages'

const KEY = ['departments']

export function DepartmentsListPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: async () => unwrap(await supabase.from('departments').select('*, openings(count)').order('name')),
  })
  const remove = useMutation({
    mutationFn: async (id: string) => unwrap(await supabase.from('departments').delete().eq('id', id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader
        title="Departments"
        description="Teams that own your job openings."
        actions={<Link to="new"><Button><Plus className="size-4" />Add department</Button></Link>}
      />
      {error && <Alert>{error.message}</Alert>}
      {remove.error && <Alert>{remove.error.message}</Alert>}
      <Card>
        {isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : !data?.length ? (
          <EmptyState
            icon={<Building2 className="size-5" />}
            title="No departments yet"
            description="Create departments like Human Resources or Information Technology."
            action={<Link to="new"><Button size="sm"><Plus className="size-4" />Add department</Button></Link>}
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{d.name}</p>
                  <p className="text-xs text-slate-500">
                    {d.openings[0]?.count ?? 0} opening(s) · created {formatDate(d.created_at)}
                  </p>
                </div>
                <Link to={`${d.id}/edit`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Edit">
                  <Pencil className="size-4" />
                </Link>
                <button
                  title="Delete"
                  className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => confirm(`Delete “${d.name}”?`) && remove.mutate(d.id)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}

export function DepartmentFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const qc = useQueryClient()

  const existing = useQuery({
    queryKey: [...KEY, id],
    enabled: isEdit,
    queryFn: async () => unwrap(await supabase.from('departments').select('*').eq('id', id!).single()),
  })

  const save = useMutation({
    mutationFn: async (name: string) =>
      isEdit
        ? unwrap(await supabase.from('departments').update({ name }).eq('id', id!))
        : unwrap(await supabase.from('departments').insert({ name })),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      navigate('/settings/departments')
    },
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    save.mutate(String(new FormData(e.currentTarget).get('name') ?? '').trim())
  }

  if (isEdit && existing.isLoading) return <Spinner />

  return (
    <>
      <BackTo to="/settings/departments" label="Departments" />
      <PageHeader title={isEdit ? 'Edit department' : 'New department'} />
      <Card className="max-w-xl p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {(save.error || existing.error) && <Alert>{(save.error ?? existing.error)!.message}</Alert>}
          <Field label="Name" htmlFor="name">
            <Input id="name" name="name" defaultValue={existing.data?.name} placeholder="Human Resources" required />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Link to="/settings/departments"><Button type="button" variant="secondary">Cancel</Button></Link>
            <Button type="submit" loading={save.isPending}>{isEdit ? 'Save changes' : 'Create department'}</Button>
          </div>
        </form>
      </Card>
    </>
  )
}
