"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { Button } from "./ui/button";
import supabase from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 400);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className={`bg-[#BBB4A699] fixed inset-0 z-[9999] ${
        isClosing
          ? "animate-[backdropFadeOut_0.4s_ease-in]"
          : "animate-[backdropFadeIn_0.4s_ease-out]"
      }`}
      onClick={handleClose}
    >
      <div className="flex justify-center items-center min-h-screen w-full">
        <div
          className={`w-full max-w-md mx-4 shadow-shadowBox p-6 rounded-2xl bg-[#F6F2EA] relative ${
            isClosing
              ? "animate-[modalExit_0.4s_ease-in]"
              : "animate-[modalEnter_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="close w-8 h-8 absolute top-4 right-4 cursor-pointer flex justify-center items-center transition-transform duration-200 hover:rotate-90"
            onClick={handleClose}
          >
            <IoClose className="text-2xl leading-normal" />
          </div>

          <div className="text-center pt-4">
            <Image
              src="/chromo-logo.png"
              alt="Chromos Logo"
              width={64}
              height={64}
              className="w-16 h-16 mx-auto"
            />
            <h2 className="text-xl mt-4 font-semibold tracking-[-0.6px] text-card-foreground font-inter">
              Limit Reached
            </h2>
            <p className="font-geist font-normal text-sm leading-5 text-foreground mt-2">
              You've reached the maximum of 5 palettes on the Free plan.
            </p>
            <p className="font-geist font-normal text-sm leading-5 text-foreground mt-1">
              Upgrade to Pro for unlimited palettes!
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              className="w-full font-geist bg-auth-button-bg text-auth-button-text hover:bg-auth-button-bg/90 cursor-pointer"
              onClick={() => router.push("/pricing")}
            >
              Upgrade to Pro Plan
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full font-geist border-black"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
