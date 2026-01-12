"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import supabase from "@/lib/supabase-client";
import DraggableColorSwatch from "./components/draggable-color-swatch";
import AdjustPalettePanel, {
  ColorAdjustments,
} from "./color-tools/adjust-palette-panel";
import VersionLabelingModal from "../version-labeling-modal";
import QuickView from "./components/quick-view";
import ExportPalette from "./components/export-palette";
import { hexToHsv, hsvToHex } from "@/helpers/colorConversion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

interface ColorItem {
  hex: string;
  name: string;
  role: string;
  opacity?: number;
  localId: string;
}

interface PaletteData {
  id: string;
  colors: ColorItem[];
}

interface Palette {
  id: string;
  project_id: string;
  version: number;
  colors: ColorItem[];
  created_at: string;
  is_favourite: number;
}

interface ColorPaletteUIProps {
  id: string;
}

const MainContainer: React.FC<ColorPaletteUIProps> = ({ id }) => {
  const genId = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const [colors, setColors] = useState<PaletteData>({
    id: "",
    colors: [
      { hex: "#EA7AF4", name: "Primary", role: "primary", localId: genId() },
      { hex: "#B43E8F", name: "Secondary", role: "secondary", localId: genId() },
      { hex: "#6200B3", name: "Surface", role: "surface", localId: genId() },
      {
        hex: "#3B0086",
        name: "Background",
        role: "background",
        localId: genId(),
      },
      { hex: "#290628", name: "Error", role: "error", localId: genId() },
    ],
  });
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdjustPanelOpen, setIsAdjustPanelOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isExportPaletteOpen, setIsExportPaletteOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [adjustingColorIndex, setAdjustingColorIndex] = useState<number | null>(
    null
  );
  const [loadingColorIndex, setLoadingColorIndex] = useState<number | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchAllPalettes = async () => {
      const { data, error } = await supabase
        .from("palettes")
        .select("*")
        .eq("project_id", id)
        .order("version", { ascending: false });

      if (!error && data && data.length > 0) {
        setPalettes(data);
        setCurrentIndex(0);
        const withIds = data[0].colors.map((c: any) => ({
          ...c,
          localId: genId(),
        }));
        setColors({ id: data[0].id, colors: withIds });
        setIsFavorite(data[0].is_favourite === 1);
      }
    };
    if (!id) return;
    fetchAllPalettes();

    const channel = supabase
      .channel(`palettes:${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "palettes",
          filter: `project_id=eq.${id}`,
        },
        (payload) => {
          fetchAllPalettes();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        }
      });

    return () => {
      supabase.removeChannel(channel);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [id]);
  const currentPalette = palettes[currentIndex] || null;

  const goToPrevious = () => {
    if (currentIndex < palettes.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setColors({
        id: palettes[newIndex].id,
        colors: palettes[newIndex].colors.map((c: any) => ({ ...c, localId: genId() }))
      });
      setIsFavorite(palettes[newIndex].is_favourite === 1);
    }
  };

  const goToNext = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setColors({
        id: palettes[newIndex].id,
        colors: palettes[newIndex].colors.map((c: any) => ({ ...c, localId: genId() }))
      });
      setIsFavorite(palettes[newIndex].is_favourite === 1);
    }
  };

  const toggleFavorite = async () => {
    if (!currentPalette) return;

    const newFavoriteValue = isFavorite ? 0 : 1;
    setIsFavorite(!isFavorite);

    const { error } = await supabase
      .from("palettes")
      .update({ is_favourite: newFavoriteValue })
      .eq("id", currentPalette.id);

    if (error) {
      console.error("Error updating favorite:", error);
      setIsFavorite(isFavorite);
    } else {
      setPalettes((prev) =>
        prev.map((p) =>
          p.id === currentPalette.id
            ? { ...p, is_favourite: newFavoriteValue }
            : p
        )
      );
    }
  };

  const addColor = async (afterIndex: number) => {
    if (colors.colors.length >= 10) return;

    const leftColor = colors.colors[afterIndex];
    const rightColor = colors.colors[afterIndex + 1];

    setLoadingColorIndex(afterIndex);

    try {
      const response = await fetch("/api/add-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leftColor: { hex: leftColor.hex, name: leftColor.name },
          rightColor: rightColor ? { hex: rightColor.hex, name: rightColor.name } : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate color");

      const newColorData = await response.json();
      console.log(newColorData);
      const newColor: ColorItem = {
        ...newColorData,
        localId: genId(),
      };

      const newColorsList = [...colors.colors];
      newColorsList.splice(afterIndex + 1, 0, newColor);
      setColors({ ...colors, colors: newColorsList });

      await updatePaletteColor(newColorsList);
      toast.success("Color added successfully");
    } catch (error) {
      toast.error("Failed to add color");
      console.error(error);
    } finally {
      setLoadingColorIndex(null);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = colors.colors.findIndex((c) => c.localId === active.id);
      const newIndex = colors.colors.findIndex((c) => c.localId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newColorsList = arrayMove(colors.colors, oldIndex, newIndex);
        setColors({ ...colors, colors: newColorsList });
        debouncedUpdatePalette(newColorsList);
      }
    }
  };

  const updateColor = (index: number, newHex: string, newOpacity: number) => {
    const updatedColors = colors.colors.map((color, i) =>
      i === index ? { ...color, hex: newHex, opacity: newOpacity } : color
    );
    setColors({ ...colors, colors: updatedColors });
    debouncedUpdatePalette(updatedColors);
  };

  const handleApplyAdjustments = (adjustments: ColorAdjustments) => {
    if (adjustingColorIndex === null) return;
    const adjustedColors = colors.colors.map((color, index) => {
      if (index !== adjustingColorIndex && adjustingColorIndex !== null)
        return color;
      const hsv = hexToHsv(color.hex);

      let newV = hsv.v + adjustments.brightness;
      newV = Math.max(0, Math.min(100, newV));

      let newS = hsv.s + adjustments.saturation;
      newS = Math.max(0, Math.min(100, newS));

      let newH = hsv.h + adjustments.hue;

      const tempShift = adjustments.temperature * 0.6;
      newH = newH + tempShift;

      newH = ((newH % 360) + 360) % 360;

      const newHex = hsvToHex(newH, newS, newV);

      return { ...color, hex: newHex };
    });

    updatePaletteColor(adjustedColors);

    setIsAdjustPanelOpen(false);
    setAdjustingColorIndex(null);
  };
  const [showForeground, setShowForeground] = useState(false);

  const updatePaletteColor = async (updatedColors: ColorItem[]) => {
    if (!colors.id) return;
    try {
      const response = await fetch("/api/update-palette", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: colors.id,
          colors: updatedColors,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update palette");
      }
      await response.json();
    } catch (error) {
      toast.error("Failed to update palette");
    }
  };

  const debouncedUpdatePalette = (updatedColors: ColorItem[]) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      updatePaletteColor(updatedColors);
    }, 2000);
  };

  const handleToggleForeground = () => {
    setShowForeground(!showForeground);
  };

  const handleOpenAdjustPanel = (colorIndex: number) => {
    setAdjustingColorIndex(colorIndex ?? null);
    setIsAdjustPanelOpen(true);
  };

  const handleCloseAdjustPanel = () => {
    setIsAdjustPanelOpen(false);
    setAdjustingColorIndex(null);
  };

  const handleOpenQuickView = () => {
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const handleOpenExportPalette = () => {
    setIsExportPaletteOpen(true);
  };

  const handleCloseExportPalette = () => {
    setIsExportPaletteOpen(false);
  };

  const handlecloseVersionLabelingModal = () => {
    setIsVersionModalOpen(false);
  };

  const handleopenVersionLabelingModal = () => {
    setIsVersionModalOpen(true);
  };

  const sidebarIcons = [
    { Icon: "/svg/drag.svg", label: "Grid" },
    { Icon: "/svg/circle-color.svg", label: "Circle" },
    { Icon: "/svg/test-tube.svg", label: "Droplet" },
    { Icon: "/svg/edit.svg", label: "Edit" },
    { Icon: "/svg/filter-white.svg", label: "Share" },
    { Icon: "/svg/bookmark.svg", label: "Bookmark" },
    { Icon: "/svg/copy.svg", label: "Copy" },
    { Icon: "/svg/lock.svg", label: "Lock" },
    { Icon: "/svg/delete-white.svg", label: "Delete" },
  ];

  const v1First = [
    { Icon: "/svg/eye-circle.svg", label: "Accessibility" },
    { Icon: "/svg/reasoning.svg", label: "Reasoning" },
    { Icon: "/svg/luma.svg", label: "Luma" },
  ];

  const v1Second = [
    { Icon: "/svg/eye.svg", label: "View" },
    { Icon: "/svg/share.svg", label: "Export" },
    { Icon: "/svg/screen.svg", label: "Palettes" },
  ];

  return (
    <div className="flex-1 py-2.5 px-3 bg-(--background-surface-secondary)">
      <div
        className="flex flex-col w-full h-[calc(100vh-20px)] bg-(--surface-primary) rounded-2xl shadow-lg animate-slide-from-bottom overflow-visible"
        style={{
          border: "1px solid var(--dairy-cream)",
          boxShadow: "3px 4px 6.8px 0 var(--dairy-cream-2)",
        }}
      >
        <div className="p-6 pt-6.5 pb-3.25 border-b border-(--line)">
          <div className="flex flex-wrap items-center justify-between animate-fade-in-delayed">
            <div className="flex items-center gap-6 text-black">
              <h1 className="text-(--main-color)  text-[18px] font-semibold leading-normal">
                V{currentPalette?.version || 1}
              </h1>
              <div className="flex items-center flex-wrap gap-4 text-sm">
                <button className="flex items-center gap-2 text-(--slider-list-2) text-[16px] font-normal leading-normal">
                  ADA Compliance
                </button>
                {v1First?.map((v1, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-(--slider-list) text-[16px] font-normal leading-normal"
                    >
                      <Image
                        src={v1?.Icon}
                        alt=""
                        width={400}
                        height={400}
                        className="w-3.5 h-3.5 mx-auto"
                      />
                      {v1?.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {v1Second?.map((v1, index) => {
                if (v1.label === "View") {
                  return (
                    <button
                      key={index}
                      onClick={handleOpenQuickView}
                      className="flex items-center gap-2.5 text-(--slider-list-2) text-[16px] font-normal leading-normal cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <Image
                        src={v1?.Icon}
                        alt="View"
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      {v1?.label}
                    </button>
                  );
                }
                if (v1.label === "Export") {
                  return (
                    <button
                      key={index}
                      onClick={handleOpenExportPalette}
                      className="flex items-center gap-2.5 text-(--slider-list-2) text-[16px] font-normal leading-normal cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <Image
                        src={v1?.Icon}
                        alt="Export"
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      {v1?.label}
                    </button>
                  );
                }
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 text-(--slider-list-2)  text-[16px] font-normal leading-normal"
                  >
                    <Image
                      src={v1?.Icon}
                      alt=""
                      width={400}
                      height={400}
                      className="w-5 h-4 mx-auto"
                    />
                    {v1?.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative flex-1 overflow-visible">
          <div className="p-8 h-full w-full flex justify-center items-end flex-wrap animate-fade-in-delayed overflow-auto">
            <div
              className="bg-(--surface-primary) rounded-lg overflow-hidden w-full"
              style={{
                border: "1px solid #EBEBEB",
                boxShadow: "1px 4px 15.6px 0 rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="pt-4.5 px-7.5 pb-2.75 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 ">
                  <span className="text-(--grey-9)  text-[18px] font-medium leading-normal">
                    Version {currentPalette?.version || 1}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-(--grey-8)" />

                  <span className="text-(--grey-8)  text-[16px] font-medium leading-normal">
                    {colors.colors.length} colors
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-(--grey-8)" />

                  <span className="text-(--grey-8)  text-[16px] font-medium leading-normal">
                    {currentPalette?.created_at
                      ? new Date(currentPalette.created_at).toLocaleDateString()
                      : "12/4/2025"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={toggleFavorite} className="cursor-pointer">
                    <Image
                      src={
                        isFavorite ? "/svg/filled-star.svg" : "/svg/star.svg"
                      }
                      alt="Favorite"
                      width={400}
                      height={400}
                      className="w-3.5 h-3.5 mx-auto"
                    />
                  </button>
                  <Image
                    src={"/svg/filter.svg"}
                    alt=""
                    width={400}
                    height={400}
                    className="w-3.5 h-3.5 mx-auto"
                  />
                  <div className="flex">
                    <button
                      onClick={goToPrevious}
                      disabled={currentIndex >= palettes.length - 1}
                      className="flex flex-col w-6 h-7 p-1 justify-center items-center gap-2.5 border border-[#E7E7E7] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/svg/undo.svg"
                        alt="Previous version"
                        width={400}
                        height={400}
                        className="w-3.5 h-3.5 mx-auto"
                      />
                    </button>

                    <button
                      onClick={goToNext}
                      disabled={currentIndex === 0}
                      className="flex flex-col w-6 h-7 p-1 justify-center items-center gap-2.5 border border-[#E7E7E7] bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Image
                        src="/svg/undo.svg"
                        alt="Next version"
                        width={400}
                        height={400}
                        className="w-3.5 h-3.5 mx-auto scale-x-[-1]"
                      />
                    </button>
                  </div>
                  <div className="p-2">
                    <Image
                      src={"/svg/menu.svg"}
                      alt=""
                      width={400}
                      height={400}
                      className="w-3.5 h-3.5  mx-auto"
                    />
                  </div>
                </div>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="flex px-7.5">
                  <SortableContext
                    items={colors.colors.map((c) => c.localId)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {colors.colors.map((color, index) => (
                      <React.Fragment key={color.localId}>
                        <DraggableColorSwatch
                          color={color}
                          index={index}
                          sidebarIcons={sidebarIcons}
                          onAddColor={addColor}
                          onColorChange={updateColor}
                          onVersionModalClick={handleopenVersionLabelingModal}
                          onAdjustPanelClick={handleOpenAdjustPanel}
                          isLast={index === colors.colors.length - 1}
                          hideAddButton={colors.colors.length >= 10}
                        />
                        {loadingColorIndex === index && (
                          <div className="relative w-[180px] shrink-0 animate-pulse">
                            <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                <span className="text-xs text-gray-500">Generating...</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </SortableContext>
                </div>
              </DndContext>

              {/* Footer */}
              <div className="px-7.5 py-4">
                <div
                  className="flex items-center gap-3.5 text-(--grey-7) text-[16px] font-medium leading-normal"
                  onClick={handleToggleForeground}
                >
                  Show Foreground Colors
                  <svg
                    className={`w-4 h-4 transition-transform text-black ${showForeground ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <AdjustPalettePanel
            isOpen={isAdjustPanelOpen}
            onClose={handleCloseAdjustPanel}
            onApply={handleApplyAdjustments}
          />
        </div>
      </div>

      <QuickView
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        colors={colors.colors}
      />

      <ExportPalette
        isOpen={isExportPaletteOpen}
        onClose={handleCloseExportPalette}
        colors={colors.colors}
      />

      <VersionLabelingModal
        isOpen={isVersionModalOpen}
        onClose={handlecloseVersionLabelingModal}
      />
    </div>
  );
};

export default MainContainer;
