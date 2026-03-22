"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Loader2, Search, UserPlus, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface Participant {
  id: string
  user_id: string
  users: {
    full_name: string
    email: string
    role: string
    phone_number: string
  }
  joined_at: string
}

interface User {
    id: string
    full_name: string
    email: string
    role: string
}

interface EventParticipantsModalProps {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventParticipantsModal({ event, open, onOpenChange }: EventParticipantsModalProps) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [addingParticipant, setAddingParticipant] = useState<string | null>(null)
  const [removingParticipant, setRemovingParticipant] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userSearchQuery, setUserSearchQuery] = useState("")

  const supabase = createClient()

  useEffect(() => {
    if (open) {
      fetchParticipants()
    }
  }, [open, event.id])

  const fetchParticipants = async () => {
    setLoading(true)
    const { data: participantsData, error } = await supabase
      .from("event_participants")
      .select(`
        id,
        user_id,
        joined_at,
        users (full_name, email, role, phone_number)
      `)
      .eq("event_id", event.id)
      .order("joined_at", { ascending: false })

    if (error) {
      toast.error("Failed to load participants")
    } else {
      setParticipants(participantsData as any || [])
    }
    setLoading(false)
  }

  const fetchAvailableUsers = async () => {
    if (userSearchQuery.length < 2) return
    
    // Get all users matching search
    const { data: users, error } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .or(`full_name.ilike.%${userSearchQuery}%,email.ilike.%${userSearchQuery}%`)
        .limit(10)

    if (error) {
        toast.error("Search failed")
        return
    }

    // Filter out existing participants
    const participantIds = new Set(participants.map(p => p.user_id))
    const filtered = (users || []).filter(u => !participantIds.has(u.id))
    
    setAvailableUsers(filtered)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
        if (userSearchQuery) fetchAvailableUsers()
        else setAvailableUsers([])
    }, 500)
    return () => clearTimeout(timer)
  }, [userSearchQuery])

  const handleAddParticipant = async (userId: string) => {
    setAddingParticipant(userId)
    const { error } = await supabase
      .from("event_participants")
      .insert({
        event_id: event.id,
        user_id: userId
      })

    if (error) {
      toast.error("Failed to add participant")
    } else {
      toast.success("Participant added successfully")
      setUserSearchQuery("")
      setAvailableUsers([])
      fetchParticipants()
    }
    setAddingParticipant(null)
  }

  const handleRemoveParticipant = async (participantId: string) => {
    setRemovingParticipant(participantId)
    const { error } = await supabase
      .from("event_participants")
      .delete()
      .eq("id", participantId)

    if (error) {
      toast.error("Failed to remove participant")
    } else {
      toast.success("Participant removed")
      fetchParticipants()
    }
    setRemovingParticipant(null)
  }

  const filteredParticipants = participants.filter(p => 
    p.users?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.users?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-2xl border-none">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-6 w-6" />
                पंजीकृत प्रतिभागी (Registered Participants)
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                {event.title} के लिए सभी पंजीकृत उपयोगकर्ताओं की सूची।
              </DialogDescription>
            </div>
            <Badge variant="outline" className="text-white border-white bg-white/10 text-lg px-3 py-1">
                Total: {participants.length}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Add Participant Search Area */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                नया प्रतिभागी जोड़ें (Add New Participant)
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="नाम या ईमेल से खोजें (Search by name or email to add)..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-9 bg-white border-slate-300 focus:ring-blue-500"
              />
            </div>
            
            {userSearchQuery.length >= 2 && availableUsers.length > 0 && (
                <div className="mt-3 border rounded-lg bg-white shadow-sm overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                        {availableUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-3 hover:bg-blue-50 border-b last:border-0 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-900">{user.full_name}</p>
                                    <p className="text-xs text-slate-500 italic">{user.email}</p>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleAddParticipant(user.id)}
                                    disabled={addingParticipant === user.id}
                                    className="h-8 bg-blue-600 hover:bg-blue-700 rounded-full"
                                >
                                    {addingParticipant === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {userSearchQuery.length >= 2 && availableUsers.length === 0 && !loading && (
                <p className="text-xs text-center text-slate-400 mt-2">कोई नया उपयोगकर्ता नहीं मिला (No new users found)</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="सूची में खोजें (Search in list)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
              </div>
          </div>

          <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">नाम (Name)</TableHead>
                  <TableHead className="font-bold">ईमेल (Email)</TableHead>
                  <TableHead className="font-bold">फ़ोन (Phone)</TableHead>
                  <TableHead className="font-bold">भूमिका (Role)</TableHead>
                  <TableHead className="text-right font-bold pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                    </TableCell>
                  </TableRow>
                ) : filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-medium">{p.users?.full_name}</TableCell>
                      <TableCell className="text-slate-600">{p.users?.email}</TableCell>
                      <TableCell className="text-slate-600">{p.users?.phone_number || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs font-normal">
                          {p.users?.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveParticipant(p.id)}
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
                          disabled={removingParticipant === p.id}
                        >
                          {removingParticipant === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                       कोई प्रतिभागी नहीं मिला (No participants found)
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50">
          <Button variant="secondary" onClick={() => onOpenChange(false)} className="rounded-lg">
            बंद करें (Close)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
