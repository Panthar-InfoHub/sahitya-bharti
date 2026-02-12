"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DirectorCard } from "./director-card"
import { Loader2 } from "lucide-react"

interface Director {
  id: string
  name: string
  title: string
  category: 'national' | 'international'
  photo_url: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  display_order: number
}

export function DirectorsSection() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('directors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (!error && data) {
      setDirectors(data)
    }
    setLoading(false)
  }

  const nationalDirectors = directors.filter(d => d.category === 'national')
  const internationalDirectors = directors.filter(d => d.category === 'international')

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-center mb-2">
          निदेशक मंडल
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          हमारे राष्ट्रीय और अंतर्राष्ट्रीय निदेशक
        </p></div>

        <Tabs defaultValue="national" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="national" className="flex-1">
              राष्ट्रीय निदेशक
            </TabsTrigger>
            <TabsTrigger value="international" className="flex-1">
              अंतर्राष्ट्रीय निदेशक
            </TabsTrigger>
          </TabsList>

          <TabsContent value="national">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">लोड हो रहा है...</span>
                </div>
              ) : nationalDirectors.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  कोई राष्ट्रीय निदेशक नहीं मिला
                </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nationalDirectors.map((director) => (
                  <DirectorCard key={director.id} director={director} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="international">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">लोड हो रहा है...</span>
                </div>
              ) : internationalDirectors.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  कोई अंतर्राष्ट्रीय निदेशक नहीं मिला
                </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internationalDirectors.map((director) => (
                  <DirectorCard key={director.id} director={director} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
