import { Building2, Calendar, FileText, Globe2, Trophy, Users, Heart, MapPin, Sparkles } from "lucide-react"

export function AboutOrganization() {
  return (
    <section className="py-24 bg-gradient-to-b from-orange-50/50 via-white to-orange-50/50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>हमारी संस्था का परिचय</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              हिंदी साहित्य भारती
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              "हिंदी को बाज़ार की भाषा के स्थान पर संस्कार की भाषा बनाना हमारा संकल्प है।"
            </p>
          </div>

          {/* Quick Stats / Formation Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">स्थापना तिथि</h3>
              <p className="text-2xl font-black text-orange-600">15 जुलाई 2020</p>
              <p className="text-slate-500 text-sm mt-2 font-medium">एक युवा और प्रभावशाली संगठन</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">संस्थापक</h3>
              <p className="text-xl font-bold text-amber-600 leading-tight">डॉ. रवींद्र शुक्ल</p>
              <p className="text-slate-500 text-sm mt-2 font-medium">पूर्व शिक्षा मंत्री एवं देश के विद्वान</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">पंजीकरण</h3>
              <p className="text-xl font-bold text-orange-600">अंतरराष्ट्रीय न्यास</p>
              <p className="text-slate-500 text-sm mt-2 font-medium">पंजीकृत अंतरराष्ट्रीय गैर-सरकारी संस्था</p>
            </div>
          </div>

          {/* Main Info Blocks */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Global Expansion */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Globe2 className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Globe2 className="w-8 h-8 text-orange-400" />
                  वैश्विक विस्तार
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-4xl font-black text-orange-400 mb-2">27</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">भारतीय राज्य</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-amber-400 mb-2">35+</div>
                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">देशों में सक्रिय</div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-slate-300 leading-relaxed font-medium">
                    कनाडा, मॉरीशस, इज़राइल, रूस और दुबई जैसे देशों में सक्रिय समितियां।
                  </p>
                </div>
              </div>
            </div>

            {/* Office & Patronage */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Building2 className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-white/80" />
                  संपर्क एवं निर्देश
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-orange-200 mb-1 uppercase text-xs tracking-widest">प्रधान कार्यालय</h4>
                    <p className="text-lg font-bold">झांसी, उत्तर प्रदेश</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-200 mb-2 uppercase text-xs tracking-widest">मार्गदर्शक मंडल</h4>
                    <p className="text-sm leading-relaxed text-white/90">
                      पूर्व राज्यपालों (स्व. केशरीनाथ त्रिपाठी, कप्तान सिंह सोलंकी) और आध्यात्मिक गुरुओं का संरक्षण।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activities & Awards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2rem] border border-orange-100 shadow-sm relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">मुख्य कार्यशैली</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "अंतरराष्ट्रीय संगोष्ठियां",
                    "साहित्यकारों का सम्मान",
                    "विश्व रिकॉर्ड जैसे बड़े आयोजन",
                    "हिंदी का वैश्विक प्रचार"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2rem] border border-orange-100 shadow-sm relative group overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">प्रतिष्ठित सम्मान</h3>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed mb-4">
                  संस्था हर साल <span className="text-amber-600 font-bold">'हिंदी साहित्य भारती पुरस्कार'</span> प्रदान करती है।
                </p>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-sm text-amber-800 font-bold italic">
                    "2024 में मुम्बई के पूर्व पुलिस कमिश्नर कृष्णा प्रकाश को सम्मानित किया गया।"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sankalap Section */}
          <div className="mt-20 mb-8 p-8 md:p-16 bg-white/60 backdrop-blur-md rounded-[3rem] border border-orange-100 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
              <Sparkles className="w-96 h-96 text-orange-600" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-4">
                  <Heart className="w-4 h-4" />
                  <span>साहित्यिक संकल्प</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">संकल्प</h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-12">
                {/* Intro Stanza */}
                <div className="text-center group">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 leading-tight space-y-2">
                    <p className="hover:scale-105 transition-transform duration-300">बीज बनकर आज हम, नव सृष्टि की रचना करेंगे</p>
                    <p className="hover:scale-105 transition-transform duration-300">हो गई है जड़ मनुजता, चेतना फिर से भरेंगे</p>
                  </div>
                </div>

                {/* Poem Grid */}
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                  {[
                    [
                      "मिल गया निज तंत्र फिर भी, दैन्यता हटने न पाई",
                      "बस प्रगति के नाम हमने, नीति-पथ को दी विदाई",
                      "स्वप्न पुरखों का अधूरा, आज हम पूरा करेंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे"
                    ],
                    [
                      "सत्य को देकर तिलांजलि, झूठ का सम्बल रहा है",
                      "ध्येय निष्ठा को भुलाया, भवन संस्कृति का ढहा है",
                      "ध्येय पथ की साधना से, सृजन की वर्षा करेंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे।"
                    ],
                    [
                      "मिट रही है वसुन्धरा अब, शत्रुता घनघोर छाई",
                      "स्वार्थ की स्वच्छन्दता ने मनुजता को दी विदाई",
                      "श्रेष्ठ है परमार्थ श्रद्धा भावना विकसित करेंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे।"
                    ],
                    [
                      "जातियों का विष भयकर, फैलता ही जा रहा है",
                      "राष्ट्र की ममता मिटाकर नेह को ही खा रहा है",
                      "किन्तु हम अपनी धरा पर, बेल यह पलने न देंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे।"
                    ],
                    [
                      "आस्तर जिसको दिया था, मित्रता का प्यार देने",
                      "वह खड़ा है अब दंग दे, हम सभी के प्राण लेने",
                      "कर अपरिमित शक्ति संचित दुष्ट दानवता हरेंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे।"
                    ],
                    [
                      "रक्त की गंगा बहाकर, त्यागमय स्वातंत्र्य पाया",
                      "कफन सिर पर बाँध बन्दे मातरम् का गीत गाया",
                      "प्रेरणा लेकर उन्हीं से क्रान्ति की ज्वाला बनेंगे",
                      "हो गई है जड़ मनुजता, चेतना फिर से भरेंगे।"
                    ]
                  ].map((stanza, idx) => (
                    <div key={idx} className="space-y-3 relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-100/50 rounded-full" />
                      {stanza.map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className={`text-lg md:text-xl leading-relaxed ${lIdx === 3 ? "font-bold text-slate-900 border-t border-orange-50 pt-2 mt-2" : "text-slate-600 font-medium"
                            }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Author Info */}
                <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                  <div className="inline-block relative">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-3">रचनाकार</p>
                    <p className="text-2xl md:text-3xl font-black text-slate-900">डॉ० रवीन्द्र शुक्ल</p>
                    <div className="absolute -right-12 -top-2 opacity-20">
                      <FileText className="w-8 h-8 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

