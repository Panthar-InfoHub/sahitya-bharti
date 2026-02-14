
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PersonCard } from "@/components/person-card"
import { createClient } from "@/lib/supabase/server"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    country: string
    city: string
  }>
}

export default async function InternationalCityPage({ params }: PageProps) {
  const { country, city } = await params
  const decodedCountry = decodeURIComponent(country)
  const decodedCity = decodeURIComponent(city)

  const supabase = await createClient()

  // Fetch members
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .ilike("nation", decodedCountry)
    .ilike("city", decodedCity)

  if (error) {
    console.error("Error fetching members:", error)
  }

  // Transform members
  const peopleInCity = (members || []).map((m: any) => ({
    id: m.id,
    // Use stored names. If Hindi logic is needed, we'd need translation service.
    // For International, English is primary.
    nameHi: `${m.first_name} ${m.last_name}`, 
    nameEn: `${m.first_name} ${m.last_name}`,
    positionId: "1", // Dummy ID
    image: m.profile_picture || "male",
    imageUrl: m.profile_picture,
    email: m.email,
    phone: m.phone_number,
    city: decodedCity,
    state: decodedCountry, // Use Country as State equivalent
    position: m.position || "Member"
  }))

  // Group by Position
  // Get unique positions
  const uniquePositions = Array.from(new Set(peopleInCity.map((p: any) => p.position))) as string[]
  
  // Sort positions? Maybe alphabetically
  uniquePositions.sort()

  const peopleByPosition = uniquePositions.map(pos => {
      return {
          position: {
              id: pos,
              positionHi: pos, // Just use English/Stored name
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
            href={`/international/${encodeURIComponent(decodedCountry.toLowerCase())}`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {decodedCountry}
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-accent uppercase tracking-wide">City Unit</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground capitalize">{decodedCity}</h1>
            <p className="text-lg text-muted-foreground">{decodedCountry}</p>
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
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary capitalize">{group.position.positionHi}</h2>
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
              <p className="text-muted-foreground">No members found in this city unit.</p>
              <Link
                href="/international"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                View All Countries
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
