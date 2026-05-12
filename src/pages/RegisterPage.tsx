import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle, session } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) navigate('/app/products', { replace: true })
  }, [session, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, username, email, password } = form
    if (!firstName || !lastName || !username || !email || !password) {
      setError('All fields are required.'); return
    }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')
    const err = await signUpWithEmail(email, password, `${firstName} ${lastName}`, username)
    if (err) { setError(err) } else {
      setSuccess('Account created! Check your email to confirm before signing in.')
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#1a2744 0%,#2d3b6e 50%,#6c5ce7 100%)' }}
    >
      <div className="absolute rounded-full opacity-[0.08] bg-white" style={{ width: 420, height: 420, top: -130, right: -90 }} />
      <div className="absolute rounded-full opacity-[0.08] bg-white" style={{ width: 300, height: 300, bottom: -100, left: -60 }} />

      <div className="bg-white rounded-[20px] p-10 w-full max-w-md relative z-10 shadow-[0_20px_60px_rgba(0,0,0,.25)]">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 text-[22px] font-bold text-[#1a2744] mb-1">
            Hope
            <span className="bg-[#6c5ce7] text-white rounded-lg px-2.5 py-1 text-[13px]">PMS</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {success ? (
          <div className="text-center">
            <p className="text-green-600 text-sm mb-4">{success}</p>
            <Link to="/login" className="text-[#6c5ce7] text-sm font-medium hover:underline">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30" />
              <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30" />
            </div>
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30" />
            <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30" />
            <input name="password" type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6c5ce7]/30" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#6c5ce7] text-white rounded-xl text-sm font-semibold hover:bg-[#5a4bd1] disabled:opacity-50 transition-colors cursor-pointer">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <div className="flex items-center gap-2 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button type="button" onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
              </svg>
              Register with Google
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500 mt-5">
          Already have an account? <Link to="/login" className="text-[#6c5ce7] font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
