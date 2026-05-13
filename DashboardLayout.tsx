import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Never throw at module level — it white-screens the entire app.
// If env vars are missing, createClient still returns an object;
// individual queries will fail gracefully and the ConfigError page will show.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

export const isMisconfigured = !supabaseUrl || !supabaseAnonKey
