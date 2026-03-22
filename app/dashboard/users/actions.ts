'use server'

import { createAdminClient } from "@/lib/supabase/admin"

export async function createManualUser(data: {
  email: string
  full_name: string
  role: string
  plan: string
  phone_number: string
}) {
  const adminClient = createAdminClient()
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured in the environment variables.")
  }

  // 1. Create the user in Auth with the provided email
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: Math.random().toString(36).slice(-12), 
    email_confirm: true, // Bypass verification since Admin is creating it
    user_metadata: { 
        full_name: data.full_name,
        phone_number: data.phone_number
    },
    phone: data.phone_number || undefined
  })

  // If already exists, we might want to just update?
  if (authError) {
    if (authError.message.includes("already registered")) {
        throw new Error("A user with this email already exists in Auth.")
    }
    throw authError
  }

  const userId = authData.user.id

  // 2. The Auth creation might already trigger a profile creation in public.users 
  const { data: existingProfile } = await adminClient
    .from('users')
    .select('id')
    .eq('email', data.email)
    .maybeSingle()

  if (existingProfile) {
      const { error: updateError } = await adminClient
        .from('users')
        .update({
            id: userId,
            full_name: data.full_name,
            role: data.role,
            plan: data.plan,
            phone_number: data.phone_number
        })
        .eq('id', existingProfile.id)
        
      if (updateError) throw updateError
  } else {
      const { error: insertError } = await adminClient
        .from('users')
        .insert({
            id: userId,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            plan: data.plan,
            phone_number: data.phone_number
        })
        
      if (insertError) throw insertError
  }

  return { success: true, userId }
}
