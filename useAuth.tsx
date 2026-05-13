import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const TITLES: Record<string, string> = {
  '/app/products':            'Products',
  '/app/deleted':             'Deleted Items',
  '/app/reports/products':    'Product Report',
  '/app/reports/top-selling': 'Top Selling Report',
  '/app/admin':               'User Management',
}

const ROLE_STYLES: Record<string, string> = {
  SUPERADMIN: 'bg-amber-100 text-amber-700 border border-amber-200',
  ADMIN:      'bg-violet-100 text-violet-700 border border-violet-200',
  USER:       'bg-blue-100 text-blue-700 border border-blue-200',
}

/** Capitalise every word: "john doe" → "John Doe" */
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(/[\s.]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function Topbar() {
  const { profile, user, signOut } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const title    = TITLES[location.pathname] ?? 'MLR-AZ PMS'
  const role     = profile?.user_type ?? 'USER'

  // Prefer Google full_name stored in username, fall back to email prefix
  const rawName    = profile?.username ?? user?.email?.split('@')[0] ?? '?'
  const displayName = toTitleCase(rawName)
  const email      = user?.email ?? ''
  const initials   = displayName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const handleSignOut = async () => {
    setOpen(false)
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-7 bg-white border-b border-gray-100"
      style={{ height: 'var(--topbar-h)' }}
    >
      <div className="text-base font-bold text-gray-800">{title}</div>

      <div className="flex items-center gap-3" ref={ref}>
        {/* Role badge */}
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${ROLE_STYLES[role] ?? ROLE_STYLES.USER}`}>
          {role}
        </span>

        {/* Avatar + dropdown trigger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 cursor-pointer focus:outline-none"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center text-[12px] font-bold select-none">
            {initials}
          </div>
          <ChevronDown size={13} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-[calc(var(--topbar-h)_-_6px)] right-5 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
            {/* User info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#6c5ce7] text-white flex items-center justify-center text-[12px] font-bold flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">{displayName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{email}</p>
                </div>
              </div>
            </div>

            {/* Profile link (cosmetic) */}
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <User size={14} className="text-gray-400" />
              My Profile
            </button>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
