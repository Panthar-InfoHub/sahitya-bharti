import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PersonCard } from "@/components/person-card"
import { statesMock } from "@/mock/statesMock"
import { transliterateText } from "@/lib/transliterate"
import { createClient } from "@/lib/supabase/server"
import { peopleMock } from "@/mock/peopleMock"
import { positionsMock } from "@/mock/positionsMock"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    stateCode: string
    cityName: string
  }>
}

export default async function CityPage({ params }: PageProps) {
  const { stateCode, cityName } = await params
  const decodedCityName = decodeURIComponent(cityName)

  const state = statesMock.find((s) => s.code.toLowerCase() === stateCode.toLowerCase())
  
  // Try to find the city in mock to get Hindi name if available
  // Robust matching
  const mockCity = state?.cities.find((c) => {
      const dbName = decodedCityName.toLowerCase();
      const mockName = c.nameEn.toLowerCase();
      return dbName === mockName || dbName.includes(mockName) || mockName.includes(dbName);
  })
  
  let cityDisplayNameHi = mockCity?.nameHi || decodedCityName
  const cityDisplayNameEn = mockCity?.nameEn || decodedCityName

  // Dynamic Transliteration (Server Side) if not found in mock
  if (!mockCity) {
      const map = await transliterateText([decodedCityName]);
      if (map[decodedCityName]) {
          cityDisplayNameHi = map[decodedCityName];
      }
  }


  if (!state) {
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
              सभी राज्य देखें
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  /* 
   * FETCH DATA FROM SUPABASE
   */
  const supabase = await createClient()
  
  // Fetch members that match the state and city
  // Note: member.state and member.city are stored as English names from country-state-city
  // but stateCode/cityId are from our mock data.
  // We need to match the mock data NAMES to the DB names.
  
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .eq("state", state.nameEn) // Assuming DB has "Delhi" (English)
    .eq("city", decodedCityName) // Use the decoded URL param directly (e.g. "Jhansi")

  if (error) {
    console.error("Error fetching members:", error)
    // Handle error gracefully or show empty state
  }

  // Transform members to Person type
  const peopleInCity = (members || []).map((m: any) => ({
    id: m.id,
    nameHi: `${m.first_name} ${m.last_name}`, // Fallback to English names if no Hindi specific field
    nameEn: `${m.first_name} ${m.last_name}`,
    positionId: "1", // Default to first position or map based on m.position string?
                     // For now, let's group by the string position they entered.
                     // But the UI expects `positionsMock`. 
                     // We might need to dynamically create groups based on unique positions found in DB.
    image: m.profile_picture || "male", // PersonCard logic might need update if it expects 'male'/'female' string vs URL
    imageUrl: m.profile_picture, // Add this prop to Person interface if needed or map to image
    email: m.email,
    phone: m.phone_number,

    city: cityDisplayNameHi, // Use the localized city name we resolved above
    state: state?.nameHi || m.state, // Use localized state name
    // Add ad-hoc position property for grouping
    position: m.position || "Member"
  }))


  // Group by Position (Dynamic)
  // We can't strictly use positionsMock if users type random positions.
  // Let's group by the distinct positions found in the data.
  

  
  // Transliterate positions
  const uniquePositions = Array.from(new Set(peopleInCity.map((p: any) => p.position))) as string[]
  const posTransliteration = await transliterateText(uniquePositions);

  const peopleByPosition = uniquePositions.map(pos => {
      const localizedPos = posTransliteration[pos] || pos;
      return {
          position: {
              id: pos,
              positionHi: localizedPos, // Use transliterated Hindi
              positionEn: pos
          },
          people: peopleInCity.filter((p: any) => p.position === pos)
      }
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href={`/states/${stateCode}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {state.nameHi} वापस जाएं
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-accent uppercase tracking-wide">शहर की जानकारी</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{cityDisplayNameHi}</h1>
            <p className="text-lg text-muted-foreground">{state.nameHi}</p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-accent">✦</span>
          </div>

          {/* Positions and People */}
          {peopleByPosition.length > 0 ? (
            <div className="space-y-16">
              {peopleByPosition.map((group: any) => (
                <div key={group.position.id}>
                  {/* Position Header */}
                  <div className="text-center mb-8 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">{group.position.positionHi}</h2>
                    <p className="text-sm text-muted-foreground">{group.position.positionEn}</p>
                  </div>

                  {/* People Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.people.map((person: any) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">इस शहर से अभी कोई सदस्य नहीं है।</p>
              <Link
                href="/states"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                सभी राज्य देखें
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
