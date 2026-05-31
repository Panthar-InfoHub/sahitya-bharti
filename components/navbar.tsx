"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

import { ProfileModal } from "./profile-modal"
import { UserNav } from "./user-nav"
import { createClient } from "@/lib/supabase/client"
import { useEffect } from "react"
import { useLanguage } from "@/lib/i18n/LanguageContext"
import dynamic from "next/dynamic"

const LanguageSwitcher = dynamic(
  () => import("./language-switcher").then((mod) => mod.LanguageSwitcher),
  { ssr: false }
)


export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { t, language } = useLanguage()

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

  const navLinks = [
    { href: "/", label: t('nav.home') },
    { href: "/#constitution", label: t('nav.constitution') },
    { href: "/#founders", label: t('nav.founders') },
    { href: "/#trustees", label: t('nav.trustees') },
    { href: "/#about-organization", label: t('nav.about') },
    { href: "/events", label: t('nav.events') },
    { href: "/#directors", label: t('nav.directors') },
    { href: "/#activities", label: t('nav.activities') },
    { href: "/#branches", label: t('nav.branches') },
    { href: "/#gallery", label: t('nav.gallery') },
    { href: "/#videos", label: t('nav.videos') },
    { href: "/#contact", label: t('nav.contact') },
  ]

  return (
    <>
      <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center h-20 gap-4 xl:gap-8">
            {/* Logo Section & Left Switcher */}
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-14 h-14 relative flex items-center justify-center">
                  <Image src="/logo.jpg" alt={t('org.name')} width={56} height={56} className="object-contain" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="whitespace-nowrap text-sm font-bold text-primary group-hover:text-accent transition-colors font-serif">
                    {t('org.name')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={`hidden xl:flex items-center justify-center ${language === 'en' ? 'gap-0.5' : 'gap-1'}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap py-2 text-m  font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors ${language === 'en' ? 'px-1.5' : 'px-2.5'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <UserNav user={user} onOpenProfile={() => setIsProfileModalOpen(true)} />
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {t('nav.login')}
                </Link>
              )}
              {(!user || user.plan === 'free') && (
                <Link
                  href="/membership"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
                >
                  {t('nav.become_member')}
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden p-2 hover:bg-accent/10 rounded-md transition-colors"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="xl:hidden pb-4 space-y-1 border-t border-border bg-white px-4">
            {/* Admin Link Mobile */}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.dashboard')}
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
                  {t('nav.profile')}
                </button>
                <button
                  className="w-full text-left block px-3 py-2 text-sm font-medium text-red-600 hover:bg-accent/10 rounded-md transition-colors"
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    window.location.href = "/"
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full text-left block px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent/10 rounded-md transition-colors mt-2"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
            {(!user || user.plan === 'free') && (
              <Link
                href="/membership"
                className="w-full text-left block px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors mt-2"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.become_member')}
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
      </nav>
    </>
  )
}
