import { NextRequest, NextResponse } from "next/server";
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
      .select("id, name")
      .eq("name", "pro")
      .single();

    if (planError || !proPlan) {
      return NextResponse.json(
        { error: "Pro plan not found" },
        { status: 404 }
      );
    }

    // Calculate end_date (1 month from purchase date - same day next month)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Add 1 month to current date

    // Deactivate any existing active subscriptions
    const { error: deactivateError } = await supabase
      .from("subscriptions")
      .update({
        status: "inactive",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("status", "active");

    if (deactivateError) {
      return NextResponse.json(
        { error: "Error deactivating existing subscriptions" },
        { status: 500 }
      );
    }

    // Create new subscription with pro plan
    const { error: insertError } = await supabase.from("subscriptions").insert({
      plan_id: proPlan.id,
      user_id: user.id,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
      status: "active",
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Error creating subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription activated successfully",
    });
  } catch (error) {
    console.error("Error in payment success handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
