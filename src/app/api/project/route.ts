import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { supabaseServer } from "@/lib/supabase-server";
import { PALETTE_GENERATION_PROMPT } from "@/constants/prompts";
import { generatePaletteTool } from "@/lib/tools/generatePalette";
import { env } from "@/env";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return new Response("Unauthorized", { status: 401 });

  const { projectId, prompt } = await req.json();

  const anthropic = createAnthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  const result = await generateText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: PALETTE_GENERATION_PROMPT,
    tools: { generatePaletteTool },
    messages: [{ role: "user", content: prompt }],
    experimental_context: { projectId },
  });
  const { error: messageError } = await supabase.from("messages").insert([
    {
      project_id: projectId,
      role: "user",
      content: prompt,
    },
    {
      project_id: projectId,
      role: "assistant",
      content: result.text || "I have created a pallete for you. Let me know if you need anything else!",
    },
  ]);

  if (messageError)
    return new Response("Failed to save messages", { status: 500 });

  return Response.json({
    text: result.text,
    toolCalls: result.toolCalls,
    toolResults: result.toolResults,
    finishReason: result.finishReason,
    usage: result.usage,
  });
}
