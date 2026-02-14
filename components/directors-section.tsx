"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DirectorCard } from "./director-card"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"


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
  display_order: number // Added display_order
}

export function DirectorsSection() {
  const [nationalMembers, setNationalMembers] = useState<Director[]>([])
  const [internationalMembers, setInternationalMembers] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Fetch directly from the dedicated directors table
    const { data, error } = await supabase
      .from('directors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    
    if (!error && data) {
         // Filter National
        const national = data.filter((m: any) => m.category === 'national')
        // Filter International
        const international = data.filter((m: any) => m.category === 'international')

        setNationalMembers(national)
        setInternationalMembers(international)
    }
    setLoading(false)
  }

  return (
    <section className="py-16 bg-linear-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
            Leadership Board
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900">
            निदेशक मंडल (Directors)
          </h2>
          <div className="w-24 h-1.5 bg-linear-to-r from-orange-400 to-amber-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-stone-500 font-medium">
            हिंदी साहित्य भारती को वैश्विक ऊंचाइयों तक ले जाने वाले हमारे सम्मानित राष्ट्रीय एवं अंतर्राष्ट्रीय पदाधिकारी
          </p>
        </div>

        <Tabs defaultValue="national" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="national" className="flex-1">
              राष्ट्रीय निदेशक (National)
            </TabsTrigger>
            <TabsTrigger value="international" className="flex-1">
              अंतर्राष्ट्रीय निदेशक (International)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="national" className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">लोड हो रहा है...</span>
              </div>
            ) : nationalMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                कोई राष्ट्रीय निदेशक नहीं मिला (No National Directors found)
              </p>
            ) : (
              <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nationalMembers.slice(0, 6).map((director) => (
                      <DirectorCard key={director.id} director={director} />
                    ))}
                  </div>
                  
                  <div className="flex justify-center pt-8">
                      <Button asChild variant="outline" className="gap-2">
                         <Link href="/national-team">
                            सभी राष्ट्रीय निदेशक देखें (View All National Directors)
                            <ArrowRight className="h-4 w-4" />
                         </Link>
                      </Button>
                  </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="international" className="space-y-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">लोड हो रहा है...</span>
              </div>
            ) : internationalMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                कोई अंतर्राष्ट्रीय निदेशक नहीं मिला (No International Directors found)
              </p>
            ) : (
               <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internationalMembers.slice(0, 6).map((director) => (
                      <DirectorCard key={director.id} director={director} />
                    ))}
                  </div>

                  <div className="flex justify-center pt-8">
                      <Button asChild variant="outline" className="gap-2">
                         <Link href="/international">
                            सभी अंतर्राष्ट्रीय सदस्य देखें (Explore All International Members)
                            <ArrowRight className="h-4 w-4" />
                         </Link>
                      </Button>
                  </div>
               </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
