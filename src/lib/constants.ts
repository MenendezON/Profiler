import type { Enums } from './database.types'

export const QUESTION_TYPES = [
  { value: 'short_text', label: 'Short answer', hasOptions: false },
  { value: 'long_text', label: 'Paragraph', hasOptions: false },
  { value: 'number', label: 'Number', hasOptions: false },
  { value: 'date', label: 'Date', hasOptions: false },
  { value: 'yes_no', label: 'Yes / No', hasOptions: false },
  { value: 'dropdown', label: 'Dropdown (one answer)', hasOptions: true },
  { value: 'multiple_choice', label: 'Checkboxes (several answers)', hasOptions: true },
  { value: 'file', label: 'File upload', hasOptions: false },
] as const

export type QuestionType = (typeof QUESTION_TYPES)[number]['value']

export const questionTypeLabel = (t: string) => QUESTION_TYPES.find((q) => q.value === t)?.label ?? t
export const questionHasOptions = (t: string) => QUESTION_TYPES.find((q) => q.value === t)?.hasOptions ?? false

export const EXPERIENCE_LEVELS = [
  'Internship',
  'Entry Level',
  'Associate',
  'Mid-Senior Level',
  'Director/ Vice-President',
  'Executive/ President',
]

export const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Other']

export const INDUSTRIES = [
  'Accounting', 'Apparel & Fashion', 'Architecture & Planning', 'Arts and Crafts', 'Automotive', 'Banking',
  'Biotechnology', 'Broadcast Media', 'Civic & Social Organization', 'Computer Software', 'Construction',
  'Customer Support', 'Education Management', 'Environmental Services', 'Event Services', 'Executive Office',
  'Facilities Services', 'Financial Services', 'Government Administration', 'Health, Wellness and Fitness',
  'Hospital & Health Care', 'Hospitality', 'Human Resources', 'Individual & Family Services',
  'Industrial Automation', 'Information Technology and Services', 'Insurance', 'Internet', 'Law Enforcement',
  'Legal Services', 'Leisure, Travel & Tourism', 'Logistics and Supply Chain', 'Management Consulting',
  'Manufacturing', 'Marketing and Advertising', 'Mechanical or Industrial Engineering', 'Media & Entertainment',
  'Non-Profit Organization Management', 'Oil & Energy', 'Public Relations and Communications', 'Real Estate',
  'Research', 'Restaurants', 'Retail', 'Staffing and Recruiting', 'Telecommunications',
  'Transportation/Trucking/Railroad', 'Utilities', 'Veterinary', 'Warehousing',
]

export const OPENING_STATUS: Record<Enums<'opening_status'>, { label: string; tone: 'green' | 'blue' | 'slate'; hint: string }> = {
  published: { label: 'Published', tone: 'green', hint: 'Visible on your careers page' },
  internal: { label: 'Internal', tone: 'blue', hint: 'Only staff can see and apply' },
  unpublished: { label: 'Unpublished', tone: 'slate', hint: 'Draft — not visible to anyone' },
}

export const STAGE_LABELS: Record<Enums<'applicant_stage'>, string> = {
  new: 'New',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
  talentpool: 'Talent pool',
}
