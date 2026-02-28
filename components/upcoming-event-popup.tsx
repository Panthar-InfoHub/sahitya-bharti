import { createClient } from "@/lib/supabase/server"
import { EventPopupClient } from "./event-popup-client"

export async function UpcomingEventPopup() {
  const supabase = await createClient()
  
  // Fetch the nearest upcoming event
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "आगामी")
    .order("date", { ascending: true })
    .limit(3)

  if (!events || events.length === 0) {
    return null
  }

  return <EventPopupClient events={events} />
}
