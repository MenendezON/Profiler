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
| `questions`            | `questions`             | `screeningquestion_id` → `template_id`, new `position` |
| `openings`             | `openings`              | `status` is an enum; `user_id` → `created_by` |
| `applicants`           | `applicants`            | **added `company_id`** (was missing → data leaked across companies); `skills` is `text[]` |
| `openingapplicants`    | `opening_applicants`    | own `id`, `stage` enum, unique (opening, applicant) |

Migrations live in `supabase/migrations/` and are already applied to the project. Tenancy helpers live in a non-exposed `private` schema; a trigger stops non-admins from changing their role/status or anyone from switching companies.

Regenerate types after schema changes: `npm run gen:types` (needs the Supabase CLI and `supabase login`).

## Migration status

| Area | Status |
|------|--------|
| Auth (sign up, sign in, sign out), app shell | ✅ |
| Dashboard (pipeline + opening stats) | ✅ |
| Settings → Locations (list/create/edit/delete) | ✅ |
| Settings → Departments (list/create/edit/delete) | ✅ |
| Settings → Screening question templates | ⏳ next |
| Job openings (list by status, create, edit, details) | ⏳ |
| Applications (pipeline, add candidate, bulk moves, CV upload → Supabase Storage) | ⏳ |
| Interviews, Reports, Email templates, Activity log, Users/invites | ⏳ |
