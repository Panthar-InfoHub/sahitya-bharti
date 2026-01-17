"use client"

import Link from "next/link"

export function MembershipCTA() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-primary via-accent to-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white">हिंदी साहित्य भारती परिवार से जुड़ें</h2>

        {/* Description */}
        <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          हिंदी साहित्य के संरक्षण और प्रचार में हमारा साथ दीजिए। हमारे सदस्य बनकर आप एक गौरवशाली परंपरा का हिस्सा बन सकते हैं।
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/membership"
            className="inline-block px-10 py-4 bg-white text-primary hover:bg-white/90 font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-white/25 transform hover:-translate-y-1"
          >
            सदस्यता प्राप्त करें
          </Link>
        </div>

        {/* Ornamental divider */}
        <div className="pt-4">
          <span className="text-white text-2xl opacity-50">✦</span>
        </div>
      </div>
    </section>
  )
}
