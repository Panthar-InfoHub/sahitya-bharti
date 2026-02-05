import { createClient } from "@/lib/supabase/server"
import { RefundsTable } from "./refunds-table"
import { RefundFilters } from "./refund-filters"

export const dynamic = "force-dynamic"

export default async function RefundsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; sort?: string }>
}) {
  const supabase = await createClient()
  
  const { search, sort: sortParam } = await searchParams
  const sort = sortParam === "asc" ? true : false // ascending: true/false

  let query = supabase
    .from("refund_requests")
    .select(`
      *,
      users!inner (full_name, email),
      events (title, fee)
    `)
  
  // Apply Search
  if (search) {
      query = query.ilike('users.full_name', `%${search}%`)
  }

  // Apply Sort
  query = query.order("created_at", { ascending: sort })

  const { data: refunds, error } = await query

  if (error) {
    console.error("Error fetching refunds:", error)
    return <div className="p-4 text-red-500">Failed to load refund requests.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">धनवापसी अनुरोध (Refund Requests)</h1>
           <p className="text-muted-foreground">Manage cancellation and refund requests from paid events.</p>
        </div>
      </div>
    
      <RefundFilters />

      <RefundsTable initialData={refunds || []} />
    </div>
  )
}
