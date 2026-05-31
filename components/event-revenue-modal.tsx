"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2, IndianRupee, CheckCircle2, XCircle, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { toast } from "sonner"

interface Transaction {
  id: string
  amount: number
  status: string
  razorpay_payment_id: string
  razorpay_order_id: string
  created_at: string
  users: {
    full_name: string
    email: string
  } | null
}

interface EventRevenueModalProps {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventRevenueModal({ event, open, onOpenChange }: EventRevenueModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && event?.id) {
      fetchTransactions()
    }
  }, [open, event?.id])

  const fetchTransactions = async () => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        status,
        razorpay_payment_id,
        razorpay_order_id,
        created_at,
        users (full_name, email)
      `)
      .eq("event_id", event.id)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setTransactions(data as any)
    } else if (error) {
      toast.error("Failed to load transactions")
    }
    setLoading(false)
  }

  const successTx = transactions.filter((t) => t.status === "success")
  const totalRevenue = successTx.reduce((sum, t) => sum + Number(t.amount), 0)
  const pendingCount = transactions.filter((t) => t.status === "pending").length
  const failedCount = transactions.filter((t) => t.status === "failed").length

  const exportCSV = () => {
    const headers = ["Date", "Name", "Email", "Amount (₹)", "Status", "Payment ID"]
    const rows = transactions.map((t) => [
      format(new Date(t.created_at), "yyyy-MM-dd HH:mm"),
      t.users?.full_name || "N/A",
      t.users?.email || "N/A",
      Number(t.amount).toFixed(2),
      t.status,
      t.razorpay_payment_id || "N/A",
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${event.title?.replace(/\s+/g, "_")}_revenue.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exported")
  }

  const statusBadge = (status: string) => {
    if (status === "success")
      return <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold"><CheckCircle2 className="w-3 h-3 mr-1" />Success</Badge>
    if (status === "pending")
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 font-semibold"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
    return <Badge className="bg-red-100 text-red-700 border-red-200 font-semibold"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <IndianRupee className="h-5 w-5 text-green-600" />
            राजस्व विवरण — {event?.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">कुल राजस्व</p>
                <p className="text-2xl font-black text-green-800">₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
                <p className="text-[10px] text-green-600 mt-1">{successTx.length} successful</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">Pending</p>
                <p className="text-2xl font-black text-amber-800">{pendingCount}</p>
                <p className="text-[10px] text-amber-600 mt-1">awaiting payment</p>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">Failed</p>
                <p className="text-2xl font-black text-red-800">{failedCount}</p>
                <p className="text-[10px] text-red-600 mt-1">transactions</p>
              </div>
            </div>

            {/* Export */}
            {transactions.length > 0 && (
              <div className="flex justify-end shrink-0">
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="overflow-y-auto flex-1 rounded-xl border">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                  <IndianRupee className="h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium">इस कार्यक्रम के लिए कोई लेन-देन नहीं</p>
                  <p className="text-xs opacity-60">No transactions for this event</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">User</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wide">Payment ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-stone-800 leading-tight">{tx.users?.full_name || "N/A"}</div>
                          <div className="text-xs text-muted-foreground">{tx.users?.email}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-stone-900">
                          ₹{Number(tx.amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3">{statusBadge(tx.status)}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(tx.created_at), "d MMM yyyy, h:mm a")}
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                          {tx.razorpay_payment_id || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
