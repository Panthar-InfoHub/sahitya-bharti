import { createClient } from "@/lib/supabase/server"
import { EventCard } from "@/components/event-card"
import { EventModal } from "@/components/event-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function DashboardEventsPage() {
  const supabase = await createClient()
  
  // Get current user (confirmed admin by layout)
  const { data: { user } } = await supabase.auth.getUser()

  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      event_participants (user_id)
    `)
    .order("date", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">कार्यक्रम (Events)</h1>
          <p className="text-muted-foreground">
             संगठन के कार्यक्रमों का प्रबंधन करें (Manage events)
          </p>
        </div>
        <EventModal trigger={
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            नया कार्यक्रम (Add)
          </Button>
        } />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events?.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            currentUserId={user?.id}
            isAdmin={true} 
          />
        ))}
        {!events?.length && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-slate-50">
            <p className="text-lg text-muted-foreground">कोई कार्यक्रम नहीं मिला (No events found)</p>
            <p className="text-sm text-slate-500">नया कार्यक्रम जोड़कर शुरुआत करें (Create a new event)</p>
          </div>
        )}
      </div>
    </div>
  )
}
