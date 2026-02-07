"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Trash2, Pencil, Users, Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { MemberModal } from "@/components/member-modal"
import { PositionManager } from "@/components/position-manager"
import { statesMock } from "@/mock/statesMock"

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [isPositionManagerOpen, setIsPositionManagerOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        // router.push("/login") 
        // For now, allow viewing but maybe restrict actions? 
        // Logic below assumes user needs to be logged in to delete/edit
    }

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      toast.error("Failed to load members")
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return
    const supabase = createClient()
    const { error } = await supabase.from("members").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete")
    } else {
      toast.success("Deleted")
      fetchMembers()
    }
  }

  const openAddModal = () => {
    setSelectedMember(null)
    setIsMemberModalOpen(true)
  }

  const openEditModal = (member: any) => {
    setSelectedMember(member)
    setIsMemberModalOpen(true)
  }

  if (loading) {
     return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <Link href="/" className="p-2 hover:bg-accent/10 rounded-full transition-colors">
                <ChevronLeft className="h-6 w-6 text-muted-foreground hover:text-primary" />
             </Link>
             <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight">सदस्य (Members)</h1>
                <p className="text-muted-foreground mt-1">Manage members and their positions</p>
             </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
             <Button variant="outline" onClick={() => setIsPositionManagerOpen(true)} className="flex-1 sm:flex-none">
                <Settings className="mr-2 h-4 w-4" />
                पद प्रबंधन (Positions)
             </Button>
             <Button onClick={openAddModal} className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                नया सदस्य (Add)
             </Button>
          </div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed">
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                    <Users className="h-10 w-10 text-primary" />
                </div>
              <h3 className="text-lg font-semibold">No members found</h3>
              <p className="text-muted-foreground mt-2">Add your first member to get started.</p>
            </div>
          ) : (
            members.map((member) => (
              <Card key={member.id} className="relative group overflow-hidden hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="h-12 w-12 rounded-full overflow-hidden border bg-muted flex-shrink-0">
                        {member.profile_picture ? (
                            <img src={member.profile_picture} alt={member.first_name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                {member.first_name[0]}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="truncate">{member.first_name} {member.last_name}</CardTitle>
                        <CardDescription className="text-primary font-medium truncate">
                            {member.position || "Member"}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                           <span>📧</span> <span className="truncate">{member.email || "-"}</span>
                      </div>
                       <div className="flex items-center gap-2">
                           <span>📱</span> <span>{member.phone_number || "-"}</span>
                      </div>
                       <div className="flex items-center gap-2">
                           <span>📍</span> 
                           <span className="truncate">
                               {(() => {
                                   const mCity = statesMock.find(s => s.nameEn === member.state)?.cities.find(c => c.nameEn === member.city)?.nameHi || member.city;
                                   const mState = statesMock.find(s => s.nameEn === member.state)?.nameHi || member.state;
                                   return `${mCity || "?"}, ${mState || "?"}`
                               })()}
                           </span>
                      </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(member)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <MemberModal 
        isOpen={isMemberModalOpen} 
        onClose={() => setIsMemberModalOpen(false)} 
        member={selectedMember} 
      />
      
      <PositionManager 
        isOpen={isPositionManagerOpen}
        onClose={() => setIsPositionManagerOpen(false)}
      />
    </div>
  )
}
