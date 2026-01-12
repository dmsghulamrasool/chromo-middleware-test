import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { supabaseServer } from "@/lib/supabase-server";
import { ADD_COLOR_PROMPT } from "@/constants/prompts";
import { env } from "@/env";

export async function POST(req: Request) {
    const supabase = await supabaseServer();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return new Response("Unauthorized", { status: 401 });

    const { leftColor, rightColor } = await req.json();

    if (!leftColor?.hex || !leftColor?.name) {
        return new Response("Missing left color", { status: 400 });
    }

    const anthropic = createAnthropic({
        apiKey: env.ANTHROPIC_API_KEY,
    });

    const prompt = `Generate a harmonized color between these two colors:

Left Color: ${leftColor.name} (${leftColor.hex})
Right Color: ${rightColor?.name || "end"} (${rightColor?.hex || "N/A"})

Return a JSON object with hex, name, and role properties.`;

    const result = await generateText({
        model: anthropic("claude-sonnet-4-5-20250929"),
        system: ADD_COLOR_PROMPT,
        messages: [{ role: "user", content: prompt }],
    });

    try {
        // Extract JSON from the response
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }

        const newColor = JSON.parse(jsonMatch[0]);

        // Validate the response
        if (!newColor.hex || !newColor.name || !newColor.role) {
            throw new Error("Invalid color format");
        }

        return Response.json(newColor);
    } catch (error) {
        console.error("Failed to parse AI response:", error);
        return new Response("Failed to generate color", { status: 500 });
    }
}
