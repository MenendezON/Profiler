-- Move applications (typically from the talent pool) into an opening, restarting at "New".
-- SECURITY INVOKER: RLS decides what the caller may read and update.
-- A candidate who already has an application for that opening is skipped (and reported).
create or replace function public.move_to_opening(p_application_ids uuid[], p_opening uuid)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  r record;
  n int;
  moved int := 0;
  skipped text[] := '{}';
begin
  if not exists (select 1 from public.openings where id = p_opening) then
    raise exception 'Opening not found.' using errcode = 'P0001';
  end if;

  for r in
    select oa.id, oa.applicant_id, oa.opening_id, trim(a.first_name || ' ' || a.last_name) as name
    from public.opening_applicants oa
    join public.applicants a on a.id = oa.applicant_id
    where oa.id = any (p_application_ids)
  loop
    if r.opening_id is distinct from p_opening and exists (
         select 1 from public.opening_applicants x where x.applicant_id = r.applicant_id and x.opening_id = p_opening) then
      skipped := skipped || r.name;
      continue;
    end if;
    update public.opening_applicants set opening_id = p_opening, stage = 'new' where id = r.id;
    get diagnostics n = row_count;
    if n = 0 then
      raise exception 'You are not allowed to move candidates.' using errcode = 'P0001';
    end if;
    moved := moved + 1;
  end loop;

  return jsonb_build_object('moved', moved, 'skipped', to_jsonb(skipped));
end $$;
revoke execute on function public.move_to_opening(uuid[], uuid) from public, anon;
grant execute on function public.move_to_opening(uuid[], uuid) to authenticated;
