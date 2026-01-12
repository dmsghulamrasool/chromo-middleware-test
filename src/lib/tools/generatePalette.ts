import { tool } from "ai";
import { date, z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";

export const generatePaletteTool = tool({
  description: 'Generate and store a versioned color palette',
  inputSchema: z.object({
    palette_code: z.string().describe('Unique palette code in format: CK-{EMOTION}-{COLOR_NAME}-{REGION}-{CONTEXT}-V{VERSION}'),
    colors: z.array(
      z.object({
        name: z.string(),
        hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        role: z.enum(['primary', 'secondary', 'accent', 'background', 'error']),
      })
    ),
  }),
  execute: async ({ palette_code, colors }, { experimental_context }) => {
    const { projectId } = experimental_context as { projectId: string }
    const supabase = await supabaseServer()
    // Fetch latest version
    const { data: latest, error } = await supabase
      .from("palettes")
      .select("version")
      .eq("project_id", projectId)
      .order("version", { ascending: false })
      .limit(1)
      .single();

    console.log({ error })

    if (error && error.code !== "PGRST116") throw error;

    const nextVersion = (latest?.version ?? 0) + 1;

    // Update palette_code with correct version number
    const updatedPaletteCode = palette_code.replace(/V\d+$/, `V${nextVersion}`);

    // Insert new version
    const { error: insertError } = await supabase
      .from("palettes")
      .insert({
        project_id: projectId,
        version: nextVersion,
        palette_code: updatedPaletteCode,
        colors,
      })
      .select()
      .single();

    console.log({ insertError })

    if (insertError) throw insertError;

    // Save tool result as message with descriptive content
    const colorDetails = colors.map(c => `${c.name} (${c.hex}) - ${c.role}`).join(', ');
    const toolResultMessage = `Generated palette ${updatedPaletteCode} (version ${nextVersion}) with ${colors.length} colors: ${colorDetails}`;
    const { error: messageError } = await supabase.from("messages").insert({
      project_id: projectId,
      role: "tool-response",
      content: toolResultMessage,
    });

    if (messageError) throw messageError;

    return {
      projectId,
      version: nextVersion,
      palette_code: updatedPaletteCode,
      colors,
    };
  },
});
