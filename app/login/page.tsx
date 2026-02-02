import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AuthForm } from "@/components/auth-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-lg">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">लॉग इन करें (Log In)</h1>
            <p className="text-muted-foreground">अपने खाते में लॉग इन करें</p>
          </div>
          <AuthForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
