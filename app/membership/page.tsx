"use client"

import { FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/form"
import { FormLabel } from "@/components/ui/form"
import { FormItem } from "@/components/ui/form"
import { FormField } from "@/components/ui/form"
import { Form } from "@/components/ui/form"
import { DialogDescription } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { DialogTrigger } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { MembershipModal } from "@/components/membership-modal"
import { createClient } from "@/lib/supabase/client"

export default function MembershipPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ control: {} }) // Declare form variable
  const [isSubmitting, setIsSubmitting] = useState(false) // Declare isSubmitting variable
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  
  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        setUser({ ...user, ...profile })
      }
    }
    getUser()
  }, [])
  
  const onSubmit = (data : any) => {
    setIsSubmitting(true)
    console.log(data)
    setIsSubmitting(false)
    setIsOpen(false)
  } // Declare onSubmit function

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 sm:py-28 bg-gradient-to-b from-primary/10 via-card to-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">परिवार में शामिल हों</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">सदस्यता प्राप्त करें</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              हिंदी साहित्य भारती का सदस्य बनकर एक गौरवशाली परंपरा का हिस्सा बनें।
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-10 py-6"
              onClick={() => setIsOpen(true)}
            >
              आवेदन शुरू करें
            </Button>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-4">हमारी सदस्यता योजनाएं</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              जीवन भर के लिए साहित्य प्रेमी परिवार का हिस्सा बनें। अपनी पसंद की योजना चुनें।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  name: "Standard", 
                  price: 1000, 
                  label: "मानक सदस्यता (Standard)",
                  features: ["आजीवन सदस्यता", "ई-पत्रिका का उपयोग", "कार्यक्रमों में प्रवेश", "डिजिटल सदस्य कार्ड"] 
                },
                { 
                  name: "Premium", 
                  price: 1500, 
                  label: "विशिष्ट सदस्यता (Premium)",
                  features: ["मानक की सभी सुविधाएं", "प्राथमिकता बैठने की व्यवस्था", "लेखक कार्यशालाओं में छूट", "भौतिक सदस्य कार्ड", "वार्षिक स्मारिका"] 
                },
                { 
                  name: "Patron", 
                  price: 100000, 
                  label: " संरक्षक सदस्यता (Patron)",
                  features: ["विशिष्ट की सभी सुविधाएं", "वीआईपी अतिथि सम्मान", "निर्णायक मंडल में स्थान", "विशेष रात्रिभोज आमंत्रण", "जीवन भर का सम्मान"] 
                },
              ].map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col p-6 rounded-2xl border ${index === 1 ? 'border-primary shadow-2xl scale-105 bg-primary/5' : 'border-border bg-card'} transition-all hover:shadow-xl`}
                >
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      सर्वाधिक लोकप्रिय
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.label.split('(')[0]}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground"> / आजीवन</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-foreground/80">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${index === 1 ? 'bg-primary' : ''}`}
                    variant={index === 1 ? 'default' : 'outline'}
                    onClick={() => {
                        setSelectedPlan(plan);
                        setIsOpen(true);
                    }}
                  >
                    चुनें
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 bg-card/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">सदस्यों के लाभ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "साहित्य कार्यक्रमों में भाग लेना",
                  description: "वार्षिक साहित्य समारोह, कविता गोष्ठी और चर्चा में भाग लें।",
                },
                {
                  title: "नेटवर्किंग के अवसर",
                  description: "देश भर के लेखकों और साहित्य प्रेमियों से जुड़ें।",
                },
                {
                  title: "प्रकाशन सहायता",
                  description: "अपनी रचनाओं को संगठन के माध्यम से प्रकाशित करवाएं।",
                },
                {
                  title: "सदस्यपत्र",
                  description: "आधिकारिक सदस्यपत्र और पहचान पत्र प्राप्त करें।",
                },
                {
                  title: "विशेष छूट",
                  description: "संगठन के कार्यक्रमों और पाठ्यक्रमों में विशेष छूट।",
                },
                {
                  title: "समाचार पत्र",
                  description: "मासिक न्यूजलेटर और साहित्य संबंधी सूचनाएं प्राप्त करें।",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 bg-card/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">अक्सर पूछे जाने वाले प्रश्न</h2>

            <div className="space-y-6">
              {[
                {
                  q: "क्या सदस्यता के लिए कोई शुल्क है?",
                  a: "सदस्यता शुल्क संगठन की आंतरिक नीति के अनुसार है। अधिक जानकारी के लिए हमसे संपर्क करें।",
                },
                {
                  q: "सदस्यता कितने समय के लिए मान्य है?",
                  a: "सामान्य सदस्यता एक वर्ष के लिए मान्य है। आप इसे नवीनीकृत करवा सकते हैं।",
                },
                {
                  q: "क्या मेरी रचना प्रकाशित होगी?",
                  a: "आपकी रचना की समीक्षा के बाद संगठन के माध्यम से प्रकाशित की जा सकती है।",
                },
                {
                  q: "क्या मैं किसी भी राज्य से सदस्य बन सकता हूं?",
                  a: "हां, भारत के किसी भी राज्य से आप सदस्य बन सकते हैं।",
                },
              ].map((item, index) => (
                <div key={index} className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Membership Modal */}
      {/* Membership Modal */}
      <MembershipModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} plan={selectedPlan} />
    </>
  )
}
