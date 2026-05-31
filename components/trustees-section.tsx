"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, User, MapPin, Mail, Phone, Heart, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/i18n/LanguageContext"

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
  const { t } = useLanguage()
  const [nationalTrustees, setNationalTrustees] = useState<Trustee[]>([])
  const [internationalTrustees, setInternationalTrustees] = useState<Trustee[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTrustee, setActiveTrustee] = useState<Trustee | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number; align: 'left' | 'right' | 'center' } | null>(null)

  useEffect(() => {
    fetchTrustees()

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.trustee-popup-card') && !target.closest('.trustee-main-card')) {
        setActiveTrustee(null)
        setPopupPosition(null)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
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

  const handleCardClick = (e: React.MouseEvent, trustee: Trustee) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const sectionElement = document.getElementById('trustees-section')

    if (sectionElement) {
      const sectionRect = sectionElement.getBoundingClientRect()
      const cardTopRelativeToSection = rect.top - sectionRect.top
      const cardLeftRelativeToSection = rect.left - sectionRect.left
      const cardRightRelativeToSection = rect.right - sectionRect.left

      if (windowWidth < 768) {
        // Center-align below the card on mobile
        setPopupPosition({
          top: cardTopRelativeToSection + rect.height + 12,
          left: Math.max(10, cardLeftRelativeToSection + (rect.width / 2) - 180), // Center 360px width popup
          align: 'center'
        })
      } else {
        const showOnRight = rect.right + 380 < windowWidth
        setPopupPosition({
          top: cardTopRelativeToSection,
          left: showOnRight ? cardRightRelativeToSection + 16 : cardLeftRelativeToSection - 376,
          align: showOnRight ? 'right' : 'left'
        })
      }
    }
    setActiveTrustee(trustee)
  }


  const TrusteeCard = ({ trustee }: { trustee: Trustee }) => (
    <div 
      onClick={(e) => handleCardClick(e, trustee)}
      className="trustee-main-card w-full max-w-[320px] mx-auto group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-blue-100 flex flex-col items-center text-center overflow-hidden h-full cursor-pointer hover:-translate-y-1"
    >
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
            {trustee.type === 'national' ? t('trustee.badge_national') : t('trustee.badge_international')}
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
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {trustee.phone && (
            <a
              href={`tel:${trustee.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Bottom Action - Details Button */}
        <div className="w-full pt-4 mt-4 border-t border-stone-50 flex justify-center">
          <span 
            className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors duration-300"
          >
            {t('nav.about')} (View Details)
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <section id="trustees-section" className="py-24 bg-slate-50 relative overflow-visible">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest">
            {t('trustee.patrons_title')}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            {t('trustee.main_title')}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-slate-500 font-medium">
            {t('trustee.subtext')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-500 font-medium">{t('trustee.loading')}</span>
          </div>
        ) : (
          <Tabs defaultValue="national" className="w-full">
            <TabsList className="flex w-full max-w-lg mx-auto bg-slate-200/50 p-1.5 rounded-2xl mb-12">
              <TabsTrigger value="national" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all">
                {t('trustee.tab_national')}
              </TabsTrigger>
              <TabsTrigger value="international" className="flex-1 py-3 rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all">
                {t('trustee.tab_international')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="national" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {nationalTrustees.length === 0 ? (
                <p className="text-center text-slate-400 py-12 font-medium">
                  {t('trustee.no_record')}
                </p>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8 relative">
                  {nationalTrustees.map((trustee) => (
                    <TrusteeCard key={trustee.id} trustee={trustee} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="international" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {internationalTrustees.length === 0 ? (
                <p className="text-center text-slate-400 py-12 font-medium">
                  {t('trustee.no_record')}
                </p>
              ) : (
                <div className="flex flex-wrap justify-center gap-6 lg:gap-8 relative">
                  {internationalTrustees.map((trustee) => (
                    <TrusteeCard key={trustee.id} trustee={trustee} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>


      {/* Floating Rolling Details Card - Roll Down Beside the Card (Bigger Size!) */}
      {activeTrustee && popupPosition && (
        <div 
          style={{ 
            position: 'absolute', 
            top: `${popupPosition.top}px`, 
            left: `${popupPosition.left}px`,
            width: '360px',
          }}
          className="trustee-popup-card z-50 bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.35)] border border-slate-800 flex flex-col justify-between max-h-[640px] animate-in slide-in-from-top-8 fade-in duration-500 ease-out origin-top"
        >
          {/* Close Button */}
          <button 
            onClick={() => { setActiveTrustee(null); setPopupPosition(null); }}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-red-500 hover:text-white text-stone-300 transition-colors z-50 cursor-pointer shadow-md"
            title={t('trustee.close')}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Roll Down Picture Header */}
          <div className="space-y-4">
            <div className="relative w-full h-52 rounded-3xl overflow-hidden shadow-inner border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-850 to-slate-950" />
              {activeTrustee.photo_url ? (
                <img
                  src={activeTrustee.photo_url}
                  alt={activeTrustee.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black text-cyan-500/20">{activeTrustee.name.charAt(0)}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400 leading-none">
                {activeTrustee.type === 'national' ? t('trustee.badge_national') : t('trustee.badge_international')}
              </p>
              <h3 className="text-xl font-black text-white mt-1.5 leading-tight tracking-tight pr-6">{activeTrustee.name}</h3>
              {activeTrustee.address && (
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-300 uppercase mt-2 leading-none">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" /> 
                  <span className="truncate max-w-[240px]">{activeTrustee.address}</span>
                </p>
              )}
            </div>

            {/* Description Scroll area */}
            <div className="border-t border-white/10 pt-3">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2 leading-none">
                {t('trustee.details_title')}
              </h4>
              <div className="max-h-[220px] overflow-y-auto pr-1 text-stone-300 text-xs leading-relaxed font-medium scrollbar-thin scrollbar-thumb-slate-800">
                {activeTrustee.description || t('trustee.no_record')}
              </div>
            </div>
          </div>

          {/* Social and Call Buttons Section (No Donation Button!) */}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-3 shrink-0">
            <div className="grid grid-cols-2 gap-2.5">
              {activeTrustee.phone && (
                <a
                  href={`tel:${activeTrustee.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 p-3 bg-green-500/10 hover:bg-green-600 hover:text-white rounded-[1.25rem] text-[11px] font-bold text-green-400 border border-green-500/20 transition-all duration-300 group/btn"
                >
                  <Phone className="w-3.5 h-3.5 group-hover/btn:animate-bounce" /> Call
                </a>
              )}
              {activeTrustee.email && (
                <a
                  href={`mailto:${activeTrustee.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 p-3 bg-blue-500/10 hover:bg-blue-600 hover:text-white rounded-[1.25rem] text-[11px] font-bold text-blue-400 border border-blue-500/20 transition-all duration-300 group/btn"
                >
                  <Mail className="w-3.5 h-3.5 group-hover/btn:animate-pulse" /> Mail
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

