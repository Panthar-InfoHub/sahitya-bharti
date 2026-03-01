"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

import { ProfileModal } from "./profile-modal"
import { UserNav } from "./user-nav"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const fetchUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      setUser({ ...user, ...profile })
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    fetchUser()

    // Listen for updates from other components (e.g., membership purchase)
    const handleUserUpdate = () => {
      fetchUser()
    }

    window.addEventListener('user_updated', handleUserUpdate)
    return () => window.removeEventListener('user_updated', handleUserUpdate)
  }, [])

  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const navLinks = [
    { href: "/#home", label: "गृह" },
    { href: "/#about", label: "हमारे बारे में" },
    { href: "/events", label: "कार्यक्रम" },
    { href: "/#leadership", label: "केंद्रीय" },
    { href: "/#branches", label: "राज्य" },
    { href: "/#gallery", label: "चित्र दीर्घा" },
    { href: "/#videos", label: "चलचित्र दीर्घा" },
    { href: "/#contact", label: "संपर्क" },
  ]

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-14 h-14 relative flex items-center justify-center">
              <Image src="/logo.jpg" alt="हिंदी साहित्य भारती" width={56} height={56} className="object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
                हिंदी साहित्य भारती
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Admin Link */}
            {/* {user?.role === 'admin' && (
              <Link
                href="/members"
                className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
              >
                सदस्य
              </Link>
            )} */}

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
            {user ? (
              <UserNav user={user} onOpenProfile={() => setIsProfileModalOpen(true)} />
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                प्रवेश
              </Link>
            )}
            {(!user || user.plan === 'free') && (
              <Link
                href="/membership"
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                सदस्य बनें
              </Link>
            )}

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
            {/* Admin Link Mobile */}
            {user?.role === 'admin' && (
              <Link
                href="/members"
                className="block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                सदस्य
              </Link>
            )}

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
            {user ? (
              <>
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-t border-border mt-2">
                  {user.full_name} ({user.email})
                </div>
                <button
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors"
                  onClick={() => {
                    setIsOpen(false)
                    setIsProfileModalOpen(true)
                  }}
                >
                  व्यक्तिगत विवरण
                </button>
                <button
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-red-600 hover:bg-accent/10 rounded-md transition-colors"
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = "/"
                  }}
                >
                  बाहर निकलें
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full text-left block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors mt-2"
                onClick={() => setIsOpen(false)}
              >
                प्रवेश
              </Link>
            )}
            {(!user || user.plan === 'free') && (
              <Link
                href="/membership"
                className="w-full text-left block px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors mt-2"
                onClick={() => setIsOpen(false)}
              >
                सदस्य बनें
              </Link>
            )}
          </div>
        )}

        {isProfileModalOpen && (
          <ProfileModal
            open={isProfileModalOpen}
            onOpenChange={setIsProfileModalOpen}
            user={user}
            onOpenMembership={() => {
              setIsProfileModalOpen(false)
              window.location.href = "/membership"
            }}
          />
        )}
      </div>
    </nav>
  )
}
