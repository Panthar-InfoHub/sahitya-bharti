"use client"
import { useState } from "react"
import {
  Trophy, Globe2, BookOpen, Megaphone,
  MessageSquare, Sparkles, MoveRight,
  MapPin, GraduationCap, Library,
  Flag, Award, Star, Languages,
  Zap, Compass
} from "lucide-react"
import { ContactPopup } from "@/components/contact-popup"

export function ActivitiesSection() {
  const [showContactPopup, setShowContactPopup] = useState(false)

  const internationalUnits = [
    { country: "कनाडा", detail: "कनाडा हिंदी महोत्सव एवं अंतरराष्ट्रीय कवि सम्मेलन", color: "from-red-500 to-rose-500" },
    { country: "रूस", detail: "विश्वविद्यालयी संगोष्ठियाँ एवं साहित्य अनुवाद कार्यशाला", color: "from-blue-500 to-blue-600" },
    { country: "मॉरीशस", detail: "विश्व हिंदी सचिवालय के साथ सांस्कृतिक आदान-प्रदान", color: "from-amber-400 to-orange-500" },
    { country: "इज़राइल", detail: "भारतीय दूतावास के साथ हिंदी दिवस एवं सांस्कृतिक संध्या", color: "from-cyan-500 to-blue-500" },
    { country: "दुबई / नाइजीरिया", detail: "व्यापारिक हिंदी एवं साहित्यिक गोष्ठियों का आयोजन", color: "from-emerald-500 to-teal-600" },
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
                <span>प्रभाव एवं कीर्तिमान</span>
              </div>
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 leading-[1.1]">
                सांस्कृतिक <span className="text-orange-600 underline decoration-orange-200 decoration-8 underline-offset-4 font-black">सक्रियता</span><br />
                एवं उपलब्धियाँ
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                हिंदी को वैश्विक स्तर पर 'संस्कार और संस्कृति की भाषा' के रूप में स्थापित करने का हमारा सफर।
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block h-20 w-[1px] bg-orange-200" />
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-black text-orange-600 italic">35+ देश</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">वैश्विक उपस्थिति</span>
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
                      गिनीज विश्व कीर्तिमान 2024
                    </div>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                    सब में राम शाश्वत श्री राम: <br />
                    <span className="text-orange-600">विश्व कीर्तिमान</span>
                  </h3>

                  <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                    मुम्बई में आयोजित कार्यक्रम में चीन का 13 साल पुराना रिकॉर्ड तोड़कर, भगवान राम को समर्पित हज़ारों पोस्टकार्ड लिखकर "Largest Postcard Sentence" का विश्व कीर्तिमान रचा।
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl shadow-sm flex items-center justify-center border border-orange-100">
                      <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                    </div>
                    <span className="font-bold text-slate-700">संस्था की ऐतिहासिक उपलब्धि</span>
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
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">'काव्य भारती' <br />एवं प्रकाशन</h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                  प्रतिभाशाली लेखकों को मंच प्रदान करना जिनकी रचनाएं संसाधनों के अभाव में प्रकाशित नहीं हो पातीं।
                </p>
                <div className="mt-auto flex items-center gap-2 text-sm font-black text-orange-600 group-hover:gap-4 transition-all pointer-events-none">
                  पत्रिका विवरण देखें <MoveRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 3. International Map/List Section (Grid Layout) */}
            <div className="md:col-span-12 lg:col-span-7 bg-slate-50/50 border border-slate-200 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">अंतरराष्ट्रीय शाखाएं</h3>
                  <p className="text-sm font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2">
                    <Globe2 className="w-4 h-4" /> वैश्विक अध्याय
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="px-5 py-2 bg-white rounded-2xl border border-orange-100 text-xs font-bold text-orange-700 shadow-sm">
                    35+ देशों में सक्रिय
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {internationalUnits.map((item, i) => (
                  <div key={i} className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all">
                    <div className="flex items-center gap-4 mb-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
                      <h4 className="font-black text-slate-900 text-lg">{item.country}</h4>
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
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <Compass className="w-7 h-7 text-orange-600" />
                  भविष्य की योजनाएँ
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex-shrink-0 flex items-center justify-center group-hover/item:border-orange-400 group-hover/item:shadow-lg transition-all">
                      <Languages className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">हिंदी विश्वविद्यालय सञ्जाल</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">दुनिया भर के हिंदी शिक्षण संस्थाओं को एक साझा मंच पर लाना।</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-orange-100 flex-shrink-0 flex items-center justify-center group-hover/item:border-orange-400 group-hover/item:shadow-lg transition-all">
                      <Library className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">अंकीय ग्रंथागार</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">हिंदी के दुर्लभ ग्रंथों को वैश्विक स्तर पर सुलभ बनाना।</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-orange-100">
                  <p className="text-sm italic text-orange-700 font-bold">
                    "हम केवल आज का नहीं, हिंदी के स्वर्णिम कल का निर्माण कर रहे हैं।"
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
                <h3 className="text-2xl font-black text-slate-900">राष्ट्र वंदन: एक त्रिवेणी संगम</h3>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">सांस्कृतिक एवं साहित्यिक महा-अभियान</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "1. राष्ट्र वंदन: अतीत का अभिनंदन",
                  theme: "पुरखों और इतिहास को नमन",
                  desc: "यह सत्र भारत की सांस्कृतिक विरासत और हिंदी साहित्य के उन महान साहित्यकारों को समर्पित होता है जिन्होंने भाषा की नींव रखी।",
                  goal: "तुलसीदास, कबीर, निराला और प्रेमचंद जैसे 'युग पुरुषों' के योगदान पर चर्चा। नई पीढ़ी को अपनी जड़ों से जोड़ना ही मुख्य उद्देश्य है।",
                  icon: Library,
                  color: "bg-orange-50 text-orange-600 border-orange-100"
                },
                {
                  title: "2. राष्ट्र वंदन: वर्तमान का अभिनंदन",
                  theme: "समकालीन साहित्यकारों का सम्मान",
                  desc: "इस चरण में वर्तमान समय में हिंदी भाषा की सेवा कर रहे विद्वानों, लेखकों और सामाजिक कार्यकर्ताओं का अभिनंदन किया जाता है।",
                  goal: "हिंदी साहित्य भारती सम्मान (जैसे जून 2024 में IPS कृष्ण प्रकाश का सम्मान) और डिजिटल युग में हिंदी की प्रासंगिकता पर विमर्श।",
                  icon: Award,
                  color: "bg-amber-50 text-amber-600 border-amber-100"
                },
                {
                  title: "3. राष्ट्र वंदन: कवि अभिनंदन",
                  theme: "काव्य चेतना और रस",
                  desc: "कविता को हिंदी साहित्य का हृदय माना जाता है, इसलिए यह सत्र पूरी तरह से एक भव्य 'कवि सम्मेलन' के रूप में आयोजित होता है।",
                  goal: "देश-विदेश के प्रतिष्ठित कवियों द्वारा राष्ट्रभक्ति और सांस्कृतिक गौरव का स्वर बुलंद करना। यह कार्यक्रम का सबसे भावनात्मक हिस्सा होता है।",
                  icon: Megaphone,
                  color: "bg-rose-50 text-rose-600 border-rose-100"
                }
              ].map((phase, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className={`w-14 h-14 ${phase.color} rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:rotate-12`}>
                    <phase.icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{phase.title}</h4>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-orange-500" />
                    {phase.theme}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                    {phase.desc}
                  </p>
                  <div className="pt-6 border-t border-slate-50">
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed italic">
                      <span className="text-slate-900 font-bold not-italic">लक्ष्य:</span> {phase.goal}
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
                <h4 className="text-xl font-black text-slate-900 mb-1">युवा प्रोत्साहन</h4>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-widest mb-2">भावी पीढ़ी का सशक्तीकरण</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">कॉलेजों और विश्वविद्यालयों में वाद-विवाद, कविता प्रतियोगिताओं और कार्यशालाओं के माध्यम से भाषाई संस्कार भरना।</p>
              </div>
            </div>

            <div className="flex items-center gap-6 p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-200 shadow-sm group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900 mb-1">सांस्कृतिक संगम</h4>
                <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-2">विविधता में एकता</p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">विभिन्न क्षेत्रीय भाषाओं और लोक-साहित्य के साथ हिंदी का सामंजस्य स्थापित कर सर्व-भारतीय चेतना का जागरण।</p>
              </div>
            </div>
          </div>

          {/* Final Vision Banner */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center border-2 border-orange-100 overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">हिंदी को संयुक्त राष्ट्र की आधिकारिक भाषा बनाना</h3>
              <p className="text-slate-600 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                हमारा संकल्प हिंदी को संयुक्त राष्ट्र की आधिकारिक भाषा के रूप में देखना है। इस वैश्विक जनमत संग्रह का हिस्सा बनें।
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="w-full sm:w-auto px-10 py-5 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-200"
                >
                  अभियान का समर्थन करें
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-orange-600 border-2 border-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-all leading-none">
                  विवरण देखें
                </button>
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
