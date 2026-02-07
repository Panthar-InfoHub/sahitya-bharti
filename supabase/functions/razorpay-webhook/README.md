# Razorpay Webhook Edge Function Deployment Guide

## Setup Instructions

### 1. Install Supabase CLI (if not already installed)
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Link to your project
```bash
supabase link --project-ref your-project-ref
```

### 4. Set Environment Variables

You need to set the Razorpay webhook secret:

```bash
supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### 5. Deploy the Edge Function
```bash
supabase functions deploy razorpay-webhook
```

### 6. Get the Function URL

After deployment, you'll get a URL like:
```
https://your-project-ref.supabase.co/functions/v1/razorpay-webhook
```

### 7. Configure Razorpay Webhook

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Click "Add New Webhook"
3. Enter the Edge Function URL from step 6
4. Select events to listen to:
   - `payment.captured`
   - `order.paid`
5. Save the webhook

## Testing Locally

### 1. Start Supabase locally
```bash
supabase start
```

### 2. Serve the function locally
```bash
supabase functions serve razorpay-webhook --env-file ./supabase/.env.local
```

### 3. Create `.env.local` file in `supabase/` folder:
```
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Test with curl
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/razorpay-webhook' \
  --header 'Content-Type: application/json' \
  --header 'x-razorpay-signature: test_signature' \
  --data '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test123","order_id":"order_test123","amount":10000,"currency":"INR","notes":{"userId":"user-id-here","plan":"premium"}}}}}'
```

## Viewing Logs

### Production Logs
```bash
supabase functions logs razorpay-webhook
```

### Follow logs in real-time
```bash
supabase functions logs razorpay-webhook --follow
```

## Benefits of Edge Function

✅ **Direct Database Access** - Uses service role key, bypasses RLS
✅ **Better Performance** - Runs on Supabase infrastructure
✅ **Easier Debugging** - View logs directly in Supabase
✅ **No Deployment Issues** - Independent of your Next.js app
✅ **Built-in CORS** - Handles CORS automatically
✅ **Automatic Scaling** - Supabase handles scaling

## Troubleshooting

### Check if function is deployed
```bash
supabase functions list
```

### View function details
```bash
supabase functions inspect razorpay-webhook
```

### Redeploy if needed
```bash
supabase functions deploy razorpay-webhook --no-verify-jwt
```

## Environment Variables Needed

- `RAZORPAY_WEBHOOK_SECRET` - Your Razorpay webhook secret
- `SUPABASE_URL` - Automatically available
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically available

## Next Steps

After deployment:
1. Update Razorpay webhook URL to point to the Edge Function
2. Make a test payment
3. Check logs: `supabase functions logs razorpay-webhook --follow`
4. Verify transaction appears in database
