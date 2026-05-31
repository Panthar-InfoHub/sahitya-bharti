"use client"

import { User, MapPin, Mail, Phone } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface Founder {
  id: string
  nameHi: string
  nameEn: string
  designationHi: string
  designationEn: string
  bioHi: string
  bioEn: string
  photo_url: string
  phone: string
  email: string
  locationHi: string
  locationEn: string
}

const founders: Founder[] = [
  {
    id: "1",
    nameHi: "डॉ. रवीन्द्र शुक्ल",
    nameEn: "Dr. Ravindra Shukla",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "पूर्व शिक्षा मंत्री उ.प्र. सरकार, वरिष्ठ कवि एवं साहित्यकार",
    bioEn: "Former Education Minister U.P. Govt, Senior Poet & Writer",
    photo_url: "/images/director.jpg",
    phone: "+91 98765 43210",
    email: "kaviravindrashukla@gmail.com",
    locationHi: "नई दिल्ली, भारत",
    locationEn: "New Delhi, India"
  },
  {
    id: "2",
    nameHi: "पूज्य स्वामी डॉ. शाश्वतानन्द गिरि जी",
    nameEn: "Pujya Swami Dr. Shashwatanand Giri Ji",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "महामण्डलेश्वर, कुरुक्षेत्र",
    bioEn: "Mahamandaleshwar, Kurukshetra",
    photo_url: "/founder/founder2.jpeg",
    phone: "9416051108",
    email: "12vidant@gmail.com",
    locationHi: "(निरंजनी अखाड़ा) कुरुक्षेत्र, हरियाणा",
    locationEn: "(Niranjani Akhada) Kurukshetra, Haryana"
  },
  {
    id: "3",
    nameHi: "डॉ. बुद्धिनाथ मिश्र",
    nameEn: "Dr. Buddhinath Mishra",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "पूर्व महाप्रबंधक ओएनजीसी, वरिष्ठ साहित्यकार, देहरादून",
    bioEn: "Former GM ONGC, Senior Writer, Dehradun",
    photo_url: "/founder/founder3.jpeg",
    phone: "+91 63976 77279",
    email: "buddhinathji@gmail.com",
    locationHi: "देहरादून, उत्तराखंड",
    locationEn: "Dehradun, Uttarakhand"
  },
  {
    id: "4",
    nameHi: "आचार्य देवेंद्र देव",
    nameEn: "Acharya Devendra Dev",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "वरिष्ठ साहित्यकार, बरेली (गिनीज बुक नामिनी)",
    bioEn: "Senior Writer, Bareilly (Guinness Book Nominee)",
    photo_url: "/founder/founder4.jpeg",
    phone: "+91 91493 54944",
    email: "9149354944",
    locationHi: "बरेली, उ.प्र.",
    locationEn: "Bareilly, U.P."
  },
  {
    id: "5",
    nameHi: "डॉ. करुणा शंकर उपाध्याय",
    nameEn: "Dr. Karuna Shankar Upadhyay",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "विभागाध्यक्ष हिन्दी, मुंबई विश्वविद्यालय, वरिष्ठ समालोचक एवं साहित्यकार",
    bioEn: "HOD Hindi, Mumbai University, Senior Critic & Writer",
    photo_url: "/founder/founder5.jpeg",
    phone: "+91  91679 21043",
    email: "dr.krupadhyay@gmail.com",
    locationHi: "मुंबई, महाराष्ट्र",
    locationEn: "Mumbai, Maharashtra"
  },
  {
    id: "6",
    nameHi: "श्री निशांत शुक्ल",
    nameEn: "Shri Nishant Shukla",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "व्यवसायी कवि, चिंतक, समाजसेवी, झांसी",
    bioEn: "Businessman, Poet, Thinker, Social Worker, Jhansi",
    photo_url: "/founder/founder6.jpeg",
    phone: "+91 94530 31311",
    email: "nishantravindrashukla@gmail.com",
    locationHi: "झांसी, उत्तर प्रदेश",
    locationEn: "Jhansi, Uttar Pradesh"
  },
  {
    id: "7",
    nameHi: "श्री योगेन्द्र शर्मा",
    nameEn: "Shri Yogendra Sharma",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "अंतरराष्ट्रीय कवि एवं साहित्यकार, भीलवाड़ा, राजस्थान",
    bioEn: "International Poet & Writer, Bhilwara, Rajasthan",
    photo_url: "/founder/founder7.jpeg",
    phone: "+91 63506 22742",
    email: "textileworld.tw@gmail.com",
    locationHi: "भीलवाड़ा, राजस्थान",
    locationEn: "Bhilwara, Rajasthan"
  },
  {
    id: "8",
    nameHi: "डॉ. अनिल शर्मा",
    nameEn: "Dr. Anil Sharma",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "प्रवक्ता हिन्दी, बी.एस.एम. इंटर कॉलेज रुड़की (उत्तराखण्ड)",
    bioEn: "Hindi Lecturer, B.S.M. Inter College Roorkee (Uttarakhand)",
    photo_url: "/founder/founder8.jpeg",
    phone: "+91 97588 12188",
    email: "dranilsharmarke@gmail.com",
    locationHi: "रुड़की, उत्तराखण्ड",
    locationEn: "Roorkee, Uttarakhand"
  },
  {
    id: "9",
    nameHi: "श्री वैभव वैद्य",
    nameEn: "Shri Vaibhav Vaidya",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "सॉफ्टवेयर इंजीनियर, चिंतक, विचारक, कनाडा",
    bioEn: "Software Engineer, Thinker, Philosopher, Canada",
    photo_url: "/founder/founder9.jpeg",
    phone: "+1 416 779 5148",
    email: "vaibhav.vaidya7@gmail.com",
    locationHi: "कनाडा",
    locationEn: "Canada"
  },
  {
    id: "10",
    nameHi: "डॉ. प्रियंका कौशिक",
    nameEn: "Dr. Priyanka Kaushik",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "एमडी यूथ एंड आर सॉल्यूशंस, जयपुर",
    bioEn: "MD Youth & HR Solutions, Jaipur",
    photo_url: "/founder/founder10.jpeg",
    phone: "+91  97997 14222",
    email: "priyankakaushik29@gmail.com",
    locationHi: "राजस्थान",
    locationEn: "Rajasthan"
  },
  {
    id: "11",
    nameHi: "डॉ. ओमप्रकाश द्विवेदी",
    nameEn: "Dr. Omprakash Dwivedi",
    designationHi: "संस्थापक सदस्य",
    designationEn: "Founder Member",
    bioHi: "पूर्व संयुक्त निदेशक, माध्यमिक शिक्षा, उ.प्र.",
    bioEn: "Former Joint Director, Secondary Education, U.P.",
    photo_url: "/founder/founder11.jpeg",
    phone: "+91 94153 74968",
    email: "omrajanidwivedi@gmail.com",
    locationHi: "काशी, उत्तर प्रदेश",
    locationEn: "Kashi, Uttar Pradesh"
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
  const { language } = useLanguage()

  const labels = {
    hi: {
      subtitle: 'संस्था के शिल्पकार',
      title: 'संस्थापक गण',
      description: 'हिंदी साहित्य भारती की नींव रखने वाले एवं इसे दिशा प्रदान करने वाले हमारे आदरणीय संस्थापक सदस्य'
    },
    en: {
      subtitle: 'Architects of the Organization',
      title: 'Founder Members',
      description: 'Our respected founding members who laid the foundation of Hindi Sahitya Bharti and continue to guide its vision'
    }
  }

  const L = labels[language] ?? labels.hi

  return (
    <section className="py-24 bg-orange-50/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
            {L.subtitle}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            {L.title}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-red-400 mx-auto rounded-full" />
          <p className="max-w-2xl mx-auto text-slate-500 font-medium">
            {L.description}
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
                  alt={language === 'en' ? founder.nameEn : founder.nameHi}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Information Area */}
              <div className="flex-1 flex flex-col items-center w-full">
                <div className="space-y-2 mb-4 w-full text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                    {language === 'en' ? founder.designationEn : founder.designationHi}
                  </p>
                  <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors duration-300">
                    {language === 'en' ? founder.nameEn : founder.nameHi}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-2 font-medium">
                    {language === 'en' ? founder.bioEn : founder.bioHi}
                  </p>
                </div>

                <div className="w-full mt-auto pt-4 border-t border-orange-50/50 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 text-xs text-stone-600">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                    <span className="truncate">{language === 'en' ? founder.locationEn : founder.locationHi}</span>
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
