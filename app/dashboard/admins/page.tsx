"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, ShieldCheck, UserX, UserPlus } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface User {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

export default function AdminsManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("admin") // Default to showing admins
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    checkAccessAndFetch()
  }, [roleFilter])

  const checkAccessAndFetch = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        setLoading(false)
        return
    }
    
    setCurrentUserId(user.id)

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'super_admin') {
        setIsSuperAdmin(false)
        setLoading(false)
        return
    }

    setIsSuperAdmin(true)
    
    // Fetch users based on role filter
    let query = supabase.from('users').select('*').order('created_at', { ascending: false })
    
    if (roleFilter !== "all") {
        query = query.eq('role', roleFilter)
    }

    const { data, error } = await query

    if (error) {
        toast.error("Failed to load users")
    } else {
        setUsers(data || [])
    }
    setLoading(false)
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
      setProcessingId(userId)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
          toast.error("Failed to update role")
      } else {
          toast.success(`User role updated to ${newRole}`)
          checkAccessAndFetch() // refresh list
      }
      setProcessingId(null)
  }

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (u.full_name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query)
    )
  })

  if (isSuperAdmin === false) {
     return (
        <div className="flex items-center justify-center p-12 h-[60vh]">
           <div className="text-center text-red-600">
              <ShieldCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="mt-2 text-muted-foreground">Only Super Admins can manage roles.</p>
           </div>
        </div>
     )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">एडमिन प्रबंधित करें (Manage Admins)</h1>
          <p className="text-muted-foreground">Grant or revoke admin privileges across the platform.</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी उपयोगकर्ता (All Users)</SelectItem>
                <SelectItem value="admin">केवल एडमिन (Admins Only)</SelectItem>
                <SelectItem value="user">नियमित उपयोगकर्ता (Regular Users)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{u.full_name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{u.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-100 text-slate-800'
                        }`}>
                          {u.role || 'user'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                          {u.id === currentUserId ? (
                              <span className="text-xs text-muted-foreground italic">स्वयं (You)</span>
                          ) : (
                              <div className="flex justify-end items-center gap-2">
                                  {processingId === u.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                  <Select
                                    disabled={processingId === u.id}
                                    value={u.role || 'user'}
                                    onValueChange={(value) => handleUpdateRole(u.id, value)}
                                  >
                                    <SelectTrigger className="w-32 h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                      <SelectItem value="super_admin">Super Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                              </div>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
