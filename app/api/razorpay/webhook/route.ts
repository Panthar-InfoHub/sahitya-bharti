import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Init Supabase Admin Client (Service Role) - to bypass RLS for DB updates
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid Webhook Signature");
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { payload } = event;
    
    // Handle 'payment.captured' or 'order.paid'
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = payload.payment.entity;
      const notes = payment.notes;

      // 1. MEMBERSHIP UPGRADE
      // If notes contain 'plan' or simple login from MembershipModal
      if (notes.plan === "premium" && notes.userId) {
         console.log(`Upgrading User ${notes.userId} to Premium`);
         const { error } = await supabase
            .from('users')
            .update({ plan: 'premium' })
            .eq('id', notes.userId);
         
         if (error) console.error("Failed to upgrade user:", error);
      }

      // 2. EVENT REGISTRATION
      if (notes.eventId && notes.userId) {
          console.log(`Registering User ${notes.userId} for Event ${notes.eventId}`);
          // Insert, ignore conflict if already exists
          const { error } = await supabase
            .from('event_participants')
            .insert({ event_id: notes.eventId, user_id: notes.userId })
            .select(); // .select() can help with returning success even if no rows affected? 
            // Actually standard insert fails on conflict without conflict handling.
            // RLS might block if doing as admin is fine.
            // supabase-js: .onConflict('event_id, user_id').ignore() if needed.
          
          if (error) {
              // Ignore unique violation (already joined)
              if (error.code !== '23505') { 
                 console.error("Failed to register user for event:", error);
              }
          }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
