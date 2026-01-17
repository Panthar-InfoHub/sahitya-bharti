import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">हमारी कहानी</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">हमारे बारे में</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                हिंदी भाषा और साहित्य के संरक्षण और प्रचार के लिए समर्पित एक संस्था
              </p>
            </div>

            {/* Ornamental Divider */}
            <div className="flex justify-center mb-12">
              <span className="text-3xl text-primary">✦</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-20 bg-card/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <div className="relative aspect-square">
                  <Image src="/ancient-hindi-literature-manuscript.jpg" alt="हिंदी साहित्य" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground">हमारा उद्देश्य</h2>
                  <div className="w-12 h-1 bg-primary"></div>
                </div>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    हिंदी साहित्य भारती हिंदी भाषा और साहित्य के संरक्षण, प्रचार और विकास के लिए एक समर्पित संस्था है। हम भारतीय
                    साहित्यिक परंपरा को आगे बढ़ाने का कार्य करते हैं।
                  </p>
                  <p>
                    हमारा विश्वास है कि भाषा संस्कृति की आत्मा है और हिंदी साहित्य की समृद्ध परंपरा को संरक्षित रखना हमारा कर्तव्य है।
                  </p>
                  <p>हम लेखकों, कवियों और साहित्य प्रेमियों को एक मंच प्रदान करते हैं जहां वे अपनी कला को साझा और विकसित कर सकें।</p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center gap-3 text-primary">
                    <span className="text-2xl">✦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">हमारे मूल्य</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">हमारी कार्य पद्धति और दर्शन</p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-primary">📚</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">संरक्षण</h3>
                <p className="text-muted-foreground leading-relaxed">
                  हिंदी साहित्य की समृद्ध परंपरा को संरक्षित रखना और आने वाली पीढ़ियों तक पहुंचाना।
                </p>
              </div>

              {/* Value 2 */}
              <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-secondary/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-secondary">✍️</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">प्रचार</h3>
                <p className="text-muted-foreground leading-relaxed">
                  हिंदी भाषा और साहित्य को समाज के हर स्तर तक पहुंचाना और इसका प्रचार करना।
                </p>
              </div>

              {/* Value 3 */}
              <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-accent/50 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-accent">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">विकास</h3>
                <p className="text-muted-foreground leading-relaxed">
                  समकालीन समय में हिंदी साहित्य का विकास और नए सृजन को प्रोत्साहित करना।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-16 sm:py-20 bg-card/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">हमारी यात्रा</h2>
              <p className="text-muted-foreground">महत्वपूर्ण पड़ाव और उपलब्धियां</p>
            </div>

            {/* Timeline */}
            <div className="space-y-8">
              {/* Timeline item 1 */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div className="w-1 h-24 bg-primary/30 mt-2"></div>
                </div>
                <div className="pb-8 space-y-2">
                  <h3 className="text-xl font-bold text-foreground">संस्था की स्थापना</h3>
                  <p className="text-sm text-muted-foreground">२०१०</p>
                  <p className="text-muted-foreground leading-relaxed">
                    हिंदी साहित्य भारती की स्थापना हुई जिसका उद्देश्य हिंदी भाषा और साहित्य को संरक्षित करना था।
                  </p>
                </div>
              </div>

              {/* Timeline item 2 */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div className="w-1 h-24 bg-secondary/30 mt-2"></div>
                </div>
                <div className="pb-8 space-y-2">
                  <h3 className="text-xl font-bold text-foreground">राष्ट्रीय स्तर पर विस्तार</h3>
                  <p className="text-sm text-muted-foreground">२०१५</p>
                  <p className="text-muted-foreground leading-relaxed">
                    संगठन भारत के विभिन्न राज्यों में अपनी शाखाएं स्थापित कर राष्ट्रीय स्तर पर कार्य करने लगा।
                  </p>
                </div>
              </div>

              {/* Timeline item 3 */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    3
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">डिजिटल रूपांतरण</h3>
                  <p className="text-sm text-muted-foreground">२०२०</p>
                  <p className="text-muted-foreground leading-relaxed">
                    डिजिटल माध्यम से साहित्य को आगे बढ़ाने का निर्णय लिया गया और ऑनलाइन कार्यक्रम शुरू किए गए।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary via-accent to-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">हमारे साथ जुड़ें</h2>
            <p className="text-lg text-white/90">हिंदी साहित्य के संरक्षण और प्रचार में हमारा साथ दीजिए।</p>
            <a
              href="/membership"
              className="inline-block px-10 py-4 bg-white text-primary hover:bg-white/90 font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              सदस्यता प्राप्त करें
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
