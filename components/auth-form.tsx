"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, Phone, User, Lock } from "lucide-react"
import { formatFullPhone } from "@/lib/utils"

const COUNTRIES = [
  { code: "+91", flag: "🇮🇳", name: "India (+91)" },
  { code: "+1", flag: "🇺🇸", name: "USA/Canada (+1)" },
  { code: "+44", flag: "🇬🇧", name: "UK (+44)" },
  { code: "+971", flag: "🇦🇪", name: "UAE (+971)" },
  { code: "+977", flag: "🇳🇵", name: "Nepal (+977)" },
  { code: "+61", flag: "🇦🇺", name: "Australia (+61)" },
  { code: "+49", flag: "🇩🇪", name: "Germany (+49)" },
  { code: "+65", flag: "🇸🇬", name: "Singapore (+65)" },
  { code: "+81", flag: "🇯🇵", name: "Japan (+81)" },
  { code: "+33", flag: "🇫🇷", name: "France (+33)" },
  { code: "+39", flag: "🇮🇹", name: "Italy (+39)" },
  { code: "+7", flag: "🇷🇺", name: "Russia (+7)" },
]

export function AuthForm() {
  const [loading, setLoading] = useState(false)
  
  // Credentials States
  const [phoneCountry, setPhoneCountry] = useState("+91")
  const [phoneLocal, setPhoneLocal] = useState("")
  const [name, setName] = useState("")

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "Google लॉगिन में समस्या हुई")
      setLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const digitsOnly = phoneLocal.replace(/\D/g, "")
    if (!digitsOnly || digitsOnly.length < 7) {
      toast.error("कृपया एक मान्य मोबाइल नंबर दर्ज करें (न्यूनतम 7 अंक)")
      return
    }
    if (!name.trim()) {
      toast.error("कृपया अपना नाम दर्ज करें")
      return
    }

    setLoading(true)
    const fullPhone = formatFullPhone(phoneCountry, phoneLocal)
    const supabase = createClient()

    console.log("CLIENT: Custom Phone & Name Login Attempt", {
      phoneCountry,
      phoneLocal,
      fullPhone,
      nameInput: name.trim()
    })

    try {
      // 1. Query the public `users` table for the matching phone number
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', fullPhone)

      if (error) throw error

      if (!users || users.length === 0) {
        toast.error("लॉगिन विफल! यह फ़ोन नंबर पंजीकृत नहीं है। (User not found)")
        setLoading(false)
        return
      }

      // 2. Case-insensitive name match on the trimmed input name
      const matchedUser = users.find(u => {
        const dbName = (u.full_name || u.name || "").trim().toLowerCase()
        const inputName = name.trim().toLowerCase()
        return dbName === inputName
      })

      if (!matchedUser) {
        toast.error("लॉगिन विफल! अमान्य फ़ोन नंबर या नाम। (Invalid credentials)")
        setLoading(false)
        return
      }

      // 3. Save to localStorage
      localStorage.setItem("sb_user", JSON.stringify(matchedUser))

      // 4. Save to cookie with 1-year expiry
      document.cookie = `sb_user=${encodeURIComponent(JSON.stringify(matchedUser))}; path=/; max-age=31536000; SameSite=Lax`

      toast.success("लॉगिन सफल रहा! डैशबोर्ड पर पुनर्निर्देशित किया जा रहा है...")
      window.location.href = "/"
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "लॉगिन विफल! कृपया पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {/* 1. Google OAuth Button */}
      <Button 
        variant="outline" 
        type="button" 
        disabled={loading} 
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-6 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-700 shadow-sm rounded-lg"
      >
        <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
          <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
        </svg>
        Google से लॉगिन करें
      </Button>

      {/* 2. Premium Divider */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100" />
        </div>
        <span className="relative px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white dark:bg-card">
          या
        </span>
      </div>

      {/* 3. Phone Number & Name Login Form */}
      <form onSubmit={handlePhoneLogin} className="space-y-4">
        {/* Phone Input Row */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-slate-600 dark:text-slate-300">
            फ़ोन नंबर (Mobile Number)
          </label>
          <div className="flex gap-2">
            <Select value={phoneCountry} onValueChange={setPhoneCountry} disabled={loading}>
              <SelectTrigger className="w-[110px] h-12 border-slate-200 focus:ring-primary shadow-sm rounded-lg shrink-0">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="mr-1.5">{c.flag}</span> {c.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="98765 43210"
                value={phoneLocal}
                disabled={loading}
                onChange={(e) => setPhoneLocal(e.target.value.replace(/[^\d\s-]/g, ""))}
                className="pl-9 h-12 border-slate-200 focus:ring-primary shadow-sm rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-600 dark:text-slate-300">
            नाम / यूज़रनेम (Name / Username)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <User className="h-4 w-4" />
            </span>
            <Input
              id="name"
              type="text"
              placeholder="पंजीकृत नाम दर्ज करें"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              className="pl-9 h-12 border-slate-200 focus:ring-primary shadow-sm rounded-lg"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium shadow-md transition-all rounded-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          लॉगिन करें (Log In)
        </Button>
      </form>
    </div>
  )
}

