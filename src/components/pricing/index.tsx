"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import supabase from "@/lib/supabase-client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
}

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);

  const fetchCurrentPlan = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: plansData, error: plansError } = await supabase
        .from("plans")
        .select("id, name")
        .in("name", ["free", "pro"]);

      if (!plansError && plansData) {
        setPlans(plansData);
      }

      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select(
          `
          plan_id,
          plans (
            name
          )
        `
        )
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error && subscription) {
        const plan = Array.isArray(subscription.plans)
          ? subscription.plans[0]
          : subscription.plans;
        setCurrentPlan(plan?.name || null);
      }
    } catch (error) {
      toast.error("Failed to load plan information.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPlan();

    // Check if user cancelled payment
    const cancel = searchParams.get("cancel");
    if (cancel === "true") {
      toast.error("Payment was cancelled. You can try again anytime.");
    }
  }, [searchParams]);

  const handleUpgradeToPro = async (proPlan: Plan) => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to upgrade");
        return;
      }

      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("data", data);

      if (!response.ok) {
        toast.error(data.error || "Failed to create checkout session");
        return;
      }

      // Redirect to Stripe Checkout
      if (data.sessionurl) {
        window.location.href = data.sessionurl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center pt-12 pb-8 px-5">
        <div className="flex justify-center mb-6">
          <Image
            src="/chromo-logo-with-text.png"
            alt="Chromo Logo"
            width={500}
            height={500}
            className="w-auto max-h-20"
          />
        </div>
        <h1 className="text-(--sidebar-text) font-inter font-semibold text-3xl md:text-4xl text-center mb-2">
          Pricing Plans
        </h1>
        <p className="text-(--sidebar-text) font-inter text-sm md:text-base text-center max-w-2xl">
          Choose the plan that works best for you.
        </p>
      </div>
      <div className="flex gap-8 justify-center flex-wrap">
        {isLoading ? (
          <>
            <div className="flex flex-col w-80 p-6 rounded-2xl border-2 border-quick-view-border bg-quick-view-bg">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-8 w-24 mb-6" />
              <div className="flex flex-col gap-3 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
            <div className="flex flex-col w-80 p-6 rounded-2xl border-2 border-quick-view-border bg-quick-view-bg">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-8 w-24 mb-6" />
              <div className="flex flex-col gap-3 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </>
        ) : (
          <>
            <div
              className={`flex flex-col w-80 p-6 rounded-2xl border-2 ${
                currentPlan === "free"
                  ? "border-auth-button-bg bg-quick-view-bg shadow-shadowBox"
                  : "border-quick-view-border bg-quick-view-bg"
              }`}
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-bold font-inter text-xl text-(--heading)">
                  Free Plan
                </h2>
                <p className="font-normal font-inter text-sm text-(--heading)">
                  Perfect for getting started
                </p>
              </div>
              <div className="flex items-baseline gap-1 pt-4">
                <span className="font-bold font-inter text-3xl text-(--heading)">
                  $0
                </span>
                <span className="font-normal font-inter text-sm text-(--heading)">
                  /month
                </span>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <span className="font-normal font-inter text-sm text-(--heading)">
                    ✓ Up to 5 palettes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal font-inter text-sm text-(--heading)">
                    ✓ Basic features
                  </span>
                </div>
              </div>
              {currentPlan === "free" ? (
                <div className="pt-6">
                  <Button
                    disabled
                    className="w-full font-geist bg-auth-button-bg text-auth-button-text"
                  >
                    Current Plan
                  </Button>
                </div>
              ) : (
                <div className="pt-6">
                  <Button
                    variant="outline"
                    className="w-full font-geist border-black"
                  >
                    Select Plan
                  </Button>
                </div>
              )}
            </div>
            <div
              className={`flex flex-col w-80 p-6 rounded-2xl border-2 ${
                currentPlan === "pro"
                  ? "border-auth-button-bg bg-quick-view-bg shadow-shadowBox"
                  : "border-quick-view-border bg-quick-view-bg"
              }`}
            >
              <div className="flex flex-col gap-2">
                <h2 className="font-bold font-inter text-xl text-(--heading)">
                  Pro Plan
                </h2>
                <p className="font-normal font-inter text-sm text-(--heading)">
                  For professionals and teams
                </p>
              </div>
              <div className="flex items-baseline gap-1 pt-4">
                <span className="font-bold font-inter text-3xl text-(--heading)">
                  $29
                </span>
                <span className="font-normal font-inter text-sm text-(--heading)">
                  /month
                </span>
              </div>
              <div className="flex flex-col gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <span className="font-normal font-inter text-sm text-(--heading)">
                    ✓ Unlimited palettes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal font-inter text-sm text-(--heading)">
                    ✓ All features
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-normal font-inter text-sm text-(--heading)">
                    ✓ Priority support
                  </span>
                </div>
              </div>
              {currentPlan === "pro" ? (
                <div className="pt-6">
                  <Button
                    disabled
                    className="w-full font-geist bg-auth-button-bg text-auth-button-text"
                  >
                    Current Plan
                  </Button>
                </div>
              ) : (
                <div className="pt-6">
                  <Button
                    onClick={() => {
                      const proPlan = plans.find((plan) => plan.name === "pro");
                      handleUpgradeToPro(proPlan!);
                    }}
                    className="w-full font-geist bg-auth-button-bg text-auth-button-text hover:bg-auth-button-bg/90"
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
