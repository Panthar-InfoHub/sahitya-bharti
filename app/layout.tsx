import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Preloader } from "@/components/preloader"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "हिंदी साहित्य भारती",
  description: "हिंदी साहित्य का संरक्षण और प्रचार",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
}

import { cookies } from "next/headers"
import { LanguageProvider } from "@/lib/i18n/LanguageContext"
import { Language } from "@/lib/i18n/translations"
import { Toaster } from "sonner"
import { BackgroundMusic } from "@/components/background-music"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialLang = (cookieStore.get("sb_lang")?.value || "hi") as Language

  return (
    <html lang={initialLang}>
      <body className={`font-serif antialiased bg-background text-foreground`} suppressHydrationWarning>
        <LanguageProvider initialLanguage={initialLang}>
          <Preloader />
          {children}
          <Analytics />
          <Toaster />
          <BackgroundMusic />
        </LanguageProvider>
      </body>
    </html>
  )
}
