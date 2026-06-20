import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// If env vars aren't set the app still works — messages are in-memory only
export const supabase = (url && key) ? createClient(url, key) : null
