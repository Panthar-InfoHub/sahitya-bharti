import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin, ArrowRight, Timer, Users, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { hi } from "date-fns/locale"
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
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header - More compact */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black mb-4 tracking-widest uppercase border border-orange-100/50">
            <Sparkles className="w-3 h-3" />
            <span>विशेष आयोजन</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            आगामी <span className="text-orange-600">कार्यक्रम</span>
          </h2>
          <div className="w-12 h-1 bg-orange-600 mx-auto rounded-full" />
        </div>

        {/* Events Grid - Compact proportions */}
        <div className={`grid gap-6 ${events.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
            events.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
          {events.map((event) => {
            const participantsCount = event.event_participants?.[0]?.count || 0
            const seatsAvailable = event.seats ? event.seats - participantsCount : null
            const isFull = seatsAvailable !== null && seatsAvailable <= 0
            const eventDate = new Date(event.date)

            return (
              <Link
                key={event.id}
                href="/events"
                className="group relative flex flex-col bg-white border border-slate-100 hover:border-orange-200 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Image Section - Scaled Down */}
                <div className="relative h-48 w-full overflow-hidden">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-slate-50 text-orange-200">
                      <Calendar className="h-12 w-12 opacity-20" />
                    </div>
                  )}

                  {/* Floating Date Badge - More compact */}
                  <div className="absolute bottom-4 left-4 flex flex-col items-center justify-center w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg z-20 border border-white">
                    <span className="text-xl font-black text-slate-900 leading-none">{format(eventDate, "dd")}</span>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter">{format(eventDate, "MMM", { locale: hi })}</span>
                  </div>

                  {/* Corner Label */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-orange-600/90 text-[10px] font-black text-white border-none shadow-sm px-2 py-0.5">
                      {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क"}
                    </Badge>
                  </div>
                </div>

                {/* Content Section - Tightened Padding */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-widest mb-2">
                    <Timer className="w-3 h-3" />
                    <span>आगामी उत्सव</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {seatsAvailable !== null && (
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                        <Users className="h-3.5 w-3.5 text-amber-500" />
                        <span>{isFull ? "सीटें भरी हुई हैं" : `${seatsAvailable} सीटें शेष`}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 text-xs font-medium line-clamp-2 leading-relaxed mb-6">
                    {event.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between group-hover:border-orange-100 transition-colors">
                    <div className="flex items-center gap-1.5 text-slate-900 font-black text-[11px] uppercase tracking-wider">
                      विवरण देखें
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Action */}
        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-slate-900 font-black text-sm hover:text-orange-600 transition-all border-b-2 border-slate-900 hover:border-orange-600 pb-1"
          >
            सभी कार्यक्रम देखें
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
