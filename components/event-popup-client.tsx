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
    <div className="fixed top-1/2 -translate-y-1/2 right-6 z-50 w-[calc(100%-3rem)] max-w-[260px] animate-in slide-in-from-right-10 fade-in duration-500">
      <div className="group relative bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 p-2 bg-white text-slate-500 hover:text-red-500 rounded-full transition-all duration-200 shadow-lg border border-slate-100 hover:scale-110 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col bg-white">
          {/* Image Section */}
          <div className="relative w-full h-36 bg-slate-50 overflow-hidden flex-shrink-0">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-amber-50">
                <Calendar className="h-12 w-12 text-orange-200" />
              </div>
            )}

            {/* Status Badge Over Image */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              आगामी कार्यक्रम
            </div>
          </div>

          {/* Portrait Content Section */}
          <div className="p-4">
            <h3 className="font-bold text-lg leading-snug text-slate-900 line-clamp-2 mb-3 group-hover:text-orange-600 transition-colors">
              {event.title}
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <Calendar className="h-3 w-3" />
                </div>
                <span>{format(new Date(event.date), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="line-clamp-1">
                  {event.location}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full h-10 bg-slate-900 hover:bg-orange-600 text-white rounded-xl shadow-md transition-all duration-300"
              asChild
            >
              <Link href="/events" className="flex items-center justify-center gap-2">
                <span className="font-bold text-sm">विवरण देखें</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
