import Image from "next/image"

interface DirectorIntroProps {
  directorImage?: string
}

export function DirectorIntro({ directorImage }: DirectorIntroProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Image */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm">
              {/* Decorative border frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl p-6 -z-10"></div>

              {/* Main image container */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-8 border-white bg-white">
                <div className="aspect-auto">
                  <Image
                    src={directorImage || "/images/director.jpg"}
                    alt="संस्थापक और निर्देशक"
                    width={400}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Decorative ornament below image */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-primary">
                <div className="text-3xl">✦</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारे नेता</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">डॉ. रविंद्र शुक्ल</h2>
              <p className="text-lg text-secondary font-semibold">संस्थापक एवं अध्यक्ष</p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                डॉ. रविन्द्र शुक्ल एक प्रसिद्ध राष्ट्रवादी कवि, साहित्यकार, लेखक एवं वक्ता थे। उनका जन्म 29 मार्च 1953 को फर्रुखाबाद (उ.प्र.) में हुआ। वे स्व. श्री मन्नूलाल शुक्ल के पुत्र थे और उन्होंने डी.लिट., एम.ए. (हिंदी), एल.एल.बी. की शिक्षा प्राप्त की।
              </p>
              <p>
                उन्होंने हिंदी साहित्य में काव्य, गद्य और शोध के क्षेत्र में महत्वपूर्ण योगदान दिया। “वंदे भारत मातरम्” और “श्री शंकर चरित्र (महाकाव्य)” उनकी प्रमुख रचनाएँ हैं। वे अनेक राष्ट्रीय-अंतरराष्ट्रीय साहित्यिक सम्मेलनों में सक्रिय रहे।
              </p>
              <p>
                डॉ. शुक्ल चार बार झाँसी से विधायक रहे और उत्तर प्रदेश सरकार में मंत्री भी रहे। वे आपातकाल एवं राम मंदिर आंदोलन में सक्रिय रहे तथा लोकतंत्र सेनानी के रूप में पहचाने गए।
              </p>
              <p>
                उन्हें साहित्य भास्कर, तुलसी साहित्य पुरस्कार, दिनकर पुरस्कार सहित 100 से अधिक सम्मान प्राप्त हुए।
              </p>
            </div>

            {/* Ornamental element */}
            <div className="pt-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="text-2xl">✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
