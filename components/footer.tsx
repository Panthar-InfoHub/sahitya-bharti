import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">हिंदी साहित्य भारती</h3>
              <p className="text-sm opacity-90">हिंदी साहित्य का संरक्षण और प्रचार</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">त्वरित लिंक</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                  गृह
                </Link>
              </li>
              <li>
                <Link href="/images-gallery" className="opacity-80 hover:opacity-100 transition-opacity">
                  चित्र दीर्घा
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-80 hover:opacity-100 transition-opacity">
                  हमारे बारे में
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">संपर्क</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@example.com" className="opacity-80 hover:opacity-100">
                  info@example.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+919876543210" className="opacity-80 hover:opacity-100">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="opacity-80">नई दिल्ली, भारत</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">सामाजिक मंच</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                📷
              </a>
            </div>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-white/20 py-6 text-center text-sm opacity-80">
          <p>© 2026 हिंदी साहित्य भारती। सर्वाधिकार सुरक्षित।</p>
        </div>
      </div>
    </footer>
  )
}
