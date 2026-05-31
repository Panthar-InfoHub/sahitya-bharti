import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  if (typeof window !== 'undefined') {
    // If logged in via custom phone session, clear any stale official Supabase token cache
    // that might cause JWT invalid/malformed headers on standard public queries
    if (localStorage.getItem("sb_user")) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
          localStorage.removeItem(key)
        }
      }
      document.cookie.split(";").forEach(c => {
        const trimmed = c.trim()
        if (trimmed.startsWith("sb-") && trimmed.includes("-auth-token=")) {
          const cookieName = trimmed.split("=")[0]
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`
        }
      })
    }

    const originalGetUser = client.auth.getUser.bind(client.auth)
    client.auth.getUser = async (jwt?: string) => {
      const sbUserStr = localStorage.getItem("sb_user")
      if (sbUserStr) {
        try {
          const customUser = JSON.parse(sbUserStr)
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
          console.error("Error parsing sb_user in client getUser:", e)
        }
      }
      return originalGetUser(jwt)
    }

    const originalSignOut = client.auth.signOut.bind(client.auth)
    client.auth.signOut = async (options?: any) => {
      localStorage.removeItem("sb_user")
      document.cookie = "sb_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax"
      
      // Also clear all sb-*-auth-token cookies/localStorage on signout
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
          localStorage.removeItem(key)
        }
      }
      document.cookie.split(";").forEach(c => {
        const trimmed = c.trim()
        if (trimmed.startsWith("sb-") && trimmed.includes("-auth-token=")) {
          const cookieName = trimmed.split("=")[0]
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`
        }
      })

      return originalSignOut(options)
    }
  }

  return client
}
