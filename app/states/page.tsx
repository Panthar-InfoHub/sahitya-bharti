"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { statesMock } from "@/mock/statesMock"

export default function StatesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">भारत के हिंदी क्षेत्र</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">सभी राज्य</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              हिंदी साहित्य भारती की सभी क्षेत्रीय शाखाएं। अपने राज्य को चुनें।
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-primary">✦</span>
          </div>

          {/* States Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {statesMock.map((state) => (
              <Link key={state.id} href={`/states/${state.code.toLowerCase()}`} className="group">
                <div className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                  {/* Background gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-300"></div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* State name */}
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {state.nameHi}
                    </h3>

                    {/* English name */}
                    <p className="text-sm text-muted-foreground">{state.nameEn}</p>

                    {/* Cities count */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-primary uppercase">शहर: {state.cities.length}</span>
                      <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
