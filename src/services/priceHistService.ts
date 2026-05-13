import { supabase } from '../lib/supabase'

export interface PriceEntry {
  id: string
  product_code: string
  unit_price: number
  eff_date: string
  created_at?: string
}

/**
 * Get all price history entries for a given product code,
 * ordered by effective date descending (newest first).
 */
export async function getPriceHistory(productCode: string): Promise<PriceEntry[]> {
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_code', productCode)
    .order('eff_date', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as PriceEntry[]
}

/**
 * Add a new price entry for a product.
 * Only ADMIN / SUPERADMIN should be able to call this (enforced by RLS).
 */
export async function addPriceEntry(payload: {
  productCode: string
  unitPrice: number
  effDate: string
}): Promise<void> {
  const { error } = await supabase.from('price_history').insert({
    product_code: payload.productCode,
    unit_price: payload.unitPrice,
    eff_date: payload.effDate,
  })
  if (error) throw new Error(error.message)
}
