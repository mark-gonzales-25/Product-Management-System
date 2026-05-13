import { useEffect, useState } from 'react'
import { Download, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'

type SortCol = 'code' | 'description' | 'price'

export default function ProductReportPage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [filterText, setFilterText] = useState('')
  const [filterUnit, setFilterUnit] = useState('')
  const [sortCol,    setSortCol]    = useState<SortCol>('code')
  const [sortAsc,    setSortAsc]    = useState(true)

  const load = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('code')
    if (err) {
      setError('Failed to load products. Please try again.')
    } else {
      setProducts(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSort = (col: SortCol) => {
    if (sortCol === col) setSortAsc(a => !a)
    else { setSortCol(col); setSortAsc(true) }
  }

  const filtered = (products ?? [])
    .filter(p => !filterText || `${p.code} ${p.description}`.toLowerCase().includes(filterText.toLowerCase()))
    .filter(p => !filterUnit || p.unit === filterUnit)
    .sort((a, b) => {
      const va = sortCol === 'price' ? a.price : (sortCol === 'description' ? a.description : a.code)
      const vb = sortCol === 'price' ? b.price : (sortCol === 'description' ? b.description : b.code)
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
    })

  const exportCSV = () => {
    const rows = [
      ['Code', 'Description', 'Unit', 'Price'],
      ...filtered.map(p => [p.code, p.description, p.unit, p.price.toFixed(2)])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'mlraz_products.csv'
    a.click()
  }

  function SortIcon({ col }: { col: SortCol }) {
    if (sortCol !== col) return <ArrowUpDown size={11} className="inline ml-1 opacity-40" />
    return sortAsc
      ? <ArrowUp size={11} className="inline ml-1 text-[#6c5ce7]" />
      : <ArrowDown size={11} className="inline ml-1 text-[#6c5ce7]" />
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-2.5">
          <div className="flex gap-2.5 flex-wrap items-center">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-8 pr-3.5 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#6c5ce7] min-w-[200px]"
                placeholder="Filter products…"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#6c5ce7] bg-white cursor-pointer"
              value={filterUnit}
              onChange={e => setFilterUnit(e.target.value)}
            >
              <option value="">All Units</option>
              {['ea','pc','mtr','pkg','ltr'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 text-white rounded-lg text-xs font-semibold hover:opacity-90 cursor-pointer"
            style={{ background: '#00b894' }}
            onClick={exportCSV}
            disabled={loading}
          >
            <Download size={13} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <div className="spinner" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center gap-2 text-red-400">
              <p className="font-medium text-sm">{error}</p>
              <button onClick={load} className="text-xs underline cursor-pointer">Try again</button>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-[#6c5ce7]"
                    onClick={() => handleSort('code')}>
                    Code <SortIcon col="code" />
                  </th>
                  <th className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-[#6c5ce7]"
                    onClick={() => handleSort('description')}>
                    Description <SortIcon col="description" />
                  </th>
                  <th className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unit</th>
                  <th className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-[#6c5ce7]"
                    onClick={() => handleSort('price')}>
                    Price <SortIcon col="price" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-14 text-center text-sm text-gray-400">No products match your filters.</td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id} className="hover:bg-indigo-50/30">
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">{p.code}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] text-gray-600">{p.description}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px]">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">${p.price.toFixed(2)}</td>
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
