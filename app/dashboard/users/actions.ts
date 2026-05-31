'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { getMockEmailForPhone } from "@/lib/utils"

export async function createManualUser(data: {
  email: string
  full_name: string
  role: string
  plan: string
  phone_number: string
  password?: string
}) {
  const adminClient = createAdminClient()
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured in the environment variables.")
  }

  // Normalize phone number to E.164 format
  let finalPhone = data.phone_number?.trim() || ""
  if (finalPhone && !finalPhone.startsWith("+")) {
    finalPhone = finalPhone.replace(/\D/g, "")
    if (finalPhone.length === 10) {
      finalPhone = `+91${finalPhone}`
    }
  }

  // Determine the Auth Email identifier
  const authEmail = finalPhone ? getMockEmailForPhone(finalPhone) : (data.email || undefined)

  console.log("SERVER: Manual User Creation Attempt", {
    authEmail,
    providedPassword: data.password ? `[${data.password}]` : "[RANDOM]",
    finalPhone
  })

  // 1. Create the user in Auth with the provided email
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: authEmail,
    password: data.password || Math.random().toString(36).slice(-12), 
    email_confirm: true, // Bypass verification since Admin is creating it
    user_metadata: { 
        full_name: data.full_name,
        phone_number: finalPhone
    }
  })

  // If already exists, we might want to just update?
  if (authError) {
    if (authError.message.toLowerCase().includes("already registered")) {
        throw new Error("A user with this email or phone number already exists in Auth.")
    }
    throw authError
  }

  const userId = authData.user.id

  // 2. The Auth creation might already trigger a profile creation in public.users 
  const { data: existingProfile } = await adminClient
    .from('users')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (existingProfile) {
      const { error: updateError } = await adminClient
        .from('users')
        .update({
            email: data.email || null,
            full_name: data.full_name,
            role: data.role,
            plan: data.plan,
            phone_number: finalPhone || null
        })
        .eq('id', userId)
        
      if (updateError) throw updateError
  } else {
      const { error: insertError } = await adminClient
        .from('users')
        .insert({
            id: userId,
            email: data.email || null,
            full_name: data.full_name,
            role: data.role,
            plan: data.plan,
            phone_number: finalPhone || null
        })
        
      if (insertError) throw insertError
  }

  return { success: true, userId }
}

export async function updateManualUserPassword(userId: string, newPassword: string) {
  const adminClient = createAdminClient()
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured in the environment variables.")
  }

  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password: newPassword
  })
  
  if (error) throw error
  return { success: true }
}

export async function deleteManualUser(userId: string) {
  const adminClient = createAdminClient()
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured in the environment variables.")
  }

  // 1. Delete from Auth
  const { error: authError } = await adminClient.auth.admin.deleteUser(userId)
  if (authError) {
    // If not found in Auth, we might still want to delete the DB record
    console.warn("User not found in Auth, deleting DB record anyway:", authError)
  }

  // 2. Delete from public.users
  const { error: dbError } = await adminClient
    .from('users')
    .delete()
    .eq('id', userId)
    
  if (dbError) throw dbError

  return { success: true }
}
