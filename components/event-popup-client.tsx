"use client"

import { useState, useEffect } from "react"
import { X, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

interface EventPopupClientProps {
  event: any
}

export function EventPopupClient({ event }: EventPopupClientProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if popup was already closed in this session
    const isClosed = sessionStorage.getItem("event_popup_closed")
    if (!isClosed) {
      // Small delay to make it pop in nicely
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    sessionStorage.setItem("event_popup_closed", "true")
  }

  if (!isVisible || !event) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-500 sm:bottom-8 sm:right-8">
      <div className="relative bg-white rounded-xl shadow-2xl border border-primary/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-1 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Image */}
        <div className="relative h-32 w-full bg-slate-100">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
             <div className="flex items-center justify-center h-full text-slate-400 bg-gradient-to-br from-orange-50 to-amber-100">
               <Calendar className="h-10 w-10 text-primary/40" />
             </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded shadow-sm">
             आगामी (Upcoming)
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-primary">
            {event.title}
          </h3>
          
          <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          <div className="flex gap-2">
             <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white" asChild>
                <Link href="/events">
                   विवरण देखें (View Details)
                </Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
