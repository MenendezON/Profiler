-- Keep tenancy helpers out of the exposed API schema (no /rest/v1/rpc endpoints).
-- Policies and defaults reference functions by OID, so moving them keeps everything working.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;
alter function public.current_company_id() set schema private;
alter function public.is_company_admin() set schema private;
alter function public.handle_new_user() set schema private;
