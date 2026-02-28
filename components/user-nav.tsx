
"use client"

import { useEffect, useState } from "react"
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

  const [planDetails, setPlanDetails] = useState<any>(null)

  useEffect(() => {
    if (user.plan && user.plan !== 'free') {
      const fetchPlan = async () => {
        const cleanPlanName = (user.plan || '').trim()
        const { data } = await supabase.from('membership_plans').select('*').ilike('name', cleanPlanName).limit(1).maybeSingle()
        if (data) setPlanDetails(data)
      }
      fetchPlan()
    }
  }, [user.plan])

  const getPlanStyles = () => {
    if (!planDetails) return ""
    if (planDetails.level >= 3) return "ring-2 ring-purple-500 ring-offset-2"
    if (planDetails.level === 2) return "ring-2 ring-yellow-500 ring-offset-2"
    return "ring-2 ring-blue-500 ring-offset-2"
  }

  const getPlanLabel = () => {
     if (!planDetails) return "Free Plan"
     return planDetails.name
  }

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 rounded-full ${getPlanStyles()}`} suppressHydrationWarning>
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
                {planDetails && planDetails.level >= 2 && <Crown className={`h-3 w-3 ${planDetails.level >= 3 ? 'text-purple-500' : 'text-yellow-500'}`} fill="currentColor" />}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="pt-1">
                <Badge variant={planDetails?.level >= 3 ? 'default' : planDetails?.level === 2 ? 'default' : planDetails?.level === 1 ? 'secondary' : 'outline'} className={`text-[10px] h-5 px-1.5 ${planDetails?.level >= 3 ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                    {getPlanLabel()}
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
