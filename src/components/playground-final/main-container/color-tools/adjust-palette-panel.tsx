"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";


export interface ColorAdjustments {
  brightness: number;
  saturation: number;
  hue: number;
  temperature: number;
}

interface AdjustPalettePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (adjustments: ColorAdjustments) => void;
}

const AdjustPalettePanel: React.FC<AdjustPalettePanelProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [brightness, setBrightness] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [hue, setHue] = useState(0);
  const [temperature, setTemperature] = useState(0);

  const brightnessSliderRef = useRef<HTMLDivElement>(null);
  const saturationSliderRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const temperatureSliderRef = useRef<HTMLDivElement>(null);

  const isDraggingBrightness = useRef(false);
  const isDraggingSaturation = useRef(false);
  const isDraggingHue = useRef(false);
  const isDraggingTemperature = useRef(false);

  const updateBrightnessFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!brightnessSliderRef.current) return;
      const rect = brightnessSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newBrightness = Math.round((x / rect.width - 0.5) * 100);
      setBrightness(newBrightness);
    },
    []
  );

  const updateSaturationFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!saturationSliderRef.current) return;
      const rect = saturationSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newSaturation = Math.round((x / rect.width - 0.5) * 100);
      setSaturation(newSaturation);
    },
    []
  );

  const updateHueFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHue = Math.round((x / rect.width - 0.5) * 360);
    setHue(newHue);
  }, []);

  const updateTemperatureFromEvent = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!temperatureSliderRef.current) return;
      const rect = temperatureSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newTemperature = Math.round((x / rect.width - 0.5) * 100);
      setTemperature(newTemperature);
    },
    []
  );

  const handleBrightnessMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingBrightness.current = true;
    updateBrightnessFromEvent(e);
  };

  const handleSaturationMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingSaturation.current = true;
    updateSaturationFromEvent(e);
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingHue.current = true;
    updateHueFromEvent(e);
  };

  const handleTemperatureMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingTemperature.current = true;
    updateTemperatureFromEvent(e);
  };

  const handleCancel = () => {
    setBrightness(0);
    setSaturation(0);
    setHue(0);
    setTemperature(0);
    onClose();
  };

  const handleApply = () => {
    onApply({ brightness, saturation, hue, temperature });
    setBrightness(0);
    setSaturation(0);
    setHue(0);
    setTemperature(0);
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingBrightness.current) {
        updateBrightnessFromEvent(e);
      }
      if (isDraggingSaturation.current) {
        updateSaturationFromEvent(e);
      }
      if (isDraggingHue.current) {
        updateHueFromEvent(e);
      }
      if (isDraggingTemperature.current) {
        updateTemperatureFromEvent(e);
      }
    };

    const handleMouseUp = () => {
      isDraggingBrightness.current = false;
      isDraggingSaturation.current = false;
      isDraggingHue.current = false;
      isDraggingTemperature.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    updateBrightnessFromEvent,
    updateSaturationFromEvent,
    updateHueFromEvent,
    updateTemperatureFromEvent,
  ]);
  const brightnessPosition = ((brightness + 50) / 100) * 100;
  const saturationPosition = ((saturation + 50) / 100) * 100;
  const huePosition = ((hue + 180) / 360) * 100;
  const temperaturePosition = ((temperature + 50) / 100) * 100;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="absolute right-0 h-full w-[320px] z-50 flex flex-col transition-transform duration-300 ease-in-out bg-(--porcelain-1) shadow-lg rounded-br-none overflow-visible"
        style={{
          top: 0,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
      <div className="flex items-center justify-center gap-2.5 py-[11px] border-b border-gray-200">
        <Image
          src="/svg/adjust.svg"
          alt="Adjust"
          width={14}
          height={12}
          className="flex-shrink-0"
        />
        <h2 className="text-lg font-medium text-[var(--main-color)]">
          Adjust Palette
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-inter text-sm font-medium text-[var(--main-color)]">
                Hue
              </label>
              <span
                className="font-inter text-sm text-[var(--grey-8)] px-3 py-1 rounded"
                style={{
                  border: "1px solid var(--Stroke-Border-1, #EBD4A6)",
                  background: "var(--Background-Surface-Secodary, #E9E4D8)",
                }}
              >
                {hue > 0 ? "+" : ""}
                {hue}
              </span>
            </div>
            <div
              ref={hueSliderRef}
              className="relative h-2 rounded-full cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              onMouseDown={handleHueMouseDown}
            >
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-400 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${huePosition}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-inter text-sm font-medium text-[var(--main-color)]">
                Saturation
              </label>
              <span
                className="font-inter text-sm text-[var(--grey-8)] px-3 py-1 rounded"
                style={{
                  border: "1px solid var(--Stroke-Border-1, #EBD4A6)",
                  background: "var(--Background-Surface-Secodary, #E9E4D8)",
                }}
              >
                {saturation > 0 ? "+" : ""}
                {saturation}
              </span>
            </div>
            <div
              ref={saturationSliderRef}
              className="relative h-2 rounded-full cursor-pointer bg-gradient-to-r from-gray-400 to-red-500"
              onMouseDown={handleSaturationMouseDown}
            >
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-400 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${saturationPosition}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-inter text-sm font-medium text-[var(--main-color)]">
                Brightness
              </label>
              <span
                className="font-inter text-sm text-[var(--grey-8)] px-3 py-1 rounded"
                style={{
                  border: "1px solid var(--Stroke-Border-1, #EBD4A6)",
                  background: "var(--Background-Surface-Secodary, #E9E4D8)",
                }}
              >
                {brightness > 0 ? "+" : ""}
                {brightness}
              </span>
            </div>
            <div
              ref={brightnessSliderRef}
              className="relative h-2 rounded-full cursor-pointer bg-gradient-to-r from-black via-gray-500 to-white"
              onMouseDown={handleBrightnessMouseDown}
            >
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-400 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${brightnessPosition}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-inter text-sm font-medium text-[var(--main-color)]">
                Temperature
              </label>
              <span
                className="font-inter text-sm text-[var(--grey-8)] px-3 py-1 rounded"
                style={{
                  border: "1px solid var(--Stroke-Border-1, #EBD4A6)",
                  background: "var(--Background-Surface-Secodary, #E9E4D8)",
                }}
              >
                {temperature > 0 ? "+" : ""}
                {temperature}
              </span>
            </div>
            <div
              ref={temperatureSliderRef}
              className="relative h-2 rounded-full cursor-pointer bg-gradient-to-r from-blue-400 via-gray-200 to-orange-400"
              onMouseDown={handleTemperatureMouseDown}
            >
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-400 shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${temperaturePosition}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-2 py-9 pl-4.75 pr-2.5 mt-auto border-t border-gray-200 shadow-effect">
        <Button
          variant="cancel"
          size="action"
          onClick={handleCancel}
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant="apply"
          size="action"
          onClick={handleApply}
          className="flex-1 cursor-pointer"
        >
          Apply
        </Button>
      </div>
    </div>
    </>
  );
};

export default AdjustPalettePanel;
