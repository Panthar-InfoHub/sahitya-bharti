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

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Part 1: Main Hero Identity */}
          <div className="text-center space-y-10 min-h-[75vh] flex flex-col justify-center items-center">
            {/* Logo Container - Pure Image, Square */}
            <div className="relative w-44 h-44 md:w-64 md:h-64 mb-6 animate-in zoom-in duration-1000">
              <Image
                src="/logo.jpg"
                alt="हिंदी साहित्य भारती"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Organization Name & Motto */}
            <div className="space-y-1 max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-stone-950 leading-[1.1]">
                हिंदी साहित्य <span className="inline-block bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent pt-8 pb-2">भारती</span>
              </h1>

              <div className="relative inline-block">
                <div className="absolute -inset-x-12 -inset-y-4 bg-orange-100/40 rounded-full blur-3xl -z-10" />
                <p className="text-2xl md:text-4xl font-serif italic text-orange-900 tracking-wide">
                  &quot;मानव बन जाए जग सारा, यह पावन संकल्प हमारा।&quot;
                </p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-20 animate-bounce">
              <div className="w-6 h-10 border-2 border-stone-200 rounded-full flex justify-center p-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Part 2: Introduction (The Parichay Focus) */}
          <div className="relative py-32">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 backdrop-blur-3xl rounded-[10rem] -z-10 shadow-[0_0_100px_rgba(251,146,60,0.03)]" />

            <div className="relative grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-1 hidden lg:block">
                <div className="h-64 w-1 bg-linear-to-b from-transparent via-orange-300 to-transparent rounded-full mx-auto" />
              </div>

              <div className="lg:col-span-10 text-center space-y-12">
                <div className="inline-flex items-center gap-6 text-orange-600 font-bold tracking-[0.3em] uppercase text-xs mb-4">
                  <div className="w-12 h-px bg-orange-200" />
                  एक परिचय
                  <div className="w-12 h-px bg-orange-200" />
                </div>

                <p className="text-3xl md:text-4xl lg:text-5xl text-stone-900 leading-[1.3] font-bold font-serif italic">
                  &quot;हिंदी साहित्य भारती एक अंतरराष्ट्रीय गैर-सरकारी संगठन है, जो <span className="text-orange-600">हिंदी साहित्य</span> के संवर्धन और भारतीय सनातन जीवन-मूल्यों की वैश्विक पुनर्स्थापना के लिए समर्पित है।&quot;
                </p>

                <p className="text-lg md:text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed font-medium">
                  इसकी स्थापना इस संकल्प के साथ की गई थी कि भाषा केवल संवाद का साधन नहीं, बल्कि संस्कृति की संवाहिका होती है।
                </p>
              </div>

              <div className="lg:col-span-1 hidden lg:block">
                <div className="h-64 w-1 bg-linear-to-b from-transparent via-orange-300 to-transparent rounded-full mx-auto" />
              </div>
            </div>
          </div>

          {/* Part 3: Vision & Mission (Non-Card Layout) */}
          <div className="py-32 space-y-24">
            <div className="relative flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-black text-stone-950 mb-4">ध्येय एवं संकल्प</h2>
              <div className="w-24 h-1.5 bg-linear-to-r from-orange-500 to-amber-500 rounded-full" />
            </div>

            <div className="relative space-y-8 max-w-5xl mx-auto px-4">
              {/* Point 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-12 rounded-[4rem] bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all duration-700 group">
                <div className="w-24 h-24 shrink-0 rounded-[2.5rem] bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 shadow-lg shadow-orange-100/50">
                  <Heart className="w-10 h-10" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-stone-900">सांस्कृतिक पुनरुत्थान</h3>
                  <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                    भारतीय दर्शन और &apos;वसुधैव कुटुंबकम&apos; की भावना के आधार पर मानवीय मूल्यों को फिर से स्थापित करना।
                  </p>
                </div>
              </div>

              {/* Point 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16 p-8 md:p-12 rounded-[4rem] bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all duration-700 group">
                <div className="w-24 h-24 shrink-0 rounded-[2.5rem] bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 shadow-lg shadow-amber-100/50">
                  <Globe className="w-10 h-10" />
                </div>
                <div className="space-y-4 text-center md:text-right">
                  <h3 className="text-2xl font-bold text-stone-900">हिंदी का वैश्विक प्रचार</h3>
                  <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                    हिंदी को अंतरराष्ट्रीय स्तर पर पहचान दिलाना और इसे भारत की राष्ट्रभाषा के रूप में पूर्ण सम्मान दिलाने के लिए कार्य करना।
                  </p>
                </div>
              </div>

              {/* Point 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 md:p-12 rounded-[4rem] bg-white/40 backdrop-blur-xl hover:bg-white/60 transition-all duration-700 group">
                <div className="w-24 h-24 shrink-0 rounded-[2.5rem] bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 shadow-lg shadow-orange-100/50">
                  <Users className="w-10 h-10" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-stone-900">साहित्यकारों का सहयोग</h3>
                  <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                    आर्थिक रूप से कमजोर लेकिन प्रतिभाशाली लेखकों की उच्च स्तरीय रचनाओं को प्रकाशित करने में मदद करना।
                  </p>
                </div>
              </div>

              {/* Decorative side shape */}
              <div className="absolute top-0 -right-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
              <div className="absolute bottom-0 -left-20 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
