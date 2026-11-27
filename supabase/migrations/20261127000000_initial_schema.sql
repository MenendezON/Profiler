-- Profiler: initial schema (ported from the Laravel app)
-- Multi-tenant: every row belongs to a company; RLS limits users to their own company.

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- types ----------
create type public.opening_status as enum ('published', 'internal', 'unpublished');
create type public.applicant_stage as enum ('new', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected', 'talentpool');
create type public.user_role as enum ('admin', 'recruiter', 'viewer');

-- ---------- tables ----------
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One profile per auth user (replaces Laravel's users table; passwords live in auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  designation text not null default 'administrator',
  role public.user_role not null default 'admin',
  status text not null default 'active' check (status in ('active', 'inactive')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.profiles (company_id);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  country text not null,
  postal_code text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.locations (company_id);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.departments (company_id);

-- Screening form templates (Laravel: screeningquestions.data -> name)
create table public.screening_templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.screening_templates (company_id);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.screening_templates (id) on delete cascade,
  title text not null,
  type text not null,
  required boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.questions (template_id);

create table public.openings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  code text not null,
  description text not null default '',
  location_id uuid references public.locations (id) on delete set null,
  department_id uuid references public.departments (id) on delete set null,
  template_id uuid references public.screening_templates (id) on delete set null,
  remote boolean not null default false,
  experience text not null default '',
  type text not null default 'Full Time',
  industry text not null default '',
  status public.opening_status not null default 'unpublished',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.openings (company_id, status);
create index on public.openings (location_id);
create index on public.openings (department_id);
create index on public.openings (template_id);
create index on public.openings (created_by);

create table public.applicants (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  city text not null default '',
  experience int not null default 0,
  resume_path text,
  cover_letter_path text,
  skills text[] not null default '{}',
  notes text,
  source text not null default 'Dashboard',
  talent_pool boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.applicants (company_id);

-- Applicant <-> opening pipeline (Laravel: openingapplicants)
create table public.opening_applicants (
  id uuid primary key default gen_random_uuid(),
  opening_id uuid references public.openings (id) on delete cascade,
  applicant_id uuid not null references public.applicants (id) on delete cascade,
  stage public.applicant_stage not null default 'new',
  rating int not null default 0 check (rating between 0 and 5),
  source text not null default 'Dashboard',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (opening_id, applicant_id)
);
create index on public.opening_applicants (applicant_id);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['companies','profiles','locations','departments','screening_templates',
                           'questions','openings','applicants','opening_applicants'] loop
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------- tenancy helpers ----------
create or replace function public.current_company_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select company_id from public.profiles where id = (select auth.uid())
$$;

create or replace function public.is_company_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
$$;

revoke execute on function public.current_company_id() from public, anon;
revoke execute on function public.is_company_admin() from public, anon;
grant execute on function public.current_company_id() to authenticated;
grant execute on function public.is_company_admin() to authenticated;

-- New sign-up: create the company named in the sign-up form and make the user its admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_company uuid;
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.companies (name, code, website)
  values (
    coalesce(nullif(meta->>'company_name', ''), split_part(new.email, '@', 2)),
    upper(left(regexp_replace(coalesce(nullif(meta->>'company_name', ''), new.email), '[^a-zA-Z]', '', 'g'), 4)),
    nullif(meta->>'company_website', '')
  )
  returning id into v_company;

  insert into public.profiles (id, company_id, first_name, last_name, email, role)
  values (new.id, v_company, coalesce(meta->>'first_name', ''), coalesce(meta->>'last_name', ''), new.email, 'admin');
  return new;
end $$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- row level security ----------
alter table public.companies           enable row level security;
alter table public.profiles            enable row level security;
alter table public.locations           enable row level security;
alter table public.departments         enable row level security;
alter table public.screening_templates enable row level security;
alter table public.questions           enable row level security;
alter table public.openings            enable row level security;
alter table public.applicants          enable row level security;
alter table public.opening_applicants  enable row level security;

-- companies: members read, admins update
create policy "members read own company" on public.companies
  for select to authenticated using (id = (select public.current_company_id()));
create policy "admins update own company" on public.companies
  for update to authenticated
  using (id = (select public.current_company_id()) and (select public.is_company_admin()))
  with check (id = (select public.current_company_id()));

-- profiles: members read colleagues; a user edits their own profile, admins edit anyone in the company
create policy "members read company profiles" on public.profiles
  for select to authenticated using (company_id = (select public.current_company_id()));
create policy "update own or admin" on public.profiles
  for update to authenticated
  using (company_id = (select public.current_company_id())
         and (id = (select auth.uid()) or (select public.is_company_admin())))
  with check (company_id = (select public.current_company_id()));

-- company-scoped tables: full CRUD inside own company
do $$
declare t text;
begin
  foreach t in array array['locations','departments','screening_templates','openings','applicants'] loop
    execute format('create policy "company read" on public.%I for select to authenticated
                    using (company_id = (select public.current_company_id()))', t);
    execute format('create policy "company insert" on public.%I for insert to authenticated
                    with check (company_id = (select public.current_company_id()))', t);
    execute format('create policy "company update" on public.%I for update to authenticated
                    using (company_id = (select public.current_company_id()))
                    with check (company_id = (select public.current_company_id()))', t);
    execute format('create policy "company delete" on public.%I for delete to authenticated
                    using (company_id = (select public.current_company_id()))', t);
  end loop;
end $$;

-- questions: scoped through their template
create policy "company questions" on public.questions
  for all to authenticated
  using (exists (select 1 from public.screening_templates t
                 where t.id = template_id and t.company_id = (select public.current_company_id())))
  with check (exists (select 1 from public.screening_templates t
                      where t.id = template_id and t.company_id = (select public.current_company_id())));

-- pipeline rows: scoped through the applicant (opening may be null for talent pool)
create policy "company pipeline" on public.opening_applicants
  for all to authenticated
  using (exists (select 1 from public.applicants a
                 where a.id = applicant_id and a.company_id = (select public.current_company_id())))
  with check (exists (select 1 from public.applicants a
                      where a.id = applicant_id and a.company_id = (select public.current_company_id()))
              and (opening_id is null or exists (select 1 from public.openings o
                      where o.id = opening_id and o.company_id = (select public.current_company_id()))));

-- default company_id on insert so the client never has to send it
do $$
declare t text;
begin
  foreach t in array array['locations','departments','screening_templates','openings','applicants'] loop
    execute format('alter table public.%I alter column company_id set default public.current_company_id()', t);
  end loop;
end $$;
alter table public.openings alter column created_by set default auth.uid();

-- ---------- dashboard stats ----------
create or replace view public.pipeline_stage_counts with (security_invoker = true) as
  select oa.stage, count(*)::int as total
  from public.opening_applicants oa
  group by oa.stage;

create or replace view public.opening_status_counts with (security_invoker = true) as
  select o.status, count(*)::int as total
  from public.openings o
  group by o.status;
