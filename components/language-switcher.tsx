"use client"

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Language } from '@/lib/i18n/translations'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' }
  ]

  const currentLang = languages.find(l => l.code === language) || languages[0]

  if (!mounted) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="relative h-10 px-3.5 border-slate-200/80 bg-white/70 backdrop-blur-md text-slate-700 font-medium shadow-sm rounded-full flex items-center gap-2 cursor-default"
        disabled
      >
        <Globe className="h-4.5 w-4.5 text-slate-400" />
        <span className="text-sm tracking-wide hidden xs:inline flex items-center gap-1.5 font-serif font-semibold">
          <span className="text-base leading-none">{currentLang.flag}</span>
          <span>{currentLang.name}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="relative h-10 px-3.5 border-slate-200/80 hover:border-orange-200 bg-white/70 backdrop-blur-md hover:bg-orange-50/20 text-slate-700 hover:text-orange-700 font-medium shadow-sm hover:shadow-md rounded-full transition-all duration-300 flex items-center gap-2 group cursor-pointer"
        >
          <Globe className="h-4.5 w-4.5 text-slate-400 group-hover:text-orange-500 transition-colors duration-300 animate-pulse-subtle" />
          <span className="text-sm tracking-wide hidden xs:inline flex items-center gap-1.5 font-serif font-semibold">
            <span className="text-base leading-none">{currentLang.flag}</span>
            <span>{currentLang.name}</span>
          </span>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-orange-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-40 p-1.5 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl animate-fade-in-up duration-300 z-[9999]"
      >
        {languages.map((lang) => {
          const isSelected = lang.code === language
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between px-3 py-2.5 my-0.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg leading-none">{lang.flag}</span>
                <span className="font-medium tracking-wide">{lang.name}</span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-orange-500 stroke-[3px]" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
