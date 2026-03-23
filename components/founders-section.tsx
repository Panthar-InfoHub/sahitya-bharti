"use client"

import { User, MapPin, Mail, Phone } from "lucide-react"

interface Founder {
  id: string
  name: string
  designation: string
  bio: string
  photo_url: string
}

const founders: Founder[] = [
  {
    id: "1",
    name: "डॉ. राम प्रसाद शुक्ल",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=RP&background=FF8C00&color=fff&size=200"
  },
  {
    id: "2",
    name: "प्रो. सरिता वर्मा",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=SV&background=FF8C00&color=fff&size=200"
  },
  {
    id: "3",
    name: "श्री विकास मिश्र",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=VM&background=FF8C00&color=fff&size=200"
  },
  {
    id: "4",
    name: "डॉ. अर्चना पाठक",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=AP&background=FF8C00&color=fff&size=200"
  },
  {
    id: "5",
    name: "श्री संजय सिंह",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=SS&background=FF8C00&color=fff&size=200"
  },
  {
    id: "6",
    name: "डॉ. नीलम श्रीवास्तव",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=NS&background=FF8C00&color=fff&size=200"
  },
  {
    id: "7",
    name: "श्री राजेश खन्ना",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=RK&background=FF8C00&color=fff&size=200"
  },
  {
    id: "8",
    name: "डॉ. कविता सिंह",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=KS&background=FF8C00&color=fff&size=200"
  },
  {
    id: "9",
    name: "श्री आलोक रंजन",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=AR&background=FF8C00&color=fff&size=200"
  },
  {
    id: "10",
    name: "डॉ. सुनीता भारती",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=SB&background=FF8C00&color=fff&size=200"
  },
  {
    id: "11",
    name: "श्री मनोज तिवारी",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=MT&background=FF8C00&color=fff&size=200"
  },
  {
    id: "12",
    name: "डॉ. दीपक शर्मा",
    designation: "संस्थापक सदस्य",
    bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
    photo_url: "https://ui-avatars.com/api/?name=DS&background=FF8C00&color=fff&size=200"
  }
]

export function FoundersSection() {
  return (
    <section className="py-24 bg-orange-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
            संस्था के शिल्पकार
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            संस्थापक गण
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-red-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-slate-500 font-medium">
            हिंदी साहित्य भारती की नींव रखने वाले एवं इसे दिशा प्रदान करने वाले हमारे आदरणीय संस्थापक सदस्य
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {founders.map((founder) => (
            <div 
              key={founder.id}
              className="w-full group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-orange-50 hover:border-orange-200 flex flex-col items-center text-center overflow-hidden h-full"
            >
              {/* Floating Background Accent */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50/50 to-transparent -z-10 group-hover:h-full group-hover:bg-orange-50/20 transition-all duration-700" />

              {/* Founder Avatar */}
              <div className="relative w-44 h-56 shrink-0 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100" />
                <img
                  src={founder.photo_url}
                  alt={founder.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Information Area */}
              <div className="flex-1 flex flex-col items-center w-full">
                <div className="space-y-2 mb-4 w-full">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                    {founder.designation}
                  </p>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors duration-300">
                    {founder.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-2 font-medium">
                    {founder.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
