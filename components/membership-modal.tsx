"use client"

import React, { useState } from "react"
import { X, CheckCircle, Loader2, Download } from "lucide-react"
import { statesMock } from "@/mock/statesMock"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface Plan {
  name: string
  price: number
  label: string
}

interface MembershipModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
  plan?: Plan
}

export function MembershipModal({ isOpen, onClose, user, plan }: MembershipModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'receipt'>('form')
  
  // Script loader inside or outside
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
  };

  const [formData, setFormData] = useState({
    name: user?.full_name?.split(" ")[0] || "",
    surname: user?.full_name?.split(" ")[1] || "",
    phone: user?.phone_number || "",
    state: user?.address || "", 
    city: "",
  })
  const [receiptData, setReceiptData] = useState<any>(null)
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedState = statesMock.find((s) => s.id === formData.state) || statesMock[0]
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


    setStep('processing')

    const basePrice = plan?.price || 1000;
    const gstAmount = basePrice * 0.025;
    const totalAmount = basePrice + gstAmount;

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet.");
        setStep('form');
        return;
    }

    try {
        // 1. Create Order
        const response = await fetch("/api/razorpay/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: totalAmount,
                notes: { 
                    userId: user.id,
                    plan: plan?.name || 'membership',
                    type: 'membership' // Helpful for filtering
                }
            }),
        });

        const orderData = await response.json();
        if (orderData.error) throw new Error(orderData.error);
    
        // 2. Open Razorpay Checkout
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Sahitya Bharti",
            description: plan?.label || "Membership",
            image: "/logo.png", // Ensure logo exists or remove
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
                    });

                    const verifyResult = await verifyResponse.json();
                    if (!verifyResult.success) throw new Error(verifyResult.message);

                    // 4. Update Database
                    const supabase = createClient()
                    const { error } = await supabase
                        .from('users')
                        .update({ 
                            plan: plan?.name || 'premium',
                            phone_number: formData.phone,
                            full_name: `${formData.name} ${formData.surname}`.trim()
                        })
                        .eq('id', user.id)

                    if (error) throw error

                    // Trigger refresh in Navbar
                    window.dispatchEvent(new Event('user_updated'))

                    // 5. Show Receipt
                    const receipt = {
                        id: response.razorpay_payment_id,
                        date: new Date().toLocaleDateString(),
                        amount: totalAmount,
                        baseAmount: basePrice,
                        gstAmount: gstAmount,
                        plan: plan?.label || "Membership",
                        user: `${formData.name} ${formData.surname}`
                    }
                    setReceiptData(receipt)
                    setStep('receipt')
                    toast.success("सदस्यता सफल! (Membership Successful!)")

                } catch (verifyError: any) {
                    console.error("Verification Failed:", verifyError);
                    toast.error("Payment Verification Failed");
                    setStep('form');
                }
            },
            prefill: {
                name: `${formData.name} ${formData.surname}`,
                email: user.email,
                contact: formData.phone,
            },
            theme: {
                color: "#F37254",
            },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

    } catch (error: any) {
        console.error("Payment Initialization Error:", error);
        toast.error("Could not initiate payment. Try again.");
        setStep('form');
    }
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
            {!user ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                    <div className="p-4 bg-orange-100 rounded-full">
                         <Loader2 className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">कृपया लॉग इन करें (Please Login)</h3>
                        <p className="text-sm text-gray-500 mt-1">सदस्यता लेने के लिए आपको लॉग इन करना होगा।</p>
                    </div>
                    <Button 
                        onClick={() => {
                            onClose();
                            // Redirect to login or open login modal if available?
                            // Navbar handles login, but we can redirect.
                            window.location.href = "/login";
                        }}
                        className="w-full"
                    >
                        Login Now
                    </Button>
                </div>
            ) : step === 'processing' ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg font-medium">भुगतान शुरू किया जा रहा है...</p>
                    <p className="text-sm text-muted-foreground">Initializing Razorpay Secure Payment...</p>
                </div>
            ) : step === 'receipt' && receiptData ? (
                <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-green-700">भुगतान सफल! (Payment Successful)</h3>
                        <p className="text-muted-foreground">आपका लेनदेन पूर्ण हो गया है</p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">लेनदेन आईडी (Transaction ID):</span>
                            <span className="font-mono font-medium">{receiptData.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">तारीख (Date):</span>
                            <span className="font-medium">{receiptData.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">योजना (Plan):</span>
                            <span className="font-bold text-primary">{receiptData.plan}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="text-muted-foreground">मूल्य (Base Amount):</span>
                            <span>₹{receiptData.baseAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">GST (2.5%):</span>
                            <span>₹{receiptData.gstAmount}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between text-base">
                            <span className="font-bold">कुल भुगतान (Total Paid):</span>
                            <span className="font-bold text-green-600">₹{receiptData.amount}</span>
                        </div>
                    </div>

                    <Button className="w-full gap-2" onClick={onClose}>
                        बंद करें (Close)   
                    </Button>
                </div>
            ) : (
                <form onSubmit={handlePayment} className="space-y-5">
                    
                    {/* Plan Information */}
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center space-y-2">
                        <h3 className="font-bold text-lg text-primary mb-1">{plan?.label}</h3>
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-2xl font-extrabold text-foreground">₹{(plan?.price || 1000) + (plan?.price || 1000) * 0.025}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                (Base: ₹{plan?.price || 1000} + GST @ 2.5%: ₹{(plan?.price || 1000) * 0.025})
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Unlock all premium features • Priority Support • Exclusive Content</p>
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

                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg"
                    >
                        Pay ₹{(plan?.price || 1000) + (plan?.price || 1000) * 0.025} Securely
                    </Button>
                    
                    {/* <p className="text-xs text-center text-muted-foreground flex justify-center items-center gap-1">
                        🔒 Secured by Razorpay
                    </p> */}
                </form>
            )}
        </div>
      </div>
    </div>
  )
}
