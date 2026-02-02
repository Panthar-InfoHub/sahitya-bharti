import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EventCard } from "@/components/event-card"
import { EventModal } from "@/components/event-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  const supabase = await createClient()
  
  // Get current user and role
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single() : { data: null }

  const isAdmin = profile?.role === 'admin'

  // Fetch all events
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      event_participants (user_id)
    `)
    .order("date", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">आगामी कार्यक्रम (Upcoming Events)</h1>
            <p className="text-muted-foreground mt-2">हमारे नवीनतम कार्यक्रमों और गतिविधियों में शामिल हों</p>
          </div>
          
          {isAdmin && (
            <EventModal trigger={
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                नया कार्यक्रम (Add Event)
              </Button>
            } />
          )}
        </div>

        {(!events || events.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <p className="text-muted-foreground text-lg">कोई आगामी कार्यक्रम नहीं है (No upcoming events)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                currentUserId={user?.id}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
