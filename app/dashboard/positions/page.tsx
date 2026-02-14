"use client"



import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, MapPin, Globe } from "lucide-react"
import { toast } from "sonner"
import { Country, City }  from "country-state-city"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { statesMock } from "@/mock/statesMock"

export default function DashboardPositionsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  
  // Mode: specific to India with States vs International (Country -> City)
  const [isInternational, setIsInternational] = useState(false)

  // India Mode
  const [selectedStateCode, setSelectedStateCode] = useState("")
  
  // International Mode
  const [selectedCountryCode, setSelectedCountryCode] = useState("")

  // Common
  const [selectedCityName, setSelectedCityName] = useState("")
  const [customCityName, setCustomCityName] = useState("") // Manual entry
  const [newPosition, setNewPosition] = useState("")
  
  const [positions, setPositions] = useState<any[]>([])

  // Derived state
  const selectedState = isInternational ? null : statesMock.find(s => s.code === selectedStateCode)
  const selectedCountry = isInternational ? Country.getCountryByCode(selectedCountryCode) : Country.getCountryByCode("IN")
  
  // Cities logic - memoized to prevent re-calculation on every render
  const cities = useMemo(() => {
    if (isInternational && selectedCountryCode) {
        const allCities = City.getCitiesOfCountry(selectedCountryCode) || []
        // Deduplicate by name and Sort
        return Array.from(new Map(allCities.map(item => [item.name, item])).values())
                    .sort((a, b) => a.name.localeCompare(b.name))
    } else if (!isInternational && selectedStateCode) {
        return selectedState?.cities || []
    }
    return []
  }, [isInternational, selectedCountryCode, selectedStateCode, selectedState])

  // Derived logic
  // If "other" is selected, we rely on customCityName. 
  // Otherwise we try to match the selectedCityName to the mock
  // The mock uses 'nameEn' as value.
  const effectiveCityName = selectedCityName === "other" ? customCityName.trim() : selectedCityName

  useEffect(() => {
    // Reset selections when toggling mode
    setSelectedStateCode("")
    setSelectedCountryCode("")
    setSelectedCityName("")
    setCustomCityName("")
    setPositions([])
  }, [isInternational])

  useEffect(() => {
    if ((isInternational ? selectedCountryCode : selectedStateCode) && effectiveCityName) {
      fetchPositions()
    } else {
        setPositions([])
    }
  }, [selectedStateCode, selectedCountryCode, effectiveCityName, isInternational])


  const fetchPositions = async () => {
      setFetching(true)
      const supabase = createClient()
      
      const countryName = isInternational ? selectedCountry?.name : "India"
      const stateName = isInternational ? "" : selectedState?.nameEn
      const cityName = effectiveCityName
      
      if (!cityName) {
          setFetching(false)
          return
      }

      if (isInternational) {
         // International: fetch from international_positions
         const { data, error } = await supabase
            .from('international_positions')
            .select('*')
            .eq('country', countryName)
            .eq('city', cityName)
            //.order('title', { ascending: true }) // Using title
         
         if (error) {
            console.error(error)
            toast.error("Failed to load positions")
            setPositions([])
        } else {
            // Map title -> name for UI consistency
            setPositions(data ? data.map(d => ({ ...d, name: d.title })) : [])
        }
      } else {
         // Domestic: fetch from positions
         let query = supabase
            .from('positions')
            .select('*')
            .eq('city', cityName)
            .order('name') // valid for positions table

         if (stateName) query = query.eq('state', stateName)

         const { data, error } = await query
      
          if (error) {
              console.error(error)
              toast.error("Failed to load positions")
              setPositions([])
          } else {
              setPositions(data || [])
          }
      }
      setFetching(false)
  }

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!isInternational && !selectedStateCode) || (isInternational && !selectedCountryCode) || !selectedCityName || !newPosition.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const countryName = isInternational ? selectedCountry?.name : "India"
      const stateName = isInternational ? null : selectedState?.nameEn
      const cityName = effectiveCityName

      if (!cityName) throw new Error("Invalid location selection")

      if (isInternational) {
          const payload = {
              country: countryName,
              city: cityName,
              title: newPosition.trim()
          }
          
          const { error } = await supabase
            .from('international_positions')
            .insert(payload)

          if (error) throw error
      } else {
          const payload: any = {
              city: cityName,
              name: newPosition.trim(),
              state: stateName
          }

          const { error } = await supabase
            .from('positions')
            .insert(payload)

          if (error) {
              if (error.code === '23505') {
                  throw new Error("This position already exists for this city")
              }
              throw error
          }
      }

      toast.success("Position added successfully")
      setNewPosition("")
      fetchPositions()
    } catch (error: any) {
      toast.error(error.message || "Error adding position")
    } finally {
      setLoading(false)
    }
  }


  const handleDeletePosition = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    setLoading(true)
    try {
      const supabase = createClient()
      
      if (isInternational) {
         const { error } = await supabase
            .from('international_positions')
            .delete()
            .eq('id', id)
         if (error) throw error
      } else {
         const { error } = await supabase
           .from('positions')
           .delete()
           .eq('id', id)
         if (error) throw error
      }

      toast.success("Position deleted successfully")
      fetchPositions()
    } catch (error: any) {
      toast.error(error.message || "Error deleting position")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-3xl font-bold tracking-tight">पद (Positions)</h1>
          <p className="text-muted-foreground">
             विशिष्ट शहरों के लिए पदों का प्रबंधन करें (Manage designations)
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Controls Card */}
          <Card className="md:col-span-1 lg:col-span-1 h-fit">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        {isInternational ? <Globe className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
                        स्थान चुनें (Select Location)
                      </div>
                      <div className="flex items-center gap-2 text-sm font-normal">
                          <Switch checked={isInternational} onCheckedChange={setIsInternational} id="mode-switch" />
                          <Label htmlFor="mode-switch" className="cursor-pointer">International</Label>
                      </div>
                  </CardTitle>
                  <CardDescription>
                      {isInternational ? "अंतरराष्ट्रीय पदों के लिए देश और शहर चुनें" : "पदों का प्रबंधन करने के लिए शहर चुनें"}
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {!isInternational ? (
                      <div className="space-y-2">
                            <Label>राज्य (State)</Label>
                            <Select value={selectedStateCode} onValueChange={value => {
                                setSelectedStateCode(value)
                                setSelectedCityName("")
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statesMock.map(s => (
                                        <SelectItem key={s.code} value={s.code}>
                                            {s.nameHi} ({s.nameEn})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                  ) : (
                      <div className="space-y-2">
                            <Label>देश (Country)</Label>
                            <Select value={selectedCountryCode} onValueChange={value => {
                                setSelectedCountryCode(value)
                                setSelectedCityName("")
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Country.getAllCountries().map(c => (
                                        <SelectItem key={c.isoCode} value={c.isoCode}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                  )}

                    <div className="space-y-2">
                        <Label>शहर (City)</Label>
                        <Select value={selectedCityName} onValueChange={setSelectedCityName} disabled={!isInternational && !selectedStateCode || isInternational && !selectedCountryCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((c: any) => {
                                    const name = c.name || c.nameEn
                                    const label = c.nameHi ? `${c.nameHi} (${c.nameEn})` : c.name
                                    return (
                                        <SelectItem key={name} value={name}>
                                            {label}
                                        </SelectItem>
                                    )
                                })}
                                <SelectItem value="other" className="font-semibold text-primary">
                                    अन्य (Other / Manual Entry)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {selectedCityName === "other" && (
                            <div className="pt-2 animate-in fade-in slide-in-from-top-1">
                                <Label className="text-xs text-muted-foreground pb-1 block">City Name (Manual)</Label>
                                <Input 
                                    placeholder="Enter city name..." 
                                    value={customCityName}
                                    onChange={(e) => setCustomCityName(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
              </CardContent>
          </Card>

          {/* List & Add Card */}
          <Card className="md:col-span-1 lg:col-span-2">
              <CardHeader>
                  <CardTitle>पदों का प्रबंधन (Manage Positions)</CardTitle>
                  <CardDescription>
                      {effectiveCityName ? `${effectiveCityName} में पद` : "शहर चुनें (Select a city)"}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {!effectiveCityName ? (
                      <div className="h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                          शुरू करने के लिए स्थान चुनें (Select location)
                      </div>
                  ) : (
                      <div className="space-y-6">
                           {/* Add Form */}
                           <form onSubmit={handleAddPosition} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="position" className="text-secondary-foreground font-semibold">नया पद जोड़ें (Add Position)</Label>
                                    <Input 
                                        id="position" 
                                        placeholder="e.g. District President" 
                                        value={newPosition}
                                        onChange={(e) => setNewPosition(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                                <Button type="submit" disabled={loading || !newPosition.trim()}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                    Add
                                </Button>
                            </form>

                            {/* List */}
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm text-muted-foreground">Existing Positions</h3>
                                {fetching ? (
                                    <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                                ) : positions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No positions defined for this city yet.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {positions.map(pos => (
                                        <div key={pos.id} className="flex items-center justify-between p-3 rounded-md border bg-white hover:bg-slate-50 transition-colors">
                                                <span className="font-medium">{pos.name}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeletePosition(pos.id, pos.name)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
