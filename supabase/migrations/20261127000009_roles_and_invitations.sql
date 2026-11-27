-- =====================================================================
-- Team: roles enforced in RLS, deactivation, invitations.
--   admin      everything + users, invitations, locations, departments, company
--   recruiter  openings, templates, candidates, applications, interviews, files
--   viewer     read-only
-- Inactive users see nothing (current_company_id() returns null).
-- =====================================================================

-- ---------- helpers ----------
create or replace function private.current_company_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select company_id from public.profiles where id = (select auth.uid()) and status = 'active'
$$;

create or replace function private.is_company_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin' and status = 'active')
$$;

create or replace function private.can_edit()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role in ('admin', 'recruiter') and status = 'active')
$$;

revoke execute on function private.can_edit() from public, anon;
grant execute on function private.can_edit() to authenticated;

-- ---------- write policies by role ----------
do $$
declare
  t text;
  admin_only text[] := array['locations', 'departments'];
  editable   text[] := array['screening_templates', 'openings', 'applicants', 'interviews'];
  guard text;
begin
  foreach t in array admin_only || editable loop
    guard := case when t = any (admin_only) then '(select private.is_company_admin())' else '(select private.can_edit())' end;
    execute format('drop policy if exists "company insert" on public.%I', t);
    execute format('drop policy if exists "company update" on public.%I', t);
    execute format('drop policy if exists "company delete" on public.%I', t);
    execute format('create policy "write: insert" on public.%I for insert to authenticated
                    with check (company_id = (select private.current_company_id()) and %s)', t, guard);
    execute format('create policy "write: update" on public.%I for update to authenticated
                    using (company_id = (select private.current_company_id()) and %s)
                    with check (company_id = (select private.current_company_id()))', t, guard);
    execute format('create policy "write: delete" on public.%I for delete to authenticated
                    using (company_id = (select private.current_company_id()) and %s)', t, guard);
  end loop;
end $$;

-- questions (scoped through their template)
drop policy "company questions" on public.questions;
create policy "company read" on public.questions for select to authenticated
  using (exists (select 1 from public.screening_templates t
                 where t.id = template_id and t.company_id = (select private.current_company_id())));
create policy "write: all" on public.questions for all to authenticated
  using ((select private.can_edit()) and exists (select 1 from public.screening_templates t
          where t.id = template_id and t.company_id = (select private.current_company_id())))
  with check ((select private.can_edit()) and exists (select 1 from public.screening_templates t
          where t.id = template_id and t.company_id = (select private.current_company_id())));

-- applications (scoped through the applicant)
drop policy "company pipeline" on public.opening_applicants;
create policy "company read" on public.opening_applicants for select to authenticated
  using (exists (select 1 from public.applicants a
                 where a.id = applicant_id and a.company_id = (select private.current_company_id())));
create policy "write: all" on public.opening_applicants for all to authenticated
  using ((select private.can_edit()) and exists (select 1 from public.applicants a
          where a.id = applicant_id and a.company_id = (select private.current_company_id())))
  with check ((select private.can_edit())
              and exists (select 1 from public.applicants a
                          where a.id = applicant_id and a.company_id = (select private.current_company_id()))
              and (opening_id is null or exists (select 1 from public.openings o
                          where o.id = opening_id and o.company_id = (select private.current_company_id()))));

-- files: viewers may open CVs but not upload, replace or delete them
drop policy "company uploads own resumes" on storage.objects;
drop policy "company updates own resumes" on storage.objects;
drop policy "company deletes own resumes" on storage.objects;
create policy "company uploads own resumes" on storage.objects for insert to authenticated
  with check (bucket_id = 'resumes' and (select private.can_edit())
              and (storage.foldername(name))[1] = (select private.current_company_id())::text);
create policy "company updates own resumes" on storage.objects for update to authenticated
  using (bucket_id = 'resumes' and (select private.can_edit())
         and (storage.foldername(name))[1] = (select private.current_company_id())::text)
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = (select private.current_company_id())::text);
create policy "company deletes own resumes" on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and (select private.can_edit())
         and (storage.foldername(name))[1] = (select private.current_company_id())::text);

-- ---------- profiles guard: role/status by admins only, never lose the last admin ----------
create or replace function private.guard_profile_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.company_id is distinct from old.company_id then
    raise exception 'company_id cannot be changed';
  end if;
  if new.email is distinct from old.email and (select auth.uid()) is not null then
    raise exception 'email is managed by sign-in and cannot be changed here';
  end if;
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and (select auth.uid()) is not null
     and not private.is_company_admin() then
    raise exception 'only admins can change role or status';
  end if;
  if old.role = 'admin' and old.status = 'active'
     and (new.role <> 'admin' or new.status <> 'active')
     and not exists (select 1 from public.profiles p
                     where p.company_id = old.company_id and p.id <> old.id and p.role = 'admin' and p.status = 'active') then
    raise exception 'The company needs at least one active admin.';
  end if;
  return new;
end $$;

-- ---------- invitations ----------
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default private.current_company_id() references public.companies (id) on delete cascade,
  email text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and email = lower(email)),
  role public.user_role not null default 'recruiter',
  token text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  invited_by uuid default auth.uid() references public.profiles (id) on delete set null,
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  accepted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index invitations_one_pending_per_email on public.invitations (company_id, email) where status = 'pending';
create index invitations_company_idx on public.invitations (company_id);
create index invitations_invited_by_idx on public.invitations (invited_by);
create index invitations_accepted_by_idx on public.invitations (accepted_by);

create trigger set_updated_at before update on public.invitations
  for each row execute function public.set_updated_at();

alter table public.invitations enable row level security;
create policy "admins manage invitations" on public.invitations for all to authenticated
  using (company_id = (select private.current_company_id()) and (select private.is_company_admin()))
  with check (company_id = (select private.current_company_id()) and (select private.is_company_admin()));
revoke all on public.invitations from anon;

-- refuse inviting someone who is already a member
create or replace function private.check_invitation()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.email := lower(trim(new.email));
  if new.status = 'pending' and exists (
       select 1 from public.profiles p where p.company_id = new.company_id and lower(p.email) = new.email) then
    raise exception 'This person is already a member of your team.' using errcode = 'P0001';
  end if;
  return new;
end $$;
revoke execute on function private.check_invitation() from public, anon, authenticated;
create trigger check_invitation before insert or update of email, status on public.invitations
  for each row execute function private.check_invitation();

-- public: what the invite page needs to show (token is the secret)
create or replace function public.get_invitation(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'email', i.email,
    'role', i.role,
    'company_name', c.name,
    'state', case
               when i.status <> 'pending' then i.status
               when i.expires_at < now() then 'expired'
               else 'pending'
             end)
  from public.invitations i
  join public.companies c on c.id = i.company_id
  where i.token = p_token and length(p_token) >= 32
$$;
revoke execute on function public.get_invitation(text) from public;
grant execute on function public.get_invitation(text) to anon, authenticated;

-- ---------- sign-up: join via invitation, or create a new company ----------
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_company uuid;
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name text := coalesce(nullif(meta->>'company_name', ''), split_part(new.email, '@', 2));
  v_inv public.invitations%rowtype;
begin
  if nullif(meta->>'invite_token', '') is not null then
    select * into v_inv from public.invitations
     where token = meta->>'invite_token' for update;
    if not found or v_inv.status <> 'pending' or v_inv.expires_at < now() then
      raise exception 'This invitation is no longer valid.';
    end if;
    if lower(new.email) <> v_inv.email then
      raise exception 'This invitation was sent to a different email address.';
    end if;

    insert into public.profiles (id, company_id, first_name, last_name, email, role, designation)
    values (new.id, v_inv.company_id, coalesce(meta->>'first_name', ''), coalesce(meta->>'last_name', ''),
            lower(new.email), v_inv.role, v_inv.role::text);
    update public.invitations set status = 'accepted', accepted_at = now(), accepted_by = new.id where id = v_inv.id;
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext('company_slug'));
  insert into public.companies (name, code, website, slug)
  values (
    v_name,
    upper(left(regexp_replace(v_name, '[^a-zA-Z]', '', 'g'), 4)),
    nullif(meta->>'company_website', ''),
    private.unique_company_slug(v_name)
  )
  returning id into v_company;

  insert into public.profiles (id, company_id, first_name, last_name, email, role)
  values (new.id, v_company, coalesce(meta->>'first_name', ''), coalesce(meta->>'last_name', ''), lower(new.email), 'admin');
  return new;
end $$;
