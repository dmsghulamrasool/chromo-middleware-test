"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalWithHeaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: string;
  width?: string;
  height?: string;
  children: ReactNode;
}

const ModalWithHeader: React.FC<ModalWithHeaderProps> = ({
  isOpen,
  onClose,
  title,
  titleIcon,
  width,
  height,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center bg-modal-overlay-bg"
      onClick={onClose}
    >
      <div
        className={`relative ${width || ''} ${height || ''} bg-white shadow-2xl animate-modalEnter rounded-lg ${height ? 'flex flex-col' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="absolute top-4 right-8 p-0 hover:bg-transparent cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="px-69.125 pt-8">
          <div className="flex items-center justify-center gap-2">
            {titleIcon && (
              <Image src={titleIcon} alt={title} width={20} height={20} />
            )}
            <h2 className="font-inter font-medium text-2xl leading-7.25 text-(--slider-list-2)">
              {title}
            </h2>
          </div>
        </div>

        <div className={height ? 'flex-1 min-h-0' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalWithHeader;
