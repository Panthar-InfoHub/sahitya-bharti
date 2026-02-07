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
import { EventDetailsModal } from "@/components/event-details-modal"
import { RefundRequestModal } from "@/components/refund-request-modal"
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
  const [showDetails, setShowDetails] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  
  const isJoined = event.event_participants?.some((p: any) => p.user_id === currentUserId)
  const participantsCount = event.event_participants?.length || 0
  const seatsAvailable = event.seats ? event.seats - participantsCount : 0
  const isFull = seatsAvailable !== null && seatsAvailable <= 0

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
  };

  const handleJoin = async () => {
    console.log("Event", event)
    if (!currentUserId) {
        toast.error("कृपया लॉगिन करें पहले (Please login first)")
        return
    }

    setJoining(true)
    const supabase = createClient()
    
    try {
        if (isJoined) {
             // Leave event or Refund Request
             if (event.fee && event.fee > 0) {
                 // Paid event -> Refund Request
                 setShowRefundModal(true)
                 return
             }
             
             // Free event -> Direct leave
            const { error } = await supabase
                .from("event_participants")
                .delete()
                .eq("event_id", event.id)
                .eq("user_id", currentUserId)
            
            if (error) throw error
            toast.success("आप कार्यक्रम से हट गए हैं (Left event)")
            router.refresh()
        } else {
             // Join event
             // Check if paid event
             if (event.fee && event.fee > 0) {
                 const isScriptLoaded = await loadRazorpayScript();
                 if (!isScriptLoaded) {
                     toast.error("Payment Gatewa y failed to load");
                     setJoining(false);
                     return;
                 }

                 // Create Order
                 const response = await fetch("/api/razorpay/order", {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ 
                         amount: event.fee,
                         notes: { eventId: event.id, userId: currentUserId }
                     }),
                 });

                 const orderData = await response.json();
                 if (orderData.error) throw new Error(orderData.error);

                 const options = {
                     key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                     amount: orderData.amount,
                     currency: orderData.currency,
                     name: "Sahitya Bharti",
                     description: `Registration: ${event.title}`,
                     order_id: orderData.id,
                     handler: async function (response: any) {
                         // Verify
                         try {
                             const verifyResponse = await fetch("/api/razorpay/verify", {
                                 method: "POST",
                                 headers: { "Content-Type": "application/json" },
                                 body: JSON.stringify({
                                     razorpay_order_id: response.razorpay_order_id,
                                     razorpay_payment_id: response.razorpay_payment_id,
                                     razorpay_signature: response.razorpay_signature,
                                 }),
                             });
                             const verifyResult = await verifyResponse.json();
                             if (!verifyResult.success) throw new Error(verifyResult.message);

                             // Insert Participation
                             const { error: joinError } = await supabase
                                .from("event_participants")
                                .insert({
                                    event_id: event.id,
                                    user_id: currentUserId
                                })
                            
                             if (joinError) throw joinError;

                             toast.success("पंजीकरण सफल! (Registration Successful!)");
                             router.refresh();
                         } catch (e: any) {
                             toast.error("Verification failed: " + e.message);
                         }
                     },
                     prefill: { name: "", contact: "" }, // Can autofill if user data available
                     theme: { color: "#F37254" }
                 };

                 const paymentObject = new (window as any).Razorpay(options);
                 paymentObject.open();

                 // We keep joining=true until Razorpay closes or succeeds? 
                 // Actually Razorpay is modal. If user closes, we might need to reset joining.
                 // Razorpay has 'modal.ondismiss' but SDK logic here is simple.
                 // We'll setJoining(false) in finally doesn't work well with async handler.
                 // So we set it to false if error, but if success it refreshes.
                 // Let's set it false after `paymentObject.open()`? No, it should stay spinning?
                 // Simple approach: Set false after a timeout? Or just leave it. 
                 // Better: Add checking for modal close. For now, simple.
                 
             } else {
                // Free Join
                const { error } = await supabase
                    .from("event_participants")
                    .insert({
                        event_id: event.id,
                        user_id: currentUserId
                    })
                
                if (error) throw error
                toast.success("सफलतापूर्वक शामिल हुए! (Successfully joined!)")
                router.refresh()
             }
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to update participation")
    } finally {
        if (!event.fee || event.fee <= 0) {
             setJoining(false)
        } else {
            // For paid events, we turn off loader after initiating (since popup opens)
            // or we could keep it if we can track modal.
            setJoining(false) 
        }
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
    <>
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group">
      <div 
        className="relative h-48 w-full bg-slate-100 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        {event.image_url ? (
          <Image 
            src={event.image_url} 
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
           <div className="flex items-center justify-center h-full text-slate-400">
             <Calendar className="h-12 w-12 opacity-20" />
           </div>
        )}
        {seatsAvailable !== null && (
            <Badge variant={isFull ? "destructive" : "secondary"} className="absolute top-2 right-2 z-10">
                {isFull ? "कोई सीट नहीं (No Seats Left)" : `${seatsAvailable} सीटें बची हैं (Seats Left)`}
            </Badge>
        )}
        <Badge variant="default" className="absolute top-2 left-2 bg-primary/90 hover:bg-primary z-10">
             {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क (Free)"}
        </Badge>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
            <h3 
                className="text-xl font-bold line-clamp-2 mb-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => setShowDetails(true)}
            >
                {event.title}
            </h3>
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
                    className="w-full relative"
                    onClick={handleJoin}
                    disabled={joining || (isFull && !isJoined)}
                >
                    {joining ? (
                        <>
                            <span className="opacity-0">Pay</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        </>
                    ) : isJoined ? (
                        "Leave Event"
                    ) : isFull ? (
                        "कोई सीट नहीं (No Seats Left)"
                    ) : event.fee > 0 ? (
                        `Pay ₹${event.fee} & Register`
                    ) : (
                        "Join Event (Free)"
                    )}
                </Button>
             )}
        </div>
      </div>
    </div>
    <EventDetailsModal 
        event={event} 
        open={showDetails} 
        onOpenChange={setShowDetails} 
        onJoin={handleJoin}
        onLeave={handleJoin} // handleJoin handles both toggle for generic logic, or specific updates
        joining={joining}
        isJoined={isJoined}
        isFull={isFull}
    />
    {currentUserId && (
        <RefundRequestModal 
            event={event}
            open={showRefundModal}
            onOpenChange={setShowRefundModal}
            currentUserId={currentUserId}
            onSuccess={() => {
                // Should we optimistically update? Or just wait for admin?
                // For now, we just close. Admin needs to approve.
            }}
        />
    )}
    </>
  )
}
