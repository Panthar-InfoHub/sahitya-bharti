"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, MapPin } from "lucide-react"
import { toast } from "sonner"
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
import { statesMock } from "@/mock/statesMock"

export default function DashboardPositionsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  
  const [selectedStateCode, setSelectedStateCode] = useState("")
  const [selectedCityName, setSelectedCityName] = useState("")
  const [newPosition, setNewPosition] = useState("")
  
  const [positions, setPositions] = useState<any[]>([])

  // Derived state
  const selectedState = statesMock.find(s => s.code === selectedStateCode)
  const cities = selectedState?.cities || []

  useEffect(() => {
    if (selectedStateCode && selectedCityName) {
      fetchPositions()
    } else {
        setPositions([])
    }
  }, [selectedStateCode, selectedCityName])

  const fetchPositions = async () => {
      setFetching(true)
      const supabase = createClient()
      const stateName = selectedState?.nameEn
      const cityName = cities.find(c => c.nameEn === selectedCityName)?.nameEn
      
      if (!stateName || !cityName) {
          setFetching(false)
          return
      }

      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('state', stateName)
        .eq('city', cityName)
        .order('name')
      
      if (error) {
          console.error(error)
          toast.error("Failed to load positions")
      } else {
          setPositions(data || [])
      }
      setFetching(false)
  }

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStateCode || !selectedCityName || !newPosition.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const stateName = selectedState?.nameEn
      const cityName = cities.find(c => c.nameEn === selectedCityName)?.nameEn

      if (!stateName || !cityName) throw new Error("Invalid location selection")

      const { error } = await supabase
        .from('positions')
        .insert({
            state: stateName,
            city: cityName,
            name: newPosition.trim()
        })

      if (error) {
          if (error.code === '23505') {
              throw new Error("This position already exists for this city")
          }
          throw error
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

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this position?")) return
      
      const supabase = createClient()
      const { error } = await supabase.from('positions').delete().eq('id', id)
      
      if (error) {
          toast.error("Failed to delete position")
      } else {
          toast.success("Position deleted")
          fetchPositions()
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
                      <MapPin className="h-5 w-5 text-primary" />
                      स्थान चुनें (Select Location)
                  </CardTitle>
                  <CardDescription>पदों का प्रबंधन करने के लिए शहर चुनें</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                    <div className="space-y-2">
                        <Label>शहर (City)</Label>
                        <Select value={selectedCityName} onValueChange={setSelectedCityName} disabled={!selectedStateCode}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select City" />
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map(c => (
                                    <SelectItem key={c.nameEn} value={c.nameEn}>
                                        {c.nameHi} ({c.nameEn})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
              </CardContent>
          </Card>

          {/* List & Add Card */}
          <Card className="md:col-span-1 lg:col-span-2">
              <CardHeader>
                  <CardTitle>पदों का प्रबंधन (Manage Positions)</CardTitle>
                  <CardDescription>
                      {selectedCityName ? `${selectedCityName} में पद` : "शहर चुनें (Select a city)"}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {!selectedCityName ? (
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
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(pos.id)}>
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
