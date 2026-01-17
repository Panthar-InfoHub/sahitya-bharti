"use client"

import Link from "next/link"
import { statesMock } from "@/mock/statesMock"

export function BranchesSection() {
  const displayStates = statesMock.slice(0, 6)

  return (
    <section className="py-16 sm:py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी शाखाएं</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">भारत के राज्य</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            पूरे भारत में हमारी उपस्थिति है। अपने राज्य को खोजें और हमसे जुड़ें।
          </p>
        </div>

        {/* Ornamental Divider */}
        <div className="flex justify-center mb-12">
          <span className="text-2xl text-primary">✦</span>
        </div>

        {/* States Grid - 6 items only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStates.map((state) => (
            <Link key={state.id} href={`/states/${state.code.toLowerCase()}`} className="group">
              <div className="relative overflow-hidden rounded-lg h-48 bg-gradient-to-br from-muted to-muted/50 border border-border hover:border-primary/50 transition-all duration-300">
                {/* Blurred background state map effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300"></div>

                {/* Hover scale and shadow effect */}
                <div className="absolute inset-0 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {state.nameHi}
                    </h3>
                    <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {state.cities.length} शहर
                    </p>
                  </div>
                </div>

                {/* Soft shadow effect on hover */}
                <div className="absolute inset-0 group-hover:shadow-lg group-hover:shadow-primary/20 rounded-lg transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA - See all states */}
        <div className="text-center mt-12">
          <Link
            href="/states"
            className="inline-block px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
          >
            सभी राज्य देखें
          </Link>
        </div>
      </div>
    </section>
  )
}
