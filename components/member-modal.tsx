"use client"

import { useEffect, useState, useMemo } from "react"
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
import { Country, State, City, type ICity } from "country-state-city"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    nation_code: "IN",
    state: "",
    state_code: "",
    city: "",
    position: "", 
  })

  const [allPositions, setAllPositions] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countries] = useState(Country.getAllCountries())

  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  // Custom location fields
  const [customNation, setCustomNation] = useState("")
  const [customState, setCustomState] = useState("")
  const [customCity, setCustomCity] = useState("")

  // Location arrays based on current selection
  const availableStates = useMemo(() => formData.nation_code ? State.getStatesOfCountry(formData.nation_code) : [], [formData.nation_code])
  const availableCities = useMemo(() => {
    let rawCities: ICity[] = []
    if (formData.nation_code && formData.state_code) {
      rawCities = City.getCitiesOfState(formData.nation_code, formData.state_code)
    } else if (formData.nation_code) {
      rawCities = City.getCitiesOfCountry(formData.nation_code) || []
    }
    
    // Deduplicate cities by name
    const uniqueCities = new Map()
    for (const city of rawCities) {
        if (!uniqueCities.has(city.name)) {
            uniqueCities.set(city.name, city)
        }
    }
    return Array.from(uniqueCities.values())
  }, [formData.nation_code, formData.state_code])

  useEffect(() => {
    if (member) {
      setFormData({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        phone_number: "", 
        position: member.position || "",
        address: member.address || "",
        nation: member.nation || "India",
        nation_code: "IN", // Assuming IN for existing for now
        state: member.state || "",
        state_code: "",
        city: member.city || "",
      })
      setAvatarUrl(member.profile_picture || null)

      if (member.phone_number) {
          const num = member.phone_number.replace(/^\+91/, "") 
          setPhoneNumber(num)
      }

    } else {
        setFormData({
            first_name: "", last_name: "", email: "", phone_number: "",
            address: "", nation: "India", nation_code: "IN", state: "", state_code: "", city: "", position: ""
        })
        setAvatarUrl(null)
        setPhoneNumber("")
        setCustomNation("")
        setCustomState("")
        setCustomCity("")
    }
  }, [member, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const fetchAllData = async () => {
        setLoadingData(true)
        const supabase = createClient()
        const { data } = await supabase.from('positions').select('*').order('name')
        setAllPositions(data || [])
        setLoadingData(false)
    }

    fetchAllData()
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (countryName: string) => {
    if (countryName === "other") {
        setFormData({ 
            ...formData, 
            nation: "other", 
            nation_code: "", 
            state: "other", // default to other state
            state_code: "", 
            city: "other"  // default to other city
        })
        return
    }

    const country = countries.find(c => c.name === countryName)
    setFormData({ 
      ...formData, 
      nation: countryName, 
      nation_code: country?.isoCode || "", 
      state: "", 
      state_code: "", 
      city: "" 
    })
  }

  const handleStateChange = (stateName: string) => {
    if (stateName === "other") {
        setFormData({ ...formData, state: "other", state_code: "", city: "other" })
        return
    }

    const stateObj = availableStates.find(s => s.name === stateName)
    setFormData({ 
      ...formData, 
      state: stateName, 
      state_code: stateObj?.isoCode || "", 
      city: "" 
    })
  }

  const handleCityChange = (cityName: string) => {
    setFormData({ ...formData, city: cityName })
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

      const finalNation = formData.nation === "other" ? customNation : formData.nation
      const finalState = formData.state === "other" ? customState : formData.state
      const finalCity = formData.city === "other" ? customCity : formData.city

      const memberData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: phoneNumber ? `+91${phoneNumber}` : "",
        address: formData.address,
        nation: finalNation,
        state: finalState,
        city: finalCity,
        position: formData.position,
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
             विवरण भरें। (Fill out member details.)
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
               <Select value={formData.nation} onValueChange={handleCountryChange}>
                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent>
                        {countries.map(c => (
                            <SelectItem key={c.isoCode} value={c.name}>{c.name}</SelectItem>
                        ))}
                        <SelectItem value="other" className="font-semibold text-primary">Other (Manual Entry)</SelectItem>
                    </SelectContent>
               </Select>
               {formData.nation === "other" && (
                   <Input 
                       placeholder="Enter Country Name" 
                       value={customNation}
                       onChange={e => setCustomNation(e.target.value)}
                       required
                       className="mt-2"
                   />
               )}
            </div>
            
            <div className="space-y-2">
                <Label>राज्य (State) *</Label>
                <Select value={formData.state} onValueChange={handleStateChange} disabled={formData.nation !== "other" && !availableStates.length}>
                    <SelectTrigger><SelectValue placeholder="Select State" /></SelectTrigger>
                    <SelectContent>
                        {availableStates.map((s, idx) => (
                            <SelectItem key={`${s.name}-${idx}`} value={s.name}>{s.name}</SelectItem>
                        ))}
                        <SelectItem value="other" className="font-semibold text-primary">Other (Manual Entry)</SelectItem>
                    </SelectContent>
                </Select>
                {formData.state === "other" && (
                   <Input 
                       placeholder="Enter State Name" 
                       value={customState}
                       onChange={e => setCustomState(e.target.value)}
                       required
                       className="mt-2"
                   />
               )}
            </div>

            <div className="space-y-2">
               <Label>शहर (City) *</Label>
               <Select value={formData.city} onValueChange={handleCityChange} disabled={formData.state !== "other" && formData.nation !== "other" && !availableCities.length}>
                    <SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger>
                    <SelectContent>
                        {availableCities.map((c, idx) => (
                            <SelectItem key={`${c.name}-${idx}`} value={c.name}>{c.name}</SelectItem>
                        ))}
                        <SelectItem value="other" className="font-semibold text-primary">Other (Manual Entry)</SelectItem>
                    </SelectContent>
               </Select>
               {formData.city === "other" && (
                   <Input 
                       placeholder="Enter City Name" 
                       value={customCity}
                       onChange={e => setCustomCity(e.target.value)}
                       required
                       className="mt-2"
                   />
               )}
            </div>

             <div className="space-y-4">
                 <Label>पद (Position) *</Label>
                 <Select 
                      value={formData.position} 
                      onValueChange={(val) => setFormData({...formData, position: val})}
                 >
                      <SelectTrigger>
                          <SelectValue placeholder={loadingData ? "Loading..." : "Select Position"} />
                      </SelectTrigger>
                      <SelectContent>
                          {allPositions.length > 0 ? allPositions.map(p => (
                              <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                          )) : (
                              <div className="p-2 text-sm text-center text-muted-foreground">
                                  No positions found.
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
