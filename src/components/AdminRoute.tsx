import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * AdminRoute — blocks USER accounts from accessing privileged pages.
 * USER → redirect to /app/products
 * ADMIN / SUPERADMIN → render children
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth()
  const role = profile?.user_type ?? 'USER'

  if (role === 'USER') {
    return <Navigate to="/app/products" replace />
  }

  return <>{children}</>
}
