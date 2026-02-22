"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, User, MapPin, Mail, Phone } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Trustee {
  id: string
  name: string
  description: string | null
  address: string | null
  email: string | null
  phone: string | null
  type: 'national' | 'international'
  photo_url: string | null
  display_order: number
}

export function TrusteesSection() {
  const [nationalTrustees, setNationalTrustees] = useState<Trustee[]>([])
  const [internationalTrustees, setInternationalTrustees] = useState<Trustee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrustees()
  }, [])

  const fetchTrustees = async () => {
    setLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from('trustees')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (!error && data) {
      setNationalTrustees(data.filter((t: any) => t.type === 'national'))
      setInternationalTrustees(data.filter((t: any) => t.type === 'international'))
    }
    setLoading(false)
  }

  const TrusteeCard = ({ trustee }: { trustee: Trustee }) => (
    <div className="w-full max-w-[320px] mx-auto group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-blue-100 flex flex-col items-center text-center overflow-hidden h-full">
      {/* Floating Background Accent */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent -z-10 group-hover:h-full group-hover:bg-blue-50/20 transition-all duration-700" />

      {/* Optimized Head-to-Chest Avatar */}
      <div className="relative w-44 h-56 shrink-0 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100" />
        {trustee.photo_url ? (
          <img
            src={trustee.photo_url}
            alt={trustee.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-blue-600/20">
              {trustee.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Information Area */}
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="space-y-2 mb-4 w-full">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            {trustee.type === 'national' ? 'राष्ट्रीय ट्रस्टी' : 'अंतर्राष्ट्रीय ट्रस्टी'}
          </p>
          <h3 className="text-xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors duration-300">
            {trustee.name}
          </h3>
          {trustee.address && (
            <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-stone-500 leading-relaxed uppercase w-full">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              <span className="truncate max-w-[200px]">{trustee.address}</span>
            </p>
          )}
          {trustee.description && (
             <p className="text-xs text-stone-500 line-clamp-2 mt-2 font-medium">
               {trustee.description}
             </p>
          )}
        </div>

        {/* Social Links Row */}
        <div className="flex gap-2.5 mt-auto pt-4">
          {trustee.email && (
            <a
              href={`mailto:${trustee.email}`}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {trustee.phone && (
            <a
              href={`tel:${trustee.phone}`}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest">
            संरक्षक व मार्गदर्शक
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            सम्मानित ट्रस्टी
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-slate-500 font-medium">
            संस्था को दिशा एवं ऊर्जा प्रदान करने वाले हमारे आदरणीय ट्रस्टीगण
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-500 font-medium">ट्रस्टी लोड हो रहे हैं...</span>
          </div>
        ) : (
          <Tabs defaultValue="national" className="w-full">
            <TabsList className="flex w-full max-w-lg mx-auto bg-slate-200/50 p-1.5 rounded-2xl mb-12">
              <TabsTrigger value="national" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all">
                राष्ट्रीय ट्रस्टी
              </TabsTrigger>
              <TabsTrigger value="international" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all">
                अंतर्राष्ट्रीय ट्रस्टी
              </TabsTrigger>
            </TabsList>

            <TabsContent value="national" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {nationalTrustees.length === 0 ? (
                <p className="text-center text-slate-400 py-12 font-medium">
                  कोई रिकॉर्ड नहीं मिला
                </p>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {nationalTrustees.map((trustee) => (
                    <TrusteeCard key={trustee.id} trustee={trustee} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="international" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {internationalTrustees.length === 0 ? (
                <p className="text-center text-slate-400 py-12 font-medium">
                  कोई रिकॉर्ड नहीं मिला
                </p>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {internationalTrustees.map((trustee) => (
                    <TrusteeCard key={trustee.id} trustee={trustee} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  )
}
