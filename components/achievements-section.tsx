import { Trophy, Globe, BookMarked, Users2 } from "lucide-react"

export function AchievementsSection() {
  const achievements = [
    {
      icon: Trophy,
      title: "राष्ट्रीय सम्मान",
      items: [
        "हिंदी सेवा सम्मान - राष्ट्रपति द्वारा (2020)",
        "साहित्य रत्न पुरस्कार (2018)",
        "भाषा भूषण सम्मान (2015)",
      ],
    },
    {
      icon: Globe,
      title: "अंतरराष्ट्रीय सहभागिता",
      items: [
        "विश्व हिंदी सम्मेलन में प्रतिनिधित्व (2019, 2022)",
        "अंतरराष्ट्रीय साहित्य महोत्सव आयोजन",
        "20+ देशों में साहित्यिक कार्यक्रम",
      ],
    },
    {
      icon: BookMarked,
      title: "प्रकाशन उपलब्धियाँ",
      items: [
        "200+ पुस्तकों का प्रकाशन",
        "त्रैमासिक साहित्यिक पत्रिका 'साहित्य दर्पण'",
        "50+ शोध पत्रों का प्रकाशन",
      ],
    },
    {
      icon: Users2,
      title: "सामाजिक योगदान",
      items: [
        "100+ ग्रामीण पुस्तकालयों की स्थापना",
        "10,000+ छात्रों को छात्रवृत्ति",
        "साक्षरता अभियान में योगदान",
      ],
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              उपलब्धियाँ एवं मान्यता
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              चार दशकों की निरंतर सेवा में प्राप्त सम्मान और उपलब्धियाँ
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow"
                >
                  {/* Icon and Title */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {achievement.title}
                    </h3>
                  </div>

                  {/* Achievement Items */}
                  <ul className="space-y-3">
                    {achievement.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "40+", label: "वर्षों का अनुभव" },
              { number: "500+", label: "कार्यक्रम आयोजित" },
              { number: "10,000+", label: "सदस्य" },
              { number: "20+", label: "राज्यों में उपस्थिति" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
