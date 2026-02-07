import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Calendar, Users, Award, Menu, Home, Image as ImageIcon, Video, Banknote, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationNav } from "@/components/notification-nav"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const sidebarLinks = [
    { href: "/dashboard", label: "अवलोकन (Overview)", icon: LayoutDashboard },
    { href: "/dashboard/events", label: "कार्यक्रम (Events)", icon: Calendar },
    { href: "/dashboard/gallery", label: "गैलरी (Gallery)", icon: ImageIcon },
    { href: "/dashboard/videos", label: "वीडियो (Videos)", icon: Video },
    { href: "/dashboard/members", label: "सदस्य (Members)", icon: Users },
    { href: "/dashboard/positions", label: "पद (Positions)", icon: Award },
    { href: "/dashboard/transactions", label: "लेनदेन (Transactions)", icon: Receipt },
    { href: "/dashboard/refunds", label: "धनवापसी (Refunds)", icon: Banknote },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              एडमिन पैनल (Admin)
            </h2>
             <Link href="/" title="Go Home">
                <Home className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
             </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Logged in as {user.email}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center px-6 justify-between sticky top-0 z-40">
           <div className="flex items-center gap-2 md:hidden">
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
              <span className="font-bold">Admin</span>
           </div>
           
           <div className="flex items-center gap-4 ml-auto">
               <NotificationNav />
           </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
