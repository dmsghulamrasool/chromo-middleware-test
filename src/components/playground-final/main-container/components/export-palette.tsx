"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModalWithHeader from "@/components/ui/modal-with-header";
import ColorPaletteStrip from "@/components/ui/color-palette-strip";

interface ColorItem {
  hex: string;
  name: string;
  role: string;
  opacity?: number;
  localId: string;
}

interface ExportPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  colors: ColorItem[];
}

const ExportPalette: React.FC<ExportPaletteProps> = ({
  isOpen,
  onClose,
  colors,
}) => {
  const colorFormats = [
    { id: 'hex', label: 'HEX' },
    { id: 'svg', label: 'SVG' },
    { id: 'cmyk', label: 'CMYK' },
    { id: 'pantone', label: 'Pantone' },
  ];

  const exportDestinations = [
    { id: 'figma', label: 'Figma', icon: '/svg/figma.svg' },
    { id: 'adobe', label: 'Adobe', icon: '/svg/adobe.svg' },
    { id: 'canva', label: 'Canva', icon: '/svg/canva.svg' },
  ];

  return (
    <ModalWithHeader
      isOpen={isOpen}
      onClose={onClose}
      title="Export Palette"
      titleIcon="/svg/export-pallet.svg"
      width="w-[852px]"
    >
      <div className="flex items-center justify-center gap-[17.75px] pt-1.25 pb-5 cursor-pointer">
        <span className="font-inter font-normal text-base leading-4.75 text-[#414141]">
          Version 1
        </span>
        <Image
          src="/svg/down-arrow.svg"
          alt="dropdown"
          width={12}
          height={7}
        />
      </div>
      <div className="pt-7.25 px-12.75 pr-13.75 pb-11 border-t border-export-palette-border">
          <div className="flex flex-col gap-2">
            <div className="flex-none order-0 self-stretch font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
              Color Format
            </div>

            <div className="flex gap-4.25">
              {colorFormats.map((format) => (
                <div
                  key={format.id}
                  className="flex-1 py-[27.5px] px-[57.5px] cursor-pointer hover:opacity-80 transition-opacity border border-solid border-export-box-border rounded-lg text-center bg-(--surface-primary)"
                >
                  <span className="font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
                    {format.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        <div className="flex flex-col gap-2 pt-12.5">
          <div className="flex-none order-0 self-stretch font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
            Export to
          </div>

          <div className="flex gap-4.25">
            {exportDestinations.map((destination) => (
              <div
                key={destination.id}
                className="flex-1 py-[27.5px] px-[57.5px] cursor-pointer hover:opacity-80 transition-opacity border border-solid border-export-box-border rounded-lg flex items-center justify-center gap-2 bg-(--surface-primary)"
              >
                <Image
                  src={destination.icon}
                  alt={destination.label}
                  width={32}
                  height={32}
                />
                <span className="font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
                  {destination.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-9.75">
          <div className="flex-none order-0 self-stretch pb-2 font-inter font-medium text-xl leading-[132%] text-(--slider-list-2)">
            Preview
          </div>

          <div className="pb-2 font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
            Background
          </div>
          <ColorPaletteStrip
            colors={colors}
            className=""
            stripClassName="flex w-full h-16 rounded-lg overflow-hidden"
            colorClassName="flex-1 h-full relative transition-all rounded-none first:rounded-l-lg last:rounded-r-lg"
          />

          <div className="pt-3.75 pb-2 font-inter font-normal text-base leading-4.75 text-(--slider-list-2)">
            Foreground
          </div>
          <ColorPaletteStrip
            colors={colors}
            className=""
            stripClassName="flex w-full h-16 rounded-lg overflow-hidden"
            colorClassName="flex-1 h-full relative transition-all rounded-none first:rounded-l-lg last:rounded-r-lg"
          />
        </div>

        <div className="flex gap-2 pt-14">
          <Button
            variant="outline"
            className="flex-1 h-11.5 px-4 py-2 gap-2.25 border border-export-button-border rounded-lg font-inter font-normal text-base leading-4.75 text-(--slider-list-2) cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-11.5 px-4 py-2 gap-2.25 rounded-lg font-inter font-normal text-base leading-4.75 cursor-pointer"
          >
            <Image src="/svg/copy.svg" alt="Copy" width={16} height={16} />
            Copy to Clipboard
          </Button>
        </div>
      </div>
    </ModalWithHeader>
  );
};

export default ExportPalette;
