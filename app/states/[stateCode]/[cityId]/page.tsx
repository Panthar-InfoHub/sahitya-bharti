import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PersonCard } from "@/components/person-card"
import { statesMock } from "@/mock/statesMock"
import { peopleMock } from "@/mock/peopleMock"
import { positionsMock } from "@/mock/positionsMock"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    stateCode: string
    cityId: string
  }>
}

export default async function CityPage({ params }: PageProps) {
  const { stateCode, cityId } = await params

  const state = statesMock.find((s) => s.code.toLowerCase() === stateCode.toLowerCase())
  const city = state?.cities.find((c) => c.id === cityId)
  const peopleInCity = peopleMock.filter((p) => p.state === state?.nameHi && p.city === city?.nameHi)

  if (!state || !city) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <p className="text-xl font-bold text-foreground">शहर नहीं मिला</p>
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

  const peopleByPosition = positionsMock
    .map((position) => {
      const peoplInPosition = peopleInCity.filter((p) => p.positionId === position.id)
      return {
        position,
        people: peoplInPosition,
      }
    })
    .filter((group) => group.people.length > 0)

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
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{city.nameHi}</h1>
            <p className="text-lg text-muted-foreground">{state.nameHi}</p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-accent">✦</span>
          </div>

          {/* Positions and People */}
          {peopleByPosition.length > 0 ? (
            <div className="space-y-16">
              {peopleByPosition.map((group) => (
                <div key={group.position.id}>
                  {/* Position Header */}
                  <div className="text-center mb-8 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary">{group.position.positionHi}</h2>
                    <p className="text-sm text-muted-foreground">{group.position.positionEn}</p>
                  </div>

                  {/* People Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.people.map((person) => (
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
