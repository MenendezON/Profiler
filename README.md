# Profiler — Applicant Tracking (React + Supabase)

Profiler is an applicant tracking system: publish job openings, move candidates through a hiring pipeline, and keep recruiting settings (locations, departments, screening forms) in one place.

This branch (`react-supabase`) is the rewrite of the original Laravel 11 / Jetstream / Livewire app (still on `dev`) to **React + Supabase**.

## Stack

- **Frontend:** Vite 8, React 19, TypeScript, React Router 8, TanStack Query, Tailwind CSS 4, lucide-react
- **Backend:** Supabase (Postgres, Auth, Row Level Security) — project `Profiler` (`uhcxmvxvppiskkiwngez`, eu-west-1)

## Getting started

```bash
npm install
cp .env.example .env    # already points at the Profiler Supabase project
npm run dev             # http://localhost:5173
```

Open `/signup`, create an account with your organization name. Sign-up creates the company and makes you its admin.

> Supabase Auth requires email confirmation by default. For local testing you can turn it off in
> Supabase Dashboard → Authentication → Sign In / Providers → Email → "Confirm email",
> and set Site URL to `http://localhost:5173` under Authentication → URL Configuration.

## Data model & security

Every business table carries a `company_id`. RLS policies restrict each signed-in user to rows of their own company, and `company_id` defaults to the caller's company, so the client never sends it.

| Laravel table          | Supabase table          | Notes |
|------------------------|-------------------------|-------|
| `users`                | `auth.users` + `profiles` | Passwords handled by Supabase Auth |
| `companies`            | `companies`             | |
| `locations`            | `locations`             | `code_postal` → `postal_code` |
| `departments`          | `departments`           | |
| `screeningquestions`   | `screening_templates`   | `data` → `name` |
| `questions`            | `questions`             | `screeningquestion_id` → `template_id`, new `position`, `options text[]` for predefined answers, `type` limited to 8 field types |
| `openings`             | `openings`              | `status` is an enum; `user_id` → `created_by`; `code` auto-generated per company (`FABR-001`) when blank |
| `applicants`           | `applicants`            | **added `company_id`** (was missing → data leaked across companies); `skills` is `text[]`; one record per email per company; CV paths point to Storage |
| —                      | `interviews`            | new: one row per interview, linked to an application; venue, interviewer and application must be in the same company |
| `openingapplicants`    | `opening_applicants`    | own `id`, `stage` enum, unique (opening, applicant) incl. one talent-pool row, `answers jsonb` for screening answers. Read through the `applications` view |

Migrations live in `supabase/migrations/` and are already applied to the project. Tenancy helpers live in a non-exposed `private` schema. Triggers stop non-admins from changing their role/status, stop anyone from switching companies, and stop an opening from referencing another company's location, department or template.

CVs and cover letters live in the private Storage bucket `resumes` under `<company_id>/<applicant_id>/`. Storage policies only let a company read or write its own folder; the app opens files through 10-minute signed URLs.

### Public careers page

`/careers/<company-slug>` lists a company's **published** openings; `/careers/<slug>/jobs/<id>` shows one and takes applications (no account needed). The company link is in **Settings**, and each published opening shows its own application link.

Anonymous visitors have **no table privileges at all**. They only call three `SECURITY DEFINER` functions, which Supabase's advisor lists as warnings on purpose:

| Function | What it allows |
|---|---|
| `get_careers_page(slug)` | Company name + published openings |
| `get_public_opening(slug, id)` | One published opening + its screening questions |
| `submit_application(...)` | Validates name/email/phone/city/experience, the CV upload, required answers and allowed options; reuses the candidate by email; refuses duplicates; source = "Career page" |

Candidates upload files insert-only to `<company_id>/applications/<random>/` — only for companies with a published opening, and they can't list or read anything back.

Known limits: no CAPTCHA/rate limiting yet, and a file uploaded by a candidate who then abandons the form stays in Storage.

Deploying: the SPA needs a catch-all rewrite to `index.html` so `/careers/...` links work — `vercel.json` (Vercel) and `public/_redirects` (Netlify) are included.

### Team & roles

| Role | Can do |
|---|---|
| **Admin** | Everything, plus users & invitations, locations, departments |
| **Recruiter** | Openings, screening templates, candidates, applications, interviews, CV uploads |
| **Viewer** | Read everything (incl. opening CVs), change nothing except their own name |

Roles are enforced by RLS (`private.can_edit()`, `private.is_company_admin()`) and Storage policies; the UI only hides what a role can't use. Deactivated users get no rows at all. A trigger keeps at least one active admin per company.

Invitations: an admin creates one in **Settings → Users** and shares the link (copy or prefilled email). `/invite/<token>` lets the person set a password; the sign-up trigger checks the token, the email and expiry, then adds them to the company with the chosen role instead of creating a new company. Someone who already has a Profiler account can't join a second company yet.

Regenerate types after schema changes: `npm run gen:types` (needs the Supabase CLI and `supabase login`).

## Migration status

| Area | Status |
|------|--------|
| Auth (sign up, sign in, sign out), app shell | ✅ |
| Dashboard (pipeline + opening stats) | ✅ |
| Settings → Locations (list/create/edit/delete) | ✅ |
| Settings → Departments (list/create/edit/delete) | ✅ |
| Settings → Screening question templates (questions, predefined answers, ordering, form preview) | ✅ |
| Job openings (status tabs + search, create, edit, details with pipeline, status switch) | ✅ |
| Applications (stage tabs, filters, search, pagination, bulk stage moves, ratings) | ✅ |
| Candidate panel (stage, rating, notes, CV open/replace, screening answers, move to another opening, talent pool, delete) | ✅ |
| Add candidate (dedupe by email, CV + cover letter upload, screening answers) | ✅ |
| Public careers page + online application (screening questions, CV upload, consent) | ✅ |
| Interviews: schedule / reschedule / cancel from the candidate panel, feedback with hire–maybe–no-hire + rating, Interviews page (upcoming, pending feedback, feedback given, cancelled), dashboard card, email invitation (mailto) + calendar file (.ics) | ✅ |
| Users & roles: invitations by link (single-use, 14 days), Admin / Recruiter / Viewer enforced in RLS and Storage, deactivation, last-admin protection, My profile + password | ✅ |
| Reports | ⏳ next |
| Email templates, Activity log | ⏳ |
