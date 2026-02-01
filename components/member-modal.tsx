
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
import { Country, State, City } from "country-state-city"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { statesMock } from "@/mock/statesMock"
import { transliterateText } from "@/lib/transliterate"

interface MemberModalProps {
  member?: any
  isOpen: boolean
  onClose: () => void
}

export function MemberModal({ member, isOpen, onClose }: MemberModalProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    position: "",
    address: "",
    nation: "India", // Default
    state: "",
    city: "",
  })

  // Location State
  const [countries, setCountries] = useState<any[]>([])
  const [states, setStates] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])

  
  const [selectedCountryCode, setSelectedCountryCode] = useState("IN")
  const [selectedStateCode, setSelectedStateCode] = useState("")

  const [transliteratedCities, setTransliteratedCities] = useState<Record<string, string>>({})

  useEffect(() => {
    if (selectedStateCode) {
      // Dynamic Transliteration for cities not in mock
      const stateCities = City.getCitiesOfState("IN", selectedStateCode);
      
      const mockState = statesMock.find(s => s.code === selectedStateCode);
      const citiesToTransliterate = stateCities.filter(city => {
          // Check if it exists in mock with a rigorous match
          const hasMock = mockState?.cities.some(c => {
             const dbName = city.name.toLowerCase();
             const mockName = c.nameEn.toLowerCase();
             // Only skip if we have a very confident match
             return dbName === mockName; 
          });
          
          // If we already have a translation in state, skip
          if (transliteratedCities[city.name]) return false;
          
          return !hasMock;
      }).map(c => c.name);

      if (citiesToTransliterate.length > 0) {
          transliterateText(citiesToTransliterate).then(result => {
              setTransliteratedCities(prev => ({...prev, ...result}));
          });
      }
    }
  }, [selectedStateCode])

  // Phone state
  const [phoneIso, setPhoneIso] = useState("IN")
  const [phoneNumber, setPhoneNumber] = useState("")

  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    // Initial load of countries
    setCountries(Country.getAllCountries())
  }, [])

  useEffect(() => {
    // When member is loaded for edit
    if (member) {
      setFormData({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        phone_number: "", 
        position: member.position || "",
        address: member.address || "",
        nation: member.nation || "India",
        state: member.state || "",
        city: member.city || "",
      })
      setAvatarUrl(member.profile_picture || null)

      // ... (rest of phone/location parsing) remains same ...


      // Handle Phone Number Parsing
      if (member.phone_number) {
          // Try to match phone number with a country code
          if (member.phone_number.startsWith("+")) {
             // Find all matching countries
             const potentialCountries = Country.getAllCountries().filter(c => 
                member.phone_number.startsWith(`+${c.phonecode}`)
             )
             
             // If matches found, try to prefer the selected nation, otherwise pick the longest match (to avoid partial matches like +1 vs +1246) or first one
             if (potentialCountries.length > 0) {
                 // Sort by length of phonecode descending to match longest code first (e.g. match +1246 before +1)
                 potentialCountries.sort((a, b) => b.phonecode.length - a.phonecode.length)
                 
                 const nationCountry = potentialCountries.find(c => c.name === (member.nation || "India"))
                 const bestMatch = nationCountry || potentialCountries[0]
                 
                 setPhoneIso(bestMatch.isoCode)
                 setPhoneNumber(member.phone_number.replace(`+${bestMatch.phonecode}`, ""))
             } else {
                 setPhoneNumber(member.phone_number)
             }
          } else {
              setPhoneNumber(member.phone_number)
          }
      } else {
        setPhoneNumber("")
      }
      
      // Try to find codes to populate dropdowns correctly (Location)
      const country = Country.getAllCountries().find(c => c.name === (member.nation || "India"))
      if (country) {
          setSelectedCountryCode(country.isoCode)
          const countryStates = State.getStatesOfCountry(country.isoCode)
          setStates(countryStates)
          
          if (member.state) {
             const state = countryStates.find(s => s.name === member.state)
             if (state) {
                 setSelectedStateCode(state.isoCode)
                 setCities(City.getCitiesOfState(country.isoCode, state.isoCode))
             }
          }
          
           // Also sync phone code if member didn't have one
          if (!member.phone_number) {
             setPhoneIso(country.isoCode)
          }
      }

    } else {
        // Reset form for new member
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        position: "",
        address: "",
        nation: "India",
        state: "",
        city: "",
      })
      setPhoneNumber("")
      setSelectedCountryCode("IN")
      setPhoneIso("IN")
      setStates(State.getStatesOfCountry("IN"))
      setSelectedStateCode("")
      setCities([])
    }
  }, [member, isOpen])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (isoCode: string) => {
      const country = Country.getCountryByCode(isoCode)
      setSelectedCountryCode(isoCode)
      // Sync phone ISO with location country
      setPhoneIso(isoCode)
      setStates(State.getStatesOfCountry(isoCode))
      setCities([])
      setSelectedStateCode("")
      setFormData(prev => ({ ...prev, nation: country?.name || "", state: "", city: "" }))
  }

  const handleStateChange = (isoCode: string) => {
      const state = State.getStateByCodeAndCountry(isoCode, selectedCountryCode)
      setSelectedStateCode(isoCode)
      setCities(City.getCitiesOfState(selectedCountryCode, isoCode))
      setFormData(prev => ({ ...prev, state: state?.name || "", city: "" }))
  }

  const handleCityChange = (cityName: string) => {
      setFormData(prev => ({ ...prev, city: cityName }))
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = e.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${Math.random()}.${fileExt}`

      const supabase = createClient()
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)
      setAvatarUrl(data.publicUrl)
      toast.success("Image uploaded successfully")
    } catch (error: any) {
      toast.error(error.message || "Error uploading image")
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
      
      if (!user) {
        throw new Error("You must be logged in to manage members")
      }

      const selectedPhoneCountry = Country.getCountryByCode(phoneIso)
      const phoneCode = selectedPhoneCountry?.phonecode || "91"

      const memberData = {
        ...formData,
        phone_number: phoneNumber ? `+${phoneCode}${phoneNumber}` : "",
        profile_picture: avatarUrl,
        user_id: user.id
      }

      if (member) {
        const { error } = await supabase
          .from("members")
          .update(memberData)
          .eq("id", member.id)
        if (error) throw error
        toast.success("Member updated successfully")
      } else {
        const { error } = await supabase
          .from("members")
          .insert([memberData])
        if (error) throw error
        toast.success("Member created successfully")
      }

      router.refresh()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Error saving member")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "सदस्य संपादित करें (Edit Member)" : "नया सदस्य जोड़ें (Add New Member)"}</DialogTitle>
          <DialogDescription>
            सदस्य का विवरण भरें (Fill in the member details)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">पहला नाम (First Name) *</Label>
              <Input required id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">अंतिम नाम (Last Name) *</Label>
              <Input required id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile_picture">प्रोफाइल फोटो (Profile Picture)</Label>
            <div className="flex items-center gap-4">
                {avatarUrl && (
                    <img src={avatarUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
                )}
                <Input 
                    id="profile_picture" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                />
                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल (Email)</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">फोन नंबर (Phone)</Label>
              <div className="flex gap-2">
                <Select 
                  value={phoneIso} 
                  onValueChange={setPhoneIso}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>+{country.phonecode}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  id="phone_number" 
                  name="phone_number" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="1234567890"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">पद (Position)</Label>
            <Input id="position" name="position" value={formData.position} onChange={handleChange} placeholder="e.g. Secretary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">पता (Address)</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>

          {/* Location Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>राष्ट्र (Nation)</Label>
              <Select value={selectedCountryCode} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label>राज्य (State)</Label>
               <Select value={selectedStateCode} onValueChange={handleStateChange} disabled={!selectedCountryCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => {
                    const mockState = statesMock.find(s => s.code === state.isoCode);
                    const displayName = mockState ? `${mockState.nameHi} (${state.name})` : state.name;
                    return (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {displayName}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

           <div className="space-y-2">
              <Label>शहर (City)</Label>
               <Select value={formData.city} onValueChange={handleCityChange} disabled={!selectedStateCode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => {
                    const mockState = statesMock.find(s => s.code === selectedStateCode);
                    // Robust matching: Check exact match OR if one contains the other (e.g. "Prayagraj" matching "Prayagraj (Allahabad)")
                    const mockCity = mockState?.cities.find(c => {
                        const dbName = city.name.toLowerCase();
                        const mockName = c.nameEn.toLowerCase();
                        return dbName === mockName || dbName.includes(mockName) || mockName.includes(dbName);
                    });
                    
                    const dynamicHindi = transliteratedCities[city.name];
                    const displayName = mockCity 
                        ? `${mockCity.nameHi} (${city.name})` 
                        : dynamicHindi 
                            ? `${dynamicHindi} (${city.name})`
                            : city.name;
                    
                    return (
                      <SelectItem key={city.name} value={city.name}>
                        {displayName}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

          <div className="flex justify-end pt-4 gap-2">
             <Button type="button" variant="outline" onClick={onClose}>
              रद्द करें (Cancel)
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {member ? "अपडेट करें (Update)" : "सहेजें (Save)"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
