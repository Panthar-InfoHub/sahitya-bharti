"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface Trustee {
  id?: string
  name: string
  description: string | null
  address: string | null
  email: string | null
  phone: string | null
  type: 'national' | 'international'
  photo_url: string | null
  display_order: number
  is_active: boolean
}

interface TrusteeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trustee: Trustee | null
  onSuccess: () => void
}

const emptyTrustee: Trustee = {
  name: "",
  description: null,
  address: null,
  email: null,
  phone: null,
  type: "national",
  photo_url: null,
  display_order: 0,
  is_active: true,
}

export function TrusteeFormModal({ open, onOpenChange, trustee, onSuccess }: TrusteeFormModalProps) {
  const [formData, setFormData] = useState<Trustee>(emptyTrustee)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (trustee) {
      setFormData(trustee)
    } else {
      setFormData(emptyTrustee)
    }
  }, [trustee, open])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `trustees/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setFormData({ ...formData, photo_url: publicUrl })
      toast.success("फोटो सफलतापूर्वक अपलोड हुई")
    } catch (error: any) {
      toast.error("Failed to upload photo: " + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      if (trustee?.id) {
        // Update existing
        const { error } = await supabase
          .from('trustees')
          .update(formData)
          .eq('id', trustee.id)

        if (error) throw error
        toast.success("ट्रस्टी सफलतापूर्वक अपडेट हुआ")
      } else {
        // Create new
        const { error } = await supabase
          .from('trustees')
          .insert([formData])

        if (error) throw error
        toast.success("ट्रस्टी सफलतापूर्वक बनाया गया")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to save trustee: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trustee ? "ट्रस्टी संपादित करें" : "नया ट्रस्टी जोड़ें"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>फोटो (Photo)</Label>
            <div className="flex items-center gap-4">
              {formData.photo_url && (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-muted-foreground mt-1">अपलोड हो रहा है...</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>नाम (Name) *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ट्रस्टी का पूरा नाम दर्ज करें"
            />
          </div>

          <div className="space-y-2">
            <Label>श्रेणी (Type) *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'national' | 'international') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">राष्ट्रीय (National)</SelectItem>
                <SelectItem value="international">अंतर्राष्ट्रीय (International)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>विवरण (Description)</Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ट्रस्टी के बारे में संक्षिप्त विवरण"
            />
          </div>
          
          <div className="space-y-2">
            <Label>पता (Address)</Label>
            <Input
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="शहर, राज्य, देश"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ईमेल (Email)</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>फोन (Phone)</Label>
              <Input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>प्रदर्शन क्रम (Display Order)</Label>
              <Input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
            <div className="space-y-2">
              <Label>सक्रिय स्थिति (Active Status)</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                />
                <span className="text-sm">{formData.is_active ? "सक्रिय" : "निष्क्रिय"}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              रद्द करें
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {trustee ? "अपडेट करें" : "बनाएं"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
