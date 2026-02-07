import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    // Init Supabase Admin Client (Service Role) - to bypass RLS for DB updates
    const supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    );
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

      // Determine transaction type and details
      let transactionType: 'membership' | 'event' = 'membership';
      let eventId: string | null = null;
      let plan: string | null = null;

      // 1. MEMBERSHIP UPGRADE
      // If notes contain 'plan' or simple login from MembershipModal
      if (notes.plan === "premium" && notes.userId) {
         console.log(`Upgrading User ${notes.userId} to Premium`);
         transactionType = 'membership';
         plan = 'premium';
         
         const { error } = await supabase
            .from('users')
            .update({ plan: 'premium' })
            .eq('id', notes.userId);
         
         if (error) console.error("Failed to upgrade user:", error);
      }

      // 2. EVENT REGISTRATION
      if (notes.eventId && notes.userId) {
          console.log(`Registering User ${notes.userId} for Event ${notes.eventId}`);
          transactionType = 'event';
          eventId = notes.eventId;
          
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

      // 3. CREATE TRANSACTION RECORD
      if (notes.userId) {
        const transactionData = {
          user_id: notes.userId,
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          amount: payment.amount / 100, // Convert from paise to rupees
          currency: payment.currency || 'INR',
          status: 'success',
          type: transactionType,
          event_id: eventId,
          plan: plan,
        };

        console.log('Attempting to insert transaction:', JSON.stringify(transactionData, null, 2));

        const { data, error: txError } = await supabase
          .from('transactions')
          .insert(transactionData)
          .select();

        if (txError) {
          console.error("❌ Failed to create transaction record:");
          console.error("Error code:", txError.code);
          console.error("Error message:", txError.message);
          console.error("Error details:", JSON.stringify(txError, null, 2));
        } else {
          console.log(`✅ Transaction recorded successfully for user ${notes.userId}`);
          console.log('Transaction data:', JSON.stringify(data, null, 2));
        }
      } else {
        console.warn('⚠️ No userId in payment notes - transaction not recorded');
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
