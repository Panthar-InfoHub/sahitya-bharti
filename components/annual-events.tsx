import { Calendar, CheckCircle2, Star, Sparkles, BookOpen, Users, Globe, Award } from "lucide-react"

export function AnnualEvents() {
    const mandatoryEvents = [
        { name: "विवेकानन्द जयंती", date: "जनवरी", description: "युवा चेतना और दार्शनिक प्रेरणा पर्व" },
        { name: "वसंत पंचमी", date: "फरवरी", description: "सरस्वती जयंती एवं विद्या पर्व" },
        { name: "वर्ष प्रतिपदा", date: "चैत्र शुक्ल प्रतिपदा", description: "भारतीय नव वर्ष का भव्य उत्सव" },
        { name: "तुलसीदास जयंती", date: "श्रावण शुक्ल सप्तमी", description: "रामचरितमानस रचनाकार स्मृति पर्व" },
        { name: "बाल्मीकि जयंती", date: "अश्विन पूर्णिमा", description: "आदिकवि स्मृति एवं सामाजिक समरसता" },
        { name: "विजयादशमी", date: "अश्विन शुक्ल दशमी", description: "अधर्म पर धर्म की विजय का उत्सव" },
        { name: "समर्पण दिवस (15 जुलाई)", date: "15 जुलाई", description: "हिन्दी साहित्य भारती स्थापना दिवस" },
    ]

    const optionalEvents = [
        { name: "विश्व एवं राष्ट्रीय हिन्दी दिवस", icon: Globe },
        { name: "शिवाजी जयंती", icon: Star },
        { name: "गुरु गोविन्द सिंह जयंती", icon: Sparkles },
        { name: "महाराणा प्रताप जयंती", icon: Award },
        { name: "भाषा उत्सव दिवस", icon: BookOpen },
        { name: "बुद्धिजीवी सम्मेलन", icon: Users },
    ]

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-bold mb-6">
                            <Calendar className="w-4 h-4" />
                            <span>साहित्यिक पंचांग</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">वार्षिक कार्यक्रम रूपरेखा</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                            संस्था द्वारा वर्ष भर आयोजित होने वाले प्रमुख सांस्कृतिक एवं साहित्यिक उत्सवों का विवरण।
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Mandatory Events - Takes 2 columns */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 underline decoration-orange-200 decoration-4 underline-offset-8">अनिवार्य कार्यक्रम</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {mandatoryEvents.map((event, idx) => (
                                    <div key={idx} className="group bg-slate-50 hover:bg-white p-6 rounded-3xl border-2 border-transparent hover:border-orange-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                {event.date}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{event.name}</h4>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Optional & Other Events */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 underline decoration-amber-100 decoration-4 underline-offset-8">ऐच्छिक कार्यक्रम</h3>
                                </div>

                                <div className="space-y-3">
                                    {optionalEvents.map((event, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-amber-50/30 rounded-2xl border border-amber-100/50 hover:bg-white hover:shadow-md transition-all group">
                                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <event.icon className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <span className="font-bold text-slate-800">{event.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Special Mention Box */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Sparkles className="w-20 h-20" />
                                </div>
                                <div className="relative z-10">
                                    <h4 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                                        <Award className="w-5 h-5" /> विशेष लक्ष्य
                                    </h4>
                                    <p className="text-sm leading-relaxed text-slate-300 font-medium italic">
                                        "भारतीय अस्मिता एवं सांस्कृतिक चेतना के मुखर राष्ट्रीय एवं स्थानीय नायकों की जयंती मनाना तथा उनके व्यक्तित्व एवं कृतित्व से भावी पीढ़ी में प्रेरणा भरने हेतु प्रभावी कार्यक्रम करना।"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mt-16 bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 text-center">
                        <p className="text-slate-700 font-bold text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
                            राष्ट्रीय एवं अंतरराष्ट्रीय संगोष्ठियाँ (संस्कारक्षम) आयोजित करना हमारी संस्था का मुख्य ध्येय है।
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
