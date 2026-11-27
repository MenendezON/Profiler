-- ===== Applicants: one record per person (email) per company
create unique index applicants_company_email_key on public.applicants (company_id, lower(email));

-- ===== Applications (opening_applicants)
-- A candidate has at most one application per opening, and at most one "no opening" row (talent pool).
alter table public.opening_applicants drop constraint opening_applicants_opening_id_applicant_id_key;
alter table public.opening_applicants
  add constraint opening_applicants_opening_applicant_key unique nulls not distinct (opening_id, applicant_id);

-- Answers to the opening's screening questions, keyed by question id.
alter table public.opening_applicants add column answers jsonb not null default '{}'::jsonb;

create index opening_applicants_opening_stage_idx on public.opening_applicants (opening_id, stage);

-- Flat, filterable list for the Applications screen (RLS of the underlying tables applies).
create or replace view public.applications with (security_invoker = true) as
  select
    oa.id,
    oa.stage,
    oa.rating,
    oa.source,
    oa.notes,
    oa.created_at,
    oa.updated_at,
    oa.opening_id,
    o.title  as opening_title,
    o.code   as opening_code,
    o.status as opening_status,
    a.id     as applicant_id,
    a.first_name,
    a.last_name,
    (a.first_name || ' ' || a.last_name) as full_name,
    a.email,
    a.phone,
    a.city,
    a.experience,
    a.skills,
    a.resume_path
  from public.opening_applicants oa
  join public.applicants a on a.id = oa.applicant_id
  left join public.openings o on o.id = oa.opening_id;

-- ===== Storage: private bucket for CVs and cover letters
-- Object paths: <company_id>/<applicant_id>/<file>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes', 'resumes', false, 10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg', 'image/png'
  ]
)
on conflict (id) do nothing;

create policy "company reads own resumes" on storage.objects
  for select to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text);

create policy "company uploads own resumes" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text);

create policy "company updates own resumes" on storage.objects
  for update to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text)
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text);

create policy "company deletes own resumes" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text);
