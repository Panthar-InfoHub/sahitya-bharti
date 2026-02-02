"use client"

import { format } from "date-fns"
import { Calendar, MapPin, Trophy, Users, Trash2, Pencil } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { EventModal } from "@/components/event-modal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EventCardProps {
  event: any
  currentUserId?: string
  isAdmin?: boolean
}

export function EventCard({ event, currentUserId, isAdmin }: EventCardProps) {
  const router = useRouter()
  const [joining, setJoining] = useState(false)
  
  const isJoined = event.event_participants?.some((p: any) => p.user_id === currentUserId)
  const participantsCount = event.event_participants?.length || 0
  const seatsAvailable = event.seats ? event.seats - participantsCount : null
  const isFull = seatsAvailable !== null && seatsAvailable <= 0

  const handleJoin = async () => {
    if (!currentUserId) {
        toast.error("कृपया पहले लॉग इन करें (Please login first)")
        return
    }

    setJoining(true)
    const supabase = createClient()
    
    try {
        if (isJoined) {
             // Leave event
            const { error } = await supabase
                .from("event_participants")
                .delete()
                .eq("event_id", event.id)
                .eq("user_id", currentUserId)
            
            if (error) throw error
            toast.success("आप कार्यक्रम से हट गए हैं (Left event)")
        } else {
             // Join event
            const { error } = await supabase
                .from("event_participants")
                .insert({
                    event_id: event.id,
                    user_id: currentUserId
                })
            
            if (error) throw error
            toast.success("सफलतापूर्वक शामिल हुए! (Successfully joined!)")
        }
        router.refresh()
    } catch (error: any) {
        toast.error(error.message || "Failed to update participation")
    } finally {
        setJoining(false)
    }
  }

  const handleDelete = async () => {
      const supabase = createClient()
      const { error } = await supabase.from("events").delete().eq("id", event.id)
      if (error) {
          toast.error("Failed to delete event")
      } else {
          toast.success("Event deleted")
          router.refresh()
      }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full bg-slate-100">
        {event.image_url ? (
          <Image 
            src={event.image_url} 
            alt={event.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
           <div className="flex items-center justify-center h-full text-slate-400">
             <Calendar className="h-12 w-12 opacity-20" />
           </div>
        )}
        {seatsAvailable !== null && (
            <Badge variant={isFull ? "destructive" : "secondary"} className="absolute top-2 right-2">
                {isFull ? "Full" : `${seatsAvailable} Seats Left`}
            </Badge>
        )}
        <Badge variant="default" className="absolute top-2 left-2 bg-primary/90 hover:bg-primary">
             {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क (Free)"}
        </Badge>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
            <h3 className="text-xl font-bold line-clamp-2 mb-2">{event.title}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{format(new Date(event.date), "PPP p")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                </div>
                 {event.prizes && (
                    <div className="flex items-start gap-2">
                        <Trophy className="h-4 w-4 text-primary mt-0.5" />
                        <span className="line-clamp-2">{event.prizes}</span>
                    </div>
                )}
            </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3 flex-1">
            {event.description}
        </p>

        {event.rules && (
             <div className="text-xs bg-slate-50 p-2 rounded text-slate-600">
                <strong>नियम (Rules):</strong> <span className="line-clamp-1">{event.rules}</span>
             </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
             {isAdmin ? (
                 <div className="flex w-full gap-2">
                     <EventModal 
                        eventToEdit={event} 
                        trigger={
                            <Button variant="outline" size="sm" className="flex-1">
                                <Pencil className="h-4 w-4 mr-2" /> 
                                Edit
                            </Button>
                        } 
                     />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                 </div>
             ) : (
                <Button 
                    variant={isJoined ? "outline" : "default"} 
                    className="w-full"
                    onClick={handleJoin}
                    disabled={joining || (isFull && !isJoined)}
                >
                    {joining ? "Updating..." : isJoined ? "Leave Event" : (isFull ? "Event Full" : "Join Event")}
                </Button>
             )}
        </div>
      </div>
    </div>
  )
}
