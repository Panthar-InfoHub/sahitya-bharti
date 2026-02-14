"use client"
import { useState } from "react"
import { Users, Award, BookText, Heart } from "lucide-react"
import { ContactPopup } from "@/components/contact-popup"

export function ActivitiesSection() {
  const [showContactPopup, setShowContactPopup] = useState(false)

  const activities = [
    {
      icon: Users,
      title: "राष्ट्रीय / अंतरराष्ट्रीय संगोष्ठियाँ",
      description: "साहित्यिक एवं सांस्कृतिक विषयों पर राष्ट्रीय और अंतरराष्ट्रीय स्तर की संगोष्ठियों का आयोजन।",
      stats: "50+ वार्षिक कार्यक्रम",
    },
    {
      icon: Award,
      title: "साहित्यिक आयोजन व सम्मान समारोह",
      description: "कवि सम्मेलन, मुशायरे, साहित्यिक पुरस्कार वितरण और लेखकों को सम्मानित करने के कार्यक्रम।",
      stats: "100+ सम्मानित साहित्यकार",
    },
    {
      icon: BookText,
      title: "शोध पत्र, पत्रिका एवं पुस्तक प्रकाशन",
      description: "शोध पत्रिकाओं का प्रकाशन, साहित्यिक पुस्तकों का प्रकाशन और नवीन लेखकों को प्रोत्साहन।",
      stats: "200+ प्रकाशित कृतियाँ",
    },
    {
      icon: Heart,
      title: "सामाजिक एवं शैक्षिक परियोजनाएँ",
      description: "ग्रामीण क्षेत्रों में शिक्षा प्रसार, पुस्तकालय स्थापना और साक्षरता अभियान।",
      stats: "30+ सक्रिय परियोजनाएँ",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              प्रमुख गतिविधियाँ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              हमारे संगठन द्वारा संचालित विविध साहित्यिक, शैक्षिक और सामाजिक कार्यक्रम
            </p>
          </div>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">
                        {activity.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {activity.description}
                      </p>

                      {/* Stats */}
                      <div className="inline-block bg-white px-4 py-2 rounded-full border border-orange-200">
                        <p className="text-sm font-semibold text-primary">
                          {activity.stats}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              हमारी गतिविधियों में भाग लेने या सहयोग करने के लिए संपर्क करें
            </p>
            <button 
              onClick={() => setShowContactPopup(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
            >
              अधिक जानकारी के लिए संपर्क करें
            </button>
          </div>
        </div>
      </div>
      
      <ContactPopup 
        open={showContactPopup} 
        onOpenChange={setShowContactPopup} 
      />
    </section>
  )
}
