"use client"

import { useState, useEffect } from "react"
import { X, Calendar, MapPin, ChevronRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

interface EventPopupClientProps {
  events: any[]
}

export function EventPopupClient({ events }: EventPopupClientProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => setIsMounted(false), 500) // Unmount after animation finishes
  }

  if (!isMounted || !events || events.length === 0) return null

  return (
    <div className="fixed top-20 md:top-24 right-4 md:right-8 z-50 h-[75vh] md:h-[80vh] pointer-events-none flex justify-end">
      {/* Drawer */}
      <div 
        className={`relative h-full w-[340px] max-w-[calc(100vw-2rem)] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-3xl pointer-events-auto flex flex-col border border-slate-100 overflow-hidden transition-all duration-500 ease-in-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600">
                <Bell className="h-5 w-5 animate-pulse" />
             </div>
             <div>
                <h2 className="font-bold text-lg text-slate-900 leading-tight">आगामी कार्यक्रम</h2>
                <p className="text-xs text-slate-500 font-medium tracking-wide">(Upcoming Events)</p>
             </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* scrollable events list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {events.map((event, idx) => (
            <div 
              key={event.id || idx} 
              className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
                {/* Image Area */}
                <div className="relative w-full h-32 bg-slate-100 overflow-hidden">
                    {event.image_url ? (
                    <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />
                    ) : (
                    <div className="flex items-center justify-center h-full bg-linear-to-br from-orange-50 to-amber-100">
                        <Calendar className="h-10 w-10 text-orange-200/80" />
                    </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                       New
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4">
                    <h3 className="font-bold text-sm leading-snug text-slate-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                            <Calendar className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            <span>{format(new Date(event.date), "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </div>
                    
                    <Link href={`/events/${event.id || ''}`}>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800 rounded-xl transition-colors group-hover:border-orange-400"
                        >
                            विवरण देखें 
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100">
           <Button
              className="w-full bg-slate-900 hover:bg-orange-600 text-white rounded-xl shadow-md transition-colors"
              asChild
            >
              <Link href="/events" className="flex items-center justify-center font-bold">
                 सभी कार्यक्रम देखें (View All)
              </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}
