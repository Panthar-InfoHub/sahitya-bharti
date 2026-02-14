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
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

interface Director {
  id?: string
  name: string
  title: string
  category: 'national' | 'international'
  photo_url: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  display_order: number
  is_active: boolean
}

interface Position {
  id: string
  title: string
  title_hindi: string | null
  category: 'national' | 'international'
}

interface DirectorFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  director: Director | null
  onSuccess: () => void
}

const emptyDirector: Director = {
  name: "",
  title: "",
  category: "national",
  photo_url: null,
  bio: null,
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

  // Position Management
  const [positions, setPositions] = useState<Position[]>([])
  const [isAddingPosition, setIsAddingPosition] = useState(false)
  const [newPosition, setNewPosition] = useState({ title: "", title_hindi: "" })
  const [loadingPositions, setLoadingPositions] = useState(false)

  useEffect(() => {
    if (director) {
      setFormData(director)
    } else {
      setFormData(emptyDirector)
    }
    setIsAddingPosition(false)
    setNewPosition({ title: "", title_hindi: "" })
  }, [director, open])

  // Fetch positions when category changes or modal opens
  useEffect(() => {
    if (open) {
      fetchPositions(formData.category)
    }
  }, [formData.category, open])

  const fetchPositions = async (category: 'national' | 'international') => {
    setLoadingPositions(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('org_positions')
      .select('*')
      .eq('category', category)
      .order('title', { ascending: true })

    if (data) {
      setPositions(data)
    }
    setLoadingPositions(false)
  }

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
      // Handle logic for new position if in adding mode
      let finalTitle = formData.title

      if (isAddingPosition) {
        // Use title_hindi as the primary source since user removed English input
        const posTitle = newPosition.title_hindi || newPosition.title
        if (!posTitle) throw new Error("Please enter a position title")

        // Save new position - use the same value for both if one is missing
        const { error: posError } = await supabase
          .from('org_positions')
          .insert({
            title: posTitle, // Required field
            title_hindi: posTitle,
            category: formData.category
          })

        if (posError) throw posError

        finalTitle = posTitle
      }

      const directorData = {
        ...formData,
        title: finalTitle,
      }

      if (director?.id) {
        // Update existing
        const { error } = await supabase
          .from('directors')
          .update(directorData)
          .eq('id', director.id)

        if (error) throw error
        toast.success("निर्देशक सफलतापूर्वक अपडेट हुआ")
      } else {
        // Create new
        const { error } = await supabase
          .from('directors')
          .insert([directorData])

        if (error) throw error
        toast.success("निर्देशक सफलतापूर्वक बनाया गया")
      }

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Failed to save director: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePositionSelect = (value: string) => {
    if (value === "new") {
      setIsAddingPosition(true)
      setNewPosition({ title: "", title_hindi: "" })
    } else {
      const selectedPos = positions.find(p => p.id === value)
      if (selectedPos) {
        setFormData({
          ...formData,
          title: selectedPos.title
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {director ? "निर्देशक संपादित करें" : "नया निर्देशक जोड़ें"}
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
          <div className="space-y-2">
            <Label>नाम (Name)</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
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
                <SelectItem value="national">राष्ट्रीय (National)</SelectItem>
                <SelectItem value="international">अंतर्राष्ट्रीय (International)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Position Section */}
          <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">पद (Position) *</Label>
              {isAddingPosition && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingPosition(false)}
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" /> रद्द करें
                </Button>
              )}
            </div>

            {isAddingPosition ? (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label>नया पद</Label>
                  <Input
                    placeholder="Ex: अध्यक्ष"
                    value={newPosition.title_hindi}
                    onChange={(e) => setNewPosition({ ...newPosition, title_hindi: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Select
                  onValueChange={handlePositionSelect}
                  // Find ID of current title if it exists in positions, else empty (handled by finding match manually if needed)
                  value={positions.find(p => p.title === formData.title && p.category === formData.category)?.id}
                >
                  <SelectTrigger>
                    {/* Show Hindi title if available in position object, else just English title */}
                    <SelectValue placeholder={
                      formData.title
                        ? (positions.find(p => p.title === formData.title)?.title_hindi ? `${positions.find(p => p.title === formData.title)?.title_hindi} (${formData.title})` : formData.title)
                        : "पद चुनें (Select Position)"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.title_hindi ? `${pos.title_hindi} (${pos.title})` : pos.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="text-primary font-medium border-t mt-1">
                      <div className="flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        नया पद जोड़ें (Add New Position)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {/* Fallback - simple validation check */}
                {!formData.title && <p className="text-xs text-muted-foreground mt-1">Select a position from the list</p>}
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label>जीवनी (Bio)</Label>
            <Textarea
              rows={4}
              value={formData.bio || ""}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
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
