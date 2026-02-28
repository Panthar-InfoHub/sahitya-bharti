"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil, Loader2, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function DashboardPlansPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  
  // Form State
  const [formData, setFormData] = useState({
      name: "",
      label: "",
      price: 0,
      level: 0,
      features: "" // comma separated for simple editing
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("membership_plans")
      .select("*")
      .order("level", { ascending: true })

    if (error) {
      console.error(error)
      toast.error("Failed to load membership plans")
    } else {
      setPlans(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the plan: ${name}?`)) return
    
    const supabase = createClient()
    const { error } = await supabase.from("membership_plans").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete plan")
    } else {
      toast.success("Plan deleted")
      fetchPlans()
    }
  }

  const openAddModal = () => {
    setSelectedPlan(null)
    setFormData({
        name: "",
        label: "",
        price: 0,
        level: 1,
        features: ""
    })
    setIsModalOpen(true)
  }

  const openEditModal = (plan: any) => {
    setSelectedPlan(plan)
    setFormData({
        name: plan.name,
        label: plan.label,
        price: plan.price,
        level: plan.level,
        features: plan.features ? plan.features.join(", ") : ""
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!formData.name || !formData.label) {
          toast.error("Name and label are required");
          return;
      }

      setSaving(true)
      const supabase = createClient()
      
      const featureArray = formData.features.split(",").map(f => f.trim()).filter(f => f !== "")

      const planData = {
          name: formData.name,
          label: formData.label,
          price: Number(formData.price),
          level: Number(formData.level),
          features: featureArray
      }

      try {
          if (selectedPlan) {
              const { error } = await supabase.from("membership_plans").update(planData).eq("id", selectedPlan.id)
              if (error) throw error
              toast.success("Plan updated successfully!")
          } else {
              const { error } = await supabase.from("membership_plans").insert([planData])
              if (error) throw error
              toast.success("Plan created successfully!")
          }
          setIsModalOpen(false)
          fetchPlans()
      } catch (err: any) {
          toast.error(err.message || "An error occurred")
      } finally {
          setSaving(false)
      }
  }

  if (loading) {
     return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold tracking-tight">योजनाएं (Membership Plans)</h1>
          <p className="text-muted-foreground">
             सदस्यता योजनाओं का प्रबंधन करें (Manage your membership plans)
          </p>
        </div>
        {/* <Button onClick={openAddModal} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            नई योजना (Add Plan)
        </Button> */}
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed text-muted-foreground">
                <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                कोई योजना नहीं मिली (No plans found)
            </div>
          ) : (
            plans.map((plan) => (
              <Card key={plan.id} className="relative group overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="flex flex-col items-start gap-2 pb-2">
                    <div className="flex justify-between w-full items-start">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" onClick={() => openEditModal(plan)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.id, plan.name)} className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground text-sm"> / आजीवन</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                           <span className="font-semibold text-foreground">स्तर (Level):</span> <span>{plan.level}</span>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">सुविधाएं (Features):</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {plan.features?.map((f: string, i: number) => (
                              <li key={i}>{f}</li>
                          ))}
                      </ul>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
           <DialogHeader>
                <DialogTitle>{selectedPlan ? "योजना संपादित करें (Edit Plan)" : "नई योजना (New Plan)"}</DialogTitle>
           </DialogHeader>

           <form onSubmit={handleSave} className="space-y-4">
               
               <div className="grid grid-cols-1 gap-4">
                   <div className="space-y-2">
                       <Label>योजना का नाम (Plan Name) *</Label>
                       <Input 
                            value={formData.name} 
                            onChange={e => {
                              setFormData({...formData, name: e.target.value, label: e.target.value})
                            }} 
                            placeholder="e.g. विशिष्ट सदस्यता (Premium)"
                            required
                       />
                       <p className="text-xs text-muted-foreground">अगर इसे बदला गया, तो यूजर्स की पुरानी योजना का नाम भी स्वतः अपडेट हो जाएगा।</p>
                   </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                       <Label>कीमत (Price ₹) *</Label>
                       <Input 
                            type="number"
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                            required
                       />
                   </div>
                   <div className="space-y-2">
                       <Label>अनुक्रम (Level/Hierarchy) *</Label>
                       <Input 
                            type="number"
                            value={formData.level} 
                            onChange={e => setFormData({...formData, level: Number(e.target.value)})} 
                            required
                       />
                       <p className="text-xs text-muted-foreground">बड़ा नंबर = उच्च योजना (e.g. 1, 2, 3)</p>
                   </div>
               </div>

               <div className="space-y-2">
                   <Label>सुविधाएं (Features)</Label>
                   <Input 
                        value={formData.features} 
                        onChange={e => setFormData({...formData, features: e.target.value})} 
                        placeholder="e.g. आजीवन सदस्यता, ई-पत्रिका का उपयोग, ..."
                   />
                   <p className="text-xs text-muted-foreground">सुविधाओं को अल्पविराम (comma) से अलग करें।</p>
               </div>
               
               <div className="flex justify-end pt-4 gap-2">
                   <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                   <Button type="submit" disabled={saving}>
                       {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Save
                   </Button>
               </div>
           </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
