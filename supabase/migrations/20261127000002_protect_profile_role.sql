-- Users may edit their own name/designation, but only admins may change role or status,
-- and nobody may move a profile to another company.
create or replace function private.guard_profile_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.company_id is distinct from old.company_id then
    raise exception 'company_id cannot be changed';
  end if;
  if (new.role is distinct from old.role or new.status is distinct from old.status)
     and (select auth.uid()) is not null
     and not private.is_company_admin() then
    raise exception 'only admins can change role or status';
  end if;
  return new;
end $$;

revoke execute on function private.guard_profile_update() from public, anon, authenticated;

create trigger guard_profile_update
  before update on public.profiles
  for each row execute function private.guard_profile_update();
