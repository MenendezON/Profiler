-- The activity log is trigger-only; emails are sent from the user's own mail app, so the client
-- records "email prepared" through this checked function (editors only, own company only).
create or replace function public.log_email_prepared(p_application_id uuid, p_template_name text, p_subject text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_company uuid;
  v_applicant uuid;
  v_opening uuid;
  v_name text;
begin
  if not private.can_edit() then
    raise exception 'not allowed';
  end if;
  select a.company_id, a.id, oa.opening_id, trim(a.first_name || ' ' || a.last_name)
    into v_company, v_applicant, v_opening, v_name
    from public.opening_applicants oa join public.applicants a on a.id = oa.applicant_id
   where oa.id = p_application_id;
  if v_company is null or v_company <> private.current_company_id() then
    raise exception 'application not found';
  end if;
  perform private.log_activity(v_company, 'email', p_application_id, 'email_prepared',
    format('Email to %s: %s', v_name, left(coalesce(p_subject, ''), 200)),
    jsonb_build_object('template', left(coalesce(p_template_name, ''), 120)), v_applicant, v_opening);
end $$;
revoke execute on function public.log_email_prepared(uuid, text, text) from public, anon;
grant execute on function public.log_email_prepared(uuid, text, text) to authenticated;
