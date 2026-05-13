import { useEffect, useState } from 'react'
import { ShieldCheck, Shield, User, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Profile, UserRole, UserStatus } from '../lib/types'
import { useAuth } from '../hooks/useAuth'

const TYPE_STYLES: Record<UserRole, string> = {
  SUPERADMIN: 'bg-amber-100 text-amber-700',
  ADMIN:      'bg-violet-100 text-violet-700',
  USER:       'bg-blue-100 text-blue-700',
}
const TYPE_ICONS: Record<UserRole, React.ReactNode> = {
  SUPERADMIN: <ShieldCheck size={11} />,
  ADMIN:      <Shield size={11} />,
  USER:       <User size={11} />,
}

export default function AdminPage() {
  const { profile: currentUser } = useAuth()
  const [users,   setUsers]   = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at')
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (u: Profile, status: UserStatus) => {
    if (u.user_type === 'SUPERADMIN') return
    await supabase.from('profiles').update({ status }).eq('id', u.id)
    load()
  }

  const deleteUser = async (u: Profile) => {
    if (u.user_type === 'SUPERADMIN') return
    if (!window.confirm(`Delete user "${u.username}" (${u.email})? This cannot be undone.`)) return
    await supabase.from('profiles').delete().eq('id', u.id)
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-700">System Users</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <div className="spinner" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['User ID', 'Username', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                    <th key={h} className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(users ?? []).map(u => {
                  const isSuper = u.user_type === 'SUPERADMIN'
                  const isSelf  = u.id === currentUser?.id
                  const locked  = isSuper || isSelf
                  return (
                    <tr key={u.id} className="hover:bg-indigo-50/30">
                      <td className="px-4 py-3 border-t border-gray-50 text-[11px] font-mono text-gray-400">
                        {u.id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">
                        {u.username}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-50 text-[13px] text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-50">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${TYPE_STYLES[u.user_type]}`}>
                          {TYPE_ICONS[u.user_type]} {u.user_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-t border-gray-50">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.status === 'ACTIVE'
                            ? <><CheckCircle2 size={10} /> ACTIVE</>
                            : <><XCircle size={10} /> INACTIVE</>}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-t border-gray-50">
                        {locked ? (
                          <span className="text-xs text-gray-400 italic">
                            {isSuper ? 'Protected' : 'Current user'}
                          </span>
                        ) : (
                          <div className="flex gap-1.5">
                            <button
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer ${
                                u.status === 'ACTIVE'
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                              onClick={() => toggleStatus(u, 'ACTIVE')}
                            >
                              <CheckCircle2 size={11} /> Active
                            </button>
                            <button
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer ${
                                u.status === 'INACTIVE'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                              onClick={() => toggleStatus(u, 'INACTIVE')}
                            >
                              <XCircle size={11} /> Inactive
                            </button>
                            <button
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                              onClick={() => deleteUser(u)}
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
