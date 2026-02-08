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
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">डॉ. रविंद्र शुक्ला</h2>
              <p className="text-lg text-secondary font-semibold">संस्थापक एवं अध्यक्ष</p>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                डॉ. रविंद्र शुक्ला एक प्रसिद्ध साहित्यिक विचारक और सांस्कृतिक कार्यकर्ता हैं। उन्होंने हिंदी साहित्य भारती की स्थापना की थी
                जिसका मुख्य उद्देश्य हिंदी भाषा और साहित्य को संरक्षित और प्रचारित करना है।
              </p>
              <p>
                उनका दृष्टिकोण है कि साहित्य समाज का दर्पण है और हिंदी साहित्य की समृद्ध परंपरा को आने वाली पीढ़ियों तक पहुंचाना हमारा
                कर्तव्य है।
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
