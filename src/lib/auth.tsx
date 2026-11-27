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
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, company:companies(id, name, code, slug)')
        .eq('id', userId!)
        .single()
      if (error) throw new Error(error.message)
      return data as Profile
    },
  })
}

export const signOut = () => supabase.auth.signOut()
