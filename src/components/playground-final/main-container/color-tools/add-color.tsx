"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../../../ui/button";

interface AddColorProps {
  onAddColor: () => void;
  position?: "left" | "right";
}

const AddColor: React.FC<AddColorProps> = ({ onAddColor, position = "right" }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onAddColor();
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute z-50 top-1/2 ${
        position === "right" ? "-right-4" : "-left-4"
      } -translate-y-1/2 p-0 border-2 border-white bg-[#FFF9E6] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-[#FFF9E6] pointer-events-none group-hover:pointer-events-auto cursor-pointer`}
      style={{ pointerEvents: 'auto', touchAction: 'none' }}
      title="Add new color"
      aria-label="Add new color"
    >
      <Image
        src="/svg/plus-circular.svg"
        alt="Add color"
        width={32}
        height={32}
        className="w-8 h-8"
      />
    </Button>
  );
};

export default AddColor;
