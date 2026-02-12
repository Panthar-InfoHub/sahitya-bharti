
"use client"

import { useState } from "react"
import { LogOut, User, Users, LayoutDashboard, Crown, Receipt } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { TransactionsModal } from "@/components/transactions-modal"

interface UserNavProps {
  user: {
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    role?: string | null
    plan?: string | null
  }
  onOpenProfile: () => void
}

export function UserNav({ user, onOpenProfile }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  console.log("UserNav Rendered. User Role:", user.role, "Plan:", user.plan)
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const getPlanStyles = (plan?: string | null) => {
    switch (plan) {
      case "patron":
        return "ring-2 ring-purple-500 ring-offset-2"
      case "premium":
        return "ring-2 ring-yellow-500 ring-offset-2"
      case "standard":
        return "ring-2 ring-blue-500 ring-offset-2"
      default:
        // Free user - minimal or no ring
        return ""
    }
  }

  const getPlanLabel = (plan?: string | null) => {
     switch (plan) {
      case "patron": return "Patron Member"
      case "premium": return "Premium Member"
      case "standard": return "Standard Member"
      default: return "Free Plan"
    }
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 rounded-full ${getPlanStyles(user.plan)}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
            <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">{user.full_name}</p>
                {(user.plan === 'premium' || user.plan === 'patron') && <Crown className={`h-3 w-3 ${user.plan === 'patron' ? 'text-purple-500' : 'text-yellow-500'}`} fill="currentColor" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="pt-1">
                <Badge variant={user.plan === 'patron' ? 'default' : user.plan === 'premium' ? 'default' : user.plan === 'standard' ? 'secondary' : 'outline'} className={`text-[10px] h-5 px-1.5 ${user.plan === 'patron' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                    {getPlanLabel(user.plan)}
                </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onSelect={() => {
             // Allow dropdown to close, then open modal
             setTimeout(() => {
               onOpenProfile()
             }, 0)
          }}  
          className="cursor-pointer"
        >
            <User className="mr-2 h-4 w-4" />
            <span>प्रोफाइल (Profile)</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          onSelect={() => {
             setTimeout(() => {
               setIsTransactionsOpen(true)
             }, 0)
          }}  
          className="cursor-pointer"
        >
            <Receipt className="mr-2 h-4 w-4" />
            <span>लेनदेन (Transactions)</span>
        </DropdownMenuItem>

        {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex items-center cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>डैशबोर्ड (Dashboard)</span>
              </Link>
            </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>लॉग आउट (Log out)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Transactions Modal */}
    <TransactionsModal 
      open={isTransactionsOpen} 
      onOpenChange={setIsTransactionsOpen} 
    />
    </>
  )
}
