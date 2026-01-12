"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PricingSuccessContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only process if success parameter is present
    const success = searchParams.get("success");
    if (success) {
      setIsLoading(false);
    }
    // Keep loading if success parameter is not present
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5">
      <div className="flex flex-col items-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image
            src="/chromo-logo-with-text.png"
            alt="Chromo Logo"
            width={500}
            height={500}
            className="w-auto max-h-20"
          />
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auth-button-bg mx-auto mb-4"></div>
            <p className="text-(--sidebar-text) font-inter">
              Verifying your subscription...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-(--sidebar-text) font-inter font-semibold text-2xl md:text-3xl text-center mb-2">
                Payment Successful!
              </h1>
              <p className="text-(--sidebar-text) font-inter text-sm md:text-base text-center">
                Your Pro subscription has been activated. You now have access to
                all premium features.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Link href="/chat" className="w-full">
                <Button className="w-full font-geist bg-auth-button-bg text-auth-button-text hover:bg-auth-button-bg/90">
                  Start Creating
                </Button>
              </Link>
              <Link href="/pricing" className="w-full">
                <Button
                  variant="outline"
                  className="w-full font-geist border-black"
                >
                  Back to Pricing
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PricingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen px-5">
          <div className="flex flex-col items-center max-w-md w-full">
            <div className="flex justify-center mb-6">
              <Image
                src="/chromo-logo-with-text.png"
                alt="Chromo Logo"
                width={500}
                height={500}
                className="w-auto max-h-20"
              />
            </div>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auth-button-bg mx-auto mb-4"></div>
              <p className="text-(--sidebar-text) font-inter">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <PricingSuccessContent />
    </Suspense>
  );
}
