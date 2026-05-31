"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DonationModal } from "./donation-modal"
import { useLanguage } from "@/lib/i18n/LanguageContext"

interface DonationWidgetProps {
  initialTotalDonated: number
  user: any
}

export function DonationWidget({ initialTotalDonated, user }: DonationWidgetProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [totalDonated, setTotalDonated] = useState(initialTotalDonated)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    const handleSuccess = () => {
      // Reload page to get fresh server-rendered totals
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }

    window.addEventListener('open-donation-modal', handleOpen)
    window.addEventListener('donation_successful', handleSuccess)
    return () => {
      window.removeEventListener('open-donation-modal', handleOpen)
      window.removeEventListener('donation_successful', handleSuccess)
    }
  }, [])

  return (
    <>
      {/* Floating Donation Total and Action Widget on Home Page Top-Left */}
      <div className="fixed top-24 left-4 z-40 bg-white/80 backdrop-blur-xl border border-orange-500/10 shadow-[0_12px_40px_rgba(249,115,22,0.1)] rounded-3xl p-4.5 hidden md:flex flex-col gap-3.5 max-w-[240px] animate-in slide-in-from-left-8 duration-700 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)] hover:border-orange-500/20 transition-all duration-500 ease-out group">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-orange-500/15 to-amber-500/15 p-2.5 rounded-2xl text-orange-600 shrink-0 border border-orange-200/30 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
            <Heart className="w-5 h-5 fill-orange-600 animate-pulse text-orange-600" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase text-stone-400 tracking-[0.15em] leading-tight mb-1">
              {t('widget.total_donated')}
            </p>
            <p className="text-xl font-black text-stone-900 leading-none tracking-tight">
              ₹{totalDonated.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setIsOpen(true)}
          size="sm" 
          className="w-full relative overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white font-black text-[11px] rounded-2xl shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-500 ease-out py-4.5 cursor-pointer"
        >
          <span className="relative z-10 flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-white" />
            {t('widget.donate_now')}
          </span>
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </Button>
      </div>

      {/* Donation Modal */}
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />
    </>
  )
}

