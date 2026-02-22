"use client"

import Image from "next/image"
import { Mail, Phone, Book, Award, Globe, Star, History, User, Languages, Trophy, Feather, MapPin, Briefcase, GraduationCap, Quote } from "lucide-react"
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
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Visual Side */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-linear-to-br from-orange-400 to-amber-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-700" />
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <Image
                  src="/images/director.jpg"
                  alt="डॉ. रविन्द्र शुक्ल"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-0 inset-x-0 h-3/5 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8 text-white">
                  <h3 className="text-3xl font-black mb-1">डॉ. रविन्द्र शुक्ल</h3>
                  <p className="text-orange-300 font-bold tracking-wide uppercase text-xs mb-3">राष्ट्रीय कवि एवं साहित्यकार</p>
                  <div className="space-y-1 text-stone-300 text-xs font-medium">
                    <p className="flex items-center gap-2"><MapPin className="w-3 h-3 text-orange-400" /> संकल्प 70/A-5 अयोध्यापुरी, झाँसी (उ.प्र.)</p>
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
                    केन्द्रीय (अंतरराष्ट्रीय) अध्यक्ष
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5" />
                    लोकतंत्र सेनानी
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.3] py-2">
                  साहित्य और राजनीति के <span className="text-orange-600">अद्वितीय समन्वय</span>
                </h2>
                <div className="space-y-4">
                  <p className="text-xl text-stone-700 leading-relaxed font-serif italic border-l-4 border-orange-400 pl-6">
                    &quot;कोई चलता पद चिन्हों पर, कोई पग चिन्ह बनाता है,<br />
                    पग चिन्ह बनाने वाला ही दुनिया में पूजा जाता है।&quot;
                  </p>
                  <p className="text-stone-500 font-medium leading-relaxed">
                    प्रख्यात राष्ट्रवादी चिंतक, पूर्व राज्यमंत्री (उ.प्र. सरकार) एवं चार बार झाँसी के विधायक रहे डॉ. रविन्द्र शुक्ल ने अपना सम्पूर्ण जीवन हिन्दी साहित्य एवं सनातन संस्कृति की पुनर्स्थापना के लिए समर्पित कर दिया है।
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <Languages className="w-10 h-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">विश्वव्यापी हिंदी मिशन</h4>
                  <p className="text-sm text-stone-500">विश्व के 37 देशों में हिंदी साहित्य भारती का विस्तार कर भाषा को वैश्विक गौरव दिलाया।</p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-sm border border-stone-100 hover:border-orange-200 transition-colors group">
                  <History className="w-10 h-10 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-stone-900 mb-1">संघर्षपूर्ण जीवन यात्रा</h4>
                  <p className="text-sm text-stone-500">राम मंदिर आन्दोलन, सम्पूर्ण क्रांति एवं आपातकाल के दौरान अनेक बार कारागार में निरुद्ध।</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a href="tel:09415030895" className="px-6 py-3 bg-white border-2 border-orange-100 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all flex items-center gap-2">
                  <Phone className="w-4 h-4" /> 09415030895
                </a>
                <a href="mailto:kaviravindrashukla@gmail.com" className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all flex items-center gap-2">
                  <Mail className="w-5 h-5" /> संपर्क करें
                </a>
              </div>
            </div>
          </div>

          {/* Deep Dive Information Tabs */}
          <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="flex flex-wrap h-auto p-2 bg-stone-50 border-b border-stone-100 rounded-none overflow-x-auto lg:overflow-visible">
                <TabsTrigger value="profile" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <User className="w-4 h-4 md:w-5 md:h-5" /> परिचय
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <History className="w-4 h-4 md:w-5 md:h-5" /> जीवन यात्रा
                </TabsTrigger>
                <TabsTrigger value="politics" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <Briefcase className="w-4 h-4 md:w-5 md:h-5" /> दायित्व
                </TabsTrigger>
                <TabsTrigger value="works" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <Feather className="w-4 h-4 md:w-5 md:h-5" /> कृतियाँ
                </TabsTrigger>
                <TabsTrigger value="honors" className="flex-1 py-4 lg:py-6 gap-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-2xl transition-all">
                  <Award className="w-4 h-4 md:w-5 md:h-5" /> सम्मान
                </TabsTrigger>
              </TabsList>

              <div className="p-8 md:p-14 lg:p-16">
                {/* Profile Detail Tab */}
                <TabsContent value="profile" className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">नाम</span>
                        <span className="col-span-2 font-black text-stone-900 text-lg">डॉ. रवीन्द्र शुक्ल</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">पिता</span>
                        <span className="col-span-2 font-bold text-stone-700">स्व. श्री मनूलाल शुक्ल</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">जन्म</span>
                        <div className="col-span-2 space-y-1">
                          <p className="font-bold text-stone-900">29 मार्च 1953 (रविवार)</p>
                          <p className="text-xs text-stone-500">चैत्र शुक्ल चतुर्दशी विक्रम संवत 2010</p>
                          <p className="text-stone-600 font-medium italic">ग्राम रायपुर, पो. जहानगंज, जनपद — फर्रुखाबाद (उ.प्र.)</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-stone-100 pb-4">
                        <span className="text-stone-400 font-bold text-xs uppercase">शिक्षा</span>
                        <span className="col-span-2 font-bold text-stone-700 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-orange-500" />
                          डी.लिट., एम.ए. (हिन्दी), एल.एल.बी
                        </span>
                      </div>
                    </div>
                    <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-10 text-white space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-orange-400 font-black flex items-center gap-2">
                          <Briefcase className="w-5 h-5" /> कर्म और निष्ठा
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {['सनातन धर्म प्रचारक', 'लेखक', 'कवि', 'पत्रकार', 'व्याख्याता'].map(karm => (
                            <span key={karm} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold">{karm}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <h4 className="text-orange-400 font-bold">विशेष पृष्ठभूमि</h4>
                        <ul className="text-stone-400 text-sm space-y-3">
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> राष्ट्रीय स्वयं सेवक संघ का तृतीय वर्ष शिक्षित, कई वर्षों तक पूर्णकालिक</li>
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> पूर्व विभाग संगठन मंत्री अखिल भारतीय विद्यार्थी परिषद</li>
                          <li className="flex gap-3"><Star className="w-4 h-4 shrink-0 text-amber-500" /> प्रखर राष्ट्रवादी कवि एवं चिन्तक</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Timeline Tab Content */}
                <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { year: '1974', title: 'सम्पूर्ण क्रांति', desc: 'आन्दोलन में महत्वपूर्ण भूमिका, 2 बार कारागार में निरुद्ध।' },
                      { year: '1975–77', title: 'आपातकाल संघर्ष', desc: 'लोकतंत्र सेनानी के रूप में 6 माह तक कारागार में निरुद्ध।' },
                      { year: '1978–83', title: 'एडवोकेट एवं श्रमिक नेता', desc: 'भारतीय मजदूर संघ के अध्यक्ष के रूप में सक्रिय।' },
                      { year: '1989–2002', title: 'विधायी सेवा', desc: 'चार बार झाँसी से विधायक एवं उ.प्र. मंत्रिपरिषद सदस्य।' },
                      { year: '1990–92', title: 'राम मंदिर आन्दोलन', desc: 'तीन बार कारागार में निरुद्ध एवं एक बार रासुका बन्दी।' },
                      { year: '2020–आज', title: 'हिन्दी साहित्य भारती', desc: 'विश्व के 37 देशों में हिन्दी विस्तार का नेतृत्व।' }
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
                      <h4 className="text-2xl font-black text-stone-900">प्रशासनिक दायित्व (निर्वर्तमान)</h4>
                      <div className="space-y-4">
                        <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <p className="font-bold text-orange-900">पूर्व राज्यमंत्री</p>
                          <p className="text-sm text-stone-600">कृषि, कृषि शिक्षा एवं अनुसंधान (उ.प्र. सरकार)</p>
                        </div>
                        <div className="p-6 bg-amber-50/30 rounded-2xl border border-amber-100">
                          <p className="font-bold text-amber-900">पूर्व राज्यमंत्री (स्वतंत्र प्रभार)</p>
                          <p className="text-sm text-stone-600">बेसिक, अनौपचारिक, प्रौढ़ शिक्षा एवं प्रशिक्षण</p>
                        </div>
                        <p className="text-sm italic font-medium text-stone-500 px-4 border-l-4 border-red-500">वन्देमातरम् गीत अनिवार्य करने के कारण शिक्षा मंत्री पद का परित्याग कर अभिनव क्रांति का उद्घोष।</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-2xl font-black text-stone-900">संस्थागत एवं सामाजिक</h4>
                      <div className="grid gap-3">
                        {[
                          'अन्तरराष्ट्रीय अध्यक्ष — हिन्दी साहित्य भारती',
                          'अध्यक्ष — रवीन्द्र फाउंडेशन (समाजसेवी ट्रस्ट)',
                          'अध्यक्ष — पं. दीनदयाल उपाध्याय शिक्षण समिति',
                          'अधिष्ठाता — उ.प्र. विधान सभा (पूर्व)',
                          'प्रदेश मंत्री — भाजपा उ.प्र. (पूर्व)'
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
                          <Book className="w-6 h-6 text-orange-500" /> काव्य कृतियाँ
                        </h4>
                        <div className="p-8 bg-orange-600 text-white rounded-[2.5rem] shadow-xl shadow-orange-100 relative overflow-hidden">
                          <Quote className="absolute top-0 right-0 w-32 h-32 text-white/10 -translate-y-4 translate-x-4" />
                          <h5 className="text-xl font-black mb-2">श्री शुक्ल चरित (महाकाव्य)</h5>
                          <p className="text-sm text-orange-100 leading-relaxed italic">सद्य: प्रकाशित होने के बाद भी अनेक शोध एवं पी.एच.डी. का केंद्र बना विश्व का प्रथम महाकाव्य।</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {['संकल्प', 'माँ', 'वन्दे भारत मातरम्', 'नगपति मेरा वन्दन ले लो', 'संजीवनी (दोहा संग्रह)'].map(book => (
                            <div key={book} className="p-4 rounded-xl border border-stone-100 hover:border-orange-200 transition-colors">
                              <p className="text-sm font-bold text-stone-800">{book}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <h4 className="text-2xl font-black text-stone-900 flex items-center gap-2">
                        <Feather className="w-6 h-6 text-amber-500" /> गद्य एवं शोध
                      </h4>
                      <div className="space-y-4">
                        {[
                          { title: 'वर्ण व्यवस्था की मौलिक अवधारणा एवं विकृति', type: 'गहन शोध ग्रन्थ' },
                          { title: 'अभिमत', type: 'लेख संग्रह' },
                          { title: 'शिक्षा की प्राण प्रतिष्ठा', type: 'शिक्षा दर्शन' }
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
                          <Globe className="w-4 h-4" /> साहित्य संवर्धन यात्राएँ
                        </h5>
                        <ul className="text-xs text-amber-900/70 font-bold space-y-1">
                          <li>• लाहौल स्पीति (हि.प्र.) — शोध लेख प्रकाशित</li>
                          <li>• नर्मदा तट (गुजरात) — शोध लेख प्रकाशित</li>
                          <li>• श्रीलंका (2400 कि.मी.) — शोध लेख प्रकाशित</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Honors Detail Tab */}
                <TabsContent value="honors" className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[
                      'साहित्य भास्कर (एटा)', 'त्रिवेणी साहित्य पुरस्कार', 'विशाल सहयोग पुरस्कार', 'दिनकर पुरस्कार', 'कविवर भूषण सम्मान',
                      'तुलसी साहित्य पुरस्कार', 'रविन्द्र नाथ टैगोर सम्मान', 'काव्य शिरोमणि सम्मान', 'साहित्य विभूति', 'साहित्य सिद्धि',
                      'अखिल भारतीय राष्ट्रभाषा सम्मान', 'तुलसी सम्मान (झाँसी)', 'लोकतंत्र सेनानी सम्मान', 'महाकवि सम्मान'
                    ].map((award, i) => (
                      <div key={i} className="p-5 text-center border border-stone-100 rounded-3xl hover:bg-orange-50 transition-all hover:scale-105">
                        <Award className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <h5 className="text-[10px] md:text-xs font-bold text-stone-800 leading-tight">{award}</h5>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-8 md:p-12 bg-linear-to-r from-orange-600 to-amber-600 rounded-[3rem] text-white text-center shadow-2xl shadow-orange-200/50">
                    <Quote className="w-10 h-10 mx-auto mb-6 opacity-40" />
                    <p className="text-xl md:text-2xl font-black italic mb-6">"100 से अधिक अन्य प्रतिष्ठित राष्ट्रीय एवं अंतरराष्ट्रीय सम्मान प्राप्त"</p>
                    <div className="max-w-3xl mx-auto text-orange-100 text-sm italic font-medium">
                      विभिन्न विषयों पर राष्ट्रीय एवं अन्तरराष्ट्रीय सेमिनार में सहभागिता एवं शोध पत्रों का वाचन। देश के बड़े-बड़े मंचों में राष्ट्रवादी काव्य पाठ एवं उद्बोधन।
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
