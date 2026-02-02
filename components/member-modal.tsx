"use client"

import { useEffect, useState } from "react"
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
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { Country } from "country-state-city"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { statesMock } from "@/mock/statesMock"

interface MemberModalProps {
  member?: any
  isOpen: boolean
  onClose: () => void
}

export function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  
  // Basic Info
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    nation: "India",
    state: "",
    city: "",
    position: "", // Will be selected from dropdown
  })

  // Location State
  const [selectedStateCode, setSelectedStateCode] = useState("")
  // Derived cities from mock
  const cities = statesMock.find(s => s.code === selectedStateCode)?.cities || []

  // Dynamic Positions State
  const [fetchingPositions, setFetchingPositions] = useState(false)
  const [availablePositions, setAvailablePositions] = useState<any[]>([])

  // Phone state
  const [phoneIso, setPhoneIso] = useState("IN")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countries] = useState(Country.getAllCountries())

  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // Reset or Load member data
    if (member) {
      setFormData({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        phone_number: "", // Parsed separately
        position: member.position || "",
        address: member.address || "",
        nation: member.nation || "India",
        state: member.state || "",
        city: member.city || "",
      })
      setAvatarUrl(member.profile_picture || null)

      // Initial State/City setup from Member data using Match logic
      // Note: DB stores English names. Mock has English names.
      const mockState = statesMock.find(s => s.nameEn === member.state)
      if (mockState) {
          setSelectedStateCode(mockState.code)
      }

      // Parse Phone
      if (member.phone_number) {
          const num = member.phone_number.replace(/^\+91/, "") // Simple parse for now assuming IN
          setPhoneNumber(num)
      }

    } else {
        // Reset defaults
        setFormData({
            first_name: "", last_name: "", email: "", phone_number: "",
            address: "", nation: "India", state: "", city: "", position: ""
        })
        setAvatarUrl(null)
        setPhoneNumber("")
        setSelectedStateCode("")
    }
  }, [member, isOpen])

  // Fetch Positions when City Changes
  useEffect(() => {
      const fetchPositions = async () => {
          if (!formData.state || !formData.city) {
              setAvailablePositions([])
              return
          }
          
          setFetchingPositions(true)
          const supabase = createClient()
          const { data } = await supabase
            .from('positions')
            .select('*')
            .eq('state', formData.state)
            .eq('city', formData.city)
            .order('name')
          
          setAvailablePositions(data || [])
          setFetchingPositions(false)
      }

      fetchPositions()
  }, [formData.state, formData.city])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStateChange = (code: string) => {
      setSelectedStateCode(code)
      const stateObj = statesMock.find(s => s.code === code)
      setFormData(prev => ({ 
          ...prev, 
          state: stateObj?.nameEn || "", 
          city: "", // Reset city
          position: "" // Reset position
      }))
  }

  const handleCityChange = (cityNameEn: string) => {
      setFormData(prev => ({ 
          ...prev, 
          city: cityNameEn,
          position: "" // Reset position
      }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files?.length) throw new Error("Select an image")

      const file = e.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${Math.random()}.${fileExt}`

      const supabase = createClient()
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success("Image uploaded")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Must be logged in")

      const memberData = {
        ...formData,
        phone_number: phoneNumber ? `+91${phoneNumber}` : "",
        profile_picture: avatarUrl,
        user_id: user.id
      }

      if (member) {
        const { error } = await supabase.from("members").update(memberData).eq("id", member.id)
        if (error) throw error
        toast.success("Updated successfully")
      } else {
        const { error } = await supabase.from("members").insert([memberData])
        if (error) throw error
        toast.success("Created successfully")
      }

      router.refresh()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Error saving")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "सदस्य संपादित करें (Edit)" : "नया सदस्य जोड़ें (Add New)"}</DialogTitle>
          <DialogDescription>
             विवरण भरें। पद चुनने के लिए पहले राज्य और शहर चुनें। (Fill details. Select State and City to choose Position.)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>पहला नाम (First Name) *</Label>
              <Input required name="first_name" value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>अंतिम नाम (Last Name) *</Label>
              <Input required name="last_name" value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>प्रोफाइल फोटो (Profile Picture)</Label>
            <div className="flex items-center gap-4">
                {avatarUrl && (
                    <img src={avatarUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
                )}
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label>ईमेल (Email)</Label>
               <Input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
               <Label>फोन (Phone)</Label>
               <div className="flex gap-2">
                   <div className="flex items-center justify-center border rounded-md px-3 bg-muted">+91</div>
                   <Input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone" />
               </div>
            </div>
          </div>

          <div className="space-y-2">
             <Label>पता (Address)</Label>
             <Input name="address" value={formData.address} onChange={handleChange} />
          </div>

          {/* Location & Position Logic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
            <div className="space-y-2">
               <Label>राज्य (State) *</Label>
               <Select value={selectedStateCode} onValueChange={handleStateChange}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                        {statesMock.map(s => (
                            <SelectItem key={s.code} value={s.code}>{s.nameHi} ({s.nameEn})</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
            </div>

             <div className="space-y-2">
               <Label>शहर (City) *</Label>
               <Select value={formData.city} onValueChange={handleCityChange} disabled={!selectedStateCode}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                        {cities.map(c => (
                            <SelectItem key={c.nameEn} value={c.nameEn}>{c.nameHi} ({c.nameEn})</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
            </div>

             <div className="space-y-2 col-span-1 sm:col-span-2">
               <Label className={!formData.city ? "text-muted-foreground" : ""}>
                   पद (Position) {!formData.city && "(Select City first)"} *
               </Label>
               <Select 
                    value={formData.position} 
                    onValueChange={(val) => setFormData(prev => ({...prev, position: val}))}
                    disabled={!formData.city || fetchingPositions}
               >
                    <SelectTrigger>
                        <SelectValue placeholder={fetchingPositions ? "Loading..." : "Select Position"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availablePositions.length > 0 ? availablePositions.map(p => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                        )) : (
                            <div className="p-2 text-sm text-center text-muted-foreground">
                                No positions found. Add one in "Manage Positions".
                            </div>
                        )}
                    </SelectContent>
               </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-2">
             <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
             <Button type="submit" disabled={saving}>
               {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Save
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
