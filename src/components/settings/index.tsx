"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import supabase from "@/lib/supabase-client";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { User } from "@/types/user";

export default function SettingsPage() {
  const [userData, setUserData] = useState<User | null>(null);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please log in again.");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) {
        throw new Error(`Failed to fetch user profile: ${userError.message}`);
      }

      if (!userData) {
        throw new Error("User profile data not found");
      }

      setUserData(userData);
    } catch (error) {
      toast.error("Failed to load user profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col pt-5 pl-12 gap-1 pb-1.75 w-full border-b border-(--sidebar-border-color)">
        <h1 className="text-(--sidebar-text) font-inter font-semibold text-lg">
          General Settings
        </h1>
        <p className="text-(--sidebar-text) font-inter text-sm">
          Here is where you can adjust your profile and system settings.
        </p>
      </div>
      <div className="flex pt-18 pl-12 gap-25">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold font-inter text-sm text-(--heading)">
            Profile Settings
          </h2>
          <p className="font-normal w-55 font inter text-xs text-(--heading)">
            Update your avatar, username, job details, and email information.
          </p>
        </div>
        <div className="flex flex-col w-126">
          <div className="flex flex-col gap-3">
            <h2 className="font-bold font-inter text-sm text-(--heading)">
              Avatar
            </h2>
            <Button
              variant="ghost"
              className="relative w-16 h-16 rounded-full bg-(--avatar-bg) p-0 overflow-hidden cursor-pointer"
            >
              <Image
                src="/svg/upload-avatar.svg"
                alt="Upload avatar"
                width={17}
                height={17}
              />
            </Button>
          </div>
          <div className="flex  pt-2.5 w-full">
            <div className="flex flex-col w-full gap-1.5">
              <div className="flex  gap-2  w-full">
                <div className="flex flex-col gap-2.5 flex-1">
                  <h2 className="font-bold font-inter text-sm text-(--heading)">
                    First Name
                  </h2>
                  <Input
                    value={userData?.full_name || ""}
                    readOnly
                    className="font-light font inter text-lg text-(--heading) pl-2.5 bg-quick-view-bg"
                  />
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  <h2 className="font-bold font-inter text-sm text-(--heading)">
                    Last Name
                  </h2>
                  <Input className="bg-quick-view-bg" />
                </div>
              </div>

              <p className="font-extralight w-full font inter text-xs text-(--heading) ">
                This is the name that will appear on your checks
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 pt-4">
            <h2 className="font-bold font-inter text-sm text-(--heading)">
              E-Mail
            </h2>
            <Input
              value={userData?.email || ""}
              readOnly
              className="font-light font inter text-lg text-(--heading) pl-2.5 bg-quick-view-bg"
            />
          </div>
          <div className="flex flex-col gap-2.5 pt-5">
            <h2 className="font-bold font-inter text-sm text-(--heading)">
              What kind of work do you do?
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between pl-2.5 bg-quick-view-bg cursor-pointer"
                >
                  <span className="font-light font inter text-(--heading)">
                    Select your work
                  </span>
                  <Image
                    src="/svg/down-arrow-slim.svg"
                    alt="arrow"
                    width={12}
                    height={7}
                  />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
          <div className="flex flex-col gap-2.5 pt-5">
            <h2 className="font-bold font-inter text-sm text-(--heading)">
              Time zone
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between pl-2.5 bg-quick-view-bg cursor-pointer"
                >
                  <span className="font-light font inter text-(--heading)">
                    Asia/Karachi
                  </span>
                  <Image
                    src="/svg/down-arrow-slim.svg"
                    alt="arrow"
                    width={12}
                    height={7}
                  />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
