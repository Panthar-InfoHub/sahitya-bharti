"use client"

import Image from "next/image"
import { Mail, Phone, Book, Award, Globe, Star, History, User, Languages, Trophy, Feather } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DirectorProfile() {
  return (
    <section className="py-24 bg-linear-to-br from-stone-50 via-white to-orange-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Main Hero Profile Section */}
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Visual Side */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-linear-to-br from-orange-400 to-amber-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-700" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/images/director.jpg"
                  alt="डॉ. रविन्द्र शुक्ल 'रवि'"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-linear-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-black mb-1">डॉ. रविन्द्र शुक्ल 'रवि'</h3>
                  <p className="text-orange-300 font-semibold tracking-wide uppercase text-sm">संस्थापक एवं अंतरराष्ट्रीय अध्यक्ष</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-bold uppercase tracking-wider">
                  <Star className="w-4 h-4" />
                  साहित्य और संस्कृति के संरक्षक
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-[1.6] md:leading-[1.2]">
                  भूमंडलीकरण में हिंदी के <span className="text-orange-600">वैश्विक ध्वजवाहक</span>
                </h2>
                <p className="text-xl text-stone-600 leading-relaxed font-medium italic">
                  "डॉ. रवींद्र शुक्ल 'रवि' का हिंदी साहित्य में योगदान उनके बहुआयामी व्यक्तित्व को दर्शाता है। वे न केवल एक लेखक और कवि हैं, बल्कि हिंदी साहित्य भारती के माध्यम से हिंदी को वैश्विक मंच पर प्रतिष्ठित करने वाले एक प्रमुख संरक्षक भी हैं।"
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <Trophy className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">गिनीज वर्ल्ड रिकॉर्ड (2024)</h4>
                  <p className="text-sm text-stone-500">'सब में राम शाश्वत श्री राम' - वैश्विक सांस्कृतिक गौरव का नया कीर्तिमान</p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <Globe className="w-10 h-10 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">35+ देशों में विस्तार</h4>
                  <p className="text-sm text-stone-500">हिंदी को बाजार से ऊपर उठाकर 'संस्कार की भाषा' के रूप में स्थापित किया</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="mailto:kaviravindrashukla@gmail.com" className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2">
                  <Mail className="w-5 h-5" /> संपर्क करें
                </a>
              </div>
            </div>
          </div>

          {/* Deep Dive Information Tabs */}
          <div className="bg-white rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
            <Tabs defaultValue="works" className="w-full">
              <TabsList className="flex flex-wrap h-auto p-2 bg-stone-50 border-b border-stone-100 rounded-none overflow-x-auto lg:overflow-visible">
                <TabsTrigger value="works" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <Feather className="w-5 h-5" /> प्रमुख कृतियाँ
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <History className="w-5 h-5" /> जीवन यात्रा
                </TabsTrigger>
                <TabsTrigger value="honors" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <Award className="w-5 h-5" /> सम्मान और पहचान
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <User className="w-5 h-5" /> परिचय विवरण
                </TabsTrigger>
              </TabsList>

              <div className="p-8 md:p-12">
                {/* Major Works Tab */}
                <TabsContent value="works" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-stone-900 flex items-center gap-2 border-b-2 border-orange-500 pb-2 w-fit">
                        <Book className="w-6 h-6 text-orange-500" /> काव्य और महाकाव्य
                      </h4>
                      <div className="space-y-4">
                        <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <h5 className="font-bold text-orange-800 text-lg">श्री शत्रुघ्न चरित (महाकाव्य)</h5>
                          <p className="text-stone-600 text-sm">भगवान राम के सबसे छोटे भाई शत्रुघ्न पर केंद्रित विश्व का एकमात्र महाकाव्य ग्रंथ।</p>
                        </div>
                        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                          <h5 className="font-bold text-stone-800 text-lg">संजीवनी (दर्शन दोहावली)</h5>
                          <p className="text-stone-600 text-sm">भारतीय दर्शन और जीवन मूल्यों पर आधारित कालजयी दोहों का संग्रह।</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {['संकल्प', 'माँ', 'नगपति मेरा वंदन ले लो', 'वंदे भारत मातरम्'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-white border border-stone-200 rounded-full font-medium text-stone-700 shadow-sm">• {tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-stone-900 flex items-center gap-2 border-b-2 border-amber-500 pb-2 w-fit">
                        <Feather className="w-6 h-6 text-amber-500" /> गद्य और शोध
                      </h4>
                      <div className="space-y-4">
                        <div className="p-6 rounded-2xl border border-stone-100 flex gap-4 hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center font-bold text-stone-400">01</div>
                          <div>
                            <h5 className="font-bold text-stone-800">शिक्षा की प्राण प्रतिष्ठा</h5>
                            <p className="text-stone-500 text-sm">शिक्षा में भारतीय मूल्यों को जोड़ने पर केंद्रित वैचारिक कृति।</p>
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl border border-stone-100 flex gap-4 hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center font-bold text-stone-400">02</div>
                          <div>
                            <h5 className="font-bold text-stone-800">वर्ण व्यवस्था की मौलिक अवधारणा और विकृति</h5>
                            <p className="text-stone-500 text-sm">गहन ऐतिहासिक और शास्त्रीय शोध पर आधारित ग्रंथ।</p>
                          </div>
                        </div>
                        <p className="text-orange-700 italic font-medium px-4 border-l-4 border-orange-300">"वे एक गंभीर चिंतक और संपादक के रूप में भी जाने जाते हैं, जिन्होंने इतिहास और शास्त्रों के गहन अध्ययन को आधुनिक संदर्भों में प्रस्तुत किया है।"</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* History/Timeline Tab */}
                <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-stone-300 before:to-transparent">
                    {/* 1990-92 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <History className="w-5 h-5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-black text-orange-600">1990–1992</div>
                        </div>
                        <div className="font-bold text-stone-800">राम मंदिर आन्दोलन</div>
                        <p className="text-stone-600 text-sm">तीन बार कारागार में निरुद्ध, एक बार रासुका बन्दी।</p>
                      </div>
                    </div>

                    {/* 1975-77 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-stone-800 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-black text-stone-900">1975–1977</div>
                        </div>
                        <div className="font-bold text-stone-800">आपातकाल के विरुद्ध भूमिका</div>
                        <p className="text-stone-600 text-sm">लोकतंत्र सेनानी के रूप में 6 माह तक कारागार में निरुद्ध।</p>
                      </div>
                    </div>

                    {/* 1989-2002 */}
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-amber-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Star className="w-5 h-5" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[45%] p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-black text-amber-600">1989–2002</div>
                        </div>
                        <div className="font-bold text-stone-800">राजनीतिक एवं विधायी सफर</div>
                        <ul className="text-stone-600 text-sm list-disc list-inside space-y-1">
                          <li>चार बार लगातार झाँसी से विधायक</li>
                          <li>उत्तर प्रदेश सरकार में तीन बार शिक्षा मंत्री</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Honors Tab Content */}
                <TabsContent value="honors" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { title: "साहित्य भास्कर", source: "एटा उ.प्र." },
                      { title: "त्रिवेणी साहित्य पुरस्कार", source: "राजस्थान" },
                      { title: "विशाल सहाय पुरस्कार", source: "कानपुर" },
                      { title: "दिनकर पुरस्कार", source: "मऊ उ.प्र." },
                      { title: "कविवर भूषण सम्मान", source: "2012" },
                      { title: "तुलसी साहित्य पुरस्कार", source: "राजापुर" },
                      { title: "रवीन्द्र नाथ टैगोर", source: "2012 भोपाल" },
                      { title: "काव्य शिरोमणि सम्मान", source: "उरई उ.प्र." }
                    ].map((award, i) => (
                      <div key={i} className="text-center p-6 border border-stone-100 rounded-[2rem] hover:bg-orange-50/50 transition-colors">
                        <Award className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                        <h5 className="font-bold text-stone-900 leading-tight">{award.title}</h5>
                        <p className="text-xs text-stone-400 mt-1 uppercase font-bold tracking-tighter">{award.source}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 text-center p-10 bg-linear-to-r from-orange-600 to-amber-600 rounded-[3rem] text-white">
                    <p className="text-xl font-bold italic mb-4">"100 से अधिक अन्य प्रतिष्ठित राष्ट्रीय एवं अंतरराष्ट्रीय सम्मान प्राप्त"</p>
                    <div className="flex justify-center gap-4">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">अन्तरराष्ट्रीय अध्यक्ष</span>
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">राष्ट्रीय कवि</span>
                    </div>
                  </div>
                </TabsContent>

                {/* Profile Details Tab Content */}
                <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-sm uppercase">नाम</span>
                        <span className="col-span-2 font-black text-stone-900 text-lg">डॉ. रवीन्द्र शुक्ल 'रवि'</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-sm uppercase">पिता</span>
                        <span className="col-span-2 font-bold text-stone-700">स्व. श्री मन्नूलाल शुक्ल</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-sm uppercase">जन्म</span>
                        <span className="col-span-2 font-bold text-stone-700">29 मार्च 1953 (फर्रुखाबाद उ.प्र.)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-sm uppercase">शिक्षा</span>
                        <span className="col-span-2 font-bold text-stone-700 text-md">डी.लिट., एम.ए.(हिन्दी), एल.एल.बी.</span>
                      </div>
                    </div>
                    <div className="p-8 bg-stone-900 rounded-[2.5rem] text-white space-y-6">
                      <h4 className="text-xl font-bold text-orange-400">विशेष दायित्व</h4>
                      <ul className="space-y-4">
                        <li className="flex gap-4">
                          <Languages className="shrink-0 w-6 h-6 text-amber-400" />
                          <div>
                            <p className="font-bold text-sm">हिंदी का वैश्विक प्रसार</p>
                            <p className="text-xs text-stone-400 leading-tight">संस्था को 35 से अधिक देशों तक पहुँचाया और हिंदी को 'संस्कार की भाषा' बनाया।</p>
                          </div>
                        </li>
                        <li className="flex gap-4">
                          <Star className="shrink-0 w-6 h-6 text-amber-400" />
                          <div>
                            <p className="font-bold text-sm">सांस्कृतिक राष्ट्रवाद</p>
                            <p className="text-xs text-stone-400 leading-tight">साहित्य को समाज सुधार और सांस्कृतिक चेतना का माध्यम बनाया है।</p>
                          </div>
                        </li>
                      </ul>
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-orange-300 font-bold mb-2">संपर्क सूत्र:</p>
                        <p className="text-lg font-serif italic">09415030895, 07905634609</p>
                      </div>
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
