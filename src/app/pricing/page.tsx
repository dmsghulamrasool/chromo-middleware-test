import PricingPage from "@/components/pricing";
import Image from "next/image";
import { Suspense } from "react";

export default function Pricing() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen px-5">
          <div className="flex flex-col items-center max-w-md w-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-auth-button-bg mx-auto mb-4"></div>
              <p className="text-(--sidebar-text) font-inter">Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <PricingPage />;
    </Suspense>
  );
}
