import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const hasSbUser = cookieStore.has("sb_user")

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll()
          if (hasSbUser) {
            // Filter out stale official auth cookies to avoid "Expected 3 parts in JWT; got 1" server errors
            return allCookies.filter(c => !(c.name.startsWith("sb-") && c.name.endsWith("-auth-token")))
          }
          return allCookies
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const originalGetUser = client.auth.getUser.bind(client.auth)
  client.auth.getUser = async (jwt?: string) => {
    const sbUserCookie = cookieStore.get("sb_user")?.value
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
        console.error("Error parsing sb_user cookie in getUser wrap:", e)
      }
    }
    return originalGetUser(jwt)
  }

  return client
}
