"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { statesMock } from "@/mock/statesMock"

interface PositionManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function PositionManager({ isOpen, onClose }: PositionManagerProps) {
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
      // Match English names as stored in DB
      const stateName = selectedState?.nameEn // e.g. "Delhi"
      const cityName = cities.find(c => c.nameEn === selectedCityName)?.nameEn // e.g. "New Delhi"
      
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
          if (error.code === '23505') { // Unique violation
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>पद प्रबंधन (Manage Positions)</DialogTitle>
          <DialogDescription>
            किसी विशिष्ट शहर के लिए नए पद जोड़ें (Add new positions for a specific city)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            {/* Location Selectors */}
            <div className="grid grid-cols-1 gap-4">
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
            </div>

            {/* Add Position Form */}
            {selectedCityName && (
                <form onSubmit={handleAddPosition} className="flex gap-2 items-end pt-4 border-t">
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="position">नया पद (New Position)</Label>
                        <Input 
                            id="position" 
                            placeholder="e.g. Secretary" 
                            value={newPosition}
                            onChange={(e) => setNewPosition(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={loading || !newPosition.trim()}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    </Button>
                </form>
            )}

            {/* Positions List */}
            <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto">
                <Label>मौजूदा पद (Existing Positions)</Label>
                {fetching ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                ) : positions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">इस शहर के लिए अभी कोई पद नहीं है (No positions yet)</p>
                ) : (
                    <div className="space-y-1">
                        {positions.map(pos => (
                            <div key={pos.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
                                <span>{pos.name}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDelete(pos.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
