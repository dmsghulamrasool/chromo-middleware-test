"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PaletteActionBar from "./palette-action-bar";
import AddColor from "./add-color";

interface ColorItem {
  hex: string;
  name: string;
  role: string;
  opacity?: number;
  localId: string;
}

interface DraggableColorSwatchProps {
  color: ColorItem;
  index: number;
  sidebarIcons: Array<{
    Icon: string;
    label: string;
  }>;
  onAddColor: (afterIndex: number) => void;
  onColorChange?: (index: number, color: string, opacity: number) => void;
  isLast?: boolean;
  hideAddButton?: boolean;
}

const DraggableColorSwatchComponent: React.FC<DraggableColorSwatchProps> = ({
  color,
  index,
  sidebarIcons,
  onAddColor,
  onColorChange,
  isLast = false,
  hideAddButton = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: color.localId,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : undefined,
    willChange: "transform",
    touchAction: "none",
  };

  const handleAddRight = () => {
    onAddColor(index);
  };

  const handleColorChange = (newColor: string, opacity: number) => {
    onColorChange?.(index, newColor, opacity);
  };

  return (
    <div className="flex-1 relative group select-none hover:z-20">
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: color.hex,
          opacity: color.opacity !== undefined ? color.opacity / 100 : 1,
          height: "332px",
        }}
        className="relative"
      >
        <div {...attributes} {...listeners}>
          <PaletteActionBar
            sidebarIcons={sidebarIcons}
            currentColor={color.hex}
            onColorChange={handleColorChange}
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-white text-[20px] font-normal leading-normal">
            {color.hex}
          </p>
          <p className="text-white text-[16px] font-normal leading-normal">
            {color.role}
          </p>
        </div>
      </div>

      {!hideAddButton && !isLast && (
        <AddColor position="right" onAddColor={handleAddRight} />
      )}
    </div>
  );
};

const DraggableColorSwatch = React.memo(DraggableColorSwatchComponent);
DraggableColorSwatch.displayName = "DraggableColorSwatch";

export default DraggableColorSwatch;
