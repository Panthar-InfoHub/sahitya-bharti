"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Printer, ArrowLeft, RefreshCw } from "lucide-react"
import Image from "next/image"

interface CertificateViewerProps {
  profile: any
  activePlan: any
}

export function CertificateViewer({ profile, activePlan }: CertificateViewerProps) {
  const [dataEntered, setDataEntered] = useState(false)
  const [certData, setCertData] = useState({
    name: profile.full_name || "",
    address: `${profile.city || ""}, ${profile.state || ""}`
  })

  const getPlanLabel = () => activePlan?.label || "आजीवन सदस्य"

  if (!dataEntered) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 relative mb-4">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
            </div>
            <CardTitle className="text-2xl font-bold font-serif text-primary">Certificate Details</CardTitle>
            <CardDescription>कृपया प्रमाण पत्र पर मुद्रित किए जाने वाले विवरणों की पुष्टि करें।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="certName">प्रमाण पत्र पर नाम (Name on Certificate)</Label>
              <Input 
                id="certName" 
                value={certData.name} 
                onChange={(e) => setCertData({ ...certData, name: e.target.value })}
                placeholder="उदा. डॉ. लीना कुल्थिया"
                className="text-lg"
                suppressHydrationWarning
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certAddress">पता/स्थान (Address/Location)</Label>
              <Input 
                id="certAddress" 
                value={certData.address} 
                onChange={(e) => setCertData({ ...certData, address: e.target.value })}
                placeholder="उदा. टीकमगढ़, मध्य प्रदेश"
                className="text-lg"
                suppressHydrationWarning
              />
            </div>
            <Button 
                className="w-full h-12 text-lg font-bold uppercase tracking-wide gap-2 mt-4" 
                onClick={() => setDataEntered(true)}
                disabled={!certData.name || !certData.address}
                suppressHydrationWarning
            >
              प्रमाण पत्र तैयार करें (Generate)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-200 p-4 md:p-12 flex flex-col items-center print:bg-white print:p-0">
      
      {/* Action Bar */}
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row justify-between items-center mb-8 gap-4 print:hidden">
          <Button variant="ghost" onClick={() => setDataEntered(false)} className="gap-2 w-full md:w-auto justify-center">
            <ArrowLeft className="h-4 w-4" /> विवरण संपादित करें (Edit Details)
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={() => window.location.reload()} className="gap-2 flex-1 md:flex-none justify-center">
                <RefreshCw className="h-4 w-4" /> रीलोड (Reload)
              </Button>
              <Button onClick={() => window.print()} className="gap-2 shadow-lg hover:scale-105 transition-transform flex-1 md:flex-none justify-center">
                <Printer className="h-4 w-4" /> प्रमाण पत्र प्रिंट करें (Print)
              </Button>
          </div>
      </div>

      {/* Certificate Main Container - Landscape High Res Design */}
      <div 
        id="certificate-print-area"
        className="certificate-bg bg-white relative w-full max-w-[1000px] h-auto shadow-2xl print:w-[297mm] print:h-[210mm] print:shadow-none print:m-0"
      >
        {/* Decorative Outer Border */}
        <div className="absolute inset-4 border-[1px] border-amber-600/30 pointer-events-none"></div>
        <div className="absolute inset-6 border-[3px] border-amber-700/60 pointer-events-none"></div>
        
        {/* Artistic Corners (SVG Overlays) */}
        <svg className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 text-amber-600/40 pointer-events-none" viewBox="0 0 100 100">
           <path d="M0 0 L100 0 L0 100 Z" fill="currentColor" />
           <path d="M0 0 L40 0 L0 40 Z" fill="rgba(0,0,0,0.8)" />
        </svg>
        <svg className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 text-amber-600/40 pointer-events-none rotate-90" viewBox="0 0 100 100">
           <path d="M0 0 L100 0 L0 100 Z" fill="currentColor" />
           <path d="M0 0 L40 0 L0 40 Z" fill="rgba(0,0,0,0.8)" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 text-amber-600/20 pointer-events-none -rotate-90" viewBox="0 0 100 100">
           <circle cx="10" cy="90" r="40" fill="currentColor" />
        </svg>

        <div className="relative h-full w-full p-12 flex flex-col items-center">
            
            {/* Top Motto */}
            <p className="text-[#2c1810] font-hindi text-lg md:text-xl font-medium tracking-wide mb-8">
               "मानव बन जाए जग सारा, यह पावन संकल्प हमारा"
            </p>

            {/* Top Center Logo and Main Heading */}
            <div className="flex flex-col items-center mb-6">
                 <div className="relative w-20 h-20 md:w-28 md:h-28 mb-4">
                     <Image src="/logo.jpg" alt="Logo" fill className="object-contain" />
                 </div>
                 <h1 className="text-4xl md:text-6xl font-extrabold text-[#9c1c1c] font-serif tracking-tight mb-2">
                    हिंदी साहित्य भारती
                 </h1>
                 <h2 className="text-2xl md:text-3xl font-bold text-[#2c1810] font-serif italic">
                    (अंतरराष्ट्रीय)
                 </h2>
            </div>

            {/* Gold Ribbon Banner */}
            <div className="relative w-full max-w-lg h-14 md:h-20 flex items-center justify-center mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-lg transform -skew-x-12 border-y-2 border-white/30"></div>
                <h2 className="relative text-xl md:text-3xl font-bold text-[#2c1810] tracking-widest uppercase px-12">
                   {getPlanLabel()} प्रमाण पत्र
                </h2>
                {/* Ribbon Fish Tails */}
                <div className="absolute -left-6 top-2 w-8 h-full bg-amber-700/80 -z-10 transform -skew-x-12"></div>
                <div className="absolute -right-6 top-2 w-8 h-full bg-amber-700/80 -z-10 transform -skew-x-12"></div>
            </div>

            {/* Main Content Body */}
            <div className="w-full flex">
                
                {/* Left Side: Photo and Name */}
                <div className="w-1/3 flex flex-col items-center">
                    <div className="relative w-40 h-40 md:w-56 md:h-56">
                         {/* Circular Gold Frame */}
                         <div className="absolute inset-0 rounded-full border-4 border-amber-400 p-1 shadow-2xl bg-white overflow-hidden">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                    Photo
                                </div>
                            )}
                         </div>
                    </div>
                    
                    <div className="mt-8 text-center space-y-2">
                         <h3 className="text-2xl md:text-3xl font-extrabold text-[#9c1c1c]">
                            {certData.name}
                         </h3>
                         <p className="text-lg md:text-xl font-bold text-[#2c1810]">
                            {certData.address}
                         </p>
                    </div>
                </div>

                {/* Right Side: Main Text Section */}
                <div className="w-2/3 pl-12 flex flex-col justify-center text-left">
                    <p className="text-lg md:text-xl leading-relaxed text-[#2c1810] font-medium font-hindi">
                        प्रमाणित किया जाता है कि आपको नियमानुसार संस्था की अंतरराष्ट्रीय सदस्यता 
                        प्रदान की जाती है। हिंदी साहित्य भारती परिवार के सदस्य के रूप में अपने 
                        दायित्व का निर्वाह करते हुए भारतीय संस्कृति की पुनर्स्थापना हेतु 
                        प्रारंभ यज्ञ में आपका सतत् योगदान रहेगा,
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-[#9c1c1c] mt-6">
                        इसी विश्वास के साथ हम आपके उज्ज्वल भविष्य की कामना करते हैं।
                    </p>
                </div>
            </div>

            {/* Bottom Signatures */}
            <div className="mt-auto w-full grid grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="h-16 flex items-end mb-2 relative w-32">
                         <img src="/images/sign2.jpeg?v=2" alt="Signature" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-5/6 h-0.5 bg-slate-800"></div>
                    <p className="font-bold text-sm md:text-base text-[#2c1810] mt-2">प्रो. विनोद कुमार मिश्र</p>
                    <p className="text-[10px] md:text-[11px] text-[#2c1810] leading-tight mt-1 opacity-80">
                        (पूर्व महासचिव विश्व हिंदी सचिवालय, मॉरीशस)<br/>
                        अंतरराष्ट्रीय संगठन महामंत्री
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="h-16 flex items-end mb-2 relative w-32">
                         <img src="/images/sign1.jpeg?v=2" alt="Signature" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-5/6 h-0.5 bg-slate-800"></div>
                    <p className="font-bold text-sm md:text-base text-[#2c1810] mt-2">राम निवास शुक्ल</p>
                    <p className="text-[10px] md:text-[11px] text-[#2c1810] leading-tight mt-1 opacity-80">
                        (पूर्व संयुक्त निदेशक राज भाषा, भारत सरकार)<br/>
                        अंतरराष्ट्रीय महामंत्री
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <div className="h-16 flex items-end mb-2 relative w-32">
                         <img src="/images/sign.jpeg?v=2" alt="Signature" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-5/6 h-0.5 bg-slate-800"></div>
                    <p className="font-bold text-sm md:text-base text-[#2c1810] mt-2">डॉ. रवीन्द्र शुक्ल</p>
                    <p className="text-[10px] md:text-[11px] text-[#2c1810] leading-tight mt-1 opacity-80">
                        (पूर्व शिक्षा मंत्री उ.प्र. सरकार)<br/>
                        केन्द्रीय (अंतरराष्ट्रीय) अध्यक्ष
                    </p>
                </div>
            </div>
        </div>

        {/* Global Styles for PDF rendering compatibility */}
        <style jsx global>{`
          @media print {
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
               -webkit-print-color-adjust: exact;
            }
            .print-hidden {
              display: none !important;
            }
          }
          .font-handwriting {
            font-family: 'Dancing Script', cursive;
          }
          .font-hindi {
            font-family: 'Inter', sans-serif; /* Placeholder for Hindi font */
          }
          .certificate-bg {
            background-image: 
              radial-gradient(circle at 0px 0px, transparent 0, #ffffff 0),
              repeating-linear-gradient(45deg, #f8fafc 0, #f8fafc 1px, transparent 0, transparent 50%);
            background-size: 100% 100%, 10px 10px;
          }
        `}</style>
      </div>
    </div>
  )
}
