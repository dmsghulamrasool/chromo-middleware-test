"use client";

import React from "react";
import Image from "next/image";

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
    <button
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute z-50 top-1/2 ${
        position === "right" ? "-right-4" : "-left-4"
      } -translate-y-1/2 w-8 h-8 border-2 border-white bg-[#FFF9E6] rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-none group-hover:pointer-events-auto cursor-pointer`}
      style={{ pointerEvents: 'auto', touchAction: 'none' }}
      title="Add new color"
      aria-label="Add new color"
    >
      <Image
        src="/svg/plus-circular.svg"
        alt="Add color"
        width={32}
        height={32}
        className="w-full h-full"
      />
    </button>
  );
};

export default AddColor;
