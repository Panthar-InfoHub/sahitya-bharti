import { BookOpen, GraduationCap, Sparkles } from "lucide-react"

export function ObjectivesSection() {
  const objectives = [
    {
      icon: BookOpen,
      title: "हिंदी भाषा एवं साहित्य का प्रचार-प्रसार",
      description: "हिंदी भाषा को राष्ट्रीय एवं अंतरराष्ट्रीय स्तर पर प्रतिष्ठित करना तथा साहित्यिक विरासत का संरक्षण करना।",
    },
    {
      icon: GraduationCap,
      title: "शैक्षणिक एवं सांस्कृतिक चेतना का विकास",
      description: "समाज में शैक्षणिक जागरूकता बढ़ाना और सांस्कृतिक मूल्यों को संरक्षित एवं प्रोत्साहित करना।",
    },
    {
      icon: Sparkles,
      title: "शोध, प्रकाशन एवं साहित्यिक गतिविधियों को प्रोत्साहन",
      description: "साहित्यिक शोध को बढ़ावा देना, गुणवत्तापूर्ण प्रकाशन करना और रचनात्मक लेखन को प्रोत्साहित करना।",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              हमारे उद्देश्य
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              हिंदी साहित्य भारती के मूल उद्देश्य जो हमारे सभी कार्यों का मार्गदर्शन करते हैं
            </p>
          </div>

          {/* Objectives Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {objectives.map((objective, index) => {
              const Icon = objective.icon
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-orange-100 group"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground mb-4 leading-snug">
                    {objective.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {objective.description}
                  </p>

                  {/* Decorative Element */}
                  <div className="mt-6 w-12 h-1 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
