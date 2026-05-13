/**
 * reportsApi.ts — Sprint 3 PR-01: feat/reports-api
 * REP_001: Full product listing with current price
 * REP_002: Top-selling products (products JOIN sales_detail)
 */
import { supabase } from './supabase'

export interface ProductReportRow {
  id: string; code: string; description: string; unit: string; price: number
}
export interface TopSellingRow {
  code: string; description: string; unit: string; totalQty: number
}

/** REP_001 — all ACTIVE products with current price */
export async function getProductReport(): Promise<{ data: ProductReportRow[]; error: string | null }> {
  const { data, error } = await supabase
    .from('products')
    .select('id, code, description, unit, price')
    .eq('active', true)
    .order('code')
  if (error) return { data: [], error: error.message }
  return { data: data ?? [], error: null }
}

/** REP_002 — top N products by total quantity sold */
export async function getTopSellingProducts(limit = 10): Promise<{ data: TopSellingRow[]; error: string | null }> {
  const [{ data: sales, error: sErr }, { data: products, error: pErr }] = await Promise.all([
    supabase.from('sales_detail').select('product_code, quantity'),
    supabase.from('products').select('code, description, unit'),
  ])
  if (sErr) return { data: [], error: sErr.message }
  if (pErr) return { data: [], error: pErr.message }

  const totals: Record<string, number> = {}
  for (const row of sales ?? []) totals[row.product_code] = (totals[row.product_code] ?? 0) + row.quantity

  const pMap: Record<string, { description: string; unit: string }> = {}
  for (const p of products ?? []) pMap[p.code] = { description: p.description, unit: p.unit }

  return {
    data: Object.entries(totals)
      .map(([code, totalQty]) => ({ code, description: pMap[code]?.description ?? code, unit: pMap[code]?.unit ?? '—', totalQty }))
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, limit),
    error: null,
  }
}
