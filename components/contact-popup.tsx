"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Phone, Mail, MapPin, Globe } from "lucide-react"

interface ContactPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactPopup({ open, onOpenChange }: ContactPopupProps) {
  const contactInfo = [
    {
      icon: Phone,
      title: "मोबाइल",
      value: "+91 98765 43210",
      link: "tel:+919876543210",
    },
    {
      icon: Mail,
      title: "ई-मेल",
      value: "info@hindisahityabharti.org",
      link: "mailto:info@hindisahityabharti.org",
    },
    {
      icon: MapPin,
      title: "कार्यालय पता",
      value: "123, साहित्य मार्ग, कवि नगर, नई दिल्ली - 110001",
      link: null,
    },
    {
      icon: Globe,
      title: "वेबसाइट",
      value: "www.hindisahityabharti.org",
      link: "https://www.hindisahityabharti.org",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">संपर्क जानकारी</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {contactInfo.map((contact, index) => {
            const Icon = contact.icon
            const content = (
              <div className="flex items-start gap-4 p-4 rounded-xl border border-orange-100 hover:bg-orange-50/50 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm mb-0.5">
                    {contact.title}
                  </h4>
                  <p className="text-sm text-muted-foreground break-all">
                    {contact.value}
                  </p>
                </div>
              </div>
            )

            return contact.link ? (
              <a key={index} href={contact.link} className="block">
                {content}
              </a>
            ) : (
              <div key={index}>{content}</div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
