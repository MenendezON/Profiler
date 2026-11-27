-- =====================================================================
-- Activity log: written only by triggers (SECURITY DEFINER), readable by
-- active members of the company, never editable through the API.
-- =====================================================================
create table public.activity_log (
  id bigint generated always as identity primary key,
  company_id uuid not null references public.companies (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,   -- null = candidate (careers page) or system
  entity_type text not null,   -- opening | application | candidate | interview | user | invitation | template | location | department
  entity_id uuid,
  action text not null,
  summary text not null,
  details jsonb not null default '{}'::jsonb,
  applicant_id uuid,           -- set for candidate-related events (no FK: history survives deletion)
  opening_id uuid,
  created_at timestamptz not null default now()
);
create index activity_log_company_time_idx on public.activity_log (company_id, created_at desc);
create index activity_log_applicant_idx on public.activity_log (applicant_id, created_at desc) where applicant_id is not null;
create index activity_log_actor_idx on public.activity_log (actor_id);
create index activity_log_hired_idx on public.activity_log (company_id, created_at) where action = 'stage_changed';

alter table public.activity_log enable row level security;
create policy "company read" on public.activity_log for select to authenticated
  using (company_id = (select private.current_company_id()));
revoke insert, update, delete, truncate on public.activity_log from anon, authenticated;
revoke all on public.activity_log from anon;

create or replace view public.activity_feed with (security_invoker = true) as
  select l.*, nullif(trim(p.first_name || ' ' || p.last_name), '') as actor_name, p.email as actor_email
  from public.activity_log l
  left join public.profiles p on p.id = l.actor_id;
revoke all on public.activity_feed from anon;

-- ---------- writer ----------
create or replace function private.log_activity(
  p_company uuid, p_entity text, p_entity_id uuid, p_action text, p_summary text,
  p_details jsonb default '{}'::jsonb, p_applicant uuid default null, p_opening uuid default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  -- skip while the company itself is being deleted (cascades)
  if p_company is null or not exists (select 1 from public.companies where id = p_company) then
    return;
  end if;
  insert into public.activity_log (company_id, actor_id, entity_type, entity_id, action, summary, details, applicant_id, opening_id)
  values (p_company,
          (select id from public.profiles where id = (select auth.uid())),
          p_entity, p_entity_id, p_action, p_summary, coalesce(p_details, '{}'::jsonb), p_applicant, p_opening);
end $$;
revoke execute on function private.log_activity(uuid, text, uuid, text, text, jsonb, uuid, uuid) from public, anon, authenticated;

create or replace function private.stage_label(s public.applicant_stage)
returns text language sql immutable set search_path = '' as $$
  select case s when 'new' then 'New' when 'shortlisted' then 'Shortlisted' when 'interviewed' then 'Interviewed'
                when 'offered' then 'Offered' when 'hired' then 'Hired' when 'rejected' then 'Rejected'
                else 'Talent pool' end
$$;

-- ---------- openings ----------
create or replace function private.trg_log_openings()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform private.log_activity(new.company_id, 'opening', new.id, 'created',
      format('Created opening %s (%s)', new.title, new.code), jsonb_build_object('status', new.status), null, new.id);
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      perform private.log_activity(new.company_id, 'opening', new.id, 'status_changed',
        format('%s: %s → %s', new.title, old.status, new.status), jsonb_build_object('from', old.status, 'to', new.status), null, new.id);
    end if;
    if (new.title, new.description, new.type, new.experience, new.industry, new.remote, new.location_id, new.department_id, new.template_id)
       is distinct from
       (old.title, old.description, old.type, old.experience, old.industry, old.remote, old.location_id, old.department_id, old.template_id) then
      perform private.log_activity(new.company_id, 'opening', new.id, 'updated', format('Edited opening %s', new.title), '{}', null, new.id);
    end if;
  elsif tg_op = 'DELETE' then
    perform private.log_activity(old.company_id, 'opening', old.id, 'deleted', format('Deleted opening %s (%s)', old.title, old.code), '{}', null, old.id);
  end if;
  return null;
end $$;

-- ---------- applications ----------
create or replace function private.trg_log_applications()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  r public.opening_applicants := coalesce(new, old);
  v_company uuid;
  v_name text;
  v_title text;
  v_old_title text;
begin
  select a.company_id, trim(a.first_name || ' ' || a.last_name) into v_company, v_name
    from public.applicants a where a.id = r.applicant_id;
  if v_company is null then
    return null; -- candidate is being deleted: logged by the candidate trigger
  end if;
  select title into v_title from public.openings where id = r.opening_id;

  if tg_op = 'INSERT' then
    perform private.log_activity(v_company, 'application', new.id, 'applied',
      case when new.opening_id is null then format('%s added to the talent pool', v_name)
           else format('%s applied to %s', v_name, v_title) end,
      jsonb_build_object('source', new.source, 'stage', new.stage), new.applicant_id, new.opening_id);
  elsif tg_op = 'UPDATE' then
    if new.stage is distinct from old.stage then
      perform private.log_activity(v_company, 'application', new.id, 'stage_changed',
        format('%s: %s → %s%s', v_name, private.stage_label(old.stage), private.stage_label(new.stage),
               coalesce(' (' || v_title || ')', '')),
        jsonb_build_object('from', old.stage, 'to', new.stage), new.applicant_id, new.opening_id);
    end if;
    if new.opening_id is distinct from old.opening_id then
      select title into v_old_title from public.openings where id = old.opening_id;
      perform private.log_activity(v_company, 'application', new.id, 'moved',
        format('%s moved from %s to %s', v_name, coalesce(v_old_title, 'no opening'), coalesce(v_title, 'no opening')),
        jsonb_build_object('from_opening', old.opening_id, 'to_opening', new.opening_id), new.applicant_id, new.opening_id);
    end if;
    if new.rating is distinct from old.rating then
      perform private.log_activity(v_company, 'application', new.id, 'rated',
        format('%s rated %s/5', v_name, new.rating), jsonb_build_object('from', old.rating, 'to', new.rating), new.applicant_id, new.opening_id);
    end if;
  elsif tg_op = 'DELETE' then
    perform private.log_activity(v_company, 'application', old.id, 'removed',
      format('Removed %s’s application%s', v_name, coalesce(' to ' || v_title, '')), '{}', old.applicant_id, old.opening_id);
  end if;
  return null;
end $$;

-- ---------- candidates ----------
create or replace function private.trg_log_applicants()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    if new.resume_path is distinct from old.resume_path and new.resume_path is not null then
      perform private.log_activity(new.company_id, 'candidate', new.id, 'cv_uploaded',
        format('New CV for %s %s', new.first_name, new.last_name), '{}', new.id, null);
    end if;
    if (new.first_name, new.last_name, new.email, new.phone, new.city, new.experience, new.skills)
       is distinct from (old.first_name, old.last_name, old.email, old.phone, old.city, old.experience, old.skills) then
      perform private.log_activity(new.company_id, 'candidate', new.id, 'updated',
        format('Edited profile of %s %s', new.first_name, new.last_name), '{}', new.id, null);
    end if;
  elsif tg_op = 'DELETE' then
    perform private.log_activity(old.company_id, 'candidate', old.id, 'deleted',
      format('Deleted candidate %s %s', old.first_name, old.last_name), jsonb_build_object('email', old.email), old.id, null);
  end if;
  return null;
end $$;

-- ---------- interviews ----------
create or replace function private.trg_log_interviews()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  r public.interviews := coalesce(new, old);
  v_name text;
  v_applicant uuid;
  v_opening uuid;
  v_when text := to_char(r.scheduled_at at time zone 'UTC', 'DD Mon YYYY HH24:MI') || ' UTC';
begin
  select a.id, trim(a.first_name || ' ' || a.last_name), oa.opening_id into v_applicant, v_name, v_opening
    from public.opening_applicants oa join public.applicants a on a.id = oa.applicant_id
   where oa.id = r.application_id;
  if v_applicant is null then
    return null;
  end if;

  if tg_op = 'INSERT' then
    perform private.log_activity(new.company_id, 'interview', new.id, 'scheduled',
      format('Interview with %s scheduled for %s', v_name, v_when), jsonb_build_object('type', new.type), v_applicant, v_opening);
  elsif tg_op = 'UPDATE' then
    if new.status = 'cancelled' and old.status <> 'cancelled' then
      perform private.log_activity(new.company_id, 'interview', new.id, 'cancelled',
        format('Interview with %s cancelled', v_name), jsonb_build_object('reason', new.cancel_reason), v_applicant, v_opening);
    elsif new.status = 'scheduled' and (new.scheduled_at is distinct from old.scheduled_at or old.status <> 'scheduled') then
      perform private.log_activity(new.company_id, 'interview', new.id, 'rescheduled',
        format('Interview with %s moved to %s', v_name, v_when), '{}', v_applicant, v_opening);
    end if;
    if new.status = 'completed' and (old.status <> 'completed' or new.decision is distinct from old.decision) then
      perform private.log_activity(new.company_id, 'interview', new.id, 'feedback',
        format('Interview feedback for %s: %s', v_name,
               case new.decision when 'hire' then 'Hire' when 'no_hire' then 'No hire' else 'Maybe' end),
        jsonb_build_object('decision', new.decision, 'rating', new.rating), v_applicant, v_opening);
    end if;
  end if;
  return null;
end $$;

-- ---------- team ----------
create or replace function private.trg_log_profiles()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_name text := coalesce(nullif(trim(new.first_name || ' ' || new.last_name), ''), new.email);
begin
  if tg_op = 'INSERT' then
    perform private.log_activity(new.company_id, 'user', new.id, 'joined', format('%s joined as %s', v_name, new.role), '{}');
  elsif tg_op = 'UPDATE' then
    if new.role is distinct from old.role then
      perform private.log_activity(new.company_id, 'user', new.id, 'role_changed', format('%s: %s → %s', v_name, old.role, new.role),
        jsonb_build_object('from', old.role, 'to', new.role));
    end if;
    if new.status is distinct from old.status then
      perform private.log_activity(new.company_id, 'user', new.id, case when new.status = 'active' then 'reactivated' else 'deactivated' end,
        format('%s %s', v_name, case when new.status = 'active' then 'reactivated' else 'deactivated' end), '{}');
    end if;
  end if;
  return null;
end $$;

create or replace function private.trg_log_invitations()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    perform private.log_activity(new.company_id, 'invitation', new.id, 'invited', format('Invited %s as %s', new.email, new.role), '{}');
  elsif new.status = 'revoked' and old.status <> 'revoked' then
    perform private.log_activity(new.company_id, 'invitation', new.id, 'invitation_revoked', format('Revoked invitation for %s', new.email), '{}');
  end if;
  return null;
end $$;

-- ---------- settings objects (create / rename / delete) ----------
create or replace function private.trg_log_named()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  kind text := tg_argv[0];
begin
  if tg_op = 'INSERT' then
    perform private.log_activity(new.company_id, kind, new.id, 'created', format('Created %s %s', kind, new.name), '{}');
  elsif tg_op = 'UPDATE' and new.name is distinct from old.name then
    perform private.log_activity(new.company_id, kind, new.id, 'renamed', format('Renamed %s %s → %s', kind, old.name, new.name), '{}');
  elsif tg_op = 'DELETE' then
    perform private.log_activity(old.company_id, kind, old.id, 'deleted', format('Deleted %s %s', kind, old.name), '{}');
  end if;
  return null;
end $$;

do $$
declare f text;
begin
  foreach f in array array['trg_log_openings','trg_log_applications','trg_log_applicants','trg_log_interviews',
                           'trg_log_profiles','trg_log_invitations','trg_log_named'] loop
    execute format('revoke execute on function private.%I() from public, anon, authenticated', f);
  end loop;
end $$;
revoke execute on function private.stage_label(public.applicant_stage) from public, anon;

create trigger log_activity after insert or update or delete on public.openings
  for each row execute function private.trg_log_openings();
create trigger log_activity after insert or update or delete on public.opening_applicants
  for each row execute function private.trg_log_applications();
create trigger log_activity after update or delete on public.applicants
  for each row execute function private.trg_log_applicants();
create trigger log_activity after insert or update on public.interviews
  for each row execute function private.trg_log_interviews();
create trigger log_activity after insert or update on public.profiles
  for each row execute function private.trg_log_profiles();
create trigger log_activity after insert or update on public.invitations
  for each row execute function private.trg_log_invitations();
create trigger log_activity after insert or update or delete on public.screening_templates
  for each row execute function private.trg_log_named('template');
create trigger log_activity after insert or update or delete on public.locations
  for each row execute function private.trg_log_named('location');
create trigger log_activity after insert or update or delete on public.departments
  for each row execute function private.trg_log_named('department');
