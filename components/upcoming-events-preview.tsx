import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export async function UpcomingEventsPreview() {
  const supabase = await createClient()
  
  // Fetch 3 upcoming events
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      event_participants(count)
    `)
    .eq("status", "आगामी")
    .order("date", { ascending: true })
    .limit(3)

  if (!events || events.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            आगामी कार्यक्रम
          </h2>
          <p className="text-lg text-muted-foreground">
            हमारे आने वाले कार्यक्रमों में शामिल हों
          </p>
        </div>

        {/* Events Grid - Centered for any number of items */}
        <div className={`grid gap-6 ${
          events.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          events.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {events.map((event) => {
            const participantsCount = event.event_participants?.[0]?.count || 0
            const seatsAvailable = event.seats ? event.seats - participantsCount : null
            const isFull = seatsAvailable !== null && seatsAvailable <= 0

            return (
              <Link 
                key={event.id} 
                href="/events"
                className="group bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full bg-slate-100">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      <Calendar className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                    <Badge variant="default" className="bg-primary/90 hover:bg-primary">
                      {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क"}
                    </Badge>
                    <Badge className="bg-blue-500/90 text-white hover:bg-blue-500">
                      {event.status}
                    </Badge>
                  </div>

                  {seatsAvailable !== null && (
                    <Badge 
                      variant={isFull ? "destructive" : "secondary"} 
                      className="absolute top-2 right-2 z-10"
                    >
                      {isFull ? "भरा हुआ" : `${seatsAvailable} सीटें`}
                    </Badge>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  <div className="pt-2 mt-auto">
                    <span className="text-primary font-semibold text-sm group-hover:underline">
                      विवरण देखें →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            सभी कार्यक्रम देखें
          </Link>
        </div>
      </div>
    </section>
  )
}
