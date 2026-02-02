
"use client"

import { LogOut, User, Users } from "lucide-react"
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

interface UserNavProps {
  user: {
    email?: string | null
    full_name?: string | null
    avatar_url?: string | null
    role?: string | null
  }
  onOpenProfile: () => void
}

export function UserNav({ user, onOpenProfile }: UserNavProps) {
  const router = useRouter()
  const supabase = createClient()
  console.log("UserNav Rendered. User Role:", user.role)
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar_url || ""} alt={user.full_name || ""} />
            <AvatarFallback>{user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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

        {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/members" className="flex items-center cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                <span>सदस्य (Members)</span>
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
  )
}
