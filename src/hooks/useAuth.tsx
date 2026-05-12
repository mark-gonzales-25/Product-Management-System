import {
  createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

interface AuthContextType {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/** Fetches profile row; creates it on first login. Never throws. */
async function fetchOrCreateProfile(user: User): Promise<Profile | null> {
  try {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (existing) return existing as Profile

    const email = user.email ?? ''
    const meta = user.user_metadata as Record<string, string> ?? {}
    const fullName = meta.full_name ?? meta.name ?? ''
    const username =
      fullName.trim() ||
      email.split('@')[0] ||
      'user'

    const { data: created } = await supabase
      .from('profiles')
      .insert({ auth_user_id: user.id, username, email, user_type: 'USER', status: 'ACTIVE' })
      .select()
      .maybeSingle()

    return (created as Profile) ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const mounted = useRef(true)

  // loadProfileRef lets us call the latest closure without it becoming a
  // useEffect dependency — prevents the effect from re-running and
  // re-registering the auth listener on every render cycle.
  const loadProfileRef = useRef<(u: User) => Promise<void>>(async () => {})
  loadProfileRef.current = async (u: User) => {
    const p = await fetchOrCreateProfile(u)
    if (mounted.current) setProfile(p)
  }

  // Stable wrapper — identity never changes, safe as an effect dep
  const loadProfile = useCallback((u: User) => loadProfileRef.current(u), [])

  useEffect(() => {
    mounted.current = true

    let resolved = false
    const resolve = () => {
      if (!resolved && mounted.current) {
        resolved = true
        setLoading(false)
      }
    }

    // Safety net: never strand the user on a spinner beyond 5 s
    const safetyTimer = setTimeout(resolve, 5000)

    // 1. Live listener — registered first so no auth events are missed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, sess) => {
        if (!mounted.current) return
        setSession(sess)
        const u = sess?.user ?? null
        setUser(u)
        if (u) {
          await loadProfile(u)
        } else {
          setProfile(null)
        }
        resolve()
      }
    )

    // 2. One-time session hydration — whichever path finishes first wins
    supabase.auth.getSession()
      .then(async ({ data: { session: sess } }) => {
        if (!mounted.current) return
        if (!resolved) {
          setSession(sess)
          const u = sess?.user ?? null
          setUser(u)
          if (u) await loadProfile(u)
        }
      })
      .catch(() => {})
      .finally(resolve)

    return () => {
      mounted.current = false
      clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (mounted.current) {
      setSession(null)
      setUser(null)
      setProfile(null)
    }
    await supabase.auth.signOut()
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) await loadProfile(user)
  }, [user, loadProfile])

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
