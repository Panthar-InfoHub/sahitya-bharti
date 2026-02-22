"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function DashboardPositionsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [newPosition, setNewPosition] = useState("")
  const [positions, setPositions] = useState<any[]>([])

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    setFetching(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('positions')
      .select('*')
      .order('name')

    if (error) {
        console.error(error)
        toast.error("Failed to load positions")
        setPositions([])
    } else {
        setPositions(data || [])
    }
    setFetching(false)
  }

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPosition.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const payload = {
          name: newPosition.trim(),
      }

      const { error } = await supabase
        .from('positions')
        .insert(payload)

      if (error) {
          if (error.code === '23505') {
              throw new Error("This position already exists")
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

  const handleDeletePosition = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
         .from('positions')
         .delete()
         .eq('id', id)
         
      if (error) throw error

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
             वैश्विक और राष्ट्रीय स्तर के पदों का प्रबंधन करें (Manage generic global designations)
          </p>
      </div>

      <div className="max-w-3xl">
          <Card>
              <CardHeader>
                  <CardTitle>पदों का प्रबंधन (Manage</CardTitle>
              </CardHeader>
              <CardContent>
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
                                <p className="text-sm text-muted-foreground italic">No positions defined yet.</p>
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
              </CardContent>
          </Card>
      </div>
    </div>
  )
}
