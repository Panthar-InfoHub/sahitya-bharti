"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function AuthForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    try {
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            router.refresh()
            router.push("/")
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })
            if (error) throw error
            toast.success("Check your email to confirm your account")
        }
    } catch (error: any) {
        toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {!isLogin && (
        <div className="space-y-2">
            <Label htmlFor="fullName">पूरा नाम (Full Name)</Label>
            <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
            />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">ईमेल (Email)</Label>
        <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">पासवर्ड (Password)</Label>
        <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLogin ? "लॉग इन (Log In)" : "साइन अप (Sign Up)"}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
          {isLogin ? "खाता नहीं है?" : "पहले से खाता है?"} {" "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
              {isLogin ? "साइन अप करें" : "लॉग इन करें"}
          </button>
      </div>
    </form>
  )
}
