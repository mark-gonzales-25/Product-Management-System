import { supabase } from '../lib/supabase'
import type { Product } from '../lib/types'

/**
 * Fetch products from Supabase.
 * - USER: only ACTIVE products (active = true)
 * - ADMIN / SUPERADMIN: all products regardless of status
 */
export async function getProducts(userType: string): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('code')

  if (userType === 'USER') {
    query = query.eq('active', true)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}

/**
 * Insert a new product. Requires ADMIN or SUPERADMIN.
 */
export async function addProduct(payload: {
  code: string
  description: string
  unit: string
  price: number
}): Promise<void> {
  const { error } = await supabase.from('products').insert({
    code: payload.code.trim().toUpperCase(),
    description: payload.description.trim(),
    unit: payload.unit,
    price: payload.price,
    active: true,
  })
  if (error) throw new Error(error.message)
}

/**
 * Update an existing product's description, unit, and price.
 */
export async function updateProduct(
  id: string,
  payload: { code: string; description: string; unit: string; price: number }
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      code: payload.code.trim().toUpperCase(),
      description: payload.description.trim(),
      unit: payload.unit,
      price: payload.price,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Soft-delete: set active = false and stamp who deleted it.
 */
export async function softDeleteProduct(
  id: string,
  deletedBy: string
): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      active: false,
      deleted_by: deletedBy,
      deleted_at: new Date().toISOString().slice(0, 10),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Recover a soft-deleted product: set active = true and clear the stamp.
 */
export async function recoverProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ active: true, deleted_by: null, deleted_at: null })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
