import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

/**
 * Rights map for the currently logged-in user.
 * Each key maps directly to a module right flag (1 = granted, 0 = denied).
 *
 * These values are read from the profiles table's user_type field
 * and mapped to a flat rights object for convenient UI gating.
 */
export interface RightsMap {
  PRD_ADD: number    // Can add products
  PRD_EDIT: number   // Can edit products
  PRD_DEL: number    // Can soft-delete products (SUPERADMIN only per matrix)
  REP_001: number    // Can view Product Report
  REP_002: number    // Can view Top Selling Report
  ADM_USER: number   // Can access User Management (Admin module)
}

const DEFAULT_RIGHTS: RightsMap = {
  PRD_ADD: 0,
  PRD_EDIT: 0,
  PRD_DEL: 0,
  REP_001: 0,
  REP_002: 0,
  ADM_USER: 0,
}

/**
 * Derive rights from user_type.
 * In the current schema, rights are role-based rather than per-user configurable.
 *
 * Matrix:
 *            | PRD_ADD | PRD_EDIT | PRD_DEL | REP_001 | REP_002 | ADM_USER
 * SUPERADMIN |   1     |    1     |    1    |    1    |    1    |    1
 * ADMIN      |   1     |    1     |    0    |    1    |    1    |    1
 * USER       |   0     |    0     |    0    |    1    |    0    |    0
 */
function deriveRights(userType: string | undefined): RightsMap {
  switch (userType) {
    case 'SUPERADMIN':
      return { PRD_ADD: 1, PRD_EDIT: 1, PRD_DEL: 1, REP_001: 1, REP_002: 1, ADM_USER: 1 }
    case 'ADMIN':
      return { PRD_ADD: 1, PRD_EDIT: 1, PRD_DEL: 0, REP_001: 1, REP_002: 1, ADM_USER: 1 }
    default: // USER
      return { PRD_ADD: 0, PRD_EDIT: 0, PRD_DEL: 0, REP_001: 1, REP_002: 0, ADM_USER: 0 }
  }
}

interface UserRightsContextType {
  rights: RightsMap
  loading: boolean
}

const UserRightsContext = createContext<UserRightsContextType | undefined>(undefined)

export function UserRightsProvider({ children }: { children: ReactNode }) {
  const { profile, loading: authLoading } = useAuth()
  const [rights, setRights] = useState<RightsMap>(DEFAULT_RIGHTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    setRights(deriveRights(profile?.user_type))
    setLoading(false)
  }, [profile, authLoading])

  return (
    <UserRightsContext.Provider value={{ rights, loading }}>
      {children}
    </UserRightsContext.Provider>
  )
}

export function useRights(): RightsMap {
  const ctx = useContext(UserRightsContext)
  if (!ctx) throw new Error('useRights must be used inside UserRightsProvider')
  return ctx.rights
}
