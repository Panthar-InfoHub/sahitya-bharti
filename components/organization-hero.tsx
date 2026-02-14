import Image from "next/image"
import { Sparkles, Globe, Heart, Users, BookOpen } from "lucide-react"

export function OrganizationHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,247,237,1),transparent),radial-gradient(circle_at_bottom_right,rgba(254,243,199,1),transparent),white]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto space-y-32">
          {/* Part 1: Main Hero Identity (Initial Fold) */}
          <div className="text-center space-y-12 min-h-[75vh] flex flex-col justify-center items-center">
            {/* Logo with enhanced presentation */}
            <div className="relative group mb-4">
              <div className="absolute -inset-1 bg-linear-to-r from-orange-400 to-amber-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative w-36 h-36 md:w-56 md:h-56 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/logo.jpg"
                  alt="हिंदी साहित्य भारती"
                  fill
                  className="object-contain rounded-full shadow-2xl ring-4 ring-white"
                  priority
                />
              </div>
            </div>

            {/* Organization Name */}
            <div className="space-y-2">
              <h1 className="pt-3 text-5xl md:text-6xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                हिंदी साहित्य भारती
              </h1>
            </div>

            {/* Motto Section - Directly below Heading */}
            <div className="inline-block relative animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="absolute -inset-8 bg-orange-100/30 rounded-full blur-2xl opacity-60" />
              <div className="relative px-8 py-4 md:px-14 md:py-8 border-y-2 border-orange-200/40">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-orange-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-2xl md:text-4xl font-black text-orange-700 tracking-tight drop-shadow-sm italic">
                  &quot;मानव बन जाए जग सारा, <br className="md:hidden" /> यह पावन संकल्प हमारा।&quot;
                </p>
              </div>
            </div>


            {/* Scroll Indicator */}
            <div className="pt-12 animate-bounce opacity-40">
              <div className="w-6 h-10 border-2 border-orange-950 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-orange-950 rounded-full" />
              </div>
            </div>
          </div>

          {/* Part 2: Introduction (Scroll Down) */}
          <div className="space-y-20 pt-10">
            {/* Ek Parichay Header */}
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent py-4 inline-block">
                एक परिचय
              </h2>
            </div>

            {/* Intro Content in a Different format (Premium Card) */}
            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-linear-to-r from-orange-100 to-amber-100 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />
              <div className="relative bg-white/80 backdrop-blur-md p-10 md:p-16 rounded-[3rem] border border-orange-100 shadow-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-linear-to-b from-orange-400 to-amber-400" />
                <p className="text-xl md:text-3xl text-stone-700 leading-relaxed font-medium text-center font-serif italic">
                  &quot;हिंदी साहित्य भारती एक अंतरराष्ट्रीय संस्था है जो हिंदी साहित्य के प्रचार-प्रसार और भारतीय सांस्कृतिक मूल्यों की वैश्विक पुनर्स्थापना के लिए समर्पित है। इसके अंतरराष्ट्रीय अध्यक्ष उत्तर प्रदेश के पूर्व शिक्षा मंत्री <span className="text-orange-700 font-bold decoration-orange-300 decoration-wavy underline underline-offset-8">डॉ. रवींद्र शुक्ल</span> हैं।&quot;
                </p>
              </div>
            </div>

            {/* Section Divider for Objectives */}
            <div className="flex flex-col items-center pt-10">
              <div className="w-px h-16 bg-linear-to-b from-transparent via-orange-300 to-transparent mb-6" />
              <h3 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4 relative inline-block text-center px-4">
                हमारा विजन और मिशन
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-orange-400 rounded-full" />
              </h3>
            </div>

            {/* Key Objectives Cards */}
            <div className="grid md:grid-cols-3 gap-8 relative px-4 pb-20">
              {/* Objective 1 */}
              <div className="group relative p-8 rounded-4xl bg-stone-50/50 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(251,146,60,0.12)] hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 mb-6 bg-orange-100/50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">सांस्कृतिक पुनरुत्थान</h3>
                <p className="text-stone-600 leading-relaxed text-base">
                  भारतीय दर्शन और &apos;वसुधैव कुटुंबकम&apos; की भावना के आधार पर मानवीय मूल्यों को फिर से स्थापित करना।
                </p>
              </div>

              {/* Objective 2 */}
              <div className="group relative p-8 rounded-4xl bg-stone-50/50 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.12)] hover:-translate-y-2 transition-all duration-500 md:translate-y-6">
                <div className="w-16 h-16 mb-6 bg-amber-100/50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">हिंदी का वैश्विक प्रचार</h3>
                <p className="text-stone-600 leading-relaxed text-base">
                  हिंदी को अंतरराष्ट्रीय स्तर पर पहचान दिलाना और इसे भारत की राष्ट्रभाषा के रूप में पूर्ण सम्मान दिलाने के लिए कार्य करना।
                </p>
              </div>

              {/* Objective 3 */}
              <div className="group relative p-8 rounded-4xl bg-stone-50/50 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(251,146,60,0.12)] hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 mb-6 bg-orange-100/50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-4">साहित्यकारों का सहयोग</h3>
                <p className="text-stone-600 leading-relaxed text-base">
                  आर्थिक रूप से कमजोर लेकिन प्रतिभाशाली लेखकों की उच्च स्तरीय रचनाओं को प्रकाशित करने में मदद करना।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
