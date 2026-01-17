"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { positionsMock } from "@/mock/positionsMock"

export default function KendriayPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">संगठन संरचना</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">केंद्रीय कार्यकारिणी</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              हिंदी साहित्य भारती की केंद्रीय कार्यकारिणी और महत्वपूर्ण पद
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-primary">✦</span>
          </div>

          {/* Positions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {positionsMock.map((position) => (
              <Link key={position.id} href={`/kendriya/${position.id}`}>
                <div className="group relative h-full bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4 h-full flex flex-col">
                    {/* Number */}
                    <span className="text-4xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors duration-300">
                      {String(position.order).padStart(2, "0")}
                    </span>

                    {/* Position title */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {position.positionHi}
                      </h3>
                      <p className="text-xs text-muted-foreground">{position.positionEn}</p>
                    </div>

                    {/* Arrow */}
                    <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-lg">→</span>
                    </div>
                  </div>

                  {/* Hover border effect */}
                  <div className="absolute inset-0 border-2 border-primary rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info box */}
          <div className="mt-16 p-8 bg-card border border-border rounded-lg text-center space-y-3">
            <p className="text-foreground">किसी पद के बारे में अधिक जानकारी के लिए उपरोक्त पदों पर क्लिक करें।</p>
            <p className="text-sm text-muted-foreground">हर पद में काम करने वाले सदस्यों की जानकारी और संपर्क विवरण देखें।</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
