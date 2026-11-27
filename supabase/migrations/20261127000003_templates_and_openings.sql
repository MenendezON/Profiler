-- Screening questions: predefined answers + a constrained set of field types.
alter table public.questions
  add column options text[] not null default '{}';

alter table public.questions
  add constraint questions_type_check check (type in (
    'short_text', 'long_text', 'number', 'date', 'yes_no', 'dropdown', 'multiple_choice', 'file'
  ));

create index if not exists questions_template_position_idx on public.questions (template_id, position);

-- Openings: code is generated per company (e.g. FABR-001) when the client leaves it blank.
alter table public.openings alter column code set default '';
alter table public.openings add constraint openings_company_code_key unique (company_id, code);

create or replace function private.set_opening_code()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  prefix text;
  next_n int;
begin
  if coalesce(trim(new.code), '') <> '' then
    return new;
  end if;

  -- serialize code generation per company
  perform pg_advisory_xact_lock(hashtext('opening_code:' || new.company_id::text));

  select c.code into prefix from public.companies c where c.id = new.company_id;

  select coalesce(max((regexp_match(o.code, '-(\d+)$'))[1]::int), 0) + 1
    into next_n
    from public.openings o
   where o.company_id = new.company_id;

  new.code := coalesce(nullif(prefix, ''), 'JOB') || '-' || lpad(next_n::text, 3, '0');
  return new;
end $$;

revoke execute on function private.set_opening_code() from public, anon, authenticated;

create trigger set_opening_code
  before insert on public.openings
  for each row execute function private.set_opening_code();

-- Applicant counts per opening and stage (used on the openings list and details page).
create or replace view public.opening_pipeline_counts with (security_invoker = true) as
  select oa.opening_id, oa.stage, count(*)::int as total
  from public.opening_applicants oa
  where oa.opening_id is not null
  group by oa.opening_id, oa.stage;
