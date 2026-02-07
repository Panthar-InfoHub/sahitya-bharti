"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function approveRefund(requestId: string, eventId: string, userId: string) {
  const supabase = await createClient()

  // 1. Update status to approved
  const { error: updateError } = await supabase
    .from("refund_requests")
    .update({ status: "approved" })
    .eq("id", requestId)

  if (updateError) throw new Error(updateError.message)

  // 2. Remove user from event participants (Unregister them)
  const { error: deleteError } = await supabase
    .from("event_participants")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)

  if (deleteError) {
      // Logic: If we fail to remove participant, should we rollback status?
      // For now, let's throw. Ideally transactional.
      throw new Error("Failed to remove participant: " + deleteError.message)
  }

  revalidatePath("/dashboard/refunds")
  return { success: true }
}

export async function rejectRefund(requestId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("refund_requests")
    .update({ status: "rejected" })
    .eq("id", requestId)

  if (error) throw new Error(error.message)

  revalidatePath("/dashboard/refunds")
  return { success: true }
}
