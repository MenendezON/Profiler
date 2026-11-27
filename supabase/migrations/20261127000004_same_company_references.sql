-- An opening may only reference a location, department and screening template of its own company.
create or replace function private.check_opening_refs()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.location_id is not null and not exists (
       select 1 from public.locations where id = new.location_id and company_id = new.company_id) then
    raise exception 'location does not belong to this company' using errcode = '23503';
  end if;
  if new.department_id is not null and not exists (
       select 1 from public.departments where id = new.department_id and company_id = new.company_id) then
    raise exception 'department does not belong to this company' using errcode = '23503';
  end if;
  if new.template_id is not null and not exists (
       select 1 from public.screening_templates where id = new.template_id and company_id = new.company_id) then
    raise exception 'screening template does not belong to this company' using errcode = '23503';
  end if;
  return new;
end $$;

revoke execute on function private.check_opening_refs() from public, anon, authenticated;

create trigger check_opening_refs
  before insert or update of company_id, location_id, department_id, template_id on public.openings
  for each row execute function private.check_opening_refs();
