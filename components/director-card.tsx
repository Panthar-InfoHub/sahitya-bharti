import Image from "next/image"
import { Mail, Phone, Linkedin, ExternalLink } from "lucide-react"

interface Director {
  id: string
  name: string
  title: string
  photo_url: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
}

interface DirectorCardProps {
  director: Director
}

export function DirectorCard({ director }: DirectorCardProps) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 hover:border-orange-100 flex flex-col items-center text-center overflow-hidden h-full">
      {/* Floating Background Accent */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-orange-50/50 to-transparent -z-10 group-hover:h-full group-hover:bg-orange-50/20 transition-all duration-700" />

      {/* Optimized Head-to-Chest Avatar */}
      <div className="relative w-44 h-56 shrink-0 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white group-hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-linear-to-br from-orange-100 to-amber-100" />
        {director.photo_url ? (
          <Image
            src={director.photo_url}
            alt={director.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black text-orange-600/20">
              {director.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Information Area */}
      <div className="flex-1 flex flex-col items-center">
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
            पदाधिकारी
          </p>
          <h3 className="text-xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors duration-300">
            {director.name}
          </h3>
          <p className="text-[11px] font-bold text-stone-500 leading-relaxed uppercase max-w-[260px]">
            {director.title}
          </p>
        </div>

        {/* Social Links Row */}
        <div className="flex gap-2.5 mb-6">
          {director.email && (
            <a
              href={`mailto:${director.email}`}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {director.linkedin_url && (
            <a
              href={director.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {director.phone && (
            <a
              href={`tel:${director.phone}`}
              className="w-9 h-9 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
              title="Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="w-full pt-4 border-t border-stone-50">
        <button className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-orange-600 flex items-center justify-center gap-2 mx-auto transition-colors duration-300">
          परिचय देखें <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
