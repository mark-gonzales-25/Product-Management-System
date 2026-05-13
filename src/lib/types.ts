export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER'
export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface Product {
  id: string
  code: string
  description: string
  unit: 'ea' | 'pc' | 'mtr' | 'pkg' | 'ltr'
  price: number
  active: boolean
  deleted_by?: string | null
  deleted_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface SalesDetail {
  id: string
  product_code: string
  quantity: number
  created_at?: string
}

export interface SystemUser {
  id: string
  username: string
  email: string
  user_type: UserRole
  status: UserStatus
  auth_user_id?: string | null
  created_at?: string
}

export interface Profile {
  id: string
  auth_user_id: string
  username: string
  email: string
  user_type: UserRole
  status: UserStatus
  created_at?: string
}
