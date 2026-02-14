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

  // Dynamic Data State
  const [allPositions, setAllPositions] = useState<any[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availablePositionNames, setAvailablePositionNames] = useState<string[]>([])

  const [loadingData, setLoadingData] = useState(false)

  // Phone state
  const [phoneIso, setPhoneIso] = useState("IN")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countries] = useState(Country.getAllCountries())

  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // New Position functionality
  const [isAddingPosition, setIsAddingPosition] = useState(false)
  const [newPositionName, setNewPositionName] = useState("")
  const [savingPosition, setSavingPosition] = useState(false)

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
      // Note: DB stores English names directly now

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
    }
  }, [member, isOpen])

  // Fetch all positions on mount/open
  useEffect(() => {
    if (!isOpen) return

    const fetchAllData = async () => {
        setLoadingData(true)
        const supabase = createClient()
        
        // Fetch domestic positions
        const { data: domestic } = await supabase.from('positions').select('*')
        
        // Fetch international positions
        const { data: international } = await supabase.from('international_positions').select('*')
        
        const combined = []
        if (domestic) {
            combined.push(...domestic.map(p => ({ ...p, country: 'India' }))) // Ensure country is set
        }
        if (international) {
            // Map title->name, and ensure country/city/state
            // international table: id, country, city, title
            combined.push(...international.map(p => ({
                ...p,
                name: p.title,
                state: null // No state for international
            })))
        }

        setAllPositions(combined)
        setLoadingData(false)
    }

    fetchAllData()
  }, [isOpen])

  // Filter States when Country changes (or init)
  useEffect(() => {
    if (!allPositions.length) return

    const selectedCountry = formData.nation
    
    if (selectedCountry === "India") {
        const countryPositions = allPositions.filter(p => (p.country || "India") === "India")
        const states = Array.from(new Set(countryPositions.map(p => p.state))).filter(Boolean).sort()
        setAvailableStates(states)
    } else {
        setAvailableStates([])
    }
  }, [formData.nation, allPositions])

  // Filter Cities when State (India) or Country (International) changes
  useEffect(() => {
    const selectedCountry = formData.nation
    
    if (selectedCountry === "India") {
        if (formData.state) {
            const statePositions = allPositions.filter(p => (p.country || "India") === "India" && p.state === formData.state)
            const cities = Array.from(new Set(statePositions.map(p => p.city))).sort()
            setAvailableCities(cities)
        } else {
            setAvailableCities([])
        }
    } else {
        // International: Cities come directly from filtered positions
        const countryPositions = allPositions.filter(p => p.country === selectedCountry)
        const cities = Array.from(new Set(countryPositions.map(p => p.city))).sort()
        setAvailableCities(cities)
    }
  }, [formData.nation, formData.state, allPositions])

  // Filter Positions when City changes
  useEffect(() => {
      const selectedCountry = formData.nation

      if (formData.city) {
          let validPositions = []
          if (selectedCountry === "India") {
             if (formData.state) {
                validPositions = allPositions.filter(p => (p.country || "India") === "India" && p.state === formData.state && p.city === formData.city)
             }
          } else {
             validPositions = allPositions.filter(p => p.country === selectedCountry && p.city === formData.city)
          }
          
          setAvailablePositionNames(validPositions.map(p => p.name).sort())
      } else {
          setAvailablePositionNames([])
      }
  }, [formData.nation, formData.state, formData.city, allPositions])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStateChange = (val: string) => {
      setFormData(prev => ({ 
          ...prev, 
          state: val, 
          city: "", // Reset city
          position: "" // Reset position
      }))
  }

  const handleCityChange = (val: string) => {
      setFormData(prev => ({ 
          ...prev, 
          city: val,
          position: "" // Reset position
      }))
  }

  const handlePositionSelect = (val: string) => {
      if (val === "new_position_action") {
          setIsAddingPosition(true)
          setNewPositionName("")
      } else {
          setFormData(prev => ({ ...prev, position: val }))
      }
  }


  const handleAddNewPosition = async () => {
      // Validate input based on country
      if (!newPositionName.trim() || !formData.city) return
      if (formData.nation === "India" && !formData.state) return
      
      setSavingPosition(true)
      try {
          const supabase = createClient()
          
          let newData = null

          if (formData.nation === "India") {
              // Insert into 'positions'
              const { data, error } = await supabase
                .from('positions')
                .insert({
                    state: formData.state,
                    city: formData.city,
                    name: newPositionName.trim()
                })
                .select()
                .single()
             
             if (error) throw error
             newData = { ...data, country: 'India' }
          } else {
              // Insert into 'international_positions'
              const { data, error } = await supabase
                .from('international_positions')
                .insert({
                    country: formData.nation,
                    city: formData.city,
                    title: newPositionName.trim()
                })
                .select()
                .single()
             
             if (error) throw error
             // Map title -> name for local state
             newData = { ...data, name: data.title, state: null }
          }

          // Update local list
          if (newData) {
              setAllPositions(prev => [...prev, newData])
              // Select it
              setFormData(prev => ({ ...prev, position: newData.name }))
              setIsAddingPosition(false)
              toast.success("New position added")
          }
      } catch (error: any) {
          toast.error(error.message || "Failed to add position")
      } finally {
          setSavingPosition(false)
      }
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
               <Label>देश (Country) *</Label>
               <Select value={formData.nation} onValueChange={(val) => {
                   setFormData({ ...formData, nation: val, state: "", city: "", position: "" })
               }}>
                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent>
                        {countries.map(c => (
                            <SelectItem key={c.isoCode} value={c.name}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
            </div>
            
            {formData.nation === "India" && (
                <div className="space-y-2">
                   <Label>राज्य (State) *</Label>
                   <Select value={formData.state} onValueChange={handleStateChange} disabled={loadingData}>
                        <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                        <SelectContent>
                            {availableStates.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                   </Select>
                </div>
            )}

            <div className="space-y-2">
               <Label>शहर (City) *</Label>
               <Select value={formData.city} onValueChange={handleCityChange} disabled={formData.nation === "India" && !formData.state}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                        {availableCities.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
               </Select>
            </div>

             <div className="space-y-4 col-span-1 sm:col-span-2 bg-slate-50 p-3 rounded-md border">
               <div className="flex items-center justify-between">
                 <Label className={!formData.city ? "text-muted-foreground" : "font-semibold"}>
                     पद (Position) {!formData.city && "(Select City first)"} *
                 </Label>
                 {isAddingPosition && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsAddingPosition(false)}
                      className="h-8 px-2 text-destructive hover:text-destructive"
                    >
                      Cancel
                    </Button>
                 )}
               </div>

               {isAddingPosition ? (
                  <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                      <Input 
                        placeholder="Enter new position name" 
                        value={newPositionName}
                        onChange={(e) => setNewPositionName(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        size="sm"
                        onClick={handleAddNewPosition}
                        disabled={!newPositionName.trim() || savingPosition}
                      >
                        {savingPosition ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                      </Button>
                  </div>
               ) : (
                   <Select 
                        value={formData.position} 
                        onValueChange={handlePositionSelect}
                        disabled={!formData.city}
                   >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Position" />
                        </SelectTrigger>
                        <SelectContent>
                            {availablePositionNames.length > 0 ? availablePositionNames.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            )) : (
                                <div className="p-2 text-sm text-center text-muted-foreground">
                                    No positions found.
                                </div>
                            )}
                            <SelectItem value="new_position_action" className="text-primary font-medium border-t mt-1 sticky bottom-0 bg-white">
                                <div className="flex items-center">
                                    <span className="mr-2">+</span> Add New Position
                                </div>
                            </SelectItem>
                        </SelectContent>
                   </Select>
               )}
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
