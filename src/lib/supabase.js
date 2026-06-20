import { createClient } from '@supabase/supabase-js'

// Vercel-Supabase integration sets NEXT_PUBLIC_ vars automatically
// Manual setup uses VITE_ vars — we check both
const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('[GuestBook] Supabase env vars missing — messages will not persist across reloads.')
} else {
  console.log('[GuestBook] Supabase connected ✓')
}

export const supabase = (url && key) ? createClient(url, key) : null
