-- =====================================================================
-- Email templates (per company, EN + FR defaults) and the Reports query.
-- =====================================================================
create type public.email_template_kind as enum (
  'acknowledgement', 'interview_invitation', 'interview_cancellation', 'rejection', 'offer', 'custom'
);

create table public.email_templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default private.current_company_id() references public.companies (id) on delete cascade,
  name text not null check (length(trim(name)) between 1 and 120),
  kind public.email_template_kind not null default 'custom',
  language text not null default 'en' check (language in ('en', 'fr')),
  subject text not null check (length(subject) <= 300),
  body text not null check (length(body) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index email_templates_company_idx on public.email_templates (company_id, kind);

create trigger set_updated_at before update on public.email_templates
  for each row execute function public.set_updated_at();
create trigger log_activity after insert or update or delete on public.email_templates
  for each row execute function private.trg_log_named('email template');

alter table public.email_templates enable row level security;
create policy "company read" on public.email_templates for select to authenticated
  using (company_id = (select private.current_company_id()));
create policy "write: insert" on public.email_templates for insert to authenticated
  with check (company_id = (select private.current_company_id()) and (select private.can_edit()));
create policy "write: update" on public.email_templates for update to authenticated
  using (company_id = (select private.current_company_id()) and (select private.can_edit()))
  with check (company_id = (select private.current_company_id()));
create policy "write: delete" on public.email_templates for delete to authenticated
  using (company_id = (select private.current_company_id()) and (select private.can_edit()));
revoke all on public.email_templates from anon;

-- ---------- defaults ----------
-- Logging is paused while defaults are inserted so they don't flood the activity log.
create or replace function private.log_activity(
  p_company uuid, p_entity text, p_entity_id uuid, p_action text, p_summary text,
  p_details jsonb default '{}'::jsonb, p_applicant uuid default null, p_opening uuid default null)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if coalesce(current_setting('profiler.skip_log', true), '') = 'on' then
    return;
  end if;
  if p_company is null or not exists (select 1 from public.companies where id = p_company) then
    return;
  end if;
  insert into public.activity_log (company_id, actor_id, entity_type, entity_id, action, summary, details, applicant_id, opening_id)
  values (p_company,
          (select id from public.profiles where id = (select auth.uid())),
          p_entity, p_entity_id, p_action, p_summary, coalesce(p_details, '{}'::jsonb), p_applicant, p_opening);
end $$;

create or replace function private.seed_email_templates(p_company uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform set_config('profiler.skip_log', 'on', true);
  insert into public.email_templates (company_id, name, kind, language, subject, body) values
  (p_company, 'Application received', 'acknowledgement', 'en',
   'We received your application – {{job_title}}',
   E'Dear {{candidate_first_name}},\n\nThank you for applying for the {{job_title}} position at {{company_name}}. We have received your application and our team will review it carefully.\n\nIf your profile matches our needs, we will contact you for the next steps.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Candidature reçue', 'acknowledgement', 'fr',
   'Nous avons bien reçu votre candidature – {{job_title}}',
   E'Bonjour {{candidate_first_name}},\n\nNous vous remercions pour votre candidature au poste de {{job_title}} chez {{company_name}}. Elle a bien été reçue et sera étudiée avec attention.\n\nSi votre profil correspond à nos besoins, nous vous contacterons pour la suite du processus.\n\nCordialement,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Interview invitation', 'interview_invitation', 'en',
   'Interview invitation – {{job_title}} – {{company_name}}',
   E'Dear {{candidate_first_name}},\n\nWe would like to invite you to an interview for the {{job_title}} position.\n\nWhen: {{interview_date}} at {{interview_time}} ({{interview_duration}})\nWhere: {{interview_location}}\nWith: {{interviewer_name}}\n\n{{interview_message}}\n\nPlease confirm your availability by replying to this email.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Convocation à un entretien', 'interview_invitation', 'fr',
   'Convocation à un entretien – {{job_title}} – {{company_name}}',
   E'Bonjour {{candidate_first_name}},\n\nNous avons le plaisir de vous convier à un entretien pour le poste de {{job_title}}.\n\nDate : {{interview_date}} à {{interview_time}} ({{interview_duration}})\nLieu : {{interview_location}}\nAvec : {{interviewer_name}}\n\n{{interview_message}}\n\nMerci de nous confirmer votre disponibilité en répondant à ce message.\n\nCordialement,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Interview cancelled', 'interview_cancellation', 'en',
   'Interview cancelled – {{job_title}}',
   E'Dear {{candidate_first_name}},\n\nWe regret to inform you that your interview planned on {{interview_date}} at {{interview_time}} has been cancelled. We will contact you again if a new date is set.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Entretien annulé', 'interview_cancellation', 'fr',
   'Annulation de votre entretien – {{job_title}}',
   E'Bonjour {{candidate_first_name}},\n\nNous sommes au regret de vous informer que l''entretien prévu le {{interview_date}} à {{interview_time}} est annulé. Nous reviendrons vers vous si une nouvelle date est fixée.\n\nCordialement,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Application not retained', 'rejection', 'en',
   'Your application for {{job_title}}',
   E'Dear {{candidate_first_name}},\n\nThank you for your interest in the {{job_title}} position and for the time you dedicated to the process.\n\nAfter careful consideration, we have decided not to move forward with your application. We will keep your profile and may contact you for future opportunities.\n\nWe wish you every success.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Candidature non retenue', 'rejection', 'fr',
   'Votre candidature au poste de {{job_title}}',
   E'Bonjour {{candidate_first_name}},\n\nNous vous remercions de l''intérêt porté au poste de {{job_title}} et du temps consacré à notre processus de recrutement.\n\nAprès étude attentive, nous ne pouvons pas donner une suite favorable à votre candidature. Nous conservons votre profil et pourrons vous recontacter pour de futures opportunités.\n\nNous vous souhaitons pleine réussite.\n\nCordialement,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Job offer', 'offer', 'en',
   'Job offer – {{job_title}} – {{company_name}}',
   E'Dear {{candidate_first_name}},\n\nWe are delighted to offer you the {{job_title}} position at {{company_name}}.\n\nYou will find the details of our offer attached. Please let us know your decision, and do not hesitate to contact us with any questions.\n\nWe look forward to welcoming you to the team.\n\nBest regards,\n{{sender_name}}\n{{company_name}}'),
  (p_company, 'Proposition d''embauche', 'offer', 'fr',
   'Proposition d''embauche – {{job_title}} – {{company_name}}',
   E'Bonjour {{candidate_first_name}},\n\nNous avons le plaisir de vous proposer le poste de {{job_title}} au sein de {{company_name}}.\n\nVous trouverez ci-joint le détail de notre proposition. Merci de nous faire part de votre décision ; nous restons à votre disposition pour toute question.\n\nAu plaisir de vous accueillir dans l''équipe.\n\nCordialement,\n{{sender_name}}\n{{company_name}}');
  perform set_config('profiler.skip_log', 'off', true);
end $$;
revoke execute on function private.seed_email_templates(uuid) from public, anon, authenticated;

-- existing companies
select private.seed_email_templates(id) from public.companies;

-- new companies get the defaults at sign-up
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

  perform private.seed_email_templates(v_company);
  return new;
end $$;

-- ---------- reports ----------
-- SECURITY INVOKER: runs with the caller's rights, so RLS limits it to their company.
create or replace function public.report_summary(p_from date, p_to date, p_opening uuid default null)
returns jsonb language sql stable security invoker set search_path = '' as $$
  with
  bounds as (select p_from::timestamptz as t0, (p_to + 1)::timestamptz as t1),
  apps as (
    select oa.id, oa.created_at, oa.stage, oa.source, oa.opening_id
    from public.opening_applicants oa, bounds b
    where oa.created_at >= b.t0 and oa.created_at < b.t1
      and (p_opening is null or oa.opening_id = p_opening)
  ),
  rank_of(stage, rnk) as (values ('new', 1), ('shortlisted', 2), ('interviewed', 3), ('offered', 4), ('hired', 5)),
  reached as (
    select a.id, greatest(
             coalesce((select rnk from rank_of where stage = a.stage::text), 0),
             coalesce((select max(r.rnk) from public.activity_log l join rank_of r on r.stage = l.details->>'to'
                        where l.entity_id = a.id and l.action = 'stage_changed'), 0),
             1) as max_rank
    from apps a
  ),
  hires as (
    select distinct on (l.entity_id) l.entity_id, l.created_at as hired_at, oa.created_at as applied_at, oa.opening_id
    from public.activity_log l, bounds b, public.opening_applicants oa
    where l.action = 'stage_changed' and l.details->>'to' = 'hired'
      and l.created_at >= b.t0 and l.created_at < b.t1
      and oa.id = l.entity_id
      and (p_opening is null or oa.opening_id = p_opening)
    order by l.entity_id, l.created_at
  ),
  weeks as (
    select generate_series(date_trunc('week', p_from::timestamp), date_trunc('week', p_to::timestamp), interval '1 week') as wk
  ),
  ivs as (
    select i.* from public.interviews i
    join public.opening_applicants oa on oa.id = i.application_id, bounds b
    where i.scheduled_at >= b.t0 and i.scheduled_at < b.t1
      and (p_opening is null or oa.opening_id = p_opening)
  )
  select jsonb_build_object(
    'applications', (select count(*) from apps),
    'hires', (select count(*) from hires),
    'avg_days_to_hire', (select round(avg(extract(epoch from hired_at - applied_at) / 86400)::numeric, 1) from hires),
    'rejected', (select count(*) from apps where stage = 'rejected'),
    'in_pipeline', (select count(*) from apps where stage in ('new', 'shortlisted', 'interviewed', 'offered')),
    'funnel', (select jsonb_agg(jsonb_build_object('stage', r.stage, 'count', (select count(*) from reached where max_rank >= r.rnk)) order by r.rnk) from rank_of r),
    'by_week', (select jsonb_agg(jsonb_build_object('week', to_char(w.wk, 'YYYY-MM-DD'),
                                 'count', (select count(*) from apps a where date_trunc('week', a.created_at at time zone 'UTC') = w.wk)) order by w.wk) from weeks w),
    'by_source', coalesce((select jsonb_agg(jsonb_build_object('source', source, 'count', n, 'hired', h) order by n desc)
                           from (select source, count(*) n, count(*) filter (where stage = 'hired') h from apps group by source) s), '[]'::jsonb),
    'by_opening', coalesce((select jsonb_agg(x order by (x->>'total')::int desc) from (
                    select jsonb_build_object(
                      'opening_id', o.id, 'title', o.title, 'code', o.code, 'status', o.status,
                      'total', count(a.id),
                      'active', count(a.id) filter (where a.stage in ('new', 'shortlisted', 'interviewed', 'offered')),
                      'interviewed', count(a.id) filter (where a.stage in ('interviewed', 'offered', 'hired')),
                      'hired', count(a.id) filter (where a.stage = 'hired'),
                      'rejected', count(a.id) filter (where a.stage = 'rejected')) as x
                    from public.openings o left join apps a on a.opening_id = o.id
                    where p_opening is null or o.id = p_opening
                    group by o.id
                    having count(a.id) > 0 or o.status = 'published') q), '[]'::jsonb),
    'interviews', jsonb_build_object(
      'total', (select count(*) from ivs),
      'scheduled', (select count(*) from ivs where status = 'scheduled'),
      'completed', (select count(*) from ivs where status = 'completed'),
      'cancelled', (select count(*) from ivs where status = 'cancelled'),
      'hire', (select count(*) from ivs where decision = 'hire'),
      'maybe', (select count(*) from ivs where decision = 'maybe'),
      'no_hire', (select count(*) from ivs where decision = 'no_hire'))
  )
$$;
revoke execute on function public.report_summary(date, date, uuid) from public, anon;
grant execute on function public.report_summary(date, date, uuid) to authenticated;
