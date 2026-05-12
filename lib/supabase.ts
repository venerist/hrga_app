import { createClient } from './supabase/client'

// Default export for client-side usage across repositories
export const supabase = createClient()

