-- "for all" write policies also applied to SELECT (performance advisor: multiple permissive policies).
-- Split them into insert / update / delete so reads go through the single "company read" policy.
drop policy "write: all" on public.questions;
create policy "write: insert" on public.questions for insert to authenticated
  with check ((select private.can_edit()) and exists (select 1 from public.screening_templates t
              where t.id = template_id and t.company_id = (select private.current_company_id())));
create policy "write: update" on public.questions for update to authenticated
  using ((select private.can_edit()) and exists (select 1 from public.screening_templates t
          where t.id = template_id and t.company_id = (select private.current_company_id())))
  with check (exists (select 1 from public.screening_templates t
              where t.id = template_id and t.company_id = (select private.current_company_id())));
create policy "write: delete" on public.questions for delete to authenticated
  using ((select private.can_edit()) and exists (select 1 from public.screening_templates t
          where t.id = template_id and t.company_id = (select private.current_company_id())));

drop policy "write: all" on public.opening_applicants;
create policy "write: insert" on public.opening_applicants for insert to authenticated
  with check ((select private.can_edit())
              and exists (select 1 from public.applicants a where a.id = applicant_id and a.company_id = (select private.current_company_id()))
              and (opening_id is null or exists (select 1 from public.openings o where o.id = opening_id and o.company_id = (select private.current_company_id()))));
create policy "write: update" on public.opening_applicants for update to authenticated
  using ((select private.can_edit())
         and exists (select 1 from public.applicants a where a.id = applicant_id and a.company_id = (select private.current_company_id())))
  with check (exists (select 1 from public.applicants a where a.id = applicant_id and a.company_id = (select private.current_company_id()))
              and (opening_id is null or exists (select 1 from public.openings o where o.id = opening_id and o.company_id = (select private.current_company_id()))));
create policy "write: delete" on public.opening_applicants for delete to authenticated
  using ((select private.can_edit())
         and exists (select 1 from public.applicants a where a.id = applicant_id and a.company_id = (select private.current_company_id())));

-- covered by questions_template_position_idx (template_id, position)
drop index if exists public.questions_template_id_idx;
