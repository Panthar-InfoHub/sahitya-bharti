"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface EventRegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: any
  user: any // Current logic passes currentUserId, we might need to fetch user details or pass full user object. 
            // In event-card, we only have currentUserId. We should fetch user details here if not passed.
  onConfirm: () => void
}

export function EventRegistrationModal({ open, onOpenChange, event, user, onConfirm }: EventRegistrationModalProps) {
  const [loading, setLoading] = useState(false)
  const [fetchingUser, setFetchingUser] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  })

  // Fetch full user details when modal opens
  useEffect(() => {
    if (open && user?.id) {
        const fetchUserDetails = async () => {
            setFetchingUser(true)
            const supabase = createClient()
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()
            
            if (data) {
                setFormData({
                    full_name: data.full_name || "",
                    email: data.email || "",
                    phone_number: data.phone_number || "",
                    address: data.address || "",
                })
            }
            setFetchingUser(false)
        }
        fetchUserDetails()
    }
  }, [open, user?.id])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const supabase = createClient()
        
        // 1. Update User Profile
        const { error } = await supabase
            .from('users')
            .update({
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                address: formData.address,
                // Email is usually not editable directly or handled separately, but we can keep it read-only in UI
            })
            .eq('id', user.id)

        if (error) throw error

        // 2. Proceed to Payment/Join
        onConfirm()
        onOpenChange(false)

    } catch (error: any) {
        toast.error(error.message || "Failed to update details")
    } finally {
        setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>पंजीकरण विवरण (Registration Details)</DialogTitle>
          <DialogDescription>
            भुगतान करने से पहले कृपया अपने विवरण की पुष्टि करें। (Please confirm your details before proceeding to payment.)
          </DialogDescription>
        </DialogHeader>
        
        {fetchingUser ? (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="grid gap-4 py-3">
            {event.fee > 0 && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-2 mb-2">
                    <h3 className="font-bold text-lg text-primary mb-1">पंजीकरण शुल्क (Fee)</h3>
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-extrabold text-foreground">₹{(event.fee + event.fee * 0.025).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            (Base: ₹{event.fee} + GST @ 2.5%: ₹{(event.fee * 0.025).toFixed(2)})
                        </p>
                    </div>
                </div>
            )}
            <div className="grid gap-2">
                <Label htmlFor="full_name">पूरा नाम (Full Name)</Label>
                <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">ईमेल (Email)</Label>
                <Input
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="bg-muted"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone_number">फोन नंबर (Phone Number)</Label>
                <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder="+91..."
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="address">पता (Address)</Label>
                <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, State"
                />
            </div>
            
            <DialogFooter className="mt-4">
                 <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                    रद्द करें (Cancel)
                 </Button>
                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    पुष्टि करें और भुगतान करें (Confirm & Pay)
                </Button>
            </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
