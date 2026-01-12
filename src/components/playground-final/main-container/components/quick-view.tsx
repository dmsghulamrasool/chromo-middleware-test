"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  hexToRgb,
  hexToHsl,
  hexToHsv,
  hexToCmyk,
  hexToCss,
} from "@/helpers/colorConversion";

interface ColorItem {
  hex: string;
  name: string;
  role: string;
  opacity?: number;
  localId: string;
}

interface QuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  colors: ColorItem[];
  initialSelectedIndex?: number;
}

const QuickView: React.FC<QuickViewProps> = ({
  isOpen,
  onClose,
  colors,
  initialSelectedIndex = 0,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [hoveredFormat, setHoveredFormat] = useState<string | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen || colors.length === 0) return null;

  const selectedColor = colors[selectedIndex];
  const rgb = hexToRgb(selectedColor.hex);
  const hsl = hexToHsl(selectedColor.hex);
  const hsb = hexToHsv(selectedColor.hex);
  const cmyk = hexToCmyk(selectedColor.hex);
  const css = hexToCss(selectedColor.hex);

  const isColorDark = (hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance < 0.5;
  };

  const isDark = isColorDark(selectedColor.hex);

  const handleCopy = async (value: string, format: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 1500);
    } catch (err) {
    }
  };

  const createCopyHandler = (value: string, format: string) => () => {
    handleCopy(value, format);
  };

  const handleMouseEnter = (label: string) => () => {
    setHoveredFormat(label);
  };

  const handleMouseLeave = () => {
    setHoveredFormat(null);
  };

  const handleColorSelect = (index: number) => () => {
    setSelectedIndex(index);
  };

  const colorFormats = [
    { label: "HEX", value: selectedColor.hex.toUpperCase() },
    { label: "HSB", value: `${Math.round(hsb.h)}, ${Math.round(hsb.s)}, ${Math.round(hsb.v)}` },
    { label: "RGB", value: `${rgb.r}, ${rgb.g}, ${rgb.b}` },
    { label: "CSS", value: css },
    { label: "HSL", value: `${hsl.h}, ${hsl.s}, ${hsl.l}` },
    { label: "CMYK", value: `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` },
  ];

  return (
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center bg-modal-overlay-bg"
      onClick={onClose}
    >
      <div
        className="relative w-146.5 bg-quick-view-bg shadow-2xl animate-modalEnter rounded-t-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center px-6 pt-7 pb-2.5 border-b border-quick-view-border relative">
          <Image
            src="/svg/eye.svg"
            alt="Quick view"
            width={20}
            height={20}
          />
          <h2 className="font-inter text-lg font-medium text-quick-view-text-black pl-2">Quick view</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="absolute right-4 p-0 text-quick-view-text-muted hover:text-quick-view-text-muted-hover hover:bg-transparent cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div
          className="px-5 pt-8 pb-5 max-h-96 overflow-y-auto scrollbar-hide"
          style={{ backgroundColor: selectedColor.hex }}
        >
          <div className="space-y-3">
            {colorFormats.map((format) => (
              <div
                key={format.label}
                onMouseEnter={handleMouseEnter(format.label)}
                onMouseLeave={handleMouseLeave}
                className="relative px-5 pt-1.5 pb-2 transition-all cursor-pointer rounded-lg hover:bg-quick-view-hover-bg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`font-inter text-xs font-medium pb-1 ${isDark ? 'text-quick-view-text-white' : 'text-quick-view-text-dark'}`}
                    >
                      {format.label}
                    </div>
                    <div
                      className={`font-inter text-sm font-normal ${isDark ? 'text-quick-view-text-white' : 'text-quick-view-text-black'}`}
                    >
                      {format.value}
                    </div>
                  </div>
                  {hoveredFormat === format.label && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={createCopyHandler(format.value, format.label)}
                      className="relative p-0 hover:bg-transparent"
                    >
                      <Image
                        src="/svg/qw-copy.svg"
                        alt="Copy"
                        width={20}
                        height={20}
                      />
                      {copiedFormat === format.label && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full px-2 py-1 bg-quick-view-tooltip-bg text-quick-view-text-white text-xs rounded whitespace-nowrap">
                          Copied!
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-quick-view-bg px-11 py-8">
          <div className="flex w-125 h-21.5 mx-auto rounded-lg overflow-hidden">
            {colors.map((color, index) => (
              <Button
                key={color.localId}
                variant="ghost"
                className="flex-1 h-full relative transition-all p-0 hover:bg-transparent rounded-none first:rounded-l-lg last:rounded-r-lg"
                style={{ backgroundColor: color.hex }}
                onClick={handleColorSelect(index)}
              >
                {index === selectedIndex && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/svg/circle-blackdot.svg"
                      alt="Selected"
                      width={23}
                      height={23}
                    />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
