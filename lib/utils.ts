import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFullPhone(countryCode: string, localNumber: string): string {
  const code = countryCode.trim()
  const local = localNumber.trim().replace(/\D/g, "")
  if (!local) return ""
  return `${code}${local}`
}

export function parseFullPhone(fullPhone: string | null | undefined): { countryCode: string; localNumber: string } {
  if (!fullPhone) return { countryCode: "+91", localNumber: "" }
  
  const commonCodes = [
    "+971", "+977", "+290", "+262", "+246", "+91", "+44", "+61", 
    "+49", "+65", "+81", "+86", "+33", "+39", "+7", "+1"
  ]
  
  const trimmed = fullPhone.trim()
  for (const code of commonCodes) {
    if (trimmed.startsWith(code)) {
      return {
        countryCode: code,
        localNumber: trimmed.substring(code.length)
      }
    }
  }
  
  if (trimmed.startsWith("+")) {
    const match = trimmed.match(/^(\+\d{1,4})(.*)$/)
    if (match) {
      return {
        countryCode: match[1],
        localNumber: match[2]
      }
    }
  }
  
  return { countryCode: "+91", localNumber: trimmed }
}

export function getMockEmailForPhone(phone: string): string {
  const clean = phone.trim().replace(/\D/g, "")
  if (!clean) return ""
  return `phone_${clean}@sahityabharti.org`
}


