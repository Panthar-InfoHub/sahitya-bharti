import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, ExternalLink } from "lucide-react"

export function Footer() {
  const quickLinks = [
    { name: "गृह", href: "/" },
    { name: "संस्थापक", href: "/#founders" },
    { name: "ट्रस्टी", href: "/#trustees" },
    { name: "निर्देशक मंडल", href: "/#directors" },
    { name: "हमारे बारे में", href: "/#about" },
    { name: "कार्यक्रम", href: "/events" },
  ]

  const socialLinks = [
    { 
      name: "Facebook", 
      icon: <Facebook className="w-5 h-5" />, 
      href: "https://www.facebook.com/share/186BLqRx4d/?mibextid=wwXIfr",
      hoverClass: "hover:bg-[#1877F2]"
    },
    { 
      name: "Instagram", 
      icon: <Instagram className="w-5 h-5" />, 
      href: "https://www.instagram.com/hindisahityabharti?igsh=M3pqOTdqanliZXJp",
      hoverClass: "hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
    },
    { 
      name: "YouTube", 
      icon: <Youtube className="w-5 h-5" />, 
      href: "https://youtube.com/channel/UCYdR3PCSoaJwFD5DNG88gcA?si=Z8Q83IeWWm-9NVNz",
      hoverClass: "hover:bg-[#FF0000]"
    },
  ]

  return (
    <footer className="relative bg-slate-950 text-slate-200 pt-24 pb-12 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Organization Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-14 h-14 bg-white rounded-xl p-1 shadow-lg shadow-orange-950/20">
                <Image 
                  src="/logo.jpg" 
                  alt="हिंदी साहित्य भारती" 
                  width={56} 
                  height={56} 
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">हिंदी साहित्य भारती</h3>
                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest">विश्वव्यापी सांस्कृतिक मंच</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              हिंदी साहित्य भारती का मुख्य उद्देश्य हिंदी साहित्य, संस्कृति एवं भारतीय जीवन मूल्यों का वैश्विक प्रचार-प्रसार करना है। हम दुनिया भर के हिंदी प्रेमियों को एक साझा मंच प्रदान करते हैं।
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-orange-500 pl-4 py-1">
              महत्वपूर्ण लिंक
            </h4>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-orange-400 text-sm transition-colors flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/40 group-hover:bg-orange-500 mr-2.5 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-orange-500 pl-4 py-1">
              संपर्क सूत्र
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">ईमेल</p>
                  <a href="mailto:hindisahityabharati@gmail.com" className="text-sm text-slate-300 hover:text-orange-400 transition-colors">
                    hindisahityabharati@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">संपर्क</p>
                  <a href="tel:+919026657244" className="text-sm text-slate-300 hover:text-orange-400 transition-colors">
                    +91 90266 57244
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">स्थान</p>
                  <p className="text-sm text-slate-300">झांसी, भारत</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-orange-500 pl-4 py-1">
              सामाजिक मंच
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 active:scale-95 ${social.hoverClass} hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(255,165,0,0.2)]`}
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs text-center md:text-left">
            © 2026 <span className="text-slate-300 font-medium">हिंदी साहित्य भारती</span>। सर्वाधिकार सुरक्षित।
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 text-[11px] transition-colors">निजता नीति</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 text-[11px] transition-colors">नियम व शर्तें</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
