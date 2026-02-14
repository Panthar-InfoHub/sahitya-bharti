
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { Country, City } from "country-state-city"
import { ChevronLeft, MapPin } from "lucide-react"

interface PageProps {
  params: Promise<{
    country: string
  }>
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params
  const decodedCountry = decodeURIComponent(country)
  
  // Find Country Info
  // Match by name
  const allCountries = Country.getAllCountries()
  const countryInfo = allCountries.find(c => c.name.toLowerCase() === decodedCountry.toLowerCase())
  
  // Use country name from URL or decoded directly
  const displayCountryName = countryInfo ? countryInfo.name : decodedCountry

  const supabase = await createClient()

  // Fetch distinct cities for this country from DB
  const { data: members } = await supabase
    .from("members")
    .select("city, nation")
    // Match nation name
    // Assuming DB stores "United States", "Nepal", etc.
    // Case insensitive match? Supabase uses ILIKE
    .ilike("nation", decodedCountry)

  // Get unique cities
  // Use Set to deduplicate
  const uniqueCities = Array.from(new Set(members?.map(m => m.city).filter(Boolean) as string[]))

  // Sort cities
  uniqueCities.sort((a,b) => a.localeCompare(b))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/international"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            सभी देश (All Countries)
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wide">देश की जानकारी (Country Units)</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{displayCountryName}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
               Cities where Sahitya Bharti has established units.
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-secondary">✦</span>
          </div>

          {/* Cities Grid */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">शहर (Cities)</h2>
            {uniqueCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueCities.map((cityName) => (
                <Link key={cityName} href={`/international/${encodeURIComponent(decodedCountry.toLowerCase())}/${encodeURIComponent(cityName.toLowerCase())}`} className="group">
                  <div className="relative bg-card border border-border rounded-lg p-6 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300 capitalize">
                        {cityName}
                      </h3>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-semibold text-secondary uppercase flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            View Unite
                        </span>
                        <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground bg-secondary/5 rounded-lg border border-dashed">
                    There are no active city units listed for {displayCountryName} yet.
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
