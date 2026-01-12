import { redirect } from "next/navigation";
import React from "react";
import { supabaseServer } from "@/lib/supabase-server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  console.log("data", data);

  // If user is not logged in, redirect to login
  if (!data.user || error) {
    redirect("/login");
  }

  // If user is logged in, allow access
  return <>{children}</>;
}
