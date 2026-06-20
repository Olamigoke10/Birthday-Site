import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  console.warn('[GuestBook] Supabase env vars missing — messages will not persist across reloads.')
} else {
  console.log('[GuestBook] Supabase connected ✓')
}

export const supabase = (url && key)
  ? createClient(url, key, {
      auth: { persistSession: false },
      global: {
        headers: {
          // Support both legacy anon key and new publishable key formats
          'apikey': key,
        },
      },
    })
  : null
