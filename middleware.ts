import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Skip session auth for v1 API routes (they use API key auth)
  if (request.nextUrl.pathname.startsWith('/api/v1/')) {
    return response
  }

  const pathname = request.nextUrl.pathname

  // Early return for static assets and paths that don't need auth checks
  if (
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/media/') ||
    pathname.startsWith('/api/webhooks/')
  ) {
    return response
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes - require authentication
  const dashboardPaths = ['/dashboard', '/customers', '/jobs', '/estimates', '/estimate-pages', '/invoices', '/settings', '/reports', '/sales', '/dispatch', '/calendar', '/team', '/contracts', '/payments', '/scheduling']
  const isTechPath = pathname.startsWith('/tech')
  const isPortalPath = pathname.startsWith('/portal') && pathname !== '/portal/login'
  const isPortalLoginPath = pathname === '/portal/login'
  const isDashboardPath = dashboardPaths.some(path => pathname.startsWith(path))
  const isProtectedPath = isDashboardPath || isTechPath || isPortalPath

  // Auth routes - redirect based on role if already logged in
  const authPaths = ['/', '/login', '/signup']
  const isAuthPath = authPaths.some(path => pathname === path)

  // Redirect unauthenticated users from protected paths
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    // Customers go to portal login, others to main login
    url.pathname = isPortalPath ? '/portal/login' : '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // For authenticated users, detect role and enforce routing
  if (user && (isAuthPath || isDashboardPath || isTechPath || isPortalPath || isPortalLoginPath)) {
    // Check team member and customer role in parallel
    const [{ data: teamMember }, { data: customer }] = await Promise.all([
      supabase
        .from('team_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single(),
      supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single(),
    ])

    const isTech = teamMember?.role === 'technician'
    const isCustomer = !!customer && !teamMember

    // Redirect from auth/login pages to correct portal
    if (isAuthPath || isPortalLoginPath) {
      const url = request.nextUrl.clone()
      if (isCustomer) {
        url.pathname = '/portal'
      } else if (isTech) {
        url.pathname = '/tech'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Customers can only access /portal routes
    if (isCustomer && (isDashboardPath || isTechPath)) {
      const url = request.nextUrl.clone()
      url.pathname = '/portal'
      return NextResponse.redirect(url)
    }

    // Techs can only access /tech routes
    if (isTech && (isDashboardPath || isPortalPath)) {
      const url = request.nextUrl.clone()
      url.pathname = '/tech'
      return NextResponse.redirect(url)
    }

    // Staff blocked from portal
    if (!isCustomer && isPortalPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
