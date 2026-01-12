"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface VersionLabelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLabel?: string;
}

export default function VersionLabelingModal({
  isOpen,
  onClose,
  initialLabel = "",
}: VersionLabelingModalProps) {
  const [label, setLabel] = useState(initialLabel);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSave = () => {
    onClose();
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--modal-overlay-bg)]"
        onClick={onClose}
      >
        <div
          className="relative w-[586px] max-w-[586px] bg-[var(--modal-bg)] rounded-lg animate-modalEnter"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center px-8 pt-8 pb-5 relative">
            <div className="flex items-center gap-3">
              <Image
                src="/svg/version.svg"
                alt="Version"
                width={18}
                height={18}
                className="w-[18px] h-[18px]"
              />
              <h2 className="font-inter font-normal text-2xl text-black">
                Version Labeling
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="p-0 text-gray-500 hover:text-gray-700 hover:bg-transparent transition-colors absolute right-8 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-3">
            <div className="border-t border-[var(--line)]"></div>
          </div>

          <div className="px-8 pt-6 pb-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-inter font-normal text-base text-black">
                  Label
                </label>
                <span className="font-inter font-normal text-base text-black">
                  Version 1
                </span>
              </div>
              <Input
                type="text"
                placeholder="Type Label"
                value={label}
                onChange={handleLabelChange}
                className="w-full h-[52px] bg-white border border-[var(--chat-search-border)] rounded-lg px-4 font-inter text-base text-black placeholder:text-[var(--modal-input-placeholder)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--chat-search-border)]"
              />
            </div>

            <div className="mt-8">
              <Button
                variant="black"
                onClick={handleSave}
                className="w-full h-[54px] text-base cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
