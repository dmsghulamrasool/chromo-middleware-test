import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the pro plan from database
    const { data: proPlan, error: planError } = await supabase
      .from("plans")
      .select("id, name, stripe_price_id")
      .eq("name", "pro")
      .single();

    if (planError || !proPlan) {
      return NextResponse.json(
        { error: "Pro plan not found" },
        { status: 404 }
      );
    }

    if (!proPlan.stripe_price_id) {
      return NextResponse.json(
        { error: "Stripe price ID not configured for Pro plan" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: proPlan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/pricing/success?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/pricing?cancel=true`,
      metadata: {
        userId: user.id,
        planType: "premium",
        source: "website",
      },
    });

    return NextResponse.json({ success: true, sessionurl: session.url });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
