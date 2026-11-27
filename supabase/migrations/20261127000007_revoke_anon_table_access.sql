-- Anonymous visitors only use get_careers_page / get_public_opening / submit_application.
-- RLS already returns nothing to anon; this removes table privileges entirely as a second layer.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
