import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Razorpay webhook secret
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not set')
      return new Response(
        JSON.stringify({ error: 'Configuration Error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the raw body and signature
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    // Verify signature
    const crypto = await import('https://deno.land/std@0.168.0/crypto/mod.ts')
    const encoder = new TextEncoder()
    const key = await crypto.crypto.subtle.importKey(
      'raw',
      encoder.encode(webhookSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuffer = await crypto.crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(rawBody)
    )
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return new Response(
        JSON.stringify({ error: 'Invalid Signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse the event
    const event = JSON.parse(rawBody)
    const { payload } = event

    console.log('Received event:', event.event)

    // Handle payment.captured or order.paid
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = payload.payment.entity
      const notes = payment.notes

      console.log('Payment notes:', notes)

      // Initialize Supabase client with service role key
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseServiceKey)

      // Determine transaction type and details
      let transactionType: 'membership' | 'event' = 'membership'
      let eventId: string | null = null
      let plan: string | null = null

      // 1. MEMBERSHIP UPGRADE
      if (notes.plan === 'premium' && notes.userId) {
        console.log(`Upgrading User ${notes.userId} to Premium`)
        transactionType = 'membership'
        plan = 'premium'

        const { error } = await supabase
          .from('users')
          .update({ plan: 'premium' })
          .eq('id', notes.userId)

        if (error) {
          console.error('Failed to upgrade user:', error)
        } else {
          console.log('✅ User upgraded successfully')
        }
      }

      // 2. EVENT REGISTRATION
      if (notes.eventId && notes.userId) {
        console.log(`Registering User ${notes.userId} for Event ${notes.eventId}`)
        transactionType = 'event'
        eventId = notes.eventId

        const { error } = await supabase
          .from('event_participants')
          .insert({ event_id: notes.eventId, user_id: notes.userId })

        if (error) {
          // Ignore unique violation (already joined)
          if (error.code !== '23505') {
            console.error('Failed to register user for event:', error)
          }
        } else {
          console.log('✅ User registered for event successfully')
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
        }

        console.log('Attempting to insert transaction:', transactionData)

        // Use upsert to handle duplicate payment IDs gracefully
        const { data, error: txError } = await supabase
          .from('transactions')
          .upsert(transactionData, { 
            onConflict: 'razorpay_payment_id',
            ignoreDuplicates: false 
          })
          .select()

        if (txError) {
          console.error('❌ Failed to create transaction record:')
          console.error('Error code:', txError.code)
          console.error('Error message:', txError.message)
          console.error('Error details:', txError)
        } else {
          console.log(`✅ Transaction recorded successfully for user ${notes.userId}`)
          console.log('Transaction data:', data)
        }
      } else {
        console.warn('⚠️ No userId in payment notes - transaction not recorded')
      }
    }

    return new Response(
      JSON.stringify({ status: 'ok' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Webhook Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
