
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { statesMock } from "@/mock/statesMock"
import { MemberModal } from "@/components/member-modal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        router.push("/login")
        return
    }

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to fetch members")
    } else {
      setMembers(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("क्या आप सुनिश्चित हैं कि आप इस सदस्य को हटाना चाहते हैं? (Are you sure you want to delete this member?)")) {
        return
    }

    const supabase = createClient()
    const { error } = await supabase.from("members").delete().eq("id", id)

    if (error) {
      toast.error("Failed to delete member")
    } else {
      toast.success("Member deleted successfully")
      fetchMembers()
    }
  }

  const openAddModal = () => {
    setSelectedMember(null)
    setIsModalOpen(true)
  }

  const openEditModal = (member: any) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    fetchMembers() // Refresh list after close
  }

  if (loading) {
     return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">सदस्य (Members)</h1>
            <p className="text-muted-foreground mt-1">अपने सदस्यों को प्रबंधित करें (Manage your members)</p>
          </div>
          <Button onClick={openAddModal} className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            <Plus className="mr-2 h-5 w-5" />
            नया सदस्य (Add Member)
          </Button>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Users className="h-10 w-10 text-primary" />
                </div>
              <h3 className="text-lg font-semibold text-gray-900">कोई सदस्य नहीं मिला (No members found)</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                ऐसा लगता है कि आपने अभी तक कोई सदस्य नहीं जोड़ा है। शुरू करने के लिए "नया सदस्य" बटन पर क्लिक करें।
              </p>
              <Button variant="outline" onClick={openAddModal} className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                पहला सदस्य जोड़ें
              </Button>
            </div>
          ) : (
            members.map((member) => (
              <Card key={member.id} className="relative group hover:shadow-xl transition-all duration-300 border-gray-200/60 overflow-hidden bg-white/80 backdrop-blur-sm">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-3 pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1" title={`${member.first_name} ${member.last_name}`}>
                                {member.first_name} {member.last_name}
                            </CardTitle>
                            <CardDescription className="font-medium text-primary mt-1">
                                {member.position || "सदस्य (Member)"}
                            </CardDescription>
                        </div>
                        <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-gray-100 relative">
                            {member.profile_picture ? (
                                <img 
                                    src={member.profile_picture} 
                                    alt={`${member.first_name} ${member.last_name}`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {member.first_name.charAt(0)}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2.5 text-sm text-gray-600">
                      {member.email && (
                          <div className="flex items-center gap-2 overflow-hidden">
                              <span className="bg-gray-100 p-1.5 rounded-md shrink-0">📧</span>
                              <span className="truncate" title={member.email}>{member.email}</span>
                          </div>
                      )}
                      {member.phone_number && (
                           <div className="flex items-center gap-2">
                                <span className="bg-gray-100 p-1.5 rounded-md shrink-0">📱</span>
                                <span>{member.phone_number}</span>
                           </div>
                      )}
                      {member.address && (
                          <div className="flex items-start gap-2">
                               <span className="bg-gray-100 p-1.5 rounded-md shrink-0 mt-0.5">📍</span>
                               <span className="line-clamp-2">{member.address}</span>
                          </div>
                      )}
                      {(member.state || member.nation) && (() => {
                          // Helper for translation
                          const stateMock = statesMock.find(s => s.nameEn.toLowerCase() === member.state?.toLowerCase());
                          // Robust matching for display
                          const cityMock = stateMock?.cities.find(c => {
                                const dbName = member.city?.toLowerCase() || "";
                                const mockName = c.nameEn.toLowerCase();
                                return dbName === mockName || dbName.includes(mockName) || mockName.includes(dbName);
                          });
                          
                          const displayState = stateMock?.nameHi || member.state;
                          const displayCity = cityMock?.nameHi || member.city;
                          const displayNation = member.nation?.toLowerCase() === "india" ? "भारत" : member.nation;

                          return (
                            <>
                                <div className="flex items-center gap-2">
                                     <span className="bg-gray-100 p-1.5 rounded-md shrink-0">�️</span>
                                     <span>{displayCity || "शहर उपलब्ध नहीं"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="bg-gray-100 p-1.5 rounded-md shrink-0">🌍</span>
                                     <span>{displayState}{displayState && displayNation ? ", " : ""}{displayNation}</span>
                                </div>
                            </>
                          );
                      })()}
                  </div>
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <Button variant="secondary" size="icon" onClick={() => openEditModal(member)} className="h-8 w-8 shadow-sm hover:bg-white">
                          <Pencil className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(member.id)} className="h-8 w-8 shadow-sm">
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
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        member={selectedMember} 
      />
    </div>
  )
}
