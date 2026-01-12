import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
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

  const { projectId, message } = await req.json();

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("content, role")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (messagesError || !messages)
    return new Response("Failed to fetch messages", { status: 500 });

  // Convert tool-response to assistant for AI context
  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "tool-response" ? "assistant" : msg.role,
    content: msg.content,
  }));

  // Add the new message if provided
  const allMessages = message
    ? [...formattedMessages, { role: "user", content: message }]
    : formattedMessages;

  const anthropic = createAnthropic({
    apiKey: env.ANTHROPIC_API_KEY,
  });

  const result = streamText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    system: PALETTE_GENERATION_PROMPT,
    tools: { generatePaletteTool },
    messages: allMessages,
    experimental_context: { projectId },
  });

  return result.toTextStreamResponse();
}
