import Image from "next/image"
import { Sparkles, Globe, Heart, Users, BookOpen, PenTool, Search, School, Mic2, Network, Wind, Megaphone, Trophy, Library, Presentation, Building2, History, ChevronDown } from "lucide-react"

export function OrganizationHero() {
  return (
    <section className="relative w-full overflow-hidden bg-stone-50">
      {/* Background Ornaments - Global */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-amber-100/20 rounded-full blur-[100px] translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

        {/* Journey Path Line */}
        <div className="absolute top-[80vh] left-1/2 -translate-x-1/2 w-px h-[calc(100%-80vh)] bg-linear-to-b from-orange-400 via-amber-300 to-orange-400 opacity-20 hidden lg:block" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* --- Part 1: The Awakening (Main Hero) --- */}
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10 py-8 px-4">
          <div className="relative group">
            <div className="absolute -inset-8 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors duration-700" />
            <div className="relative w-40 h-40 md:w-56 md:h-56 animate-in zoom-in duration-1000 ease-out">
              <Image
                src="/logo.jpg"
                alt="हिंदी साहित्य भारती"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 max-w-5xl">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-stone-950 leading-[1.2] py-2">
              हिंदी साहित्य भारती
            </h1>
            <p className="text-lg md:text-2xl lg:text-3xl font-serif italic text-orange-900 tracking-normal opacity-90 animate-in slide-in-from-bottom duration-1000 delay-300">
              &quot;मानव बन जाए जग सारा, यह पावन संकल्प हमारा।&quot;
            </p>
          </div>

          <div className="animate-bounce flex flex-col items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-stone-400 uppercase">हमारी यात्रा</span>
            <div className="w-5 h-8 border-2 border-stone-200 rounded-full flex justify-center p-0.5">
              <div className="w-1 h-1.5 bg-orange-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* --- Part 2: The Identity (Parichay) --- */}
        <div className="relative pt-0 pb-20 lg:pb-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-orange-100/50 px-4 py-1.5 rounded-full text-orange-700 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                एक परिचय
              </div>
            </div>

            <div className="relative p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden transform hover:scale-[1.005] transition-all duration-700">
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-orange-50 to-transparent opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-amber-50 to-transparent opacity-50" />

              <p className="relative text-xl md:text-3xl lg:text-4xl text-stone-900 leading-[1.4] font-bold font-serif italic text-center px-2">
                &quot;हिंदी साहित्य भारती एक अंतरराष्ट्रीय गैर-सरकारी संगठन है, जो <span className="text-orange-600 decoration-orange-200 underline underline-offset-4">हिंदी साहित्य</span> के संवर्धन और भारतीय सनातन जीवन-मूल्यों की वैश्विक पुनर्स्थापना के लिए समर्पित है।&quot;
              </p>

              <div className="mt-8 md:mt-12 flex flex-col items-center gap-6">
                <div className="w-10 h-px bg-stone-200" />
                <p className="text-base md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-serif text-center">
                  इसकी स्थापना इस संकल्प के साथ की गई थी कि भाषा केवल संवाद का साधन नहीं, बल्कि संस्कृति की संवाहिका होती है।
                </p>
              </div>
            </div>
          </div>

          {/* Journey Node */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_0_6px_rgba(249,115,22,0.1)] hidden lg:block translate-y-1.5" />
        </div>

        {/* --- Part 3: The Growth (Vikas) --- */}
        <div className="relative py-20 lg:py-32">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start overflow-visible">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl rotate-3">
                  <History className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-stone-950 leading-tight">
                  स्थापना और <br />
                  <span className="text-orange-600">विकास</span>
                </h2>
                <div className="w-16 md:w-20 h-1.5 bg-orange-600 rounded-full" />
              </div>

              <div className="space-y-6">
                <p className="text-lg md:text-2xl text-stone-800 leading-relaxed font-serif italic border-l-4 border-orange-200 pl-6">
                  प्रख्यात साहित्यकार एवं पूर्व शिक्षा मंत्री उ.प्र. <span className="text-orange-700 font-bold not-italic">डॉ. रविन्द्र शुक्ल</span> तथा देश एवं विदेश के अनेक विद्वानों ने भारतीय संस्कृति की मूलधार, हिन्दी भाषा और हिन्दी साहित्य के उत्थान का संकल्प लेकर व्यापक मंथन के बाद <span className="text-stone-950 font-bold not-italic">15 जुलाई 2020</span> को संस्था का गठन किया।
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-6">
              <div className="p-8 rounded-[2rem] md:rounded-[2.5rem] bg-orange-600 text-white shadow-2xl shadow-orange-200 transform lg:translate-y-8">
                <Globe className="w-8 h-8 md:w-10 md:h-10 mb-6 opacity-50" />
                <p className="text-base md:text-xl leading-relaxed font-medium">
                  आज हिन्दी साहित्य भारती विश्व के <span className="text-amber-300 font-bold text-2xl">37 देशों</span>, भारत के प्रत्येक प्रदेश, जनपदीय एवं महानगरीय स्तर पर सक्रियता के साथ अपने संकल्प को पूर्ण करने में लगी हुई है। यह विश्व की एक अभिनव और सबसे बड़ी संस्था है।
                </p>
              </div>

              <div className="p-8 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-stone-100 shadow-xl">
                <p className="text-base md:text-lg text-stone-700 leading-relaxed">
                  संस्था से अनेक <span className="text-stone-950 font-bold">पूर्व राज्यपाल, कुलाधिपति, कुलपति, प्राचार्य</span> और ख्यातिलब्ध साहित्यकार जुड़े हैं। नवोदित प्रतिभाशाली साहित्यकारों के साथ-साथ अनेक साहित्यप्रेमी पूर्ण निष्ठा एवं समर्पणभाव से इस अभियान का हिस्सा हैं।
                </p>
              </div>
            </div>
          </div>

          {/* Journey Node */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_0_6px_rgba(249,115,22,0.1)] hidden lg:block translate-y-1.5" />
        </div>

        {/* --- Part 4: The Zenith (Shloka & Purpose) --- */}
        <div className="relative py-20 lg:py-32 space-y-24">
          {/* Shloka Zen Moment */}
          <div className="relative max-w-5xl mx-auto px-4">
            <div className="absolute -inset-20 bg-[radial-gradient(circle,rgba(251,146,60,0.1)_0%,transparent_70%)] blur-3xl -z-10" />

            <div className="text-center space-y-10">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif font-black text-stone-950 leading-[1.3] md:leading-[1.2]">
                  अयं बन्धुरयं नेति गणना लघुचेतसाम्।<br />
                  <span className="text-orange-600">उदारचरितानां तु वसुधैव कुटुम्बकम्॥</span>
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-10 md:w-16 bg-stone-200" />
                  <p className="text-sm md:text-xl text-stone-500 font-medium italic font-serif">
                    महाउपनिषद: अध्याय 6, मंत्र 71
                  </p>
                  <div className="h-px w-10 md:w-16 bg-stone-200" />
                </div>
              </div>

              <div className="bg-stone-950 text-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] text-center space-y-6 shadow-2xl">
                <p className="text-lg md:text-2xl leading-relaxed font-serif italic opacity-90">
                  &quot;यह अपना मित्र है और यह नहीं है, इस तरह की गणना छोटे चित्त वाले लोग करते हैं। उदार हृदय वाले लोगों के लिए तो (सम्पूर्ण) धरती ही परिवार है।&quot;
                </p>
                <p className="text-sm md:text-xl text-stone-400 font-medium max-w-2xl mx-auto leading-relaxed">
                  हिन्दी साहित्य भारती ने <span className="text-orange-400">“मानव बन जाए जग सारा”</span> को अपना ध्येय बनाकर शांति स्थापना के लिए आंदोलन प्रारम्भ किया है।
                </p>
              </div>
            </div>
          </div>

          {/* Objectives Finale */}
          <div className="space-y-12 md:space-y-24">
            <div className="text-center space-y-4 md:space-y-6">
              <span className="text-[10px] md:text-xs font-black tracking-widest text-orange-600 uppercase block">उद्देश्यों की सिद्धि</span>
              <h2 className="text-3xl md:text-6xl lg:text-7xl font-black text-stone-950 leading-tight">संस्था के उद्देश्य</h2>
              <div className="w-20 md:w-32 h-1.5 md:h-2 bg-linear-to-r from-orange-600 to-amber-600 rounded-full mx-auto mt-4 md:mt-8" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "विश्व शांति", desc: "सकारात्मक सोच के बुद्धिजीवियों को एक मंच पर लाना।", icon: <Globe className="w-5 h-5" />, color: "bg-orange-600" },
                { title: "सनातन चेतना", desc: "सांस्कृतिक चेतना को विश्व पटल पर प्रतिष्ठित करना।", icon: <Sparkles className="w-5 h-5" />, color: "bg-amber-600" },
                { title: "साहित्यिक माध्यम", desc: "सम्पूर्ण साहित्य को माध्यम बनाकर मूल्यों का विकास।", icon: <BookOpen className="w-5 h-5" />, color: "bg-stone-900" },
                { title: "हिन्दी का गौरव", desc: "हिन्दी को सम्पर्क और राष्ट्रभाषा की प्रतिष्ठा दिलाना।", icon: <Heart className="w-5 h-5" />, color: "bg-orange-600" },
                { title: "युवा संस्कार", desc: "युवा पीढ़ी में संस्कार के लिए कार्यक्रमों की रचना।", icon: <Users className="w-5 h-5" />, color: "bg-amber-600" },
                { title: "लेखक सहयोग", desc: "रचनाकारों को हर प्रकार का साहित्यिक सहयोग देना।", icon: <PenTool className="w-5 h-5" />, color: "bg-stone-900" },
                { title: "शोध एवं यथार्थ", desc: "साहित्य में भारत की गरिमा के प्रक्षेपणों का शोध।", icon: <Search className="w-5 h-5" />, color: "bg-orange-600" },
                { title: "शिक्षा समावेशन", desc: "मानव कल्याणकारी साहित्य को पाठ्यक्रमों में जोड़ना।", icon: <School className="w-5 h-5" />, color: "bg-amber-600" },
                { title: "काव्य मंच", desc: "विश्व स्तर पर काव्य मंचों द्वारा समाज को संस्कार।", icon: <Mic2 className="w-5 h-5" />, color: "bg-stone-900" },
                { title: "संगठन विस्तार", desc: "शिक्षण संस्थानों में संगठन का अहर्निश विस्तार।", icon: <Network className="w-5 h-5" />, color: "bg-orange-600" },
                { title: "प्रदूषण मुक्ति", desc: "साहित्य के प्रदूषण को समाप्त कर श्रेष्ठता लाना।", icon: <Wind className="w-5 h-5" />, color: "bg-amber-600" },
                { title: "मूल्य प्रसार", desc: "आदर्श मानवीय जीवन मूल्यों को जन-जन तक पहुँचाना।", icon: <Megaphone className="w-5 h-5" />, color: "bg-stone-900" },
                { title: "राष्ट्रार्पण", desc: "साहित्यकारों को राष्ट्रार्पण के भाव से प्रेरित करना।", icon: <Trophy className="w-5 h-5" />, color: "bg-orange-600" },
                { title: "वैश्विक मंच", desc: "उत्कृष्ट साहित्यकारों को अंतरराष्ट्रीय मंच दिलाना।", icon: <Library className="w-5 h-5" />, color: "bg-amber-600" },
                { title: "साहित्यिक विकास", desc: "सेमिनार व कार्यशालाओं से साहित्य का उन्नयन।", icon: <Presentation className="w-5 h-5" />, color: "bg-stone-900" },
                { title: "सम्पन्न संस्था", desc: "अतिथि गृहों का निर्माण व सुदृढ़ आर्थिक व्यवस्था।", icon: <Building2 className="w-5 h-5" />, color: "bg-orange-600" }
              ].map((obj, i) => (
                <div key={i} className="group p-6 md:p-8 rounded-[2rem] bg-white border border-stone-100 hover:border-orange-200 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/20">
                  <div className={`w-10 h-10 rounded-xl mb-5 flex items-center justify-center text-white shadow-lg ${obj.color} group-hover:scale-110 transition-transform`}>
                    {obj.icon}
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">{obj.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{obj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
