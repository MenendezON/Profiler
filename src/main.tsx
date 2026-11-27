import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { AuthProvider } from '@/lib/auth'
import { RequireAuth } from '@/components/AppLayout'
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
import { ComingSoon } from '@/pages/ComingSoon'
import { NotFound } from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  // public careers site (no account needed)
  { path: '/careers/:slug', element: <CareersPage /> },
  { path: '/careers/:slug/jobs/:openingId', element: <JobPage /> },
  {
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'openings', element: <OpeningsListPage /> },
      { path: 'openings/new', element: <OpeningFormPage /> },
      { path: 'openings/:id', element: <OpeningDetailPage /> },
      { path: 'openings/:id/edit', element: <OpeningFormPage key="edit" /> },
      { path: 'applications', element: <ApplicationsPage /> },
      { path: 'applications/new', element: <AddCandidatePage /> },
      { path: 'interviews', element: <InterviewsPage /> },
      { path: 'reports', element: <ComingSoon title="Reports" /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/locations', element: <LocationsListPage /> },
      { path: 'settings/locations/new', element: <LocationFormPage /> },
      { path: 'settings/locations/:id/edit', element: <LocationFormPage /> },
      { path: 'settings/departments', element: <DepartmentsListPage /> },
      { path: 'settings/departments/new', element: <DepartmentFormPage /> },
      { path: 'settings/departments/:id/edit', element: <DepartmentFormPage /> },
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
