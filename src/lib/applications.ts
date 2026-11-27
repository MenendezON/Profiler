import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import { unwrap } from './utils'
import type { Enums } from './database.types'

export type Stage = Enums<'applicant_stage'>

export const STAGE_TONES: Record<Stage, 'blue' | 'violet' | 'amber' | 'green' | 'red' | 'slate'> = {
  new: 'blue',
  shortlisted: 'violet',
  interviewed: 'amber',
  offered: 'amber',
  hired: 'green',
  rejected: 'red',
  talentpool: 'slate',
}

/** Stages shown by default on the Applications screen (the "active" pipeline). */
export const ACTIVE_STAGES: Stage[] = ['new', 'shortlisted', 'interviewed', 'offered']

export const RESUME_BUCKET = 'resumes'
export const RESUME_ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
export const RESUME_MAX_BYTES = 10 * 1024 * 1024

/** Everything that shows application data — refreshed after any change. */
export function invalidateApplications(qc: QueryClient) {
  for (const key of ['applications', 'application', 'stage-counts', 'opening-pipeline', 'dashboard-stats', 'openings']) {
    qc.invalidateQueries({ queryKey: [key] })
  }
}

export function useMoveStage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ ids, stage }: { ids: string[]; stage: Stage }) =>
      unwrap(await supabase.from('opening_applicants').update({ stage }).in('id', ids)),
    onSuccess: () => invalidateApplications(qc),
  })
}

export function validateResume(file: File): string | null {
  if (file.size > RESUME_MAX_BYTES) return 'The file is larger than 10 MB.'
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!RESUME_ACCEPT.split(',').includes(`.${ext}`)) return 'Upload a PDF, Word document or image.'
  return null
}

/** Upload a CV to <company>/<applicant>/<kind>-<timestamp>.<ext> and return its storage path. */
export async function uploadApplicantFile(companyId: string, applicantId: string, file: File, kind: 'resume' | 'cover-letter') {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
  const path = `${companyId}/${applicantId}/${kind}-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, { contentType: file.type || undefined })
  if (error) throw new Error(`Upload failed: ${error.message}`)
  return path
}

export async function signedFileUrl(path: string, download = false) {
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).createSignedUrl(path, 60 * 10, download ? { download: true } : undefined)
  if (error) throw new Error(error.message)
  return data.signedUrl
}

/**
 * Remove every stored file of an applicant (used before deleting the candidate):
 * files uploaded by recruiters under <company>/<applicant>/ plus the current CV and cover letter,
 * which live under <company>/applications/<uuid>/ when they came from the careers page.
 */
export async function deleteApplicantFiles(companyId: string, applicant: { id: string; resume_path: string | null; cover_letter_path: string | null }) {
  const folder = `${companyId}/${applicant.id}`
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).list(folder)
  if (error) throw new Error(error.message)
  const paths = new Set(data.map((f) => `${folder}/${f.name}`))
  if (applicant.resume_path) paths.add(applicant.resume_path)
  if (applicant.cover_letter_path) paths.add(applicant.cover_letter_path)
  if (paths.size) {
    const { error: rmError } = await supabase.storage.from(RESUME_BUCKET).remove([...paths])
    if (rmError) throw new Error(rmError.message)
  }
}

export function initials(first?: string | null, last?: string | null) {
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`.toUpperCase() || '?'
}
