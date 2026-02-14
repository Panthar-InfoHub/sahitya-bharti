import { createClient } from "@/lib/supabase/server"
import { statesMock } from "@/mock/statesMock"
import { BranchesClient } from "@/components/branches-client"
import { Country } from "country-state-city"

export async function BranchesSection() {
  const supabase = await createClient()

  // Fetch all members' locations to calculate counts
  const { data: members } = await supabase
    .from("members")
    .select("state, city, nation")

  // Calculate distinct stats
  const nationalMap = new Map<string, Set<string>>()
  const internationalMap = new Map<string, Set<string>>() // Country -> Set of Cities

  if (members) {
    members.forEach((m) => {
       const nation = m.nation || "India" // Default to India
       const city = m.city ? m.city.toLowerCase() : null
       
       if (nation === "India") {
           if (m.state && city) {
               const stateKey = m.state.toLowerCase()
               if (!nationalMap.has(stateKey)) {
                   nationalMap.set(stateKey, new Set())
               }
               nationalMap.get(stateKey)?.add(city)
           }
       } else {
           // International
           if (city) {
               // Use nation name as key
               if (!internationalMap.has(nation)) {
                   internationalMap.set(nation, new Set())
               }
               internationalMap.get(nation)?.add(city)
           }
       }
    })
  }

  // --- Process National Stats ---
  const nationalStats = statesMock
      .map((state) => {
        const stateKey = state.nameEn.toLowerCase()
        const uniqueCityCount = nationalMap.get(stateKey)?.size || 0
        return { 
            code: state.code,
            name: state.nameHi,
            nameEn: state.nameEn,
            count: uniqueCityCount,
            type: 'state' as const
        }
      })
      .filter((state) => state.count > 0)
      .sort((a, b) => b.count - a.count) // Sort by count desc
      
  // --- Process International Stats ---
  const allCountries = Country.getAllCountries()
  const internationalStats = Array.from(internationalMap.entries()).map(([nationName, citiesSet]) => {
      const countryInfo = allCountries.find(c => c.name === nationName)
      return {
          code: countryInfo ? countryInfo.isoCode : nationName, // Fallback to name if code not found
          name: nationName, // English name mostly
          nameEn: nationName,
          count: citiesSet.size,
          type: 'country' as const
      }
  })

  // Sort international by count desc
  internationalStats.sort((a, b) => b.count - a.count)

  return (
    <BranchesClient 
        nationalStats={nationalStats} 
        internationalStats={internationalStats} 
    />
  )
}
