import { tool } from "ai";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";

export const addColorTool = tool({
    description: 'Generate a harmonized color between two existing colors. Analyze the left and right colors and create a new color that creates a smooth visual progression.',
    inputSchema: z.object({
        leftColor: z.object({
            hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            name: z.string(),
        }),
        rightColor: z.object({
            hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            name: z.string(),
        }),
        newColor: z.object({
            hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            name: z.string(),
            role: z.string(),
        }),
    }),
    execute: async ({ newColor }, { experimental_context }) => {
        const { palleteId, afterIndex } = experimental_context as { palleteId: string, afterIndex: number };
        const supabase = await supabaseServer();

        const { data: palette, error } = await supabase
            .from("palettes")
            .select("*")
            .eq("id", palleteId)
            .single();

        if (error || !palette) {
            throw new Error("Failed to fetch palette");
        }

        const colors = [...palette.colors];
        colors.splice(afterIndex + 1, 0, newColor);

        const { error: updateError } = await supabase
            .from("palettes")
            .update({ colors })
            .eq("id", palleteId);

        if (updateError) {
            throw new Error("Failed to update palette");
        }

        return {
            hex: newColor.hex,
            name: newColor.name,
            role: newColor.role,
        };
    },
});
