"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "गृह" },
    { href: "/images-gallery", label: "चित्र दीर्घा" },
    { href: "/videos-gallery", label: "वीडियो दीर्घा" },
    { href: "/kendriya", label: "केंद्रीय" },
    { href: "/states", label: "राज्य" },
    { href: "/about", label: "हमारे बारे में" },
  ]

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image src="/images/logo.jpg" alt="हिंदी साहित्य भारती" width={56} height={56} className="object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
                हिंदी साहित्य
              </span>
              <span className="text-xs text-muted-foreground">भारती</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Link
              href="/membership"
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
            >
              नमस्कार लेखक
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-md transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/membership"
              className="block px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors mt-2"
              onClick={() => setIsOpen(false)}
            >
              नमस्कार लेखक
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
