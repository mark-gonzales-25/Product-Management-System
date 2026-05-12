import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) navigate('/app/products', { replace: true })
  }, [session, navigate])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Email and password are required.'); return }
    setLoading(true)
    setError('')
    const err = await signInWithEmail(email, password)
    if (err) setError(err)
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1a2744 0%,#2d3b6e 50%,#6c5ce7 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute rounded-full opacity-[0.08] bg-white" style={{ width: 420, height: 420, top: -130, right: -90 }} />
      <div className="absolute rounded-full opacity-[0.08] bg-white" style={{ width: 300, height: 300, bottom: -100, left: -60 }} />

      <div className="bg-white rounded-[20px] p-10 w-full max-w-md relative z-10 shadow-[0_20px_60px_rgba(0,0,0,.25)]">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-2 text-[22px] font-bold text-[#1a2744] mb-1">
            Hope
            <span className="bg-[#6c5ce7] text-white rounded-lg px-2.5 py-1 text-[13px]">PMS</span>
          </div>
          <p className="text-gray-500 text-[15px] mt-2">Sign in to manage your products.</p>
        </div>

        {/* Email / Password form */}
        <form onSubmit={handleEmailLogin} className="space-y-3 mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#6c5ce7] text-white rounded-xl text-sm font-semibold hover:bg-[#5a4bd1] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google button */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
            <path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"/>
            <path fill="#FBBC05" d="M24 46c5.5 0 10.5-1.9 14.3-5l-6.6-5.4C29.8 37 27 38 24 38c-6.1 0-11.2-3.9-13.1-9.4l-7 5.4C7.5 42.1 15.2 46 24 46z"/>
            <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.5-2.6 4.6-4.8 6.1l6.6 5.4c3.9-3.6 6.4-8.9 6.4-15 0-1.3-.2-2.7-.5-4z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          Hope, Inc. Internal System — authorised personnel only.
        </p>
      </div>
    </div>
  )
}
