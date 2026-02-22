
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PrintButton } from "@/components/print-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function IdCardPage() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Get Profile Data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  // 3. Check Membership Status
  const paidPlans = ['standard', 'premium', 'patron']
  if (!profile || !paidPlans.includes(profile.plan?.toLowerCase())) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">यह आईडी कार्ड केवल भुगतान किए गए सदस्यों (Standard, Premium, Patron) के लिए उपलब्ध है।</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    )
  }

  const getPlanLabel = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'standard': return "मानक सदस्य"
      case 'premium': return "विशिष्ट सदस्"
      case 'patron': return "संरक्षक सदस"
      default: return "सदस्य (Member)"
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center print:bg-white print:p-0">

      {/* Controls - Hidden when printing */}
      <div className="w-full max-w-[400px] flex justify-between items-center mb-8 print:hidden">
        <Link href="/">
          <Button variant="outline">होम पर वापस जाएं</Button>
        </Link>
        <div className="flex gap-2">
          <PrintButton />
        </div>
      </div>

      {/* ID Card Container */}
      <div
        id="printable-id-card"
        className="w-[300px] h-[480px] bg-white border border-gray-200 shadow-xl relative flex flex-col items-center overflow-hidden rounded-xl print:shadow-none print:border-2 print:border-black print:rounded-sm print:w-[74mm] print:h-[126mm] print:fixed print:top-1/2 print:left-1/2 print:-translate-x-1/2 print:-translate-y-1/2 mx-auto"
      >
        {/* Header Background */}
        <div className="absolute top-0 w-full h-56 bg-[#8B4513]"></div>

        {/* Logo */}
        <div className="relative z-10 mt-4 w-20 h-20 bg-white rounded-full p-1 shadow-md">
          <Image src="/logo.jpg" alt="Logo" width={80} height={80} className="rounded-full object-cover h-full w-full" />
        </div>

        {/* Organization Name */}
        <div className="relative z-10 mt-2 text-center text-white">
          <h2 className="text-xl font-bold uppercase tracking-wider">साहित्य भारती</h2>
          <p className="text-xs text-yellow-200">हिंदी साहित्य भारती</p>
        </div>

        {/* User Photo */}
        <div className="relative z-10 mt-4">
          <Avatar className="h-28 w-28 border-4 border-white shadow-sm">
            <AvatarImage src={profile.avatar_url} className="object-cover" />
            <AvatarFallback className="text-4xl bg-orange-100 text-orange-800">
              {profile.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Details */}
        <div className="mt-2 text-center w-full px-4">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{profile.full_name}</h3>

          <div className="mt-1 inline-block px-3 py-1 bg-yellow-500 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 uppercase">
            {getPlanLabel(profile.plan)}
          </div>

          <div className="mt-6 flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex justify-between border-b border-dashed pb-1">
              <span className="font-semibold">आईडी क्रमांक (ID):</span>
              <span className="font-mono">{profile.id?.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-dashed pb-1 pt-1">
              <span className="font-semibold">जुड़ने की तिथि:</span>
              <span>{new Date(profile.created_at).toLocaleDateString("hi-IN")}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-semibold">वैधता:</span>
              <span className="text-green-600 font-bold">आजीवन</span>
            </div>
          </div>
        </div>

        {/* Footer Stripe */}
        <div className="absolute bottom-0 w-full h-4 bg-[#DAA520]"></div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 print:hidden">
        नोट: प्रिंट सेटिंग्स में 'लेआउट: पोर्ट्रेट' और 'पेपर साइज़: A4' चुनें।
      </p>

    </div>
  )
}
