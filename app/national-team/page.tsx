
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ChevronLeft, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default async function NationalTeamPage() {
  const supabase = await createClient()

  // Fetch all national directors
  const { data: directors } = await supabase
    .from("directors")
    .select("*")
    .eq("is_active", true)
    .eq("category", "national")
    .order("display_order", { ascending: true })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            मुख्य पृष्ठ (Home)
          </Link>

          {/* Header */}
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wide">राष्ट्रीय नेतृत्व (National Leadership)</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">राष्ट्रीय निर्देशक मंडल</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              हमारे राष्ट्रीय संगठन का नेतृत्व करने वाले सभी पदाधिकारी।
            </p>
          </div>

          {/* Ornamental Divider */}
          <div className="flex justify-center mb-12">
            <span className="text-3xl text-secondary">✦</span>
          </div>

          {/* People Grid */}
          {directors && directors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {directors.map((director) => (
                <div key={director.id} className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 overflow-hidden text-center">

                  <div className="w-48 h-48 mx-auto relative overflow-hidden rounded-full mb-6 bg-muted border-4 border-background shadow-md">
                    {director.photo_url ? (
                      <img src={director.photo_url} alt={director.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-muted-foreground bg-secondary/10">
                        {director.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">{director.name}</h3>
                    <p className="text-primary font-medium text-lg">{director.title}</p>

                    {director.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3 px-4">{director.bio}</p>
                    )}

                    <div className="flex justify-center gap-4 pt-4">
                      {director.email && (
                        <a href={`mailto:${director.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                      {director.phone && (
                        <a href={`tel:${director.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              कोई राष्ट्रीय निर्देशक नहीं मिला (No National Directors found)
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
