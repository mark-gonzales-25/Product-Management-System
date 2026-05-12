import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app/products', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="spinner-lg" />
      <p className="mt-4 text-[var(--muted)] font-medium text-sm">Authenticating…</p>
    </div>
  )
}
