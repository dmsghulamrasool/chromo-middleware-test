"use client";
import Header from "@/layout/header";
import AttachmentModel from "@/model/attachment-model";
import SingUpModel from "@/model/sing-up-model";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiArrowUp } from "react-icons/fi";
import supabase from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import PaletteLoader from "@/components/ui/palette-loader";
import HomePage from "@/components/landing-page";

export default function Home() {
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [isAttachementModel, setIsAttachementModel] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onToggleModel = () => {
    setModelIsOpen(!modelIsOpen);
  };
  const onAttachementModel = () => {
    setIsAttachementModel(!isAttachementModel);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([{ prompt, user_id: user.id }])
        .select()
        .single();

      if (error) {
        return;
      }

      if (data) {
        const response = await fetch("/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ projectId: data.id, prompt }),
        });

        if (!response.ok) {
        }

        router.push(`/play-ground/${data.id}`);
      }
    } catch (error) {
      console.log("error");
      setIsLoading(false);
      return;
    }
  };

  const onSubmitHandler = async () => {
    if (!prompt.trim()) {
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await handleSubmit();
    } else {
      onToggleModel();
    }
  };
  return (
    <>
      <PaletteLoader isVisible={isLoading} />
      <div className="flex flex-col min-h-screen h-auto">
        <Header />
        <div className="py-7 md:py-[181px] px-5">
          <div className="max-w-223.5 w-full mx-auto pt-26.5 relative">
            <div
              className="absolute top-[-300px] left-[-1000px] blur-[93.4px] pointer-events-none -z-10"
              style={{
                width: "923px",
                height: "268.44px",
                background: "#FF8800",
                borderRadius: "50%",
                opacity: 0.3,
              }}
            />
            <div
              className="absolute top-[-300px] left-[-300px] blur-[93.4px] pointer-events-none -z-10"
              style={{
                width: "639px",
                height: "268.44px",
                background: "#FFC800",
                borderRadius: "50%",
                opacity: 0.3,
              }}
            />
            <div
              className="absolute top-[-300px] left-[100px] blur-[93.4px] pointer-events-none -z-10"
              style={{
                width: "972px",
                height: "268.44px",
                background: "#35CC38",
                borderRadius: "50%",
                opacity: 0.1,
              }}
            />
            <div
              className="absolute top-[-300px] left-[100px] blur-[93.4px] pointer-events-none -z-10"
              style={{
                width: "923px",
                height: "268.44px",
                background: "#FF8800",
                borderRadius: "50%",
                opacity: 0.2,
              }}
            />
            <div className="w-27.5 h-27.5 mx-auto ">
              <video
                key="home-orb-video"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{
                  clipPath: "circle(26% at center)",
                  transform: "scale(1.5)",
                }}
              >
                <source src="/video/chromos-orb.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="flex flex-col items-center pt-15">
              <h2 className="font-inter text-3xl sm:text-6xl md:text-[78px] leading-[normal] font-bold text-center">
                <span className="hover-text">Turn</span>{" "}
                <span className="hover-text">inspi</span>
                <span className="hover-text">ration</span>{" "}
                <span className="hover-text">into</span>
                <br />
                <span className="hover-text">Palet</span>
                <span className="hover-text">tes,</span>{" "}
                <span className="hover-text">Effort</span>
                <span className="hover-text">lessly.</span>
              </h2>
            </div>
          </div>

          <div className="pt-16">
            <div className="h-15 md:h-20 max-w-250 w-full mx-auto relative gradient-border">
              <span
                className="absolute top-0 bottom-0 md:bottom-auto h-fit my-auto md:top-8 text-base leading-4 left-5 md:left-7 cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90 hover:rotate-90"
                onClick={onAttachementModel}
              >
                <FiPlus />
              </span>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-full border-0 outline-0 pl-14 bg-transparent placeholder:font inter placeholder:font-normal"
                placeholder="Describe the mood, style or inspiration for your color palette... "
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onSubmitHandler();
                  }
                }}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={`border h-10 w-10 flex justify-center items-center rounded-full absolute md:top-5 md:right-7 bottom-0 top-0 my-auto right-3 sm:my-0 md:bottom-auto transition-all duration-200 ${
                  prompt.trim() && !isLoading
                    ? "border-(--button-border-active) cursor-pointer hover:scale-125 active:scale-90"
                    : "border-gray-300 cursor-not-allowed opacity-50"
                }`}
                onClick={onSubmitHandler}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiArrowUp className="text-base leading-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        {modelIsOpen && <SingUpModel onClose={onToggleModel} />}
        {isAttachementModel && <AttachmentModel onClose={onAttachementModel} />}
      </div>
      <HomePage />
    </>
  );
}
