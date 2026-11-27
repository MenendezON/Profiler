import { supabase } from './supabase'
import { RESUME_BUCKET } from './applications'

export interface PublicLocation { name: string; city: string; country: string }

export interface PublicOpeningSummary {
  id: string
  title: string
  code: string
  type: string
  remote: boolean
  experience: string
  industry: string
  created_at: string
  department: string | null
  location: PublicLocation | null
}

export interface CareersPage {
  company: { name: string; slug: string; website: string | null }
  openings: PublicOpeningSummary[]
}

export interface PublicQuestion {
  id: string
  title: string
  type: string
  required: boolean
  options: string[]
}

export interface PublicOpening {
  company: { id: string; name: string; slug: string; website: string | null }
  opening: PublicOpeningSummary & { description: string }
  questions: PublicQuestion[]
}

export async function fetchCareersPage(slug: string) {
  const { data, error } = await supabase.rpc('get_careers_page', { p_slug: slug })
  if (error) throw new Error(error.message)
  return data as unknown as CareersPage | null
}

export async function fetchPublicOpening(slug: string, openingId: string) {
  const { data, error } = await supabase.rpc('get_public_opening', { p_slug: slug, p_opening_id: openingId })
  if (error) throw new Error(error.message)
  return data as unknown as PublicOpening | null
}

/** Candidate uploads go to <company>/applications/<random>/<kind>.<ext> (insert-only for visitors). */
export async function uploadApplicationFile(companyId: string, folder: string, file: File, kind: 'resume' | 'cover-letter') {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
  const path = `${companyId}/applications/${folder}/${kind}.${ext}`
  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, { contentType: file.type || undefined, upsert: false })
  if (error) throw new Error('We could not upload your file. Please check it is a PDF, Word document or image under 10 MB and try again.')
  return path
}

export const careersUrl = (slug: string) => `${window.location.origin}/careers/${slug}`
export const jobUrl = (slug: string, openingId: string) => `${careersUrl(slug)}/jobs/${openingId}`
