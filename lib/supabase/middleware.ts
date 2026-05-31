import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const hasSbUser = request.cookies.has("sb_user")

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = request.cookies.getAll()
          if (hasSbUser) {
            return allCookies.filter(c => !(c.name.startsWith("sb-") && c.name.endsWith("-auth-token")))
          }
          return allCookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })

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

  const originalGetUser = supabase.auth.getUser.bind(supabase.auth)
  supabase.auth.getUser = async (jwt?: string) => {
    const sbUserCookie = request.cookies.get("sb_user")?.value
    if (sbUserCookie) {
      try {
        const customUser = JSON.parse(decodeURIComponent(sbUserCookie))
        if (customUser && customUser.id) {
          return {
            data: {
              user: {
                id: customUser.id,
                email: customUser.email,
                phone: customUser.phone_number,
                role: customUser.role,
                user_metadata: {
                  full_name: customUser.full_name,
                  avatar_url: customUser.avatar_url,
                },
                ...customUser,
              } as any
            },
            error: null
          }
        }
      } catch (e) {
        console.error("Error parsing sb_user cookie in middleware getUser wrap:", e)
      }
    }
    return originalGetUser(jwt)
  }

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    request.nextUrl.pathname !== '/' && // Allow landing page
    !request.nextUrl.pathname.startsWith('/states') && // Allow public viewing
    !request.nextUrl.pathname.startsWith('/events') && // Allow public events
    !request.nextUrl.pathname.startsWith('/images-gallery') && // Allow image gallery
    !request.nextUrl.pathname.startsWith('/videos-gallery') && // Allow video gallery
    !request.nextUrl.pathname.startsWith('/kendriya') && // Allow central committee
    !request.nextUrl.pathname.startsWith('/about') && // Allow about page
    !request.nextUrl.pathname.startsWith('/api') // Allow API routes
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
