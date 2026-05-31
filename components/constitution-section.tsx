"use client"

import { FileText, ExternalLink } from "lucide-react"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const labels = {
  hi: {
    title: 'साहित्य भारती का संविधान',
    desc: 'हिन्दी साहित्य भारती के नियमों, उद्देश्यों, और संरचना को विस्तार से जानने के लिए आधिकारिक संविधान पढ़ें।',
    button: 'संविधान पढ़ें (PDF)',
  },
  en: {
    title: 'Constitution of Sahitya Bharti',
    desc: 'Read the official constitution to learn about the rules, objectives, and structure of Hindi Sahitya Bharti in detail.',
    button: 'Read Constitution (PDF)',
  },
}

export function ConstitutionSection() {
  const { language } = useLanguage()
  const L = labels[language] ?? labels.hi

  return (
    <section id="constitution" className="py-12 bg-orange-50/50 border-y border-orange-100">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-8 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform duration-300">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FileText className="h-10 w-10 text-orange-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-serif">
            {L.title}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-center">
            {L.desc}
          </p>
          <a
            href="https://cbpznbckfrolcsspjzwl.supabase.co/storage/v1/object/public/avatars/constitution.pdf#toolbar=0&navpanes=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 text-sm font-medium text-white shadow transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 w-full sm:w-auto"
          >
            {L.button}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
