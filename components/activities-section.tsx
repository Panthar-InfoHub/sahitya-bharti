"use client"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import {
  Trophy, Globe2, BookOpen, Megaphone,
  Sparkles, MoveRight,
  GraduationCap, Library,
  Flag, Award, Star, Languages,
  Zap, Compass
} from "lucide-react"
import { ContactPopup } from "@/components/contact-popup"

export function ActivitiesSection() {
  const { t, language } = useLanguage()
  const [showContactPopup, setShowContactPopup] = useState(false)

  const internationalUnits = [
    { country: language === 'hi' ? "कनाडा" : "Canada", detail: t('act.c_can'), color: "from-red-500 to-rose-500" },
    { country: language === 'hi' ? "रूस" : "Russia", detail: t('act.c_rus'), color: "from-blue-500 to-blue-600" },
    { country: language === 'hi' ? "मॉरीशस" : "Mauritius", detail: t('act.c_mau'), color: "from-amber-400 to-orange-500" },
    { country: language === 'hi' ? "इज़राइल" : "Israel", detail: t('act.c_isr'), color: "from-cyan-500 to-blue-500" },
    { country: language === 'hi' ? "दुबई / नाइजीरिया" : "Dubai / Nigeria", detail: t('act.c_dub'), color: "from-emerald-500 to-teal-600" },
  ]

  const vandanPhases = [
    {
      title: t('act.rv1_title'),
      theme: t('act.rv1_theme'),
      desc: t('act.rv1_desc'),
      goal: t('act.rv1_goal'),
      icon: Library,
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      title: t('act.rv2_title'),
      theme: t('act.rv2_theme'),
      desc: t('act.rv2_desc'),
      goal: t('act.rv2_goal'),
      icon: Award,
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      title: t('act.rv3_title'),
      theme: t('act.rv3_theme'),
      desc: t('act.rv3_desc'),
      goal: t('act.rv3_goal'),
      icon: Megaphone,
      color: "bg-rose-50 text-rose-600 border-rose-100"
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-50/50 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50/50 rounded-full blur-[100px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-xs font-black mb-6 tracking-widest uppercase shadow-sm">
                <Zap className="w-3 h-3 text-orange-600" />
                <span>{t('act.badge')}</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1] font-serif">
                {t('act.title1')} <span className="text-orange-600 underline decoration-orange-200 decoration-8 underline-offset-4 font-black">{t('act.title2')}</span><br />
                {t('act.title3')}
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                {t('act.desc')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block h-20 w-[1px] bg-orange-200" />
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-orange-600 italic font-serif">{t('act.countries_stat')}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('act.countries_lbl')}</span>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

            {/* 1. Guinness World Record (Featured Card) */}
            <div className="md:col-span-8 group relative overflow-hidden bg-white border-2 border-orange-100 rounded-[2.5rem] md:rounded-[3rem] p-0 min-h-[450px] transition-all hover:shadow-2xl hover:shadow-orange-200/50">
              <div className="grid md:grid-cols-2 h-full">
                {/* Text Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-3 bg-orange-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                      <Award className="w-4 h-4" />
                      {t('act.g_badge')}
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight font-serif">
                    {language === 'hi' ? (
                      <>
                        सब में राम शाश्वत श्री राम: <br />
                        <span className="text-orange-600 font-black">विश्व कीर्तिमान</span>
                      </>
                    ) : (
                      <>
                        Ram in All, Eternal Shri Ram: <br />
                        <span className="text-orange-600 font-black">World Record</span>
                      </>
                    )}
                  </h3>

                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                    {t('act.g_desc')}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100">
                      <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                    </div>
                    <span className="font-bold text-slate-700 font-serif">{t('act.g_highlight')}</span>
                  </div>
                </div>

                {/* Image / Certificate Content */}
                <div className="relative bg-orange-50/50 flex items-center justify-center p-8 overflow-hidden">
                  {/* Decorative background for image */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -mr-32 -mt-32" />

                  {/* The Certificate Frame */}
                  <div className="relative z-10 w-full aspect-[3/4.5] max-w-[280px] group-hover:scale-105 transition-transform duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-lg overflow-hidden border-8 border-white bg-white">
                    <img
                      src="/images/wrold-record.png"
                      alt="Guinness World Record Certificate"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Icon Overlay for empty space */}
                  <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                    <Trophy className="w-64 h-64 text-orange-600 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Magazine / Publication (Secondary Card) */}
            <div className="md:col-span-4 bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 relative overflow-hidden group border border-orange-100 shadow-sm hover:shadow-xl transition-all">
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:-rotate-12 transition-transform duration-500">
                <Library className="w-48 h-48 text-orange-600" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 border border-orange-100/50">
                  <BookOpen className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight font-serif">{t('act.pub_title')}</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                  {t('act.pub_desc')}
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-black text-orange-600 group-hover:gap-4 transition-all pointer-events-none font-serif">
                  {t('act.pub_link')} <MoveRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 3. International Map/List Section (Grid Layout) */}
            <div className="md:col-span-12 lg:col-span-7 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 font-serif">{t('act.int_title')}</h3>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2 font-serif">
                    <Globe2 className="w-4 h-4" /> {t('act.int_badge')}
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="px-5 py-2 bg-white rounded-2xl border border-orange-100 text-xs font-bold text-orange-700 shadow-sm font-serif">
                    {t('act.int_active')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {internationalUnits.map((item, i) => (
                  <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
                      <h4 className="font-black text-slate-900 text-lg font-serif">{item.country}</h4>
                    </div>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed group-hover:text-slate-900 transition-colors">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Future Initiatives */}
            <div className="md:col-span-12 lg:col-span-5 bg-gradient-to-br from-orange-100 via-white to-amber-50 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 relative overflow-hidden group border border-orange-200 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.1),transparent)] opacity-100" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 font-serif">
                  <Compass className="w-7 h-7 text-orange-600" />
                  {t('act.fut_title')}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex-shrink-0 flex items-center justify-center group-hover/item:border-orange-400 group-hover/item:shadow-lg transition-all">
                      <Languages className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1 font-serif">{t('act.fut_u_title')}</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('act.fut_u_desc')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex-shrink-0 flex items-center justify-center group-hover/item:border-orange-400 group-hover/item:shadow-lg transition-all">
                      <Library className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1 font-serif">{t('act.fut_l_title')}</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('act.fut_l_desc')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-orange-100">
                  <p className="text-sm italic text-orange-700 font-bold font-serif">
                    {t('act.fut_quote')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rashtra Vandan Detailed Section */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Flag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-serif">{t('act.rv_title')}</h3>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-widest font-serif">{t('act.rv_badge')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {vandanPhases.map((phase, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className={`w-14 h-14 ${phase.color} rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:rotate-12`}>
                    <phase.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2 font-serif">{phase.title}</h4>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 font-serif">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    {phase.theme}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                    {phase.desc}
                  </p>
                  <div className="pt-6 border-t border-slate-50">
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed italic">
                      <span className="text-slate-900 font-bold not-italic font-serif">
                        {language === 'hi' ? "लक्ष्य:" : "Goal:"}
                      </span> {phase.goal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="flex items-center gap-6 p-8 bg-orange-50/50 rounded-[2rem] border border-orange-100 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-200 shadow-sm group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 mb-1 font-serif">{t('act.youth_title')}</h4>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-2 font-serif">{t('act.youth_badge')}</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{t('act.youth_desc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-200 shadow-sm group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 mb-1 font-serif">{t('act.union_title')}</h4>
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-2 font-serif">{t('act.union_badge')}</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{t('act.union_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactPopup
        open={showContactPopup}
        onOpenChange={setShowContactPopup}
      />
    </section>
  )
}
