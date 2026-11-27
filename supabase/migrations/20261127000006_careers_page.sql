-- =====================================================================
-- Public careers page: candidates apply without an account.
-- Anonymous visitors never get table access. They go through three
-- SECURITY DEFINER functions that only expose published openings and
-- validate everything they write. CV uploads are insert-only into
-- <company_id>/applications/<uuid>/ for companies with a published opening.
-- =====================================================================

-- ---------- company slug (careers URL: /careers/<slug>) ----------
create or replace function private.slugify(p text)
returns text language sql immutable set search_path = '' as $$
  select trim(both '-' from regexp_replace(
           lower(translate(coalesce(p, ''),
             'àâäáãåçéèêëíìîïñóòôöõúùûüýÿÀÂÄÁÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝ',
             'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY')),
           '[^a-z0-9]+', '-', 'g'))
$$;

alter table public.companies add column slug text;

create or replace function private.unique_company_slug(p_name text, p_exclude uuid default null)
returns text language plpgsql set search_path = '' as $$
declare
  base text := coalesce(nullif(private.slugify(p_name), ''), 'company');
  candidate text := base;
  n int := 1;
begin
  while exists (select 1 from public.companies where slug = candidate and id is distinct from p_exclude) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;
  return candidate;
end $$;

update public.companies set slug = private.unique_company_slug(name, id) where slug is null;
alter table public.companies alter column slug set not null;
alter table public.companies add constraint companies_slug_key unique (slug);
alter table public.companies add constraint companies_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

-- sign-up now also sets the slug
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_company uuid;
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name text := coalesce(nullif(meta->>'company_name', ''), split_part(new.email, '@', 2));
begin
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
  values (new.id, v_company, coalesce(meta->>'first_name', ''), coalesce(meta->>'last_name', ''), new.email, 'admin');
  return new;
end $$;

-- ---------- storage: anonymous CV upload (insert only) ----------
create or replace function private.accepts_applications(p_company text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.openings o
    where o.company_id::text = p_company and o.status = 'published'
  )
$$;

revoke execute on function private.accepts_applications(text) from public;
grant usage on schema private to anon;
grant execute on function private.accepts_applications(text) to anon, authenticated;

create policy "candidates upload application files" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[2] = 'applications'
    and array_length(storage.foldername(name), 1) = 3
    and private.accepts_applications((storage.foldername(name))[1])
  );

-- ---------- public read API ----------
create or replace function public.get_careers_page(p_slug text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'company', jsonb_build_object('name', c.name, 'slug', c.slug, 'website', c.website),
    'openings', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', o.id, 'title', o.title, 'code', o.code, 'type', o.type, 'remote', o.remote,
               'experience', o.experience, 'industry', o.industry, 'created_at', o.created_at,
               'department', d.name,
               'location', case when l.id is null then null
                                else jsonb_build_object('name', l.name, 'city', l.city, 'country', l.country) end)
             order by o.created_at desc)
      from public.openings o
      left join public.departments d on d.id = o.department_id
      left join public.locations l on l.id = o.location_id
      where o.company_id = c.id and o.status = 'published'
    ), '[]'::jsonb)
  )
  from public.companies c
  where c.slug = p_slug and c.status = 'active'
$$;

create or replace function public.get_public_opening(p_slug text, p_opening_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'company', jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'website', c.website),
    'opening', jsonb_build_object(
      'id', o.id, 'title', o.title, 'code', o.code, 'description', o.description, 'type', o.type,
      'remote', o.remote, 'experience', o.experience, 'industry', o.industry, 'created_at', o.created_at,
      'department', d.name,
      'location', case when l.id is null then null
                       else jsonb_build_object('name', l.name, 'city', l.city, 'country', l.country) end),
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object('id', q.id, 'title', q.title, 'type', q.type,
                                          'required', q.required, 'options', to_jsonb(q.options))
                       order by q.position)
      from public.questions q where q.template_id = o.template_id and q.type <> 'file'
    ), '[]'::jsonb)
  )
  from public.openings o
  join public.companies c on c.id = o.company_id
  left join public.departments d on d.id = o.department_id
  left join public.locations l on l.id = o.location_id
  where o.id = p_opening_id and c.slug = p_slug and o.status = 'published' and c.status = 'active'
$$;

-- ---------- public write API ----------
create or replace function public.submit_application(
  p_opening_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_city text,
  p_experience int,
  p_resume_path text,
  p_cover_letter_path text default null,
  p_answers jsonb default '{}'::jsonb
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_opening public.openings%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_prefix text;
  v_applicant uuid;
  v_answers jsonb := '{}'::jsonb;
  q record;
  v jsonb;
begin
  select * into v_opening from public.openings where id = p_opening_id and status = 'published';
  if not found then
    raise exception 'This position is no longer accepting applications.' using errcode = 'P0001';
  end if;

  -- basic field validation
  if length(trim(coalesce(p_first_name, ''))) not between 1 and 100
     or length(trim(coalesce(p_last_name, ''))) not between 1 and 100 then
    raise exception 'Please enter your first and last name.' using errcode = 'P0001';
  end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 254 then
    raise exception 'Please enter a valid email address.' using errcode = 'P0001';
  end if;
  if length(trim(coalesce(p_phone, ''))) not between 6 and 30 then
    raise exception 'Please enter a valid phone number.' using errcode = 'P0001';
  end if;
  if length(trim(coalesce(p_city, ''))) not between 1 and 100 then
    raise exception 'Please enter your city.' using errcode = 'P0001';
  end if;
  if p_experience is null or p_experience not between 0 and 60 then
    raise exception 'Please enter your years of experience.' using errcode = 'P0001';
  end if;

  -- files must have been uploaded to this company's application folder
  v_prefix := v_opening.company_id::text || '/applications/';
  if p_resume_path is null or left(p_resume_path, length(v_prefix)) <> v_prefix
     or not exists (select 1 from storage.objects where bucket_id = 'resumes' and name = p_resume_path) then
    raise exception 'Please attach your CV.' using errcode = 'P0001';
  end if;
  if p_cover_letter_path is not null and (left(p_cover_letter_path, length(v_prefix)) <> v_prefix
     or not exists (select 1 from storage.objects where bucket_id = 'resumes' and name = p_cover_letter_path)) then
    raise exception 'The cover letter upload failed. Please try again.' using errcode = 'P0001';
  end if;

  -- screening answers: keep only this opening's questions, check required + allowed options
  for q in
    select qq.id, qq.title, qq.type, qq.required, qq.options
    from public.questions qq
    where qq.template_id = v_opening.template_id and qq.type <> 'file'
  loop
    v := coalesce(p_answers, '{}'::jsonb) -> q.id::text;
    if v is null or v = 'null'::jsonb or v = '""'::jsonb or v = '[]'::jsonb then
      if q.required then
        raise exception 'Please answer: %', q.title using errcode = 'P0001';
      end if;
      continue;
    end if;
    if q.type = 'dropdown' and not (jsonb_typeof(v) = 'string' and (v #>> '{}') = any (q.options)) then
      raise exception 'Invalid answer for: %', q.title using errcode = 'P0001';
    elsif q.type = 'multiple_choice' and not (jsonb_typeof(v) = 'array'
          and not exists (select 1 from jsonb_array_elements_text(v) x where x <> all (q.options))) then
      raise exception 'Invalid answer for: %', q.title using errcode = 'P0001';
    elsif q.type = 'yes_no' and jsonb_typeof(v) <> 'boolean' then
      raise exception 'Invalid answer for: %', q.title using errcode = 'P0001';
    elsif q.type = 'number' and jsonb_typeof(v) <> 'number' then
      raise exception 'Invalid answer for: %', q.title using errcode = 'P0001';
    elsif q.type in ('short_text', 'long_text', 'date') and (jsonb_typeof(v) <> 'string' or length(v #>> '{}') > 5000) then
      raise exception 'Invalid answer for: %', q.title using errcode = 'P0001';
    end if;
    v_answers := v_answers || jsonb_build_object(q.id::text, v);
  end loop;

  -- one candidate per email per company: reuse and refresh contact details + CV
  select id into v_applicant from public.applicants
   where company_id = v_opening.company_id and lower(email) = v_email;

  if v_applicant is null then
    insert into public.applicants (company_id, first_name, last_name, email, phone, city, experience,
                                   resume_path, cover_letter_path, source)
    values (v_opening.company_id, trim(p_first_name), trim(p_last_name), v_email, trim(p_phone), trim(p_city),
            p_experience, p_resume_path, p_cover_letter_path, 'Career page')
    returning id into v_applicant;
  else
    if exists (select 1 from public.opening_applicants where opening_id = v_opening.id and applicant_id = v_applicant) then
      raise exception 'You have already applied for this position.' using errcode = 'P0001';
    end if;
    update public.applicants
       set phone = trim(p_phone), city = trim(p_city), experience = p_experience,
           resume_path = p_resume_path,
           cover_letter_path = coalesce(p_cover_letter_path, cover_letter_path)
     where id = v_applicant;
  end if;

  insert into public.opening_applicants (opening_id, applicant_id, stage, source, answers)
  values (v_opening.id, v_applicant, 'new', 'Career page', v_answers);

  return true;
end $$;

-- These three are the only functions anonymous visitors may call.
revoke execute on function public.get_careers_page(text) from public;
revoke execute on function public.get_public_opening(text, uuid) from public;
revoke execute on function public.submit_application(uuid, text, text, text, text, text, int, text, text, jsonb) from public;
grant execute on function public.get_careers_page(text) to anon, authenticated;
grant execute on function public.get_public_opening(text, uuid) to anon, authenticated;
grant execute on function public.submit_application(uuid, text, text, text, text, text, int, text, text, jsonb) to anon, authenticated;

-- Hygiene: helper functions in private stay callable only where needed.
revoke execute on function private.slugify(text) from public, anon;
revoke execute on function private.unique_company_slug(text, uuid) from public, anon;
