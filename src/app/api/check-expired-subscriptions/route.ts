import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    // Optional: Add authentication/authorization check here if needed
    // For now, this can be called by any authenticated user or via cron job

    const supabase = await supabaseServer();

    // Call the database function to process expired subscriptions
    const { error } = await supabase.rpc("handle_expired_subscriptions");

    if (error) {
      console.error("Error processing expired subscriptions:", error);
      return NextResponse.json(
        {
          error: "Error processing expired subscriptions",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Expired subscriptions processed successfully",
    });
  } catch (error) {
    console.error("Error in check-expired-subscriptions handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Also allow GET for easy testing
export async function GET(req: NextRequest) {
  return POST(req);
}
