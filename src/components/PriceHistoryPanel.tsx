import { useEffect, useState } from 'react'
import { X, History, Plus } from 'lucide-react'
import type { Product } from '../lib/types'
import { getPriceHistory, addPriceEntry, type PriceEntry } from '../services/priceHistService'
import { useAuth } from '../hooks/useAuth'

interface PriceHistoryPanelProps {
  product: Product
  onClose: () => void
}

export default function PriceHistoryPanel({ product, onClose }: PriceHistoryPanelProps) {
  const { profile } = useAuth()
  const isPrivileged =
    profile?.user_type === 'ADMIN' || profile?.user_type === 'SUPERADMIN'

  const [entries,  setEntries]  = useState<PriceEntry[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPrice, setNewPrice] = useState('')
  const [newDate,  setNewDate]  = useState('')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getPriceHistory(product.code)
      setEntries(data)
    } catch {
      setError('Failed to load price history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [product.code])

  const handleAdd = async () => {
    const price = parseFloat(newPrice)
    if (!newDate || isNaN(price) || price < 0) return
    setSaving(true)
    try {
      await addPriceEntry({ productCode: product.code, unitPrice: price, effDate: newDate })
      setShowForm(false); setNewPrice(''); setNewDate(''); load()
    } catch {
      setError('Failed to add price entry.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-gray-800">
            <History size={16} className="text-[#6c5ce7]" /> Price History
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-3">
          <strong>{product.code}</strong> — {product.description}
        </p>

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <div className="rounded-xl border border-gray-100 overflow-hidden text-sm mb-4">
          <div className="flex justify-between px-4 py-2.5 bg-gray-50 font-semibold text-gray-500 text-xs uppercase tracking-wider">
            <span>Eff. Date</span><span>Unit Price</span>
          </div>
          {loading ? (
            <div className="py-6 flex items-center justify-center text-gray-400">
              <div className="spinner" />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-4 text-center text-xs text-gray-400">No price history yet.</div>
          ) : entries.map(e => (
            <div key={e.id} className="flex justify-between px-4 py-2.5 border-t border-gray-100">
              <span className="text-gray-500">{e.eff_date}</span>
              <span className="font-semibold">${e.unit_price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {isPrivileged && !showForm && (
          <button
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-dashed border-[#6c5ce7] text-[#6c5ce7] hover:bg-indigo-50 cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <Plus size={12} /> Add Price Entry
          </button>
        )}

        {isPrivileged && showForm && (
          <div className="border border-gray-200 rounded-xl p-4 mt-2">
            <p className="text-xs font-semibold text-gray-600 mb-3">New Price Entry</p>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Effective Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6c5ce7]"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
              <input
                type="number" step="0.01" min="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6c5ce7]"
                placeholder="0.00"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold hover:border-gray-400 cursor-pointer"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 rounded-lg bg-[#6c5ce7] text-white text-xs font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50"
                onClick={handleAdd}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Add Entry'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
