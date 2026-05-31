"use client"

import { User, MapPin, Mail, Phone } from "lucide-react"

interface Founder {
  id: string
  name: string
  designation: string
  bio: string
  photo_url: string
  phone: string
  email: string
  location: string
}

const founders: Founder[] = [
  {
    id: "1",
    name: "डॉ. रवीन्द्र शुक्ल",
    designation: "संस्थापक सदस्य",
    bio: "पूर्व शिक्षा मंत्री उ.प्र. सरकार, वरिष्ठ कवि एवं साहित्यकार",
    photo_url: "/images/director.jpg",
    phone: "+91 98765 43210",
    email: "kaviravindrashukla@gmail.com",
    location: "नई दिल्ली, भारत"
  },
  {
    id: "2",
    name: "पूज्य स्वामी डॉ. शाश्वतानन्द गिरि जी",
    designation: "संस्थापक सदस्य",
    bio: "महामण्डलेश्वर, कुरुक्षेत्र",
    photo_url: "/founder/founder2.jpeg",
    phone: "9416051108",
    email: "12vidant@gmail.com",
    location: "(निरंजनी अखाड़ा) कुरुक्षेत्र, हरियाणा"
  },
  {
    id: "3",
    name: "डॉ. बुद्धिनाथ मिश्र",
    designation: "संस्थापक सदस्य",
    bio: "पूर्व महाप्रबंधक ओएनजीसी, वरिष्ठ साहित्यकार, देहरादून",
    photo_url: "/founder/founder3.jpeg",
    phone: "+91 63976 77279",
    email: "buddhinathji@gmail.com",
    location: "देहरादून, उत्तराखंड"
  },
  {
    id: "4",
    name: "आचार्य देवेंद्र देव",
    designation: "संस्थापक सदस्य",
    bio: "वरिष्ठ साहित्यकार, बरेली (गिनीज बुक नामिनी)",
    photo_url: "/founder/founder4.jpeg",
    phone: "+91 91493 54944",
    email: "9149354944",
    location: "बरेली, उ.प्र."
  },
  {
    id: "5",
    name: "डॉ. करुणा शंकर उपाध्याय",
    designation: "संस्थापक सदस्य",
    bio: "विभागाध्यक्ष हिन्दी, मुंबई विश्वविद्यालय, वरिष्ठ समालोचक एवं साहित्यकार",
    photo_url: "/founder/founder5.jpeg",
    phone: "+91  91679 21043",
    email: "dr.krupadhyay@gmail.com",
    location: "मुंबई, महाराष्ट्र"
  },
  {
    id: "6",
    name: "श्री निशांत शुक्ल",
    designation: "संस्थापक सदस्य",
    bio: "व्यवसायी कवि, चिंतक, समाजसेवी, झांसी",
    photo_url: "/founder/founder6.jpeg",
    phone: "+91 94530 31311",
    email: "nishantravindrashukla@gmail.com",
    location: "झांसी, उत्तर प्रदेश"
  },
  {
    id: "7",
    name: "श्री योगेन्द्र शर्मा",
    designation: "संस्थापक सदस्य",
    bio: "अंतरराष्ट्रीय कवि एवं साहित्यकार, भीलवाड़ा, राजस्थान",
    photo_url: "/founder/founder7.jpeg",
    phone: "+91 63506 22742",
    email: "textileworld.tw@gmail.com",
    location: "भीलवाड़ा, राजस्थान"
  },
  {
    id: "8",
    name: "डॉ. अनिल शर्मा",
    designation: "संस्थापक सदस्य",
    bio: "प्रवक्ता हिन्दी, बी.एस.एम. इंटर कॉलेज रुड़की (उत्तराखण्ड)",
    photo_url: "/founder/founder8.jpeg",
    phone: "+91 97588 12188",
    email: "dranilsharmarke@gmail.com",
    location: "रुड़की, उत्तराखण्ड"
  },
  {
    id: "9",
    name: "श्री वैभव वैद्य",
    designation: "संस्थापक सदस्य",
    bio: "सॉफ्टवेयर इंजीनियर, चिंतक, विचारक, कनाडा",
    photo_url: "/founder/founder9.jpeg",
    phone: "+1 416 779 5148",
    email: "vaibhav.vaidya7@gmail.com",
    location: "कनाडा"
  },
  {
    id: "10",
    name: "डॉ. प्रियंका कौशिक",
    designation: "संस्थापक सदस्य",
    bio: "एमडी यूथ एंड आर सॉल्यूशंस, जयपुर",
    photo_url: "/founder/founder10.jpeg",
    phone: "+91  97997 14222",
    email: "priyankakaushik29@gmail.com",
    location: "राजस्थान"
  },
  {
    id: "11",
    name: "डॉ. ओमप्रकाश द्विवेदी",
    designation: "संस्थापक सदस्य",
    bio: " पूर्व संयुक्त निदेशक, माध्यमिक शिक्षा, उ.प्र.",
    photo_url: "/founder/founder11.jpeg",
    phone: "+91 94153 74968",
    email: "omrajanidwivedi@gmail.com",
    location: "काशी, उत्तर प्रदेश"
  },
  // {
  //   id: "12",
  //   name: "डॉ. दीपक शर्मा",
  //   designation: "संस्थापक सदस्य",
  //   bio: "हिंदी साहित्य भारती के विकास एवं प्रचार-प्रसार में महत्वपूर्ण योगदान।",
  //   photo_url: "https://ui-avatars.com/api/?name=DS&background=FF8C00&color=fff&size=200",
  //   phone: "+91 98765 43221",
  //   email: "deepak.sharma@example.com",
  //   location: "शिमला, हिमाचल प्रदेश"
  // }
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

        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {founders.map((founder) => (
            <div 
              key={founder.id}
              className="w-full sm:w-[320px] lg:w-[300px] xl:w-[280px] group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-orange-50 hover:border-orange-200 flex flex-col items-center text-center overflow-hidden h-full"
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
                <div className="space-y-2 mb-4 w-full text-center">
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

                <div className="w-full mt-auto pt-4 border-t border-orange-50/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 text-xs text-stone-600">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="truncate">{founder.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-stone-600">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                    <a href={`tel:${founder.phone.replace(/\s+/g, '')}`} className="hover:text-orange-600 transition-colors">
                      {founder.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-stone-600">
                    <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                    <a href={`mailto:${founder.email}`} className="hover:text-orange-600 transition-colors truncate">
                      {founder.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
