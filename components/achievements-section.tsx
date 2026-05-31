"use client"

import { Trophy, Globe, BookMarked, Users2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export function AchievementsSection() {
  const { t } = useLanguage()

  const achievements = [
    {
      icon: Trophy,
      title: t('ach.cat1_title'),
      items: [
        t('ach.cat1_item1'),
        t('ach.cat1_item2'),
        t('ach.cat1_item3'),
      ],
    },
    {
      icon: Globe,
      title: t('ach.cat2_title'),
      items: [
        t('ach.cat2_item1'),
        t('ach.cat2_item2'),
        t('ach.cat2_item3'),
      ],
    },
    {
      icon: BookMarked,
      title: t('ach.cat3_title'),
      items: [
        t('ach.cat3_item1'),
        t('ach.cat3_item2'),
        t('ach.cat3_item3'),
      ],
    },
    {
      icon: Users2,
      title: t('ach.cat4_title'),
      items: [
        t('ach.cat4_item1'),
        t('ach.cat4_item2'),
        t('ach.cat4_item3'),
      ],
    },
  ]

  const stats = [
    { number: t('ach.stat1_num'), label: t('ach.stat1_lbl') },
    { number: t('ach.stat2_num'), label: t('ach.stat2_lbl') },
    { number: t('ach.stat3_num'), label: t('ach.stat3_lbl') },
    { number: t('ach.stat4_num'), label: t('ach.stat4_lbl') },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-serif">
              {t('ach.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto font-medium">
              {t('ach.desc')}
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
                    <h3 className="text-xl font-bold text-foreground font-serif">
                      {achievement.title}
                    </h3>
                  </div>

                  {/* Achievement Items */}
                  <ul className="space-y-3">
                    {achievement.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground leading-relaxed font-medium">
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
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 shadow-sm"
              >
                <div className="text-3xl font-bold text-primary mb-2 font-serif">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
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
