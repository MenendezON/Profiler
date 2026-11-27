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
import { ComingSoon } from '@/pages/ComingSoon'
import { NotFound } from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  {
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'openings/*', element: <ComingSoon title="Job Openings" /> },
      { path: 'applications/*', element: <ComingSoon title="Applications" /> },
      { path: 'interviews', element: <ComingSoon title="Interviews" /> },
      { path: 'reports', element: <ComingSoon title="Reports" /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/locations', element: <LocationsListPage /> },
      { path: 'settings/locations/new', element: <LocationFormPage /> },
      { path: 'settings/locations/:id/edit', element: <LocationFormPage /> },
      { path: 'settings/departments', element: <DepartmentsListPage /> },
      { path: 'settings/departments/new', element: <DepartmentFormPage /> },
      { path: 'settings/departments/:id/edit', element: <DepartmentFormPage /> },
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
