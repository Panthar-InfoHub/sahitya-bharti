"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy, X, FileText, Loader2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface EventDetailsModalProps {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoin?: () => void
  onLeave?: () => void
  joining?: boolean
  isJoined?: boolean
  isFull?: boolean
}

export function EventDetailsModal({ 
    event, 
    open, 
    onOpenChange,
    onJoin,
    onLeave,
    joining,
    isJoined,
    isFull
}: EventDetailsModalProps) {
  if (!event) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-xl">
        
        {/* Header Image */}
        <div className="relative h-64 w-full bg-slate-100">
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
               <Calendar className="h-16 w-16 opacity-20" />
             </div>
           )}
           <Button
               variant="ghost" 
               size="icon" 
               className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full h-8 w-8"
               onClick={() => onOpenChange(false)}
           >
               <X className="h-4 w-4" />
           </Button>
           <Badge className="absolute bottom-4 left-4 bg-white/90 text-black hover:bg-white text-base px-3 py-1">
               {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क (Free)"}
           </Badge>
        </div>

        <div className="p-6 space-y-6">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold leading-tight text-gray-900">
                    {event.title}
                </DialogTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                    </div>
                    {(event.start_time || event.end_time) && (
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                                {event.start_time && format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                                {event.start_time && event.end_time && " - "}
                                {event.end_time && format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}
                            </span>
                        </div>
                    )}
                </div>
            </DialogHeader>

            {/* Description */}
            <div className="prose prose-sm max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                 {event.prizes && (
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <Trophy className="h-3 w-3" />
                            पुरस्कार (Prizes)
                        </h4>
                        <p className="text-sm font-medium whitespace-pre-wrap break-words">{event.prizes}</p>
                    </div>
                )}
                {event.rules && (
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            नियम (Rules)
                        </h4>
                        <p className="text-sm font-medium whitespace-pre-wrap break-words">{event.rules}</p>
                    </div>
                )}
            </div>
            
            {/* Footer Action */}
            <div className="pt-4 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2"> {/* Sticky footer if needed, or just normal */}
                {/* Removed duplicate "Close" button */}
                
                {/* Action Buttons */}
                {isJoined ? (
                    <Button 
                        variant="destructive" 
                        onClick={onLeave}
                        disabled={joining}
                        className="w-full sm:w-auto"
                    >
                        {joining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Unregister / Leave
                    </Button>
                ) : (
                    <Button 
                        onClick={onJoin}
                        disabled={joining || isFull}
                        className="w-full sm:w-auto"
                    >
                         {joining ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : isFull ? (
                            "No Seats Left"
                        ) : event.fee > 0 ? (
                            `Pay ₹${event.fee} & Register`
                        ) : (
                            "Join Event"
                        )}
                    </Button>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
