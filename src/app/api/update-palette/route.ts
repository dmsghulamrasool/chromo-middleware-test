import { supabaseServer } from "@/lib/supabase-server";

export async function PATCH(req: Request) {
  console.log("update-palette: starting");

  let body;
  try {
    body = await req.json();
    console.log("update-palette: body parsed", { id: body.id, colorsCount: body.colors?.length });
  } catch (e) {
    console.error("update-palette: failed to parse body", e);
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { id, colors } = body;

  if (!id || !colors) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await supabaseServer();
    console.log("update-palette: supabase client created");
  } catch (e) {
    console.error("update-palette: failed to create supabase client", e);
    return Response.json({ error: "Failed to initialize database" }, { status: 500 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  console.log("update-palette: auth check", { hasUser: !!user, authError: authError?.message });

  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error: updateError } = await supabase
    .from("palettes")
    .update({ colors })
    .eq("id", id);

  if (updateError) {
    console.error("update-palette: update failed", updateError);
    return Response.json({ error: "Failed to update palette", details: updateError.message }, { status: 500 });
  }

  console.log("update-palette: success");
  return Response.json({ success: true, data });
}
