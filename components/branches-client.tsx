
"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, MapPin } from "lucide-react"

interface BranchStat {
  code: string // State Code or Country ISO/Name
  name: string // Display Name (Hindi/English)
  nameEn: string // English Name for URL
  count: number // Unique City Count
  type: 'state' | 'country'
}

interface BranchesClientProps {
  nationalStats: BranchStat[]
  internationalStats: BranchStat[]
}

export function BranchesClient({ nationalStats, internationalStats }: BranchesClientProps) {
  const [activeTab, setActiveTab] = useState<'national' | 'international'>('national')

  const currentStats = activeTab === 'national' ? nationalStats : internationalStats
  // Limit to 6
  const displayStats = currentStats.slice(0, 6)

  // Don't hide whole section if one is empty, hide if BOTH are empty.
  // Actually parent might do that. Child render will handle empty tabs.
  if (nationalStats.length === 0 && internationalStats.length === 0) return null

  return (
    <section className="py-16 sm:py-20 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-3">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी शाखाएं (Our Branches)</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
             {activeTab === 'national' ? 'भारत के राज्य (National)' : 'वैश्विक उपस्थिति (International)'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
             {activeTab === 'national' 
                ? "पूरे भारत में हमारी उपस्थिति है। अपने राज्य को खोजें और हमसे जुड़ें।" 
                : "साहित्य भारती का विस्तार विश्व भर में हो रहा है।"}
          </p>
        </div>

        {/* Toggle / Tabs */}
        <div className="flex justify-center mb-12">
            <div className="bg-secondary/30 p-1 rounded-full flex gap-1 items-center">
                <button
                    onClick={() => setActiveTab('national')}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'national' 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                    }`}
                >
                    <MapPin className="h-4 w-4" />
                    राष्ट्रीय (National)
                </button>
                <button
                    onClick={() => setActiveTab('international')}
                    className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === 'international' 
                        ? 'bg-primary text-primary-foreground shadow-md' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                    }`}
                >
                    <Globe className="h-4 w-4" />
                    अंतर्राष्ट्रीय (International)
                </button>
            </div>
        </div>

        {/* Ornamental Divider */}
        <div className="flex justify-center mb-12 opacity-50">
          <span className="text-2xl text-primary">✦</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStats.length > 0 ? (
              displayStats.map((item) => (
                <Link 
                    key={item.code} 
                    href={item.type === 'state' ? `/states/${item.code.toLowerCase()}` : `/international/${item.nameEn.toLowerCase()}`} 
                    className="group h-full block"
                >
                  <div className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden h-full">
                    {/* Background gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      {/* Name */}
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 truncate" title={item.name}>
                        {item.name}
                      </h3>

                      {/* Cities count */}
                      <div className="flex items-center justify-between pt-2 mt-auto">
                        <span className="text-xs font-semibold text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                             शहर: {item.count}
                        </span>
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
          ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground bg-secondary/10 rounded-lg border border-dashed border-secondary">
                    <p>इस श्रेणी में अभी कोई इकाइयां नहीं हैं (No active units found).</p>
                </div>
          )}
        </div>

        {/* CTA - See all */}
        <div className="text-center mt-12">
          <Link
            href={activeTab === 'national' ? "/states" : "/international"}
            className="inline-block px-8 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
          >
            {activeTab === 'national' ? "सभी राज्य देखें" : "सभी देश देखें"}
          </Link>
        </div>
      </div>
    </section>
  )
}
