"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface EventModalProps {
  trigger: React.ReactNode
  eventToEdit?: any
}

export function EventModal({ trigger, eventToEdit }: EventModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Initial state based on eventToEdit
  const [formData, setFormData] = useState({
    title: eventToEdit?.title || "",
    description: eventToEdit?.description || "",
    location: eventToEdit?.location || "",
    seats: eventToEdit?.seats ? String(eventToEdit.seats) : "",
    fee: eventToEdit?.fee ? String(eventToEdit.fee) : "",
    prizes: eventToEdit?.prizes || "",
    rules: eventToEdit?.rules || "",
  })
  const [date, setDate] = useState<Date | undefined>(eventToEdit?.date ? new Date(eventToEdit.date) : new Date())
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
        toast.error("कृपया तारीख चुनें (Please select a date)")
        return
    }
    if (formData.seats && parseInt(formData.seats) < 0) {
        toast.error("सीटें नकारात्मक नहीं हो सकतीं (Seats cannot be negative)")
        return
    }
    if (formData.fee && parseFloat(formData.fee) < 0) {
        toast.error("शुल्क नकारात्मक नहीं हो सकता (Fee cannot be negative)")
        return
    }
    setSaving(true)
    
    try {
      const supabase = createClient()
      let imageUrl = eventToEdit?.image_url || null

      // Upload Image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const filePath = `event-${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, imageFile)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath)
            
        imageUrl = publicUrl
      }

      const eventData = {
          title: formData.title,
          description: formData.description,
          location: formData.location,
          date: date.toISOString(),
          seats: formData.seats ? parseInt(formData.seats) : null,
          fee: formData.fee ? parseFloat(formData.fee) : 0,
          prizes: formData.prizes,
          rules: formData.rules,
          image_url: imageUrl,
      }

      if (eventToEdit) {
          // Update
          const { error: updateError } = await supabase
            .from("events")
            .update(eventData)
            .eq("id", eventToEdit.id)
          
          if (updateError) throw updateError
          toast.success("कार्यक्रम अपडेट किया गया (Event updated!)")

      } else {
          // Insert
          const { error: insertError } = await supabase
            .from("events")
            .insert(eventData)
          
          if (insertError) throw insertError
          toast.success("कार्यक्रम सफलतापूर्वक बनाया गया (Event created!)")
      }

      setOpen(false)
      if (!eventToEdit) {
         setFormData({ title: "", description: "", location: "", seats: "", fee: "", prizes: "", rules: "" })
         setImageFile(null)
      }
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Operation failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {eventToEdit ? "कार्यक्रम संपादित करें (Edit Event)" : "नया कार्यक्रम जोड़ें (Add New Event)"}
          </DialogTitle>
          <DialogDescription>
            {eventToEdit ? "नीचे कार्यक्रम विवरण बदलें (Change event details below)." : "सदस्यों के शामिल होने के लिए एक नया कार्यक्रम बनाएं (Create a new event)."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Basic Info */}
                <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="title">कार्यक्रम का नाम (Event Title) *</Label>
                        <Input id="title" name="title" required value={formData.title} onChange={handleChange} placeholder="कार्यक्रम का नाम (Event Name)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">स्थान (Location) *</Label>
                        <Input id="location" name="location" required value={formData.location} onChange={handleChange} placeholder="स्थान / शहर (Venue / City)" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <Label>दिनांक (Date) *</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>तारीख चुनें (Pick a date)</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Column 2: Details */}
                <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="seats">कुल सीटें (Total Seats)</Label>
                        <Input id="seats" name="seats" type="number" min="0" value={formData.seats} onChange={handleChange} placeholder="उदाहरण: 100" />
                    </div>
                     <div className="space-y-2">
                         <Label htmlFor="fee">प्रवेश शुल्क (Entry Fee) (₹)</Label>
                         <Input id="fee" name="fee" type="number" min="0" value={formData.fee} onChange={handleChange} placeholder="0 (Free)" />
                     </div>
                    <div className="space-y-2">
                        <Label htmlFor="prizes">पुरस्कार (Prizes)</Label>
                        <Input id="prizes" name="prizes" value={formData.prizes} onChange={handleChange} placeholder="उदाहरण: प्रमाण पत्र, पदक..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="image">तस्वीर (Event Image)</Label>
                        <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} accept="image/*" />
                    </div>
                </div>

                {/* Column 3: Text Areas */}
                <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="rules">नियम (Rules)</Label>
                        <Textarea id="rules" name="rules" value={formData.rules} onChange={handleChange} placeholder="नियम..." className="h-20" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">विवरण (Description)</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="विवरण..." className="h-24" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={saving} size="lg">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {eventToEdit ? "अपडेट करें (Update)" : "कार्यक्रम बनाएं (Create Event)"}
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
