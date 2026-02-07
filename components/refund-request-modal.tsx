"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface RefundRequestModalProps {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
  onSuccess: () => void
}

export function RefundRequestModal({ 
    event, 
    open, 
    onOpenChange,
    currentUserId,
    onSuccess
}: RefundRequestModalProps) {
  const [reason, setReason] = useState("")
  const [upiId, setUpiId] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
        toast.error("Please provide a reason for cancellation")
        return
    }

    setSubmitting(true)
    const supabase = createClient()

    try {
        const { error } = await supabase
            .from('refund_requests')
            .insert({
                user_id: currentUserId,
                event_id: event.id,
                reason: reason,
                upi_id: upiId,
                status: 'pending'
            })

        if (error) throw error

        toast.success("Refund request submitted successfully! Admin will review it.")
        onOpenChange(false)
        onSuccess()
    } catch (error: any) {
        toast.error(error.message || "Failed to submit request")
    } finally {
        setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancellation & Refund Request</DialogTitle>
          <DialogDescription>
            Since this is a paid event, your cancellation requires admin approval for refund.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="reason">Reason for Cancellation</Label>
                <Textarea 
                    id="reason" 
                    placeholder="Why do you want to cancel?" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="upi">UPI ID (for Refund)</Label>
                <Input 
                    id="upi" 
                    placeholder="e.g. user@okhdfcbank" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Optional. We may contact you if not provided.</p>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="destructive" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Request
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
