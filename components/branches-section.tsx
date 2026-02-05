import Link from "next/link"
import { statesMock } from "@/mock/statesMock"
import { createClient } from "@/lib/supabase/server"

export async function BranchesSection() {
  const supabase = await createClient()

  // Fetch all members' locations to calculate counts
  const { data: members } = await supabase
    .from("members")
    .select("state, city")

  // Calculate unique cities per state
  const stateCityMap = new Map<string, Set<string>>()

  if (members) {
    members.forEach((m) => {
       if (m.state && m.city) {
           const stateKey = m.state.toLowerCase()
           if (!stateCityMap.has(stateKey)) {
               stateCityMap.set(stateKey, new Set())
           }
           stateCityMap.get(stateKey)?.add(m.city.toLowerCase())
       }
    })
  }

  // Filter states that have at least one city
  const activeStates = statesMock
      .map((state) => {
        const stateKey = state.nameEn.toLowerCase()
        const uniqueCityCount = stateCityMap.get(stateKey)?.size || 0
        return { ...state, uniqueCityCount }
      })
      .filter((state) => state.uniqueCityCount > 0)
      
  // Limit to 6 for the landing page
  const displayStates = activeStates.slice(0, 6)

  // If no states are active yet, maybe show some default ones or empty state?
  // But strictly following user Request: "only show the states which exists with positions"
  // So if 0, show 0.

  if (displayStates.length === 0) return null

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

        {/* States Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStates.map((state) => (
            <Link key={state.id} href={`/states/${state.code.toLowerCase()}`} className="group">
              <div className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden h-full">
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
                    <span className="text-xs font-semibold text-primary uppercase">शहर: {state.uniqueCityCount}</span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      →
                    </span>
                  </div>
                </div>
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
