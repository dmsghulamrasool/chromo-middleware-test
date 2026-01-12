"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ColorPicker from "./color-picker";

interface PaletteActionBarProps {
  sidebarIcons: Array<{
    Icon: string;
    label: string;
  }>;
  currentColor: string;
  onColorChange?: (color: string, opacity: number) => void;
}

const PaletteActionBar: React.FC<PaletteActionBarProps> = ({
  sidebarIcons,
  currentColor,
  onColorChange,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleColorChange = (color: string, opacity: number) => {
    onColorChange?.(color, opacity);
  };

  return (
    <div className={`absolute left-3 top-3 flex flex-col gap-3 transition-opacity duration-300 ${isPickerOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      {sidebarIcons.map(({ Icon, label }, iconIndex) => {
        // 4th icon (index 3) is the Edit/Color Picker trigger
        if (iconIndex === 3) {
          return (
            <DropdownMenu
              key={iconIndex}
              open={isPickerOpen}
              onOpenChange={setIsPickerOpen}
            >
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer" title={label}>
                  <Image
                    src={Icon}
                    alt=""
                    width={400}
                    height={400}
                    className="w-3.5 h-3.5 mx-auto"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="p-0 border-none bg-transparent shadow-none"
              >
                <ColorPicker
                  color={currentColor}
                  onColorChange={handleColorChange}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <button
            key={iconIndex}
            className="cursor-pointer"
            title={label}
          >
            <Image
              src={Icon}
              alt=""
              width={400}
              height={400}
              className="w-3.5 h-3.5 mx-auto"
            />
          </button>
        );
      })}
    </div>
  );
};

export default PaletteActionBar;
