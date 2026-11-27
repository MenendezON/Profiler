import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Tables } from './database.types'

type Profile = Tables<'profiles'> & { company: Pick<Tables<'companies'>, 'id' | 'name' | 'code' | 'slug'> | null }

interface AuthState {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthState>({ session: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: null, loading: true })
  const queryClient = useQueryClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState({ session: data.session, loading: false }))
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, loading: false })
      if (event === 'SIGNED_OUT') queryClient.clear()
    })
    return () => sub.subscription.unsubscribe()
  }, [queryClient])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

/** The signed-in user's profile and company. */
export function useProfile() {
  const { session } = useAuth()
  const userId = session?.user.id
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    retry: (count, err) => !(err instanceof AccessRevokedError) && count < 1,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, company:companies(id, name, code, slug)')
        .eq('id', userId!)
        .maybeSingle()
      if (error) throw new Error(error.message)
      // RLS hides the profile of a deactivated user (or one whose company was removed)
      if (!data) throw new AccessRevokedError()
      return data as Profile
    },
  })
}

export const signOut = () => supabase.auth.signOut()

export class AccessRevokedError extends Error {
  constructor() {
    super('Your access to Profiler has been deactivated.')
  }
}

/** What the signed-in user may do. Mirrors the RLS rules in the database. */
export function useRole() {
  const { data: profile } = useProfile()
  const role = profile?.role
  return {
    role,
    isAdmin: role === 'admin',
    canEdit: role === 'admin' || role === 'recruiter',
    isViewer: role === 'viewer',
  }
}

/** Render children only when the signed-in user has the permission (UI hint; RLS enforces it). */
export function Can({ edit, admin, children }: { edit?: boolean; admin?: boolean; children: ReactNode }) {
  const { canEdit, isAdmin } = useRole()
  if (admin && !isAdmin) return null
  if (edit && !canEdit) return null
  return <>{children}</>
}
