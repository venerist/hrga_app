import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/app/security/env'
import { canAccessRoute } from '@/app/auth/permissions'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const { data: { user }, error } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protected route logic
  if (path.startsWith('/dashboard')) {
    const isLegacyAuth = request.cookies.get('hrga_legacy_auth')?.value === 'true'

    if (!user && !isLegacyAuth) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Role-based Access Control (RBAC)
    const role = isLegacyAuth ? 'admin' : (user?.user_metadata?.role || 'viewer')
    if (!canAccessRoute(role, path)) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard' // Redirect unauthorized access to main dashboard
      return NextResponse.redirect(url)
    }
  }

  const isLegacyAuth = request.cookies.get('hrga_legacy_auth')?.value === 'true'

  if (path === '/login' && (user || isLegacyAuth)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
