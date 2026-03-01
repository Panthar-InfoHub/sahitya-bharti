
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PrintButton } from "@/components/print-button"

export default async function CertificatePage() {
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
  const cleanPlan = (profile?.plan || '').trim()
  const { data: activePlan } = await supabase.from('membership_plans').select('*').ilike('name', cleanPlan).limit(1).maybeSingle()

  if (!profile || !activePlan) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">यह प्रमाण पत्र केवल भुगतान किए गए सदस्यों (Paid Members) के लिए उपलब्ध है।</p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
          </div>
      )
  }

  const getPlanLabel = () => activePlan.label || "सदस्य"

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center print:bg-white print:p-0">
      
      {/* Controls - Hidden when printing */}
      <div className="w-full max-w-[800px] flex justify-between items-center mb-8 print:hidden">
          <Link href="/">
             <Button variant="outline">होम पर वापस जाएं (Home)</Button>
          </Link>
          <div className="flex gap-2">
             <PrintButton />
          </div>
      </div>

      {/* Certificate Container */}
      <div className="bg-white p-2 shadow-xl print:shadow-none w-full max-w-[800px] print:w-[297mm] print:h-[210mm] print:max-w-none mx-auto">
         <div className="border-[6px] md:border-[10px] border-double border-[#8B4513] h-full p-4 md:p-6 relative flex flex-col items-center text-center">
            
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-8 h-8 md:w-16 md:h-16 border-t-2 border-l-2 md:border-t-4 md:border-l-4 border-[#DAA520]"></div>
            <div className="absolute top-2 right-2 w-8 h-8 md:w-16 md:h-16 border-t-2 border-r-2 md:border-t-4 md:border-r-4 border-[#DAA520]"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 md:w-16 md:h-16 border-b-2 border-l-2 md:border-b-4 md:border-l-4 border-[#DAA520]"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 md:w-16 md:h-16 border-b-2 border-r-2 md:border-b-4 md:border-r-4 border-[#DAA520]"></div>

            {/* Passport Photo */}
            <div className="absolute top-6 right-6 md:top-12 md:right-12 z-20 w-16 h-20 md:w-28 md:h-36 border-2 border-[#8B4513] shadow-sm bg-gray-50 flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Member Photo" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xs text-gray-400 text-center px-1">फ़ोटो <br/> (Photo)</span>
                )}
            </div>

            {/* Header */}
            <div className="space-y-2 mt-4 md:mt-8">
                 <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto mb-2">
                     <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
                 </div>
                 <h1 className="text-2xl md:text-5xl font-serif font-bold text-[#8B4513] tracking-wider uppercase px-4">सदस्यता प्रमाण पत्र</h1>
                 <h2 className="text-sm md:text-xl font-medium text-[#DAA520]">Certificate of Membership</h2>
            </div>

            {/* Content - Moved up with justify-start and explicit padding */}
            <div className="flex-1 flex flex-col justify-start md:pt-8 space-y-4 w-full max-w-3xl py-6 md:py-0">
                <p className="text-base md:text-xl text-gray-600 font-serif italic">यह प्रमाणित किया जाता है कि</p>
                
                <h3 className="text-xl md:text-4xl font-bold border-b-2 border-gray-300 pb-2 px-4 md:px-12 inline-block mx-auto min-w-[200px] md:min-w-[400px] text-[#2c1810] my-4 md:my-8">
                    {profile.full_name || profile.username || "Member Name"}
                </h3>

                <p className="text-sm md:text-xl text-gray-600 font-serif px-2 leading-relaxed">
                   <span className="text-lg md:text-2xl font-bold text-[#8B4513]">साहित्य भारती</span> के एक सम्मानित <br/>
                    <strong className="text-base md:text-2xl text-[#DAA520]">{getPlanLabel()}</strong> हैं।
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-0 md:gap-y-8 max-w-xl mx-auto w-full mt-6 md:mt-12 text-sm md:text-lg text-gray-700 pb-4 md:pb-0">
                     <div className="border-b md:border-0 pb-2 md:pb-0 text-center md:text-left">
                        <span className="font-bold block text-xs md:text-sm uppercase tracking-wide text-gray-400 mb-1">सदस्यता तिथि (Member Since)</span>
                        {new Date(profile.created_at).toLocaleDateString("en-GB")}
                    </div>
                     <div className="text-center md:text-right">
                        <span className="font-bold block text-xs md:text-sm uppercase tracking-wide text-gray-400 mb-1">वैधता (Valid Until)</span>
                        आजीवन (Lifetime)
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-end mt-2 md:mt-4 px-4 md:px-16 mb-6 gap-6 md:gap-0">
                <div className="text-center">
                    <div className="w-32 md:w-48 border-b border-black mb-2"></div>
                    <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase">अधिकृत हस्ताक्षर</p>
                </div>
                 <div className="text-center">
                    <p className="text-[10px] md:text-sm font-bold text-gray-500 mb-2">{new Date().toLocaleDateString("hi-IN")}</p>
                    <div className="w-32 md:w-48 border-b border-black mb-2"></div>
                    <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase">दिनांक</p>
                </div>
            </div>

         </div>
      </div>
      

    </div>
  )
}
