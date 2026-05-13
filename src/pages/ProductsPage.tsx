import { useEffect, useRef, useState } from 'react'
import {
  Plus, Search, MoreVertical, Pencil, History, Trash2, Package, X
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'
import { useAuth } from '../hooks/useAuth'
import { useRights } from '../context/UserRightsContext'

const UNITS = ['ea', 'pc', 'mtr', 'pkg', 'ltr'] as const
type Unit = typeof UNITS[number]

interface ProductForm {
  code: string
  description: string
  unit: Unit
  price: string
}
type FormErrors = Partial<Record<keyof ProductForm, string>>
const EMPTY: ProductForm = { code: '', description: '', unit: 'ea', price: '' }

// ─── Three-dot action menu ────────────────────────────────────────────────────
function ActionMenu({
  product, canEdit, canDelete, canPriceHistory,
  onEdit, onDelete, onPriceHistory,
}: {
  product: Product
  canEdit: boolean
  canDelete: boolean
  canPriceHistory: boolean
  onEdit: () => void
  onDelete: () => void
  onPriceHistory: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function outside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [open])

  if (!canEdit && !canDelete && !canPriceHistory) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
        aria-label={`Actions for ${product.code}`}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
          {canEdit && (
            <button
              onClick={() => { setOpen(false); onEdit() }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Pencil size={13} className="text-gray-400" /> Edit Details
            </button>
          )}

          {canPriceHistory && (
            <button
              onClick={() => { setOpen(false); onPriceHistory() }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <History size={13} className="text-gray-400" /> Price History
            </button>
          )}

          {canDelete && (
            <>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setOpen(false); onDelete() }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 size={13} /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Product form modal ───────────────────────────────────────────────────────
function ProductModal({
  title, form, errors, saving, onChange, onClose, onSave,
}: {
  title: string
  form: ProductForm
  errors: FormErrors
  saving: boolean
  onChange: (f: ProductForm) => void
  onClose: () => void
  onSave: () => void
}) {
  const set = (k: keyof ProductForm, v: string) => onChange({ ...form, [k]: v })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold flex items-center gap-2 text-gray-800">
            <Package size={16} className="text-[#6c5ce7]" /> {title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {(['code', 'description'] as const).map(field => (
          <div key={field} className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 text-gray-600">
              {field === 'code' ? 'Product Code' : 'Description'}
            </label>
            <input
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                errors[field] ? 'border-red-400' : 'border-gray-200 focus:border-[#6c5ce7]'
              }`}
              placeholder={field === 'code' ? 'e.g. NB0006' : 'Product description'}
              value={form[field]}
              onChange={e => set(field, e.target.value)}
            />
            {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Unit</label>
          <select
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6c5ce7] bg-white cursor-pointer"
            value={form.unit}
            onChange={e => set('unit', e.target.value)}
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold mb-1.5 text-gray-600">Current Price</label>
          <input
            type="number" step="0.01" min="0"
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
              errors.price ? 'border-red-400' : 'border-gray-200 focus:border-[#6c5ce7]'
            }`}
            placeholder="0.00"
            value={form.price}
            onChange={e => set('price', e.target.value)}
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
        </div>

        <div className="flex gap-2.5 justify-end mt-5">
          <button
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-gray-400 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-[#6c5ce7] text-white text-sm font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Soft Delete Confirm Dialog ───────────────────────────────────────────────
function SoftDeleteConfirmDialog({
  product, onConfirm, onCancel,
}: {
  product: Product
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-gray-800 mb-2">Delete Product?</h3>
        <p className="text-sm text-gray-500 mb-5">
          Move <strong>{product.code}</strong> — {product.description} to Deleted Items?
          This can be recovered by an Admin.
        </p>
        <div className="flex gap-2.5 justify-end">
          <button
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-gray-400 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:opacity-90 cursor-pointer"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Price History Panel ──────────────────────────────────────────────────────
function PriceHistoryModal({ product, onClose }: { product: Product; onClose: () => void }) {
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer"><X size={16} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Showing history for <strong>{product.code}</strong> — {product.description}
        </p>
        <div className="rounded-xl border border-gray-100 overflow-hidden text-sm">
          <div className="flex justify-between px-4 py-2.5 bg-gray-50 font-semibold text-gray-500 text-xs uppercase tracking-wider">
            <span>Date</span><span>Price</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-t border-gray-100">
            <span className="text-gray-500">Current</span>
            <span className="font-semibold">${product.price.toFixed(2)}</span>
          </div>
          <div className="px-4 py-3 text-center text-xs text-gray-400 border-t border-gray-100">
            Full price history requires the price_history table (Sprint 2 DB).
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold hover:border-gray-400 cursor-pointer"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const { profile } = useAuth()
  const rights = useRights()
  const role = profile?.user_type ?? 'USER'
  const isPrivileged = role === 'ADMIN' || role === 'SUPERADMIN'

  const [products, setProducts]   = useState<Product[]>([])
  const [filter,   setFilter]     = useState('')
  const [loading,  setLoading]    = useState(true)
  const [error,    setError]      = useState<string | null>(null)

  const [showAdd,        setShowAdd]        = useState(false)
  const [showEdit,       setShowEdit]       = useState(false)
  const [showHistory,    setShowHistory]    = useState(false)
  const [showDeleteConf, setShowDeleteConf] = useState(false)
  const [form,           setForm]           = useState<ProductForm>(EMPTY)
  const [editId,         setEditId]         = useState<string | null>(null)
  const [activeProduct,  setActiveProduct]  = useState<Product | null>(null)
  const [saving,         setSaving]         = useState(false)
  const [formErrors,     setFormErrors]     = useState<FormErrors>({})

  const load = async () => {
    setLoading(true); setError(null)
    let query = supabase.from('products').select('*').order('code')
    if (role === 'USER') query = query.eq('active', true)
    const { data, error: err } = await query
    if (err) { setError('Failed to load products. Please try again.') }
    else { setProducts(data ?? []) }
    setLoading(false)
  }

  useEffect(() => { load() }, [role])

  const filtered = (products ?? []).filter(p =>
    !filter || `${p.code} ${p.description}`.toLowerCase().includes(filter.toLowerCase())
  )

  const validate = (f: ProductForm): FormErrors => {
    const e: FormErrors = {}
    if (!f.code.trim()) e.code = 'Required'
    if (!f.description.trim()) e.description = 'Required'
    if (!f.price || isNaN(Number(f.price)) || Number(f.price) < 0) e.price = 'Enter a valid price'
    return e
  }

  const handleSaveNew = async () => {
    const e = validate(form)
    if (Object.keys(e).length) { setFormErrors(e); return }
    setSaving(true)
    await supabase.from('products').insert({
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      unit: form.unit, price: parseFloat(form.price), active: true,
    })
    setSaving(false); setShowAdd(false); setForm(EMPTY); setFormErrors({}); load()
  }

  const handleSaveEdit = async () => {
    if (!editId) return
    const e = validate(form)
    if (Object.keys(e).length) { setFormErrors(e); return }
    setSaving(true)
    await supabase.from('products').update({
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      unit: form.unit, price: parseFloat(form.price),
    }).eq('id', editId)
    setSaving(false); setShowEdit(false); setFormErrors({}); load()
  }

  const openEdit = (p: Product) => {
    setEditId(p.id)
    setForm({ code: p.code, description: p.description, unit: p.unit, price: p.price.toFixed(2) })
    setFormErrors({}); setShowEdit(true)
  }

  const openHistory = (p: Product) => { setActiveProduct(p); setShowHistory(true) }

  const openDelete = (p: Product) => { setActiveProduct(p); setShowDeleteConf(true) }

  const handleConfirmDelete = async () => {
    if (!activeProduct) return
    await supabase.from('products').update({
      active: false,
      deleted_by: profile?.username ?? null,
      deleted_at: new Date().toISOString().slice(0, 10),
    }).eq('id', activeProduct.id)
    setShowDeleteConf(false); setActiveProduct(null); load()
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-wrap gap-2.5">
          <span className="text-sm font-bold text-gray-700">Product List</span>
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="pl-8 pr-3.5 py-2 border border-gray-200 rounded-lg text-[13px] outline-none focus:border-[#6c5ce7] min-w-[200px]"
                placeholder="Search products…"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              />
            </div>
            {rights.PRD_ADD === 1 && (
              <button
                className="px-3.5 py-2 bg-[#1a2744] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-[#243057] cursor-pointer"
                onClick={() => { setForm(EMPTY); setFormErrors({}); setShowAdd(true) }}
              >
                <Plus size={13} /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <div className="spinner" /><span className="text-sm">Loading products…</span>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center gap-2 text-red-400">
              <p className="font-medium text-sm">{error}</p>
              <button onClick={load} className="text-xs underline cursor-pointer">Try again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
              <Package size={40} className="opacity-25" />
              <p className="font-medium text-sm">No products found</p>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Code', 'Description', 'Unit', 'Price',
                    ...(isPrivileged ? ['Stamp'] : []),
                    ''
                  ].map(h => (
                    <th key={h} className="bg-gray-50 px-4 py-2.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-indigo-50/30 group">
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">{p.code}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] text-gray-600">{p.description}</td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px]">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-600">{p.unit}</span>
                    </td>
                    <td className="px-4 py-3 border-t border-gray-50 text-[13px] font-semibold text-gray-800">
                      ${p.price.toFixed(2)}
                    </td>
                    {isPrivileged && (
                      <td className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
                        {p.deleted_by && p.deleted_at ? `${p.deleted_by} — ${p.deleted_at}` : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 border-t border-gray-50 text-right pr-4">
                      <ActionMenu
                        product={p}
                        canEdit={rights.PRD_EDIT === 1}
                        canDelete={rights.PRD_DEL === 1}
                        canPriceHistory={isPrivileged}
                        onEdit={() => openEdit(p)}
                        onDelete={() => openDelete(p)}
                        onPriceHistory={() => openHistory(p)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showAdd && (
        <ProductModal title="Add Product" form={form} errors={formErrors} saving={saving}
          onChange={setForm} onClose={() => setShowAdd(false)} onSave={handleSaveNew} />
      )}
      {showEdit && (
        <ProductModal title="Edit Product" form={form} errors={formErrors} saving={saving}
          onChange={setForm} onClose={() => setShowEdit(false)} onSave={handleSaveEdit} />
      )}
      {showDeleteConf && activeProduct && (
        <SoftDeleteConfirmDialog product={activeProduct}
          onConfirm={handleConfirmDelete} onCancel={() => setShowDeleteConf(false)} />
      )}
      {showHistory && activeProduct && (
        <PriceHistoryModal product={activeProduct} onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
