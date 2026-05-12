import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/app/security/env'

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (supabaseBrowserClient) return supabaseBrowserClient

  supabaseBrowserClient = createBrowserClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY
  )
  return supabaseBrowserClient
}
