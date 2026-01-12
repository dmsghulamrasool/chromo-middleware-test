"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../../../ui/button";
import ColorPicker from "../color-tools/color-picker";

interface PaletteActionBarProps {
  sidebarIcons: Array<{
    Icon: string;
    label: string;
  }>;
  currentColor: string;
  onColorChange?: (color: string, opacity: number) => void;
  onVersionModalClick?: () => void;
  onAdjustPanelClick?: () => void;
}

const PaletteActionBar: React.FC<PaletteActionBarProps> = ({
  sidebarIcons,
  currentColor,
  onColorChange,
  onVersionModalClick,
  onAdjustPanelClick,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleColorChange = (color: string, opacity: number) => {
    onColorChange?.(color, opacity);
  };

  return (
    <div
      className={`absolute left-3 top-3 flex flex-col gap-3 transition-opacity duration-300 ${
        isPickerOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
    >
      {sidebarIcons.map(({ Icon, label }, iconIndex) => {
        if (iconIndex === 3) {
          return (
            <DropdownMenu
              key={iconIndex}
              open={isPickerOpen}
              onOpenChange={setIsPickerOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="p-0 h-auto w-auto hover:bg-transparent cursor-pointer"
                  title={label}
                >
                  <Image
                    src={Icon}
                    alt=""
                    width={400}
                    height={400}
                    className="w-3.5 h-3.5 mx-auto"
                  />
                </Button>
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
          <PalleteIcon
            iconIndex={iconIndex}
            key={iconIndex}
            label={label}
            Icon={Icon}
            onVersionModalClick={onVersionModalClick}
            onAdjustPanelClick={onAdjustPanelClick}
          />
        );
      })}
    </div>
  );
};

export default PaletteActionBar;

interface PaletteInterface {
  onVersionModalClick?: () => void;
  onAdjustPanelClick?: () => void;
  iconIndex: number;
  label: string;
  Icon: string;
}

const PalleteIcon = ({
  onVersionModalClick,
  onAdjustPanelClick,
  iconIndex,
  label,
  Icon,
}: PaletteInterface) => {
  const handleOnClickIcon = () => {
    if (iconIndex === 2) {
      onAdjustPanelClick?.();
    }
    if (iconIndex === 5) {
      onVersionModalClick?.();
    }
  };

  return (
    <Button
      key={iconIndex}
      variant="ghost"
      size="icon-sm"
      className="p-0 h-auto w-auto hover:bg-transparent cursor-pointer"
      title={label}
      onClick={handleOnClickIcon}
    >
      <Image
        src={Icon}
        alt=""
        width={400}
        height={400}
        className="w-3.5 h-3.5 mx-auto"
      />
    </Button>
  );
};
