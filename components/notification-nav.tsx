"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationNav() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    
    // Optional: Realtime subscription could go here
    const supabase = createClient()
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
        },
        (payload) => {
           // Simplistic reload on any user update (optimize later)
           fetchNotifications()
        }
      )
      .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("users")
      .select("notifications")
      .eq("id", user.id)
      .single()

    if (data && data.notifications) {
        // Reverse to show newest first
        const list = [...data.notifications].reverse()
        setNotifications(list)
        // Assume all are "unread" if we don't track read state, or just show count
        setUnreadCount(list.length)
    }
  }

  const handleOpenChange = (open: boolean) => {
      // Could mark as read here (clear count)
      if (open) setUnreadCount(0) 
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
            <h4 className="font-semibold leading-none">Notifications</h4>
            <div className="text-xs text-muted-foreground mt-1">
                You have {notifications.length} messages
            </div>
        </div>
        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                    No new notifications
                </div>
            ) : (
                <div className="grid">
                    {notifications.map((note, i) => (
                        <div key={i} className="p-4 border-b last:border-0 hover:bg-slate-50 text-sm">
                            {note}
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
