"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { HexColorPicker } from "react-colorful";
import { hexToHsv, hsvToHex } from "@/helpers/colorConversion";

interface ColorPickerProps {
  color: string;
  onColorChange?: (color: string, opacity: number) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange }) => {
  const [currentColor, setCurrentColor] = useState(color);
  const [opacity, setOpacity] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [hexInput, setHexInput] = useState(color.replace("#", "").toUpperCase());

  const opacitySliderRef = useRef<HTMLDivElement>(null);
  const brightnessSliderRef = useRef<HTMLDivElement>(null);
  const isDraggingOpacity = useRef(false);
  const isDraggingBrightness = useRef(false);
  const baseHue = useRef(0);
  const baseSaturation = useRef(100);

  useEffect(() => {
    setCurrentColor(color);
    setHexInput(color.replace("#", "").toUpperCase());
    const hsv = hexToHsv(color);
    baseHue.current = hsv.h;
    baseSaturation.current = hsv.s;
    setBrightness(hsv.v);
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor);
    setHexInput(newColor.replace("#", "").toUpperCase());
    const hsv = hexToHsv(newColor);
    baseHue.current = hsv.h;
    baseSaturation.current = hsv.s;
    setBrightness(hsv.v);
    onColorChange?.(newColor, opacity);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("#", "").toUpperCase();
    setHexInput(value);

    if (/^[0-9A-F]{6}$/i.test(value)) {
      const newColor = `#${value}`;
      setCurrentColor(newColor);
      const hsv = hexToHsv(newColor);
      baseHue.current = hsv.h;
      baseSaturation.current = hsv.s;
      setBrightness(hsv.v);
      onColorChange?.(newColor, opacity);
    }
  };

  const handleOpacityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace("%", "");
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setOpacity(numValue);
    onColorChange?.(currentColor, numValue);
  };

  const updateOpacityFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!opacitySliderRef.current) return;
    const rect = opacitySliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newOpacity = Math.round((x / rect.width) * 100);
    setOpacity(newOpacity);
    onColorChange?.(currentColor, newOpacity);
  }, [currentColor, onColorChange]);

  const updateBrightnessFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!brightnessSliderRef.current) return;
    const rect = brightnessSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newBrightness = Math.round((1 - x / rect.width) * 100);
    setBrightness(newBrightness);
    const newColor = hsvToHex(baseHue.current, baseSaturation.current, newBrightness);
    setCurrentColor(newColor);
    setHexInput(newColor.replace("#", "").toUpperCase());
    onColorChange?.(newColor, opacity);
  }, [opacity, onColorChange]);

  const handleOpacityMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingOpacity.current = true;
    updateOpacityFromEvent(e);
  };

  const handleBrightnessMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingBrightness.current = true;
    updateBrightnessFromEvent(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingOpacity.current) {
        updateOpacityFromEvent(e);
      }
      if (isDraggingBrightness.current) {
        updateBrightnessFromEvent(e);
      }
    };

    const handleMouseUp = () => {
      isDraggingOpacity.current = false;
      isDraggingBrightness.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [updateOpacityFromEvent, updateBrightnessFromEvent]);

  const stopPropagation = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  const opacitySliderBg = `
    linear-gradient(90deg, rgba(${parseInt(currentColor.slice(1, 3), 16)}, ${parseInt(currentColor.slice(3, 5), 16)}, ${parseInt(currentColor.slice(5, 7), 16)}, 0) 0%, ${currentColor} 100%),
    repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 8px 8px
  `;

  return (
    <div
      className="flex flex-col gap-4 p-4 w-[264px] h-[236px] bg-[var(--color-picker-bg)] rounded-lg shadow-[0px_10px_15px_0px_#1F29371A,0px_4px_6px_0px_#1F29370D]"
      onMouseDown={stopPropagation}
      onPointerDown={stopPropagation}
      onClick={stopPropagation}
    >
      <div className="color-picker-wrapper">
        <HexColorPicker
          color={currentColor}
          onChange={handleColorChange}
          style={{ width: "232px" }}
        />
      </div>

      <div
        ref={opacitySliderRef}
        className="relative w-[232px] h-2 rounded-full cursor-pointer"
        style={{ background: opacitySliderBg }}
        onMouseDown={handleOpacityMouseDown}
      >
        <div
          className="absolute top-0 w-2 h-2 rounded-full border-2 border-white shadow-[0px_2px_4px_rgba(31,41,55,0.06),0px_4px_6px_rgba(31,41,55,0.1)] -translate-x-1/2 pointer-events-none"
          style={{ left: `${opacity}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Image
          src="/svg/picker.svg"
          alt="Color Picker"
          width={14}
          height={14}
          className="flex-shrink-0"
        />
        <div
          ref={brightnessSliderRef}
          className="relative flex-1 h-2 rounded-full cursor-pointer bg-gradient-to-r from-white to-black"
          onMouseDown={handleBrightnessMouseDown}
        >
          <div
            className="absolute top-0 w-2 h-2 rounded-full border-2 border-white shadow-[0px_2px_4px_rgba(31,41,55,0.06),0px_4px_6px_rgba(31,41,55,0.1)] -translate-x-1/2 pointer-events-none"
            style={{ left: `${100 - brightness}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center justify-between px-1.5 py-1 gap-1 w-[69px] h-7 bg-[var(--color-picker-input-bg)] border border-[var(--color-picker-border)] rounded shadow-[0px_1px_2px_rgba(31,41,55,0.08)]">
          <span className="font-inter text-sm leading-5 text-[var(--color-picker-text)]">
            Hex
          </span>
          <div className="flex flex-col gap-0.5">
            <Image
              src="/svg/increment.svg"
              alt="Increment"
              width={9}
              height={5}
              className="cursor-pointer"
            />
            <Image
              src="/svg/decrement.svg"
              alt="Decrement"
              width={9}
              height={5}
              className="cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center px-1.5 py-1 flex-1 h-7 bg-[var(--color-picker-input-bg)] border border-[var(--color-picker-border)] rounded shadow-[0px_1px_2px_rgba(31,41,55,0.08)]">
          <span className="font-inter text-sm leading-5 text-[var(--color-picker-text-muted)]">
            #
          </span>
          <input
            type="text"
            value={hexInput}
            onChange={handleHexInputChange}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            maxLength={6}
            className="w-full bg-transparent outline-none cursor-text font-inter text-sm leading-5 text-[var(--color-picker-text)]"
          />
        </div>

        <div className="flex items-center justify-between px-1.5 py-1 w-[61px] h-7 bg-[var(--color-picker-input-bg)] border border-[var(--color-picker-border)] rounded shadow-[0px_1px_2px_rgba(31,41,55,0.08)]">
          <input
            type="text"
            value={`${opacity}%`}
            onChange={handleOpacityInputChange}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            className="w-full bg-transparent outline-none cursor-text font-inter text-sm leading-5 text-[var(--color-picker-text)]"
          />
        </div>
      </div>

      <style jsx global>{`
        .color-picker-wrapper .react-colorful {
          width: 232px !important;
          height: auto !important;
          gap: 16px;
        }
        .color-picker-wrapper .react-colorful__saturation {
          border-radius: 4px;
          height: 97px !important;
        }
        .color-picker-wrapper .react-colorful__hue {
          display: none !important;
        }
        .color-picker-wrapper .react-colorful__saturation-pointer {
          width: 12px;
          height: 12px;
          border: 2px solid white;
          box-shadow: 0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(31, 41, 55, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ColorPicker;
