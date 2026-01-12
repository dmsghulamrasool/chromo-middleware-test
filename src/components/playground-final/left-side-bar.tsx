"use client";

import Image from "next/image";
import { ChevronDown, Search, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "../ui/input";
import { useState, useEffect, useRef } from "react";
import supabase from "@/lib/supabase-client";
import ReasoningSection from "./reasoning-section";
import SuggestionsSection from "./suggestions-section";
import VersionLabelingModal from "./version-labeling-modal";
import UpgradeModal from "../upgrade-modal";
import toast from "react-hot-toast";

interface LeftSideBarProps {
  id: string;
  className?: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  order: number;
  created_at: string;
}

const LeftSideBar = ({ id, className }: LeftSideBarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("project_id", id)
        .order("order", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    if (id) fetchMessages();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    // Check user's plan and palette limit before allowing submission
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Get project to find user_id
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("user_id")
        .eq("id", id)
        .single();

      if (!projectError && project) {
        // Get user's subscription to check plan
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select(
            `
            plan_id,
            end_date,
            plans (
              name
            )
          `
          )
          .eq("user_id", project.user_id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get user_creations to check current palettes count
        const { data: userCreations, error: creationsError } = await supabase
          .from("user_creations")
          .select("palettes")
          .eq("user_id", project.user_id)
          .single();

        if (!creationsError && userCreations) {
          let planName = "free"; // Default to free if no subscription found

          if (!subError && subscription) {
            const plan = Array.isArray(subscription.plans)
              ? subscription.plans[0]
              : subscription.plans;
            planName = plan?.name || "free";

            // Check if subscription has expired (end_date is in the past)
            if (planName === "pro" && subscription.end_date) {
              const endDate = new Date(subscription.end_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (endDate < today) {
                // Subscription expired, treat as free plan
                planName = "free";

                // Optionally trigger the downgrade function
                // This ensures the database is updated
                try {
                  await supabase.rpc("handle_expired_subscriptions");
                } catch (error) {
                  console.error("Error checking expired subscriptions:", error);
                }
              }
            }
          }

          // Only show upgrade modal for free plan users who reached the limit
          // Pro plan users should have unlimited access
          if (planName === "free" && userCreations.palettes >= 5) {
            setIsUpgradeModalOpen(true);
            return;
          }

          // If user has pro plan, allow creation without any limit check
          if (planName === "pro") {
            // Pro plan users have unlimited access, continue with creation
          }
        }
      }
    }

    const userMessage = inputValue;
    setInputValue("");

    // Add user message to database
    const { data: userMsg, error } = await supabase
      .from("messages")
      .insert([
        {
          project_id: id,
          role: "user",
          content: userMessage,
        },
      ])
      .select()
      .single();

    if (error || !userMsg) return;

    setMessages([...messages, userMsg]);

    // Call chat API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ projectId: id }),
    });

    if (!response.ok || !response.body) {
      console.error("API call failed:", response.status);
      return;
    }

    // Create assistant message placeholder
    const assistantMsgId = crypto.randomUUID();

    const assistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      order: userMsg.order + 1,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);

    // Stream the response
    let accumulatedContent = "";
    let streamSuccessful = false;

    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        console.log(accumulatedContent);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }

      streamSuccessful = true;
    } catch (error) {
      console.error("Streaming error:", error);
    }

    // If no stream content, use fallback message
    const finalContent =
      accumulatedContent.trim() || "I have created the palette for you.";

    // Update UI with final content
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === assistantMsgId ? { ...msg, content: finalContent } : msg
      )
    );

    // Save assistant message to database
    await supabase.from("messages").insert([
      {
        project_id: id,
        role: "assistant",
        content: finalContent,
      },
    ]);
  };

  const handleVersionModalClose = () => {
    setIsModalOpen(false)
  }

  const handleUpgradeModalClose = () => {
    setIsUpgradeModalOpen(false)
  }
  return (
    <>
      <VersionLabelingModal
        isOpen={isModalOpen}
        onClose={handleVersionModalClose}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={handleUpgradeModalClose}
      />
      <div
        className={`w-96 bg-(--surface-primary) border-r border-(--sidebar-gray)  flex flex-col ${className || ""
          }`}
      >
        {/* Header */}
        <div className=" border-b border-(--line) py-[23px]">
          <div className="flex items-center gap-4 w-full  pl-7">
            <div className="flex items-center gap-2.5 font-normal leading-8 text-xl text-[--primary] flex-1 text-left">
              Energetic Startup Workspace
              <ChevronDown className="w-5 h-5  text-[--primary]" />
            </div>
          </div>
        </div>

        <div className="flex-1 pl-6 pr-2.5 overflow-y-auto">
          <div className="py-2">
            <div className="relative">
              <Input
                placeholder="Search"
                className="w-full h-[47px] rounded-[48px] border border-[1.33px]  gap-2 opacity-100 fill-[rgba(238,238,238,0)] stroke-[rgba(238,238,238,0.25)] stroke-[8] backdrop-blur-[4px]"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="pb-2.5 w-full min-w-64 flex flex-col gap-2">
            {messages
              .filter((message: any) => message.role !== "tool-response")
              .map((message: any) => (
                <div
                  key={message.id}
                  className={`rounded-lg text-sm border p-4 ${message.role === "user"
                    ? "bg-[#FFF7E0] text-gray-700 border-(--dairy-cream-2) ml-auto"
                    : "bg-white text-gray-700 border-gray-200"
                    }`}
                >
                  <div className="prose prose-neutral max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Optional sections - uncomment to use */}
          <div className="flex gap-2 flex-col">
            {/* <div className="py-4 px-4.25 mt-4 w-full h-17.75 bg-(--porcelain-2) border border-(--chat-search-border) rounded-lg">
              <div className="flex flex-col gap-1.75">
                <div className="flex items-center justify-between">
                  <span className="font-inter font-normal text-base leading-4.75 text-black">
                    Energetic Startup Workspace
                  </span>
                  <Image
                    src="/svg/save.svg"
                    alt="Save"
                    width={16}
                    height={16}
                    className="w-4 h-4 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>
                <span className="font-inter font-normal text-base leading-4.75 text-black">
                  Version 1
                </span>
              </div>
            </div> */}
            {/* <ReasoningSection /> */}
            {/* <SuggestionsSection /> */}
          </div>
        </div>

        {/* Input fixed at bottom */}
        <div className="px-6 py-4 border-t border-(--line)">
          <div className="relative w-full flex justify-between h-18 items-center gap-2 px-8 py-4 rounded-[48px] border border-0.5 border-(--pavlova) bg-(--porcelain-2) shadow-[0_2px_8.1px_6px_rgba(255,195,0,0.50)] blur-[0.1px] backdrop-blur-[3px]">
            <Plus className="w-5 h-5 flex-shrink-0" />
            <Input
              type="text"
              placeholder="Palette's vibe..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="flex-1 bg-transparent border-0 h-auto font-medium text-(--grey-8) placeholder:text-(--grey-8) focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
            />
            <button
              onClick={handleSubmit}
              className="flex-shrink-0 flex justify-center items-center w-10 h-10 rounded-[40px] border border-1.5 border-white bg-[rgba(255,244,210,0.20)]"
            >
              <Image
                src="/svg/upload.svg"
                alt=""
                width={400}
                height={400}
                className="w-3.5 h-4"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSideBar;
