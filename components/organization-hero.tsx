import Image from "next/image"

export function OrganizationHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.3),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40 animate-pulse">
              <Image
                src="/logo.jpg"
                alt="हिंदी साहित्य भारती"
                fill
                className="object-contain rounded-full shadow-2xl ring-4 ring-orange-200"
                priority
              />
            </div>
          </div>

          {/* Organization Name */}
          <div className="space-y-2">
            <h1 className="pt-3 text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              हिंदी साहित्य भारती
            </h1>
          </div>

          {/* Vision, Mission, Purpose */}
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {/* Vision */}
            <div className="space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                दृष्टि
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                हिंदी साहित्य को विश्व स्तर पर प्रतिष्ठित करना और भारतीय संस्कृति का संरक्षण करना।
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                मिशन
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                साहित्यकारों को प्रोत्साहित करना और हिंदी भाषा के विकास में योगदान देना।
              </p>
            </div>

            {/* Purpose */}
            <div className="space-y-3 p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-orange-100 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                उद्देश्य
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                साहित्यिक कार्यक्रमों का आयोजन और नई प्रतिभाओं को मंच प्रदान करना।
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="pt-8">
            <p className="text-2xl font-semibold text-orange-600 italic">
              "मानव बन जाए जाग सारा, यही है संकल्प हमारा।"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
