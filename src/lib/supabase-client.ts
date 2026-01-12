import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/env'

const supabase = createBrowserClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
);
export default supabase;