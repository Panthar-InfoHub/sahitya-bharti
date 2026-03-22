"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Pencil } from "lucide-react"
import { toast } from "sonner"
import { createManualUser } from "./actions"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  phone_number: string
  address: string
  plan: string
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [plans, setPlans] = useState<any[]>([])
  
  // Edit Modal State
  const [editUser, setEditUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    plan: ""
  })
  const [savingUser, setSavingUser] = useState(false)

  // Add User State
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [addUserFormData, setAddUserFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "user",
    plan: ""
  })
  const [addingUser, setAddingUser] = useState(false)

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
    
    if (profile?.role === 'super_admin') {
        setIsSuperAdmin(true)
        setIsAdmin(true)
    } else if (profile?.role === 'admin') {
        setIsAdmin(true)
    } else {
        // Not admin or super_admin
        setLoading(false)
        return
    }
    
    // Fetch plans
    const { data: plansData } = await supabase.from('membership_plans').select('*').order('level', { ascending: true })
    if (plansData) {
        setPlans(plansData)
        setAddUserFormData(prev => ({ ...prev, plan: plansData[0]?.name || "free" }))
    }

    // Fetch users
    let query = supabase.from('users').select('*').order('created_at', { ascending: false })
    
    if (roleFilter !== "all") {
        query = query.eq('role', roleFilter)
    }

    const { data, error } = await query

    if (error) {
        toast.error("Failed to load users")
    } else {
        setUsers(data as User[] || [])
    }
    setLoading(false)
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
      if (!isSuperAdmin) return toast.error("Only Super Admins can change roles")
      
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

  const openEditModal = (u: User) => {
      setEditUser(u)
      setEditFormData({
          full_name: u.full_name || "",
          phone_number: u.phone_number || "",
          address: u.address || "",
          plan: u.plan || ""
      })
  }

  const handleSaveUser = async () => {
      if (!editUser) return
      setSavingUser(true)

      const supabase = createClient()
      
      const planChanged = editFormData.plan !== editUser.plan
      
      const { error } = await supabase
        .from("users")
        .update({
            full_name: editFormData.full_name,
            phone_number: editFormData.phone_number,
            address: editFormData.address,
            plan: editFormData.plan
        })
        .eq("id", editUser.id)

      if (error) {
          toast.error("Failed to update user details")
      } else {
          // If plan changed (upgrade/downgrade), record it in transactions for offline tracking
          if (planChanged) {
              const newPlan = plans.find(p => p.name === editFormData.plan)
              const amount = newPlan ? Number(newPlan.price) : 0
              
              if (amount > 0) {
                  const { error: txError } = await supabase.from('transactions').insert({
                    user_id: editUser.id,
                    amount: amount,
                    currency: 'INR',
                    status: 'success',
                    type: 'membership',
                    plan: editFormData.plan,
                    razorpay_payment_id: `OFFLINE_ADMIN_${currentUserId}_${Date.now()}`,
                    razorpay_order_id: 'MANUAL_UPGRADE'
                  })
                  
                  if (txError) {
                      console.error("Failed to record transaction:", txError)
                      toast.warning("User updated, but failed to record offline transaction.")
                  } else {
                      toast.success(`User updated and offline payment of ₹${amount} recorded.`)
                  }
              } else {
                toast.success("User details updated successfully")
              }
          } else {
            toast.success("User details updated successfully")
          }
          
          setEditUser(null)
          checkAccessAndFetch()
      }
      setSavingUser(false)
  }



  const handleAddUser = async () => {
      if (!isSuperAdmin) return toast.error("Only Super Admins can add users manually")
      if (!addUserFormData.email || !addUserFormData.full_name) {
          return toast.error("Username and Email are required")
      }
      
      setAddingUser(true)

      try {
        const result = await createManualUser({
            email: addUserFormData.email,
            full_name: addUserFormData.full_name,
            phone_number: addUserFormData.phone_number,
            role: addUserFormData.role,
            plan: addUserFormData.plan
        })

        if (result.success) {
            toast.success("User added successfully through Auth Admin API.")
            setIsAddingUser(false)
            setAddUserFormData({ full_name: "", email: "", phone_number: "", role: "user", plan: plans[0] || "" })
            checkAccessAndFetch()
        }
      } catch (error: any) {
          console.error(error)
          if (error.message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
              toast.error("SERVICE ROLE KEY is missing in .env.local. Manual user creation requires this key to create Auth records.", {
                  duration: 6000
              })
          } else {
              toast.error("Failed to add user: " + (error.message || "Unknown error"))
          }
      } finally {
          setAddingUser(false)
      }
  }

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (u.full_name || "").toLowerCase().includes(query) ||
      (u.email || "").toLowerCase().includes(query) ||
      (u.phone_number || "").toLowerCase().includes(query)
    )
  })

  // Security fallback if they somehow get here
  if (!loading && !isAdmin && !isSuperAdmin) {
     return (
        <div className="flex items-center justify-center p-12 h-[60vh]">
           <div className="text-center text-red-600">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
           </div>
        </div>
     )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">उपयोगकर्ता (Users)</h1>
          <p className="text-muted-foreground">Platform users management and details.</p>
        </div>
        {isSuperAdmin && (
            <Button onClick={() => setIsAddingUser(true)}>
                उपयोगकर्ता जोड़ें (Add User)
            </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
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
                <SelectItem value="super_admin">केवल सुपर एडमिन (Super Admins Only)</SelectItem>
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
                    <TableHead>Phone / State</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{u.full_name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Joined: {new Date(u.created_at).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{u.phone_number || "-"}</div>
                        <div className="text-xs text-muted-foreground max-w-[150px] truncate">{u.address || "-"}</div>
                      </TableCell>
                      <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                            u.plan === 'premium' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                            (u.plan && u.plan !== 'free') ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                              {u.plan || 'Free'}
                          </span>
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
                      <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                              {/* Edit details button - available to admin and super_admin */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => openEditModal(u)}
                              >
                                  <Pencil className="h-4 w-4" />
                              </Button>

                              {/* Role Select - only editable for super_admin */}
                              {u.id === currentUserId ? (
                                  <span className="text-xs text-muted-foreground italic mr-2">स्वयं (You)</span>
                              ) : (
                                  <div className="flex justify-end items-center gap-2">
                                      {processingId === u.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                      <Select
                                        disabled={!isSuperAdmin || processingId === u.id}
                                        value={u.role || 'user'}
                                        onValueChange={(value) => handleUpdateRole(u.id, value)}
                                      >
                                        <SelectTrigger className="w-32 h-8 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">User</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                          {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                                        </SelectContent>
                                      </Select>
                                  </div>
                              )}
                          </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>नया उपयोगकर्ता जोड़ें (Add New User)</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add_email" className="text-right">ईमेल (Email)</Label>
                <Input 
                    id="add_email"
                    type="email"
                    placeholder="user@example.com"
                    value={addUserFormData.email} 
                    onChange={(e) => setAddUserFormData({...addUserFormData, email: e.target.value})}
                    className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add_name" className="text-right">नाम (Name)</Label>
                <Input 
                    id="add_name" 
                    placeholder="Full Name"
                    value={addUserFormData.full_name} 
                    onChange={(e) => setAddUserFormData({...addUserFormData, full_name: e.target.value})}
                    className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add_phone" className="text-right">फ़ोन (Phone)</Label>
                <Input 
                    id="add_phone" 
                    placeholder="Enter phone number" 
                    value={addUserFormData.phone_number} 
                    onChange={(e) => setAddUserFormData({...addUserFormData, phone_number: e.target.value})}
                    className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">भूमिका (Role)</Label>
                <Select
                  value={addUserFormData.role}
                  onValueChange={(value) => setAddUserFormData({...addUserFormData, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">योजना (Plan)</Label>
                <Select
                  value={addUserFormData.plan}
                  onValueChange={(value) => setAddUserFormData({...addUserFormData, plan: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                    ))}
                    {plans.length === 0 && <SelectItem value="free">Free</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingUser(false)}>रद्द करें (Cancel)</Button>
            <Button onClick={handleAddUser} disabled={addingUser}>
                {addingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                जोड़ें (Add)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>उपयोगकर्ता संपादित करें (Edit User)</DialogTitle>
          </DialogHeader>
          
          {editUser && (
              <div className="grid gap-4 py-4">
                  {/* Read-only fields */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">ईमेल (Email)</Label>
                    <Input value={editUser.email} disabled className="col-span-3 bg-slate-50 opacity-70" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right text-muted-foreground">योजना (Plan)</Label>
                    <Select
                      disabled={!isSuperAdmin}
                      value={editFormData.plan}
                      onValueChange={(value) => setEditFormData({...editFormData, plan: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                        ))}
                        {plans.length === 0 && <SelectItem value="free">Free</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Editable fields */}
                  <div className="grid grid-cols-4 items-center gap-4 mt-2">
                    <Label htmlFor="full_name" className="text-right">नाम (Name)</Label>
                    <Input 
                        id="full_name" 
                        value={editFormData.full_name} 
                        onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                        className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone_number" className="text-right">फ़ोन (Phone)</Label>
                    <Input 
                        id="phone_number" 
                        value={editFormData.phone_number} 
                        onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})}
                        className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">पता (Address)</Label>
                    <Input 
                        id="address" 
                        value={editFormData.address} 
                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                        className="col-span-3" 
                    />
                  </div>
              </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>रद्द करें (Cancel)</Button>
            <Button onClick={handleSaveUser} disabled={savingUser}>
                {savingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                सहेजें (Save)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
