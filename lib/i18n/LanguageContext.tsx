"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, translations, t } from './translations'

interface LanguageContextProps {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof translations) => string
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage = 'hi'
}: {
  children: React.ReactNode
  initialLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  // Synchronize initial client render language with cookie/localStorage if already set
  useEffect(() => {
    const savedLang = localStorage.getItem('sb_lang') as Language
    if (savedLang && (savedLang === 'hi' || savedLang === 'en') && savedLang !== initialLanguage) {
      setLanguageState(savedLang)
    }
  }, [initialLanguage])

  // Synchronize dynamic client-side root element class for scaling English text
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      if (language === 'en') {
        root.classList.add('lang-en')
      } else {
        root.classList.remove('lang-en')
      }
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sb_lang', lang)
      // Save to cookie (1 year expiry) for server-side pre-rendering
      document.cookie = `sb_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`
    }
  }

  const translate = (key: keyof typeof translations): string => {
    return t(key, language)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
