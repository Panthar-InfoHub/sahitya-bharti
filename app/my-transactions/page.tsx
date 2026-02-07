"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Receipt } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Transaction {
  id: string
  razorpay_payment_id: string
  amount: number
  currency: string
  status: string
  type: string
  event_id: string | null
  plan: string | null
  created_at: string
  events?: {
    title: string
  }
}

export default function MyTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    fetchTransactions()
  }, [typeFilter])

  const fetchTransactions = async () => {
    setLoading(true)
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Please login to view transactions")
      setLoading(false)
      return
    }

    let query = supabase
      .from("transactions")
      .select(`
        *,
        events (title)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    // Apply type filter
    if (typeFilter !== "all") {
      query = query.eq("type", typeFilter)
    }

    const { data, error } = await query

    if (error) {
      toast.error("Failed to load transactions")
      console.error(error)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  const totalSpent = transactions
    .filter(tx => tx.status === 'success')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Transactions</h1>
          <p className="text-muted-foreground">View your payment history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Successful Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(tx => tx.status === 'success').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="max-w-xs">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="event">Event Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(tx.created_at), "MMM dd, yyyy")}
                          <div className="text-xs text-muted-foreground md:hidden">
                            {format(new Date(tx.created_at), "HH:mm")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'membership' ? 'default' : 'secondary'} className="whitespace-nowrap">
                            {tx.type === 'membership' ? 'Membership' : 'Event'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tx.type === 'event' 
                            ? tx.events?.title || 'Event Registration'
                            : `${tx.plan || 'Premium'} Plan`
                          }
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          ₹{Number(tx.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              tx.status === 'success' ? 'default' : 
                              tx.status === 'pending' ? 'secondary' : 
                              'destructive'
                            }
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs hidden md:table-cell">
                          {tx.razorpay_payment_id}
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
    </div>
  )
}
