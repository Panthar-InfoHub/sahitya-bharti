import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy", // Fallback for build
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
    });

    // Validate Credentials Format
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    if (!keyId.startsWith("rzp_") && !keyId.includes("dummy")) {
        console.error("Invalid Razorpay Key ID format detected.");
        return NextResponse.json(
            { error: "Configuration Error: NEXT_PUBLIC_RAZORPAY_KEY_ID should start with 'rzp_'. You may have used the Secret Key instead." },
            { status: 500 }
        );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is missing.");
       return NextResponse.json(
            { error: "Configuration Error: RAZORPAY_KEY_SECRET is missing in .env file." },
            { status: 500 }
        );
    }

    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes("dummy")) {
        console.warn("Razorpay Keys are missing or dummy. Payment will fail.");
    }

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay takes amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Order Creation Error:", error);
    // Return more details for debugging
    return NextResponse.json(
      { 
        error: error.message || "Something went wrong", 
        details: error.error || error 
      },
      { status: 500 }
    );
  }
}
