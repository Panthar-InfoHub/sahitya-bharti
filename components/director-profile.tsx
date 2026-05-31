"use client"

import Image from "next/image"
import { Mail, Phone, Book, Award, Globe, Star, History, User, Languages, Trophy, Feather, MapPin, Briefcase, GraduationCap, Quote, Heart } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DirectorProfile() {
  const { t, language } = useLanguage()

  return (
    <section id="directors-section" className="py-24 bg-linear-to-br from-stone-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Main Hero Profile Section */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Visual Side */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-linear-to-br from-orange-400 to-amber-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-700" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/images/director.jpg"
                  alt={t('director.name')}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 h-3/5 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-black mb-1">{t('director.name')}</h3>
                  <p className="text-orange-300 font-bold tracking-wide uppercase text-xs mb-3">{t('director.role')}</p>
                  <div className="space-y-1 text-stone-300 text-xs font-medium">
                    <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-orange-400" /> {t('director.address')}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3 h-3 text-orange-400" /> kaviravindrashukla@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <Star className="w-3.5 h-3.5" />
                    {t('director.badge1')}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5" />
                    {t('director.badge2')}
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.3] py-2">
                  {language === 'hi' ? (
                    <>
                      साहित्य और राजनीति के <span className="text-orange-600">अद्वितीय समन्वय</span>
                    </>
                  ) : (
                    <>
                      A Unique Blend of <span className="text-orange-600">Literature & Politics</span>
                    </>
                  )}
                </h2>
                <div className="space-y-4">
                  <p className="text-xl text-stone-700 leading-relaxed font-serif italic border-l-4 border-orange-400 pl-6 whitespace-pre-line">
                    {t('director.quote')}
                  </p>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    {t('director.desc_para')}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <Languages className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">{t('director.mission1_title')}</h4>
                  <p className="text-sm text-stone-500">{t('director.mission1_desc')}</p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <History className="w-10 h-10 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">{t('director.mission2_title')}</h4>
                  <p className="text-sm text-stone-500">{t('director.mission2_desc')}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="tel:09415030895" className="px-6 py-3 bg-white border-2 border-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 09415030895
                </a>
                <a href="mailto:kaviravindrashukla@gmail.com" className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2">
                  <Mail className="w-5 h-5" /> {t('director.contact_btn')}
                </a>
                <button 
                  onClick={() => window.dispatchEvent(new Event('open-donation-modal'))}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 transform active:scale-95 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white animate-pulse" /> {t('director.donate_btn')}
                </button>
              </div>
            </div>
          </div>

          {/* Deep Dive Information Tabs */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="flex flex-wrap h-auto p-2 bg-stone-50 border-b border-stone-100 rounded-none overflow-x-auto lg:overflow-visible">
                <TabsTrigger value="profile" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all text-xs md:text-sm">
                  <User className="w-4 h-4 md:w-5 md:h-5" /> {t('director.tab_intro')}
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all text-xs md:text-sm">
                  <History className="w-4 h-4 md:w-5 md:h-5" /> {t('director.tab_journey')}
                </TabsTrigger>
                <TabsTrigger value="politics" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all text-xs md:text-sm">
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5" /> {t('director.tab_roles')}
                </TabsTrigger>
                <TabsTrigger value="works" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all text-xs md:text-sm">
                  <Feather className="w-4 h-4 md:w-5 md:h-5" /> {t('director.tab_works')}
                </TabsTrigger>
                <TabsTrigger value="honors" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all text-xs md:text-sm">
                  <Award className="w-4 h-4 md:w-5 md:h-5" /> {t('director.tab_honors')}
                </TabsTrigger>
              </TabsList>

              <div className="p-8 md:p-14 lg:p-16">
                {/* Profile Detail Tab */}
                <TabsContent value="profile" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">{t('director.label_name')}</span>
                        <span className="col-span-2 font-black text-stone-900 text-lg">{t('director.name')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">{t('director.label_father')}</span>
                        <span className="col-span-2 font-bold text-stone-700">{t('director.father_val')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">{t('director.label_dob')}</span>
                        <div className="col-span-2 space-y-1">
                          <p className="font-bold text-stone-900">{t('director.dob_val1')}</p>
                          <p className="text-xs text-stone-500">{t('director.dob_val2')}</p>
                          <p className="text-stone-600 font-medium italic">{t('director.dob_val3')}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">{t('director.label_edu')}</span>
                        <span className="col-span-2 font-bold text-stone-700 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-orange-500" />
                          {t('director.edu_val')}
                        </span>
                      </div>
                    </div>
                    <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-10 text-white space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-orange-400 font-black flex items-center gap-2">
                          <Briefcase className="w-5 h-5" /> {t('director.label_work_faith')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            t('director.skill1'),
                            t('director.skill2'),
                            t('director.skill3'),
                            t('director.skill4'),
                            t('director.skill5')
                          ].map(karm => (
                            <span key={karm} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold">{karm}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <h4 className="text-orange-400 font-bold">{t('director.special_bg')}</h4>
                        <ul className="text-stone-400 text-sm space-y-3">
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> {t('director.bg_item1')}</li>
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> {t('director.bg_item2')}</li>
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> {t('director.bg_item3')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Timeline Tab Content */}
                <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { year: '1974', title: t('director.j1_title'), desc: t('director.j1_desc') },
                      { year: '1975–77', title: t('director.j2_title'), desc: t('director.j2_desc') },
                      { year: '1978–83', title: t('director.j3_title'), desc: t('director.j3_desc') },
                      { year: '1989–2002', title: t('director.j4_title'), desc: t('director.j4_desc') },
                      { year: '1990–92', title: t('director.j5_title'), desc: t('director.j5_desc') },
                      { year: t('director.j6_year'), title: t('director.j6_title'), desc: t('director.j6_desc') }
                    ].map((item, i) => (
                      <div key={i} className="p-8 rounded-[2.5rem] bg-stone-50 border border-stone-200 hover:bg-white hover:shadow-xl hover:shadow-orange-200/20 transition-all group">
                        <div className="text-orange-600 font-black text-xl mb-2 group-hover:scale-110 transition-transform origin-left">{item.year}</div>
                        <h5 className="font-bold text-stone-900 mb-2">{item.title}</h5>
                        <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Political & Social Tab */}
                <TabsContent value="politics" className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-stone-900">{t('director.resp_admin_title')}</h4>
                      <div className="space-y-4">
                        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <p className="font-bold text-orange-900">{t('director.resp_admin_item1_title')}</p>
                          <p className="text-sm text-stone-600">{t('director.resp_admin_item1_desc')}</p>
                        </div>
                        <div className="p-6 bg-amber-50/30 rounded-2xl border border-amber-100">
                          <p className="font-bold text-amber-900">{t('director.resp_admin_item2_title')}</p>
                          <p className="text-sm text-stone-600">{t('director.resp_admin_item2_desc')}</p>
                        </div>
                        <p className="text-xs md:text-sm italic font-medium text-stone-500 px-4 border-l-4 border-red-500">{t('director.resp_admin_note')}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-stone-900">{t('director.resp_social_title')}</h4>
                      <div className="grid gap-3">
                        {[
                          t('director.role_item1'),
                          t('director.role_item2'),
                          t('director.role_item3'),
                          t('director.role_item4'),
                          t('director.role_item5')
                        ].map(role => (
                          <div key={role} className="flex items-center gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100">
                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                            <span className="text-sm font-bold text-stone-700">{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Literary Works Tab Content */}
                <TabsContent value="works" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                          <Book className="w-6 h-6 text-orange-500" /> {t('director.works_poetry_title')}
                        </h4>
                        <div className="p-8 bg-orange-600 text-white rounded-[2.5rem] shadow-xl shadow-orange-100 relative overflow-hidden">
                          <Quote className="absolute top-0 right-0 w-32 h-32 text-white/10 -translate-y-4 translate-x-4" />
                          <h5 className="text-xl font-black mb-2">{t('director.works_epic_title')}</h5>
                          <p className="text-sm text-orange-100 leading-relaxed italic">{t('director.works_epic_desc')}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            t('director.book1'),
                            t('director.book2'),
                            t('director.book3'),
                            t('director.book4'),
                            t('director.book5')
                          ].map(book => (
                            <div key={book} className="p-4 rounded-xl border border-stone-100 hover:border-orange-200 transition-colors">
                              <p className="text-sm font-bold text-stone-800">{book}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                        <Feather className="w-6 h-6 text-amber-500" /> {t('director.works_prose_title')}
                      </h4>
                      <div className="space-y-4">
                        {[
                          { title: t('director.prose1_title'), type: t('director.prose1_type') },
                          { title: t('director.prose2_title'), type: t('director.prose2_type') },
                          { title: t('director.prose3_title'), type: t('director.prose3_type') }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-orange-500 shadow-sm">{i + 1}</div>
                            <div>
                              <h5 className="font-bold text-stone-900">{item.title}</h5>
                              <p className="text-xs text-stone-400 font-bold uppercase">{item.type}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-200">
                        <h5 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> {t('director.works_travel_title')}
                        </h5>
                        <ul className="text-xs text-amber-900/70 font-bold space-y-1">
                          {[
                            t('director.travel_item1'),
                            t('director.travel_item2'),
                            t('director.travel_item3')
                          ].map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Honors Detail Tab */}
                <TabsContent value="honors" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[
                      t('director.award1'), t('director.award2'), t('director.award3'), t('director.award4'), t('director.award5'),
                      t('director.award6'), t('director.award7'), t('director.award8'), t('director.award9'), t('director.award10'),
                      t('director.award11'), t('director.award12'), t('director.award13'), t('director.award14')
                    ].map((award, i) => (
                      <div key={i} className="p-5 text-center border border-stone-100 rounded-3xl hover:bg-orange-50 transition-all hover:scale-105">
                        <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <h5 className="text-[10px] md:text-xs font-bold text-stone-800 leading-tight">{award}</h5>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-8 md:p-12 bg-linear-to-r from-orange-600 to-amber-600 rounded-[3rem] text-white text-center shadow-2xl shadow-orange-200/50">
                    <Quote className="w-10 h-10 mx-auto mb-6 opacity-40" />
                    <p className="text-xl md:text-2xl font-black italic mb-6">{t('director.award_hl_title')}</p>
                    <div className="max-w-3xl mx-auto text-orange-100 text-sm italic font-medium">
                      {t('director.award_hl_desc')}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

