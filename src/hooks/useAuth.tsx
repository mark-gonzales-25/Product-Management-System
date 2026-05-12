import { createContext, useContext, useState, ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'

// Minimal stub — full implementation delivered in M4 feat/auth-context PR
interface AuthContextType {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState<Session | null>(null)
  const [loading] = useState(false)
  return <AuthContext.Provider value={{ session, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
