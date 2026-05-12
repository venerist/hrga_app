import { createClient } from '@/lib/supabase/client'

export const authService = {
  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }
}
