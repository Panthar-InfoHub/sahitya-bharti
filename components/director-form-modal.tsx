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
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

interface Director {
  id?: string
  name: string
  name_hindi: string | null
  title: string
  title_hindi: string | null
  category: 'national' | 'international'
  photo_url: string | null
  bio: string | null
  bio_hindi: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  display_order: number
  is_active: boolean
}

interface DirectorFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  director: Director | null
  onSuccess: () => void
}

const emptyDirector: Director = {
  name: "",
  name_hindi: null,
  title: "",
  title_hindi: null,
  category: "national",
  photo_url: null,
  bio: null,
  bio_hindi: null,
  email: null,
  phone: null,
  linkedin_url: null,
  display_order: 0,
  is_active: true,
}

export function DirectorFormModal({ open, onOpenChange, director, onSuccess }: DirectorFormModalProps) {
  const [formData, setFormData] = useState<Director>(emptyDirector)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (director) {
      setFormData(director)
    } else {
      setFormData(emptyDirector)
    }
  }, [director, open])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `directors/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
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
      if (director?.id) {
        // Update existing
        const { error } = await supabase
          .from('directors')
          .update(formData)
          .eq('id', director.id)

        if (error) throw error
        toast.success("निदेशक सफलतापूर्वक अपडेट हुआ")
      } else {
        // Create new
        const { error } = await supabase
          .from('directors')
          .insert([formData])

        if (error) throw error
        toast.success("निदेशक सफलतापूर्वक बनाया गया")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to save director: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {director ? "निदेशक संपादित करें" : "नया निदेशक जोड़ें"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>फोटो</Label>
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

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>नाम (अंग्रेजी) *</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>नाम (हिंदी)</Label>
              <Input
                value={formData.name_hindi || ""}
                onChange={(e) => setFormData({ ...formData, name_hindi: e.target.value })}
              />
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>पद (अंग्रेजी) *</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>पद (हिंदी)</Label>
              <Input
                value={formData.title_hindi || ""}
                onChange={(e) => setFormData({ ...formData, title_hindi: e.target.value })}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>श्रेणी *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: 'national' | 'international') =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">राष्ट्रीय</SelectItem>
                <SelectItem value="international">अंतर्राष्ट्रीय</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>जीवनी (अंग्रेजी)</Label>
              <Textarea
                rows={4}
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>जीवनी (हिंदी)</Label>
              <Textarea
                rows={4}
                value={formData.bio_hindi || ""}
                onChange={(e) => setFormData({ ...formData, bio_hindi: e.target.value })}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                value={formData.linkedin_url || ""}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              />
            </div>
          </div>

          {/* Display Order & Active */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>प्रदर्शन क्रम</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>सक्रिय स्थिति</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, is_active: checked })}
                />
                <span className="text-sm">{formData.is_active ? "सक्रिय" : "निष्क्रिय"}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              रद्द करें
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {director ? "अपडेट करें" : "बनाएं"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
