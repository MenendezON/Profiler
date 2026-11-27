import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, unwrap } from '@/lib/utils'
import type { Tables } from '@/lib/database.types'
import { QUESTION_TYPES, questionHasOptions, questionTypeLabel, type QuestionType } from '@/lib/constants'
import { Alert, Badge, Button, Card, Checkbox, Dialog, EmptyState, Field, Input, PageHeader, Select, Spinner, Textarea } from '@/components/ui'
import { BackTo } from './LocationsPages'

type Question = Tables<'questions'>
const KEY = ['screening-templates']

// ============================================================ list

export function ScreeningTemplatesListPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [creating, setCreating] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: async () =>
      unwrap(await supabase.from('screening_templates').select('*, questions(count), openings(count)').order('name')),
  })

  const create = useMutation({
    mutationFn: async (name: string) =>
      unwrap(await supabase.from('screening_templates').insert({ name }).select('id').single()),
    onSuccess: (row) => {
      qc.invalidateQueries({ queryKey: KEY })
      navigate(row.id)
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => unwrap(await supabase.from('screening_templates').delete().eq('id', id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })

  function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    create.mutate(String(new FormData(e.currentTarget).get('name') ?? '').trim())
  }

  const addButton = (
    <Button onClick={() => setCreating(true)}><Plus className="size-4" />New template</Button>
  )

  return (
    <>
      <BackTo to="/settings" label="Settings" />
      <PageHeader
        title="Screening questions"
        description="Application form templates. Attach one to a job opening to ask candidates extra questions."
        actions={addButton}
      />
      {(error || remove.error) && <Alert>{(error ?? remove.error)!.message}</Alert>}
      <Card>
        {isLoading ? (
          <div className="p-6"><Spinner /></div>
        ) : !data?.length ? (
          <EmptyState
            icon={<ClipboardList className="size-5" />}
            title="No templates yet"
            description="Create a template like “IT roles” or “Field staff” and add the questions candidates should answer."
            action={<Button size="sm" onClick={() => setCreating(true)}><Plus className="size-4" />New template</Button>}
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.map((t) => {
              const used = t.openings[0]?.count ?? 0
              return (
                <li key={t.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
                  <Link to={t.id} className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.questions[0]?.count ?? 0} question(s) · used by {used} opening(s) · updated {formatDate(t.updated_at)}
                    </p>
                  </Link>
                  <Link to={t.id} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Edit">
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    title="Delete"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() =>
                      confirm(
                        used
                          ? `“${t.name}” is used by ${used} opening(s). Delete it anyway? Those openings will no longer have screening questions.`
                          : `Delete “${t.name}” and its questions?`,
                      ) && remove.mutate(t.id)
                    }
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Dialog
        open={creating}
        onClose={() => setCreating(false)}
        title="New template"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreating(false)}>Cancel</Button>
            <Button type="submit" form="new-template" loading={create.isPending}>Create</Button>
          </>
        }
      >
        <form id="new-template" onSubmit={onCreate} className="space-y-3">
          {create.error && <Alert>{create.error.message}</Alert>}
          <Field label="Template name" htmlFor="tpl-name">
            <Input id="tpl-name" name="name" placeholder="e.g. IT roles" autoFocus required />
          </Field>
        </form>
      </Dialog>
    </>
  )
}

// ============================================================ detail / editor

export function ScreeningTemplateDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const key = [...KEY, id]
  const [editing, setEditing] = useState<Question | 'new' | null>(null)
  const [renaming, setRenaming] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () =>
      unwrap(
        await supabase
          .from('screening_templates')
          .select('*, questions(*)')
          .eq('id', id!)
          .order('position', { referencedTable: 'questions' })
          .single(),
      ),
  })
  const questions = data?.questions ?? []
  const refresh = () => {
    qc.invalidateQueries({ queryKey: key })
    qc.invalidateQueries({ queryKey: KEY, exact: true })
  }

  const rename = useMutation({
    mutationFn: async (name: string) => unwrap(await supabase.from('screening_templates').update({ name }).eq('id', id!)),
    onSuccess: () => { refresh(); setRenaming(false) },
  })

  const removeTemplate = useMutation({
    mutationFn: async () => unwrap(await supabase.from('screening_templates').delete().eq('id', id!)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); navigate('/settings/screening-templates') },
  })

  const removeQuestion = useMutation({
    mutationFn: async (qid: string) => unwrap(await supabase.from('questions').delete().eq('id', qid)),
    onSuccess: refresh,
  })

  // Swap with neighbour, then renumber 0..n so positions stay dense.
  const move = useMutation({
    mutationFn: async ({ index, dir }: { index: number; dir: -1 | 1 }) => {
      const order = [...questions]
      const j = index + dir
      ;[order[index], order[j]] = [order[j], order[index]]
      const changed = order.map((q, pos) => ({ q, pos })).filter(({ q, pos }) => q.position !== pos)
      for (const { q, pos } of changed) unwrap(await supabase.from('questions').update({ position: pos }).eq('id', q.id))
    },
    onSuccess: refresh,
  })

  if (isLoading) return <Spinner />
  if (error || !data) return <Alert>{error?.message ?? 'Template not found'}</Alert>

  const mutationError = rename.error ?? removeTemplate.error ?? removeQuestion.error ?? move.error

  return (
    <>
      <BackTo to="/settings/screening-templates" label="Screening questions" />
      <PageHeader
        title={data.name}
        description={`${questions.length} custom question(s) added to the standard application form.`}
        actions={
          <>
            <Button variant="secondary" onClick={() => setRenaming(true)}><Pencil className="size-4" />Rename</Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:bg-red-50"
              onClick={() => confirm(`Delete “${data.name}” and its questions?`) && removeTemplate.mutate()}
            >
              <Trash2 className="size-4" />Delete
            </Button>
          </>
        }
      />
      {mutationError && <div className="mb-4"><Alert>{mutationError.message}</Alert></div>}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <h2 className="text-sm font-semibold">Questions</h2>
            <Button size="sm" onClick={() => setEditing('new')}><Plus className="size-4" />Add question</Button>
          </div>
          {!questions.length ? (
            <EmptyState
              icon={<ClipboardList className="size-5" />}
              title="No questions yet"
              description="Candidates will only fill in the standard fields until you add questions."
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {questions.map((q, i) => (
                <li key={q.id} className="flex items-start gap-3 px-5 py-3">
                  <div className="flex flex-col">
                    <button
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      disabled={i === 0 || move.isPending}
                      onClick={() => move.mutate({ index: i, dir: -1 })}
                      aria-label="Move up"
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      disabled={i === questions.length - 1 || move.isPending}
                      onClick={() => move.mutate({ index: i, dir: 1 })}
                      aria-label="Move down"
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {q.title}
                      {q.required && <span className="ml-1 text-red-500">*</span>}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge tone="violet">{questionTypeLabel(q.type)}</Badge>
                      {q.options.map((o) => <Badge key={o}>{o}</Badge>)}
                    </div>
                  </div>
                  <button onClick={() => setEditing(q)} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Edit">
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => confirm('Delete this question?') && removeQuestion.mutate(q.id)}
                    className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="lg:col-span-2">
          <FormPreview questions={questions} />
        </div>
      </div>

      {editing && (
        <QuestionDialog
          templateId={id!}
          question={editing === 'new' ? null : editing}
          nextPosition={questions.length}
          onClose={() => setEditing(null)}
          onSaved={() => { refresh(); setEditing(null) }}
        />
      )}

      <Dialog
        open={renaming}
        onClose={() => setRenaming(false)}
        title="Rename template"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenaming(false)}>Cancel</Button>
            <Button type="submit" form="rename-template" loading={rename.isPending}>Save</Button>
          </>
        }
      >
        <form
          id="rename-template"
          onSubmit={(e) => { e.preventDefault(); rename.mutate(String(new FormData(e.currentTarget).get('name')).trim()) }}
        >
          <Field label="Template name" htmlFor="rename">
            <Input id="rename" name="name" defaultValue={data.name} autoFocus required />
          </Field>
        </form>
      </Dialog>
    </>
  )
}

function QuestionDialog({ templateId, question, nextPosition, onClose, onSaved }: {
  templateId: string
  question: Question | null
  nextPosition: number
  onClose: () => void
  onSaved: () => void
}) {
  const [type, setType] = useState<string>(question?.type ?? 'short_text')
  const withOptions = questionHasOptions(type)

  const save = useMutation({
    mutationFn: async (values: { title: string; type: string; required: boolean; options: string[] }) =>
      question
        ? unwrap(await supabase.from('questions').update(values).eq('id', question.id))
        : unwrap(await supabase.from('questions').insert({ ...values, template_id: templateId, position: nextPosition })),
    onSuccess: onSaved,
  })

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const options = withOptions
      ? [...new Set(String(f.get('options') ?? '').split('\n').map((o) => o.trim()).filter(Boolean))]
      : []
    save.mutate({ title: String(f.get('title')).trim(), type, required: f.get('required') === 'on', options })
  }

  return (
    <Dialog
      open
      onClose={onClose}
      size="lg"
      title={question ? 'Edit question' : 'Add question'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="question-form" loading={save.isPending}>{question ? 'Save' : 'Add question'}</Button>
        </>
      }
    >
      <form id="question-form" onSubmit={onSubmit} className="space-y-4">
        {save.error && <Alert>{save.error.message}</Alert>}
        <Field label="Question" htmlFor="q-title">
          <Input id="q-title" name="title" defaultValue={question?.title} placeholder="How many languages do you speak?" autoFocus required />
        </Field>
        <Field label="Answer type" htmlFor="q-type">
          <Select id="q-type" value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
            {QUESTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
        {withOptions && (
          <Field label="Predefined answers" htmlFor="q-options" hint="One answer per line.">
            <Textarea
              id="q-options"
              name="options"
              rows={4}
              defaultValue={question?.options.join('\n')}
              placeholder={'Wolof\nFrench\nEnglish'}
              required
            />
          </Field>
        )}
        <Checkbox name="required" defaultChecked={question?.required ?? true} label="Candidates must answer this question" />
      </form>
    </Dialog>
  )
}

// ============================================================ preview

const STANDARD_FIELDS = ['Full name', 'Email', 'Mobile', 'Current city', 'Experience (years)', 'Resume']

function FormPreview({ questions }: { questions: Question[] }) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold">Application form preview</h2>
      <p className="mt-1 text-xs text-slate-500">What candidates will see when they apply.</p>
      <div className="mt-4 space-y-3 opacity-90">
        {STANDARD_FIELDS.map((f) => (
          <div key={f}>
            <p className="mb-1 text-xs font-medium text-slate-600">{f} <span className="text-red-500">*</span></p>
            <div className="h-8 rounded-md border border-slate-200 bg-slate-50" />
          </div>
        ))}
        {questions.map((q) => (
          <div key={q.id}>
            <p className="mb-1 text-xs font-medium text-slate-600">
              {q.title} {q.required && <span className="text-red-500">*</span>}
            </p>
            <PreviewControl q={q} />
          </div>
        ))}
        <Button size="sm" className="mt-2 w-full" disabled>Apply</Button>
      </div>
    </Card>
  )
}

function PreviewControl({ q }: { q: Question }) {
  switch (q.type) {
    case 'long_text':
      return <div className="h-16 rounded-md border border-slate-200 bg-slate-50" />
    case 'yes_no':
      return <div className="flex gap-4 text-xs text-slate-600"><span>○ Yes</span><span>○ No</span></div>
    case 'dropdown':
      return <div className="flex h-8 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-400">— Select ({q.options.length} options) —</div>
    case 'multiple_choice':
      return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">{q.options.map((o) => <span key={o}>☐ {o}</span>)}</div>
    case 'file':
      return <div className="flex h-8 items-center rounded-md border border-dashed border-slate-300 px-2 text-xs text-slate-400">Choose file…</div>
    default:
      return <div className="h-8 rounded-md border border-slate-200 bg-slate-50" />
  }
}
