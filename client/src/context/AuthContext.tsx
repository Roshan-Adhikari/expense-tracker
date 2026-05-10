import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

export type AuthUser = {
  id: string
  email: string
  name: string
}

type AuthContextValue = {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>
  signOut: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapUser(u: SupabaseUser): AuthUser {
  const meta = u.user_metadata as { full_name?: string } | undefined
  const raw =
    meta?.full_name?.trim() ||
    u.email?.split('@')[0]?.replace(/[._]/g, ' ') ||
    'User'
  const name = raw
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
  return {
    id: u.id,
    email: u.email ?? '',
    name,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSession(null)
      setLoading(false)
      return
    }

    const supabase = getSupabase()

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const user = useMemo(() => (session?.user ? mapUser(session.user) : null), [session])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const supabase = getSupabase()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      return {}
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign in failed' }
    }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined,
        },
      })
      if (error) return { error: error.message }
      const needsEmailConfirmation = !data.session
      return { needsEmailConfirmation }
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Sign up failed' }
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabase()
    await supabase.auth.signOut()
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const supabase = getSupabase()
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/auth/recovery` : undefined
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
      if (error) return { error: error.message }
      return {}
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'Request failed' }
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
    }),
    [user, session, loading, signIn, signUp, signOut, requestPasswordReset],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
