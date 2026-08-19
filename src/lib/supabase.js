import { createClient } from '@supabase/supabase-js'

const runtime = typeof window !== 'undefined' ? window.__BLUMEN_SUPABASE__ : null

const url = import.meta.env.VITE_SUPABASE_URL || runtime?.url || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || runtime?.anonKey || ''

export const isSupabaseConfigured = Boolean(
  url &&
    key &&
    !String(url).includes('YOUR_') &&
    !String(key).includes('YOUR_'),
)

export const supabase = isSupabaseConfigured ? createClient(url, key) : null
