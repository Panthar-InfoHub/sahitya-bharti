"use client"

import React, { useState } from "react"
import { X, CheckCircle, Loader2, Download } from "lucide-react"
import { statesMock } from "@/mock/statesMock"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface MembershipModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

// Plan details
const PLANS = {
  silver: { name: "Silver Plan", price: 1000, label: "सिल्वर प्लान" },
  premium: { name: "Premium Plan", price: 2500, label: "प्रीमियम प्लान" }
}

export function MembershipModal({ isOpen, onClose, user }: MembershipModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'receipt'>('form')
  const [selectedPlan, setSelectedPlan] = useState<'silver' | 'premium'>('silver')
  const [formData, setFormData] = useState({
    name: user?.full_name?.split(" ")[0] || "",
    surname: user?.full_name?.split(" ")[1] || "",
    phone: user?.phone_number || "",
    state: user?.address || "", 
    city: "",
  })
  const [receiptData, setReceiptData] = useState<any>(null)
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedState = statesMock.find((s) => s.id === formData.state) || statesMock[0] // fallback or handle proper matching if ID/Name differs
  const cities = selectedState?.cities || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "नाम आवश्यक है"
    if (!formData.phone.trim()) {
      newErrors.phone = "फोन नंबर आवश्यक है"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "10 अंकों का वैध फोन नंबर दर्ज करें"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (!user) {
        toast.error("कृपया पहले लॉग इन करें (Please login first)")
        return
    }

    setStep('processing')

    // Simulate Payment Delay
    setTimeout(async () => {
        try {
            const supabase = createClient()
            
            // 1. Update User Plan in DB
            const { error } = await supabase
                .from('users')
                .update({ 
                    plan: selectedPlan,
                    phone_number: formData.phone, // Update contact info too
                    full_name: `${formData.name} ${formData.surname}`.trim()
                })
                .eq('id', user.id)

            if (error) throw error

            // 2. Generate Receipt Data
            const receipt = {
                id: `RCPT-${Math.floor(Math.random() * 1000000)}`,
                date: new Date().toLocaleDateString(),
                amount: PLANS[selectedPlan].price,
                plan: PLANS[selectedPlan].name,
                user: `${formData.name} ${formData.surname}`
            }
            setReceiptData(receipt)
            setStep('receipt')
            toast.success("सदस्यता सफल! (Membership Successful!)")
            
        } catch (error: any) {
            console.error("Payment Error:", error)
            toast.error("Transaction Failed. Try again.")
            setStep('form')
        }
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-xl font-bold text-primary">
            {step === 'receipt' ? "भुगतान रसीद (Payment Receipt)" : "सदस्य बनें (Become a Member)"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-accent/10 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">भुगतान संसाधित हो रहा है...</p>
                    <p className="text-sm text-muted-foreground">कृपया प्रतीक्षा करें | Processing Payment...</p>
                </div>
            )}

            {step === 'receipt' && receiptData && (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-green-700">भुगतान सफल!</h3>
                        <p className="text-muted-foreground">Payment Successful</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Receipt ID:</span>
                            <span className="font-mono font-medium">{receiptData.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span className="font-medium">{receiptData.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Plan:</span>
                            <span className="font-bold text-primary">{receiptData.plan}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between text-base">
                            <span className="font-bold">Total Paid:</span>
                            <span className="font-bold text-green-600">₹{receiptData.amount}</span>
                        </div>
                    </div>

                    <Button className="w-full gap-2" onClick={onClose}>
                        <Download className="h-4 w-4" />
                        Download Receipt
                    </Button>
                </div>
            )}

            {step === 'form' && (
                <form onSubmit={handlePayment} className="space-y-5">
                    
                    {/* Plan Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        {(['silver', 'premium'] as const).map((plan) => (
                            <div 
                                key={plan}
                                onClick={() => setSelectedPlan(plan)}
                                className={`cursor-pointer border-2 rounded-lg p-3 text-center transition-all ${
                                    selectedPlan === plan 
                                    ? 'border-primary bg-primary/5 shadow-md' 
                                    : 'border-muted hover:border-primary/50'
                                }`}
                            >
                                <div className={`font-bold ${plan === 'premium' ? 'text-yellow-600' : 'text-slate-600'}`}>
                                    {PLANS[plan].label}
                                </div>
                                <div className="text-xl font-bold mt-1">₹{PLANS[plan].price}</div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">नाम *</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Name" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">उपनाम</label>
                                <input name="surname" value={formData.surname} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Surname" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">फोन नंबर *</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="9876543210" />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">राज्य (State)</label>
                             <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                              >
                                <option value="">Select State</option>
                                {statesMock.map((s) => (
                                  <option key={s.id} value={s.id}>{s.nameHi}</option>
                                ))}
                              </select>
                        </div>
                    </div>

                    <div className="bg-accent/10 border border-accent rounded-md p-4 flex justify-between items-center">
                        <span className="font-medium">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">₹{PLANS[selectedPlan].price}</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
                    >
                        Secure Pay ₹{PLANS[selectedPlan].price}
                    </button>
                    
                    <p className="text-xs text-center text-muted-foreground flex justify-center items-center gap-1">
                        🔒 Secured by Razorpay (Test Mode)
                    </p>
                </form>
            )}
        </div>
      </div>
    </div>
  )
}
