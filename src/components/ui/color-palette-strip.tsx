"use client";

import React from "react";

interface ColorItem {
  hex: string;
  name?: string;
  role?: string;
  opacity?: number;
  localId: string;
}

interface ColorPaletteStripProps {
  colors: ColorItem[];
  className?: string;
  stripClassName?: string;
  colorClassName?: string;
}

const ColorPaletteStrip: React.FC<ColorPaletteStripProps> = ({
  colors,
  className = "bg-quick-view-bg px-11 py-8",
  stripClassName = "flex w-125 h-21.5 mx-auto rounded-lg overflow-hidden",
  colorClassName = "flex-1 h-full relative transition-all rounded-none first:rounded-l-lg last:rounded-r-lg",
}) => {
  return (
    <div className={className}>
      <div className={stripClassName}>
        {colors.map((color) => (
          <div
            key={color.localId}
            className={colorClassName}
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPaletteStrip;
