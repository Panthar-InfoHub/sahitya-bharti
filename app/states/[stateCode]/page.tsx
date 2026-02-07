import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { statesMock } from "@/mock/statesMock"
import { transliterateText } from "@/lib/transliterate"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
  params: Promise<{
    stateCode: string
  }>
}

export default async function StatePage({ params }: PageProps) {
  const { stateCode } = await params

  const stateMock = statesMock.find((s) => s.code.toLowerCase() === stateCode.toLowerCase())

  // If state is not in mock, we technically could still show it if we have a generic state handler,
  // but for now, we assume states are limited to our supported list (mock).
  // If we want to support any state, we'd need a fallback for stateName.
  
  if (!stateMock) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <p className="text-xl font-bold text-foreground">राज्य नहीं मिला</p>
            <Link
              href="/states"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              वापस जाएं
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const supabase = await createClient()

  // Fetch distinct cities for this state from DB
  const { data: members } = await supabase
    .from("members")
    .select("city")
    .eq("state", stateMock.nameEn) // Match valid members in this state

  // Get unique cities
  const uniqueCities = Array.from(new Set(members?.map(m => m.city).filter(Boolean) as string[]))

  // Map cities to display format
  // Try to find in mock for Hindi name, else use English name
  
  // 1. Identify cities that need transliteration (not in mock)
  const citiesToTransliterate = uniqueCities.filter(cityName => {
      const mockCity = stateMock.cities.find(c => {
          const dbName = cityName.toLowerCase();
          const mockName = c.nameEn.toLowerCase();
          return dbName === mockName; // Strict match for mock
      });
      return !mockCity;
  });

  // 2. Fetch translations in parallel (Server Side)
  const transliteratedMap = await transliterateText(citiesToTransliterate);

  const displayCities = uniqueCities.map(cityName => {
      // Robust matching for display
      const mockCity = stateMock.cities.find(c => {
          const dbName = cityName.toLowerCase();
          const mockName = c.nameEn.toLowerCase();
          return dbName === mockName || dbName.includes(mockName) || mockName.includes(dbName);
      });
      
      const dynamicHindi = transliteratedMap[cityName];

      return {
          id: mockCity?.id || cityName, // Use ID if valid, else name as ID
          nameEn: cityName,
          nameHi: mockCity?.nameHi || dynamicHindi || cityName, // Priority: Mock > Dynamic > English
          slug: cityName // Encoded in URL
      }
  })


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/states"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            सभी राज्य
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wide">राज्य की जानकारी</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{stateMock.nameHi}</h1>
            <p className="text-lg text-muted-foreground">{stateMock.nameEn}</p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-secondary">✦</span>
          </div>

          {/* Cities Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">शहर</h2>
            {displayCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayCities.sort((a,b) => a.nameHi.localeCompare(b.nameHi)).map((city) => (
                <Link key={city.nameEn} href={`/states/${stateMock.code.toLowerCase()}/${encodeURIComponent(city.nameEn)}`} className="group">
                  <div className="relative bg-card border border-border rounded-lg p-6 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors duration-300"></div>

                    {/* Content */}
                    <div className="relative z-10 space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors duration-300">
                        {city.nameHi}
                      </h3>
                      <p className="text-sm text-muted-foreground">{city.nameEn}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-semibold text-secondary uppercase">यहाँ क्लिक करें</span>
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
                <div className="text-center py-12 text-muted-foreground">
                    इस राज्य में अभी कोई शहर उपलब्ध नहीं है।
                </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
