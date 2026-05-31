"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2, ArrowRight, X, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DirectorCard } from "./director-card"
import { useLanguage } from "@/lib/i18n/LanguageContext"

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

// Language-aware labels (no translation key needed — inline)
const labels = {
  hi: {
    national: 'राष्ट्रीय पदाधिकारी',
    international: 'अंतर्राष्ट्रीय पदाधिकारी',
    about: 'परिचय',
    no_bio: 'विवरण उपलब्ध नहीं है।',
    close: 'बंद करें',
    call: 'कॉल करें',
    mail: 'मेल करें',
    loading: 'जानकारी प्राप्त की जा रही है...',
    no_national: 'कोई राष्ट्रीय निर्देशक नहीं मिला',
    no_international: 'कोई अंतर्राष्ट्रीय निर्देशक नहीं मिला',
    view_all_national: 'सभी राष्ट्रीय निर्देशक देखें',
    view_all_international: 'सभी अंतर्राष्ट्रीय सदस्य देखें',
  },
  en: {
    national: 'National Official',
    international: 'International Official',
    about: 'About',
    no_bio: 'No details available.',
    close: 'Close',
    call: 'Call',
    mail: 'Mail',
    loading: 'Fetching information...',
    no_national: 'No national directors found',
    no_international: 'No international directors found',
    view_all_national: 'View All National Directors',
    view_all_international: 'View All International Members',
  },
}

export function DirectorsSection() {
  const { language } = useLanguage()
  const L = labels[language] ?? labels.hi

  const [nationalMembers, setNationalMembers] = useState<Director[]>([])
  const [internationalMembers, setInternationalMembers] = useState<Director[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDirector, setActiveDirector] = useState<Director | null>(null)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    fetchMembers()

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.director-popup-card') && !target.closest('.director-main-card')) {
        setActiveDirector(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const fetchMembers = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('directors')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (!error && data) {
      setNationalMembers(data.filter((m: any) => m.category === 'national'))
      setInternationalMembers(data.filter((m: any) => m.category === 'international'))
    }
    setLoading(false)
  }

  const handleCardClick = (e: React.MouseEvent, director: Director) => {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setActiveDirector(director)
  }

  return (
    <section id="directors-section" className="py-24 bg-gradient-to-b from-white to-orange-50/50 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
      <div className="container mx-auto px-4">

        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
            नेतृत्व मंडल
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-stone-900">निर्देशक मंडल</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-stone-500 font-medium">
            हिंदी साहित्य भारती को वैश्विक ऊंचाइयों तक ले जाने वाले हमारे सम्मानित राष्ट्रीय एवं अंतर्राष्ट्रीय पदाधिकारी
          </p>
        </div>

        <Tabs defaultValue="national" className="w-full">
          <TabsList className="flex w-full max-w-lg mx-auto bg-stone-100/50 p-1.5 rounded-2xl mb-12">
            <TabsTrigger value="national" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
              राष्ट्रीय निर्देशक
            </TabsTrigger>
            <TabsTrigger value="international" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
              अंतर्राष्ट्रीय निर्देशक
            </TabsTrigger>
          </TabsList>

          <TabsContent value="national" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-stone-500 font-medium">{L.loading}</span>
              </div>
            ) : nationalMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">{L.no_national}</p>
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {nationalMembers.slice(0, 6).map((director) => (
                    <DirectorCard key={director.id} director={director} onClick={(e) => handleCardClick(e, director)} />
                  ))}
                </div>
                <div className="flex justify-center pt-8">
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/national-team">{L.view_all_national} <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="international" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-2 text-stone-500 font-medium">{L.loading}</span>
              </div>
            ) : internationalMembers.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">{L.no_international}</p>
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
                  {internationalMembers.slice(0, 6).map((director) => (
                    <DirectorCard key={director.id} director={director} onClick={(e) => handleCardClick(e, director)} />
                  ))}
                </div>
                <div className="flex justify-center pt-8">
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/international">{L.view_all_international} <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Fixed Detail Popup ── */}
      <Dialog open={!!activeDirector} onOpenChange={(open) => !open && setActiveDirector(null)}>
        <DialogContent className="sm:max-w-[600px] w-[90vw] sm:w-[600px] h-[90vw] sm:h-[600px] max-h-[90vh] p-0 bg-white border-orange-100 text-stone-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden gap-0">
          {activeDirector && (
            <>
              {/* Photo with close button layered on top */}
              <div className="relative w-full h-[45%] shrink-0 min-h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-50" />
                {activeDirector.photo_url ? (
                  <img
                    src={activeDirector.photo_url}
                    alt={activeDirector.name}
                    className="absolute inset-0 w-full h-full object-contain bg-white/40 backdrop-blur-sm"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-black text-orange-400/20">{activeDirector.name.charAt(0)}</span>
                  </div>
                )}
                {/* Custom close button inside photo - Dialog Content has its own, but we'll use ours to place it nicely */}
                <button
                  onClick={() => setActiveDirector(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-red-500 text-stone-600 hover:text-white transition-colors cursor-pointer backdrop-blur-sm shadow-md border border-white"
                  title={L.close}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content — scrollable */}
              <div className="flex flex-col gap-3 p-6 overflow-y-auto flex-1">
                {/* Category badge */}
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400 leading-none">
                  {activeDirector.category === 'national' ? L.national : L.international}
                </p>

                {/* Name & title */}
                <div>
                  <h3 className="text-3xl font-black text-stone-900 leading-tight">{activeDirector.name}</h3>
                  {activeDirector.title && (
                    <p className="text-sm font-semibold text-stone-500 uppercase mt-2 leading-snug">
                      {activeDirector.title}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="border-t border-orange-100 pt-4">
                  <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-3">{L.about}</p>
                  <p className="text-base text-stone-600 leading-relaxed font-medium">
                    {activeDirector.bio || L.no_bio}
                  </p>
                </div>
              </div>

              {/* Action buttons — always at bottom */}
              {(activeDirector.phone || activeDirector.email) && (
                <div className="border-t border-orange-100 p-4 grid grid-cols-2 gap-4 shrink-0 bg-orange-50/50">
                  {activeDirector.phone && (
                    <a
                      href={`tel:${activeDirector.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-500 text-green-600 hover:text-white rounded-2xl text-sm font-bold border border-green-200 transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" /> {L.call}
                    </a>
                  )}
                  {activeDirector.email && (
                    <a
                      href={`mailto:${activeDirector.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-2xl text-sm font-bold border border-blue-200 transition-all duration-300"
                    >
                      <Mail className="w-5 h-5" /> {L.mail}
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
