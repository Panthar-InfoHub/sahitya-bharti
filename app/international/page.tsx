
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { Country } from "country-state-city"
import { Globe } from "lucide-react"

export default async function InternationalPage() {
  const supabase = await createClient()

  // Fetch distinct countries and cities where members exist
  const { data: members } = await supabase
    .from("members")
    .select("nation, city")
    
  // Map: CountryName -> Set(CityNames)
  const countryCityMap = new Map<string, Set<string>>()

  if (members) {
    members.forEach((m) => {
       const nation = m.nation || "India"
       // Filter out India as this is the international page
       if (nation !== "India" && m.city) {
           if (!countryCityMap.has(nation)) {
               countryCityMap.set(nation, new Set())
           }
           countryCityMap.get(nation)?.add(m.city.toLowerCase())
       }
    })
  }

  const allCountries = Country.getAllCountries()

  const countries = Array.from(countryCityMap.entries()).map(([nationName, citiesSet]) => {
      const countryInfo = allCountries.find(c => c.name === nationName)
      return {
          code: countryInfo ? countryInfo.isoCode : "UN", // Unknown flag fallback
          name: nationName,
          slug: encodeURIComponent(nationName.toLowerCase()),
          cityCount: citiesSet.size
      }
  }).sort((a,b) => b.cityCount - a.cityCount) // Sort by count

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">वैश्विक उपस्थिति (Global Presence)</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">सभी देश (International Units)</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              साहित्य भारती का अंतर्राष्ट्रीय विस्तार। उन देशों को देखें जहाँ हमारी उपस्थिति है।
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <Globe className="w-8 h-8 text-primary opacity-50" />
          </div>

          {/* Countries Grid */}
          {countries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {countries.map((country) => (
                <Link key={country.name} href={`/international/${country.slug}`} className="group">
                  <div className="relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden h-full">
                    {/* Background gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      {/* Country name */}
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {country.name}
                      </h3>

                      {/* City count */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-semibold text-primary uppercase">Cities Units: {country.cityCount}</span>
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          ) : (
                <div className="text-center py-20 text-muted-foreground bg-secondary/10 rounded-lg border border-dashed border-secondary">
                    <p>वर्तमान में कोई अंतर्राष्ट्रीय इकाई सक्रिय नहीं है (No active international units found).</p>
                </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
