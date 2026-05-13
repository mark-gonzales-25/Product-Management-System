import { useEffect, useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { useAuth } from '../hooks/useAuth'

export default function DeletedPage() {
  const { profile } = useAuth()
  const role      = profile?.user_type ?? 'USER'
  const showStamp = role === 'ADMIN' || role === 'SUPERADMIN'

  const [items,   setItems]   = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products').select('*').eq('active', false).order('code')
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const recover = async (p: Product) => {
    await supabase.from('products').update({
      active: true, deleted_by: null, deleted_at: null,
    }).eq('id', p.id)
    load()
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-700">Inactive Products</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <div className="spinner" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
              <Trash2 size={40} className="opacity-25" />
              <p className="font-medium text-sm">No deleted items</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Code', 'Description', 'Unit',
                    ...(showStamp ? ['Deleted By'] : []),
                    'Action'
                  ].map(h => (
                    <th key={h} className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="hover:bg-indigo-50/30">
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">{p.code}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] text-gray-600">{p.description}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px]">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">{p.unit}</span>
                    </td>
                    {showStamp && (
                      <td className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
                        {p.deleted_by && p.deleted_at ? `${p.deleted_by} — ${p.deleted_at}` : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 border-t border-gray-50">
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white cursor-pointer hover:opacity-90"
                        style={{ background: '#00b894' }}
                        onClick={() => recover(p)}
                      >
                        <RotateCcw size={12} /> Recover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
