import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PersonCard } from "@/components/person-card"
import { positionsMock } from "@/mock/positionsMock"
import { peopleMock } from "@/mock/peopleMock"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    positionId: string
  }>
}

export default async function PositionPage({ params }: PageProps) {
  const { positionId } = await params

  const position = positionsMock.find((p) => p.id === positionId)
  const peopleInPosition = peopleMock.filter((p) => p.positionId === positionId)

  if (!position) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <p className="text-xl font-bold text-foreground">पद नहीं मिला</p>
            <Link
              href="/kendriya"
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/kendriya"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            वापस जाएं
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">पद विवरण</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">{position.positionHi}</h1>
            <p className="text-lg text-muted-foreground">{position.positionEn}</p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-accent">✦</span>
          </div>

          {/* People in this position */}
          {peopleInPosition.length > 0 ? (
            <div>
              <p className="text-center text-muted-foreground mb-12 text-lg">इस पद में काम कर रहे सदस्य</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {peopleInPosition.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground">इस पद के लिए अभी कोई सदस्य नहीं है।</p>
              <Link
                href="/kendriya"
                className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                सभी पद देखें
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
