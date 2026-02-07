"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Download } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Transaction {
  id: string
  user_id: string
  razorpay_payment_id: string
  razorpay_order_id: string
  amount: number
  currency: string
  status: string
  type: string
  event_id: string | null
  plan: string | null
  created_at: string
  users: {
    name: string
    email: string
  }
  events?: {
    title: string
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchTransactions()
  }, [typeFilter, statusFilter])

  const fetchTransactions = async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from("transactions")
      .select(`
        *,
        users (name, email),
        events (title)
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (typeFilter !== "all") {
      query = query.eq("type", typeFilter)
    }
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
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

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      tx.users?.name?.toLowerCase().includes(query) ||
      tx.users?.email?.toLowerCase().includes(query) ||
      tx.razorpay_payment_id?.toLowerCase().includes(query) ||
      tx.razorpay_order_id?.toLowerCase().includes(query)
    )
  })

  const totalAmount = filteredTransactions
    .filter(tx => tx.status === 'success')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const exportToCSV = () => {
    const headers = ["Date", "User", "Email", "Type", "Description", "Amount", "Status", "Payment ID"]
    const rows = filteredTransactions.map(tx => [
      format(new Date(tx.created_at), "yyyy-MM-dd HH:mm"),
      tx.users?.name || "N/A",
      tx.users?.email || "N/A",
      tx.type,
      tx.type === 'event' ? tx.events?.title || 'Event' : `${tx.plan} Plan`,
      tx.amount,
      tx.status,
      tx.razorpay_payment_id
    ])

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported successfully")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View all payment transactions</p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredTransactions.filter(tx => tx.status === 'success').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredTransactions.filter(tx => tx.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or payment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
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
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(tx.created_at), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tx.users?.name || "N/A"}</div>
                          <div className="text-sm text-muted-foreground">{tx.users?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'membership' ? 'default' : 'secondary'}>
                          {tx.type === 'membership' ? 'Membership' : 'Event'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {tx.type === 'event' 
                          ? tx.events?.title || 'Event Registration'
                          : `${tx.plan || 'Premium'} Plan`
                        }
                      </TableCell>
                      <TableCell className="font-medium">
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
                      <TableCell className="font-mono text-xs">
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
  )
}
