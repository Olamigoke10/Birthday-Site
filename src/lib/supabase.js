import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn(
    '[GuestBook] Supabase env vars missing — messages will NOT persist.\n' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file (local) ' +
    'or Vercel environment variables (production).'
  )
} else {
  console.log('[GuestBook] Supabase connected to', url)
}

export const supabase = (url && key) ? createClient(url, key) : null
