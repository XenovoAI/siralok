import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw here to avoid crashing the Next dev server during local development.
  // Missing env vars will break auth calls at runtime; log an informative warning instead.
  // The developer should provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
  // Example:
  // NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
  // NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
  console.warn('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY). Auth will not work until they are set.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
