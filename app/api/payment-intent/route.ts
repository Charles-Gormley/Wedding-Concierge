import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

// In-memory store for payment intents (for demo purposes)
// In production, you'd want to use a proper database
const paymentIntents = new Map<string, { priceId: string; userId: string }>();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { priceId } = await req.json();

    if (!userId) { // Check if user is authenticated / the validity of the userId.
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!priceId) {
      return NextResponse.json({ message: "Price ID is required" }, { status: 400 });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 7_999, // TODO: Grab this dynamically from the priceId.
      currency: "usd",
      metadata: {
        "priceId": priceId,
        "userId": userId,
      },
    });

    // // Store the payment intent ID with the user's ID
    // paymentIntents.set(paymentIntent.id, { priceId: priceId, userId: userId });

    return NextResponse.json({ paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error("[PAYMENT_INTENT]", error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("paymentIntentId");

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!paymentIntentId) {
      return NextResponse.json({ message: "Payment Intent ID is required" }, { status: 400 });
    }

    // Retrieve the stored payment intent data
    const storedData = paymentIntents.get(paymentIntentId);

    if (!storedData || storedData.userId !== userId) {
      return NextResponse.json({ message: "Payment Intent not found" }, { status: 404 });
    }

    return NextResponse.json({ priceId: storedData.priceId });
  } catch (error) {
    console.error("[PAYMENT_INTENT]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 