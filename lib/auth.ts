
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUserProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function requireUser() {
  const data = await getUserProfile()
  if (!data) {
    redirect('/login')
  }
  return data
}
