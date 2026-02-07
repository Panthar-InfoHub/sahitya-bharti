"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Receipt, Download } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Transaction {
  id: string
  razorpay_payment_id: string
  razorpay_order_id: string
  amount: number
  currency: string
  status: string
  type: string
  event_id: string | null
  plan: string | null
  created_at: string
  users?: {
    name: string
    email: string
  }
  events?: {
    title: string
  }
}

interface TransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionsModal({ open, onOpenChange }: TransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (open) {
      fetchTransactions()
    }
  }, [open, typeFilter])

  const fetchTransactions = async () => {
    setLoading(true)
    const supabase = createClient()

    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      toast.error("Please login to view transactions")
      setLoading(false)
      return
    }

    // Get user details
    const { data: userData } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", currentUser.id)
      .single()

    setUser(userData)

    let query = supabase
      .from("transactions")
      .select(`
        *,
        events (title)
      `)
      .eq("user_id", currentUser.id)
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

  const downloadReceipt = (tx: Transaction) => {
    // Generate receipt HTML
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #333; }
    .header p { margin: 5px 0; color: #666; }
    .receipt-info { margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; color: #333; }
    .info-value { color: #666; }
    .amount { font-size: 24px; font-weight: bold; color: #2563eb; text-align: center; margin: 30px 0; }
    .status { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    .status-success { background: #dcfce7; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #333; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>हिंदी साहित्य भारती</h1>
    <p>Payment Receipt</p>
  </div>
  
  <div class="receipt-info">
    <div class="info-row">
      <span class="info-label">Receipt Date:</span>
      <span class="info-value">${format(new Date(tx.created_at), "PPP p")}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Customer Name:</span>
      <span class="info-value">${user?.name || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Email:</span>
      <span class="info-value">${user?.email || 'N/A'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Transaction Type:</span>
      <span class="info-value">${tx.type === 'event' ? 'Event Registration' : 'Membership'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Description:</span>
      <span class="info-value">${tx.type === 'event' ? tx.events?.title || 'Event Registration' : `${tx.plan || 'Premium'} Plan`}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Payment ID:</span>
      <span class="info-value">${tx.razorpay_payment_id}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Order ID:</span>
      <span class="info-value">${tx.razorpay_order_id}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Status:</span>
      <span class="info-value"><span class="status status-success">${tx.status.toUpperCase()}</span></span>
    </div>
  </div>
  
  <div class="amount">
    Amount Paid: ₹${Number(tx.amount).toFixed(2)}
  </div>
  
  <div class="footer">
    <p>Thank you for your payment!</p>
    <p>This is a computer-generated receipt and does not require a signature.</p>
    <p>For any queries, please contact us at support@sahityabharti.org</p>
  </div>
</body>
</html>
    `

    // Create blob and download
    const blob = new Blob([receiptHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt_${tx.razorpay_payment_id}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Receipt downloaded successfully")
  }

  const totalSpent = transactions
    .filter(tx => tx.status === 'success')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">My Transactions</DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 py-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Successful</p>
            <p className="text-2xl font-bold text-green-600">
              {transactions.filter(tx => tx.status === 'success').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-blue-600">₹{totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter */}
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

        {/* Transactions Table */}
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
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(tx.created_at), "MMM dd, yyyy")}
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
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReceipt(tx)}
                        className="gap-2"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
