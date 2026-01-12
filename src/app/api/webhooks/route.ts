import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  return NextResponse.json({ received: true });
}
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Create Supabase client using existing key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
  );

  const eventType = event.type as string;

  if (eventType === "checkout.session.completed") {
    const session = (event as any).data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    console.log("[session]", session);

    if (userId && customerId && subscriptionId) {
      // Save customer_id to profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userId);

      if (profileError) {
        console.error("Error saving customer_id to profiles:", profileError);
      } else {
        console.log(
          "Successfully saved stripe_customer_id to profiles for user:",
          userId
        );
      }

      // Get the pro plan from database
      const { data: proPlan, error: planError } = await supabase
        .from("plans")
        .select("id, name")
        .eq("name", "pro")
        .single();

      if (!planError && proPlan) {
        // Calculate end_date (1 month from now)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // Check if subscription already exists by user_id
        const { data: userSubscription, error: userCheckError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (userCheckError && userCheckError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected if subscription doesn't exist
          console.error("Error checking user subscription:", userCheckError);
        }

        if (userSubscription) {
          // Update existing subscription for this user
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              plan_id: proPlan.id,
              start_date: startDate.toISOString().split("T")[0],
              end_date: endDate.toISOString().split("T")[0],
              status: "active",
              // stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userSubscription.id);

          if (updateError) {
            console.error("Error updating subscription:", updateError);
          } else {
            console.log(
              "Successfully updated existing subscription for user:",
              userId
            );
          }
        } else {
          // Create new subscription
          const { error: insertError } = await supabase
            .from("subscriptions")
            .insert({
              plan_id: proPlan.id,
              user_id: userId,
              start_date: startDate.toISOString().split("T")[0],
              end_date: endDate.toISOString().split("T")[0],
              status: "active",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
            });

          if (insertError) {
            console.error("Error creating new subscription:", insertError);
          } else {
            console.log(
              "Successfully created new subscription for user:",
              userId
            );
          }
        }
      }
    } else {
      console.warn(
        "Missing userId, customerId, or subscriptionId in checkout.session.completed event"
      );
    }
  } else if (eventType === "customer.subscription.updated") {
    // Handle subscription updates
  } else if (eventType === "customer.subscription.deleted") {
    // Handle subscription cancellation
  } else {
    console.log(`Unhandled event type ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
