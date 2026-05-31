"use client"

import React, { useState, useEffect } from "react"
import { X, CheckCircle, Loader2, Heart, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

export function DonationModal({ isOpen, onClose, user }: DonationModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'receipt'>('form')
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<number | null>(500)
  const [phone, setPhone] = useState(user?.phone_number || "")
  const [name, setName] = useState(user?.full_name || "")
  const [receiptData, setReceiptData] = useState<any>(null)
  
  const presets = [250, 500, 1000, 2500, 5000]

  useEffect(() => {
    if (user) {
      setName(user.full_name || "")
      setPhone(user.phone_number || "")
    }
  }, [user])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const getDonationAmount = () => {
    if (selectedPreset !== null) return selectedPreset
    const amt = parseFloat(customAmount)
    return isNaN(amt) ? 0 : amt
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = getDonationAmount()

    if (amount <= 0) {
      toast.error("कृपया एक मान्य राशि दर्ज करें। (Please enter a valid amount.)")
      return
    }

    if (!name.trim()) {
      toast.error("कृपया अपना नाम दर्ज करें। (Please enter your name.)")
      return
    }

    if (!phone.trim()) {
      toast.error("कृपया फोन नंबर दर्ज करें। (Please enter your phone number.)")
      return
    }

    setStep('processing')

    const isScriptLoaded = await loadRazorpayScript()
    if (!isScriptLoaded) {
      toast.error("Razorpay SDK लोड करने में असमर्थ। (Failed to load Razorpay SDK.)")
      setStep('form')
      return
    }

    try {
      // 1. Create Order
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: amount,
          notes: { 
            userId: user.id,
            plan: 'donation',
            type: 'donation'
          }
        }),
      })

      const orderData = await response.json()
      if (orderData.error) throw new Error(orderData.error)

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hindi Sahitya Bharti",
        description: "General Donation / योगदान",
        image: "/logo.jpg", 
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyResult = await verifyResponse.json()
            if (!verifyResult.success) throw new Error(verifyResult.message)

            // 4. Update Database Immediate Client-side Sync
            const supabase = createClient()
            const { error: txError } = await supabase
              .from('transactions')
              .insert({
                user_id: user.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                amount: amount,
                currency: 'INR',
                status: 'success',
                type: 'membership', // To satisfy DB CHECK constraints
                plan: 'donation'
              })

            if (txError && txError.code !== '23505') { // Ignore if webhook inserted it first
              console.error("Failed to insert transaction client-side:", txError)
            }

            // Trigger updates across components
            window.dispatchEvent(new Event('donation_successful'))

            // 5. Show Receipt
            const receipt = {
              id: response.razorpay_payment_id,
              date: new Date().toLocaleDateString(),
              amount: amount,
              user: name
            }
            setReceiptData(receipt)
            setStep('receipt')
            toast.success("योगदान के लिए धन्यवाद! (Thank you for your contribution!)")

          } catch (verifyError: any) {
            console.error("Verification Failed:", verifyError)
            toast.error("Payment Verification Failed")
            setStep('form')
          }
        },
        prefill: {
          name: name,
          email: user.email,
          contact: phone,
        },
        theme: {
          color: "#EA580C",
        },
        modal: {
          ondismiss: function() {
            setStep('form')
          }
        }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()

    } catch (error: any) {
      console.error("Payment Initialization Error:", error)
      toast.error("Could not initiate payment. Try again.")
      setStep('form')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-xl font-bold text-stone-900">
              {step === 'receipt' ? "योगदान रसीद (Receipt)" : "संस्था को सहयोग दें (Contribute)"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent/10 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
              <div className="p-4 bg-orange-100 rounded-full text-orange-600">
                <Heart className="h-8 w-8 fill-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">कृपया लॉग इन करें (Please Login)</h3>
                <p className="text-sm text-gray-500 mt-1">योगदान देने के लिए आपको अपने खाते में लॉग इन करना होगा।</p>
              </div>
              <Button 
                onClick={() => {
                  onClose()
                  window.location.href = "/login"
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Login Now
              </Button>
            </div>
          ) : step === 'processing' ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
              <p className="text-lg font-bold">भुगतान प्रक्रिया में है...</p>
              <p className="text-sm text-muted-foreground">Initializing Razorpay Secure Payment...</p>
            </div>
          ) : step === 'receipt' && receiptData ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-green-700">योगदान सफल!</h3>
                <p className="text-muted-foreground mt-1">आपके अमूल्य योगदान के लिए हिन्दी साहित्य भारती आभारी है।</p>
              </div>
              
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">सहयोगी (Contributor):</span>
                  <span className="font-bold text-stone-900">{receiptData.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">लेनदेन आईडी (Transaction ID):</span>
                  <span className="font-mono font-medium">{receiptData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">तारीख (Date):</span>
                  <span className="font-medium">{receiptData.date}</span>
                </div>
                <div className="border-t pt-3 mt-2 flex justify-between text-base">
                  <span className="font-bold">कुल सहयोग (Total Contribution):</span>
                  <span className="font-extrabold text-green-600">₹{receiptData.amount.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 font-bold" onClick={onClose}>
                बंद करें (Close)   
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              
              {/* Contribution Quote */}
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-center space-y-2">
                <Award className="w-8 h-8 text-orange-600 mx-auto" />
                <p className="text-sm font-serif italic text-orange-950 font-medium">
                  "भाषा और संस्कृति के वैश्विक प्रसार में आपका एक छोटा सहयोग भी अत्यंत महत्वपूर्ण है।"
                </p>
              </div>

              {/* Amount Selection */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-700 block">सहयोग राशि चुनें (Choose Amount) *</label>
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset)
                        setCustomAmount("")
                      }}
                      className={`py-2 px-3 rounded-xl font-bold border text-sm transition-all ${
                        selectedPreset === preset
                          ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      ₹{preset.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset(null)}
                    className={`py-2 px-3 rounded-xl font-bold border text-sm transition-all ${
                      selectedPreset === null
                        ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100"
                        : "border-stone-200 text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    कस्टम (Custom)
                  </button>
                </div>

                {selectedPreset === null && (
                  <div className="relative mt-2 animate-in slide-in-from-top-2 duration-200">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="अन्य राशि दर्ज करें (Enter custom amount)"
                      className="w-full pl-7 pr-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 block">पूरा नाम (Full Name) *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-medium" 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 block">फोन नंबर (Phone Number) *</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full p-2.5 border border-stone-200 rounded-xl font-medium" 
                    placeholder="9876543210" 
                    required 
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-orange-100"
              >
                ₹{getDonationAmount().toLocaleString()} का योगदान दें
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
