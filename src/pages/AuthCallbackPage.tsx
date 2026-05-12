import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      // Login guard — check record_status (ACTIVE/INACTIVE) after OAuth sign-in
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('auth_user_id', session.user.id)
        .maybeSingle()

      if (profile?.status === 'INACTIVE') {
        await supabase.auth.signOut()
        setError('Your account is pending activation. Contact an administrator.')
        return
      }

      navigate('/app/products', { replace: true })
    })
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-red-600 text-sm font-medium">{error}</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="text-[#6c5ce7] text-sm hover:underline cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="spinner-lg" />
      <p className="mt-4 text-gray-400 font-medium text-sm">Authenticating…</p>
    </div>
  )
}
