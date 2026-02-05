"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { approveRefund, rejectRefund } from "./actions"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function RefundsTable({ initialData }: { initialData: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAction = async (id: string, action: "approve" | "reject", eventId?: string, userId?: string) => {
    setLoadingId(id)
    try {
        if (action === "approve") {
            if (!eventId || !userId) throw new Error("Missing event or user ID")
            await approveRefund(id, eventId, userId)
            toast.success("Request approved & User unregistered")
        } else {
            await rejectRefund(id)
            toast.success("Request rejected")
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to process request")
    } finally {
        setLoadingId(null)
    }
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>UPI ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No refund requests found.
              </TableCell>
            </TableRow>
          ) : (
            initialData.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(request.created_at), "PPP")}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{request.users?.full_name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">{request.users?.email}</p>
                </TableCell>
                <TableCell>
                   <p className="font-medium">{request.events?.title || "Deleted Event"}</p>
                   {request.events?.fee ? <Badge variant="outline">₹{request.events.fee}</Badge> : null}
                </TableCell>
                <TableCell className="max-w-xs truncate" title={request.reason}>
                  {request.reason}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {request.upi_id || "-"}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                        request.status === "approved" ? "default" : // In default theme default is primary (black/dark)
                        request.status === "rejected" ? "destructive" : 
                        "secondary"
                    }
                    className={
                        request.status === "approved" ? "bg-green-600 hover:bg-green-700" : ""
                    }
                  >
                    {request.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === "pending" && (
                     <div className="flex justify-end gap-2">
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction(request.id, "approve", request.event_id, request.user_id)}
                            disabled={loadingId === request.id}
                         >
                            {loadingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                         </Button>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleAction(request.id, "reject")}
                            disabled={loadingId === request.id}
                         >
                            {loadingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                         </Button>
                     </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
