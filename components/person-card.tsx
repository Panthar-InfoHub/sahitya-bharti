"use client"

import { useState } from "react"
import Image from "next/image"
import type { Person } from "@/types/people"
import { Mail, Phone, MapPin } from "lucide-react"

interface PersonCardProps {
  person: Person
}

export function PersonCard({ person }: PersonCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="h-80 relative cursor-pointer perspective" onClick={() => setIsFlipped(!isFlipped)}>
      <div
        className="relative w-full h-full transition-transform duration-500 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front - Image and Name */}
        <div
          className="absolute w-full h-full bg-card rounded-lg border border-border overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative h-full">
            {/* Image */}
            {/* Image */}
            <img
              src={person.imageUrl || "/placeholder.svg"}
              alt={person.nameHi}
              className="h-full w-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white space-y-2">
              <h3 className="text-xl font-bold">{person.nameHi}</h3>
              <p className="text-sm opacity-90">{person.nameEn}</p>
              <p className="text-xs opacity-75 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {person.city}
              </p>
            </div>

            {/* Hover indicator */}
            <div className="absolute top-4 right-4 text-white text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              क्लिक करें
            </div>
          </div>
        </div>

        {/* Back - Contact Details */}
        <div
          className="absolute w-full h-full bg-primary text-primary-foreground rounded-lg border border-border p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold mb-3">{person.nameHi}</h3>
            </div>

            {/* Contact details */}
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${person.email}`}
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="break-all">{person.email}</span>
              </a>

              <a
                href={`tel:${person.phone}`}
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{person.phone}</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {person.city}, {person.state}
                </span>
              </div>
            </div>
          </div>

          {/* Click to flip back indicator */}
          <div className="text-xs opacity-75 text-center">क्लिक करके वापस जाएं</div>
        </div>
      </div>
    </div>
  )
}
