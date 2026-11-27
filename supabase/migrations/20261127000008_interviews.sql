-- ===== Interviews
create type public.interview_type as enum ('in_person', 'phone', 'video');
create type public.interview_status as enum ('scheduled', 'completed', 'cancelled');
create type public.interview_decision as enum ('hire', 'maybe', 'no_hire');

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default private.current_company_id() references public.companies (id) on delete cascade,
  application_id uuid not null references public.opening_applicants (id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes int not null default 60 check (duration_minutes between 5 and 600),
  type public.interview_type not null default 'in_person',
  location_id uuid references public.locations (id) on delete set null,
  meeting_details text,                 -- address, phone number or video link
  interviewer_id uuid references public.profiles (id) on delete set null,
  message text,                         -- note for the candidate (used in the invitation)
  status public.interview_status not null default 'scheduled',
  cancel_reason text,
  decision public.interview_decision,
  rating int check (rating between 0 and 5),
  feedback text,
  feedback_at timestamptz,
  created_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index interviews_company_time_idx on public.interviews (company_id, scheduled_at);
create index interviews_application_idx on public.interviews (application_id);
create index interviews_interviewer_idx on public.interviews (interviewer_id);
create index interviews_location_idx on public.interviews (location_id);
create index interviews_created_by_idx on public.interviews (created_by);

create trigger set_updated_at before update on public.interviews
  for each row execute function public.set_updated_at();

alter table public.interviews enable row level security;

create policy "company read" on public.interviews for select to authenticated
  using (company_id = (select private.current_company_id()));
create policy "company insert" on public.interviews for insert to authenticated
  with check (company_id = (select private.current_company_id()));
create policy "company update" on public.interviews for update to authenticated
  using (company_id = (select private.current_company_id()))
  with check (company_id = (select private.current_company_id()));
create policy "company delete" on public.interviews for delete to authenticated
  using (company_id = (select private.current_company_id()));

-- Application, venue and interviewer must belong to the interview's company.
create or replace function private.check_interview_refs()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
       select 1 from public.opening_applicants oa
       join public.applicants a on a.id = oa.applicant_id
       where oa.id = new.application_id and a.company_id = new.company_id) then
    raise exception 'application does not belong to this company' using errcode = '23503';
  end if;
  if new.location_id is not null and not exists (
       select 1 from public.locations where id = new.location_id and company_id = new.company_id) then
    raise exception 'location does not belong to this company' using errcode = '23503';
  end if;
  if new.interviewer_id is not null and not exists (
       select 1 from public.profiles where id = new.interviewer_id and company_id = new.company_id) then
    raise exception 'interviewer does not belong to this company' using errcode = '23503';
  end if;
  return new;
end $$;

revoke execute on function private.check_interview_refs() from public, anon, authenticated;

create trigger check_interview_refs
  before insert or update of company_id, application_id, location_id, interviewer_id on public.interviews
  for each row execute function private.check_interview_refs();

-- Flat list for the Interviews screen and the dashboard.
create or replace view public.interview_list with (security_invoker = true) as
  select
    i.id, i.scheduled_at, i.duration_minutes, i.type, i.status, i.meeting_details, i.message,
    i.decision, i.rating, i.feedback, i.feedback_at, i.cancel_reason, i.created_at,
    i.application_id, oa.stage,
    a.id as applicant_id, a.first_name, a.last_name, (a.first_name || ' ' || a.last_name) as full_name,
    a.email, a.phone,
    o.id as opening_id, o.title as opening_title, o.code as opening_code,
    l.id as location_id, l.name as location_name, l.address as location_address, l.city as location_city,
    p.id as interviewer_id, nullif(trim(p.first_name || ' ' || p.last_name), '') as interviewer_name, p.email as interviewer_email
  from public.interviews i
  join public.opening_applicants oa on oa.id = i.application_id
  join public.applicants a on a.id = oa.applicant_id
  left join public.openings o on o.id = oa.opening_id
  left join public.locations l on l.id = i.location_id
  left join public.profiles p on p.id = i.interviewer_id;

revoke all on public.interviews, public.interview_list from anon;
