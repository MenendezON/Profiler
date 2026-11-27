import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { AuthProvider } from '@/lib/auth'
import { RequireAuth, RequireRole } from '@/components/AppLayout'
import { LoginPage, SignupPage } from '@/pages/AuthPages'
import { DashboardPage } from '@/pages/DashboardPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { LocationFormPage, LocationsListPage } from '@/pages/settings/LocationsPages'
import { DepartmentFormPage, DepartmentsListPage } from '@/pages/settings/DepartmentsPages'
import { ScreeningTemplateDetailPage, ScreeningTemplatesListPage } from '@/pages/settings/ScreeningTemplatesPages'
import { OpeningsListPage } from '@/pages/openings/OpeningsListPage'
import { OpeningFormPage } from '@/pages/openings/OpeningFormPage'
import { OpeningDetailPage } from '@/pages/openings/OpeningDetailPage'
import { ApplicationsPage } from '@/pages/applications/ApplicationsPage'
import { AddCandidatePage } from '@/pages/applications/AddCandidatePage'
import { CareersPage } from '@/pages/careers/CareersPage'
import { JobPage } from '@/pages/careers/JobPage'
import { InterviewsPage } from '@/pages/InterviewsPage'
import { UsersPage } from '@/pages/settings/UsersPage'
import { ProfilePage } from '@/pages/settings/ProfilePage'
import { AcceptInvitePage } from '@/pages/AcceptInvitePage'
import { ActivityLogPage } from '@/pages/settings/ActivityLogPage'
import { EmailTemplateEditorPage, EmailTemplatesListPage } from '@/pages/settings/EmailTemplatesPages'
import { ReportsPage } from '@/pages/ReportsPage'
import { NotFound } from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/invite/:token', element: <AcceptInvitePage /> },
  // public careers site (no account needed)
  { path: '/careers/:slug', element: <CareersPage /> },
  { path: '/careers/:slug/jobs/:openingId', element: <JobPage /> },
  {
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'openings', element: <OpeningsListPage /> },
      { path: 'openings/new', element: <RequireRole edit><OpeningFormPage /></RequireRole> },
      { path: 'openings/:id', element: <OpeningDetailPage /> },
      { path: 'openings/:id/edit', element: <RequireRole edit><OpeningFormPage key="edit" /></RequireRole> },
      { path: 'applications', element: <ApplicationsPage /> },
      { path: 'applications/new', element: <RequireRole edit><AddCandidatePage /></RequireRole> },
      { path: 'interviews', element: <InterviewsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/locations', element: <LocationsListPage /> },
      { path: 'settings/locations/new', element: <RequireRole admin><LocationFormPage /></RequireRole> },
      { path: 'settings/locations/:id/edit', element: <RequireRole admin><LocationFormPage /></RequireRole> },
      { path: 'settings/departments', element: <DepartmentsListPage /> },
      { path: 'settings/departments/new', element: <RequireRole admin><DepartmentFormPage /></RequireRole> },
      { path: 'settings/departments/:id/edit', element: <RequireRole admin><DepartmentFormPage /></RequireRole> },
      { path: 'settings/users', element: <UsersPage /> },
      { path: 'settings/activity-log', element: <ActivityLogPage /> },
      { path: 'settings/email-templates', element: <EmailTemplatesListPage /> },
      { path: 'settings/email-templates/new', element: <RequireRole edit><EmailTemplateEditorPage /></RequireRole> },
      { path: 'settings/email-templates/:id', element: <EmailTemplateEditorPage /> },
      { path: 'settings/profile', element: <ProfilePage /> },
      { path: 'settings/screening-templates', element: <ScreeningTemplatesListPage /> },
      { path: 'settings/screening-templates/:id', element: <ScreeningTemplateDetailPage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
