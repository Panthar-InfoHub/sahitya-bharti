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
import { EventRegistrationModal } from "@/components/event-registration-modal"
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  
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


  const initiatePayment = async () => {
     setJoining(true)
     try {
         const isScriptLoaded = await loadRazorpayScript();
         if (!isScriptLoaded) {
             toast.error("Payment Gateway failed to load");
             setJoining(false);
             return;
         }

         const basePrice = event.fee;
         const gstAmount = basePrice * 0.025;
         const totalAmount = basePrice + gstAmount;

         // Create Order
         const response = await fetch("/api/razorpay/order", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ 
                 amount: totalAmount,
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
                     const supabase = createClient()
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
             prefill: { name: "", contact: "" },
             theme: { color: "#F37254" }
         };

         const paymentObject = new (window as any).Razorpay(options);
         paymentObject.open();
     } catch (error: any) {
         toast.error(error.message || "Payment initialization failed")
         setJoining(false)
     }
  }

  const handleJoin = async () => {
    console.log("Event", event)
    if (!currentUserId) {
        toast.error("कृपया लॉगिन करें पहले (Please login first)")
        return
    }

    const supabase = createClient()
    
    try {
        if (isJoined) {
             setJoining(true)
             // Leave event or Refund Request
             if (event.fee && event.fee > 0) {
                 // Paid event -> Refund Request
                 setShowRefundModal(true)
                 setJoining(false)
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
            setJoining(false)
        } else {
             // Join event
             // Check if paid event
             if (event.fee && event.fee > 0) {
                 // Open Registration Modal instead of direct payment
                 setShowRegistrationModal(true)
             } else {
                setJoining(true)
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
                setJoining(false)
             }
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to update participation")
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
    <>
    <div 
      className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group cursor-pointer"
      onClick={() => setShowDetails(true)}
    >
      <div 
        className="relative h-48 w-full bg-slate-100"
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
        <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
          <Badge variant="default" className="bg-primary/90 hover:bg-primary">
               {event.fee > 0 ? `₹ ${event.fee}` : "निःशुल्क (Free)"}
          </Badge>
          {event.status && (
            <Badge 
              variant="secondary" 
              className={`${
                event.status === 'आगामी' ? 'bg-blue-500/90 text-white hover:bg-blue-500' :
                event.status === 'चल रहा है' ? 'bg-green-500/90 text-white hover:bg-green-500' :
                'bg-gray-500/90 text-white hover:bg-gray-500'
              }`}
            >
              {event.status}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div>
            <h3 
                className="text-xl font-bold line-clamp-2 mb-2 hover:text-primary transition-colors"
            >
                {event.title}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary min-w-[16px]" />
                    <span>
                      {format(new Date(event.date), "PPP")}
                      {event.end_date && ` - ${format(new Date(event.end_date), "PPP")}`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="line-clamp-1">{event.location}</span>
                </div>
                 {(event.start_time || event.end_time) && (
                    <div className="flex items-center gap-2 text-primary/80">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {event.start_time && format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")}
                            {event.start_time && event.end_time && " - "}
                            {event.end_time && format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}
                        </span>
                    </div>
                 )}
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

        <div className="pt-2 flex items-center justify-between gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
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
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isJoined) {
                        // If already joined, handle leave directly
                        handleJoin()
                      } else {
                        // If not joined, open modal to show details first
                        setShowDetails(true)
                      }
                    }}
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
                         `Register`
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
    <EventRegistrationModal 
        open={showRegistrationModal}
        onOpenChange={setShowRegistrationModal}
        event={event}
        user={{ id: currentUserId }} 
        onConfirm={initiatePayment} 
    />
    </>
  )
}
