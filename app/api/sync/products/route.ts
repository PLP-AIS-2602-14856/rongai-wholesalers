import { NextResponse } from "next/server";
import { runProductSyncForAdmin } from "@/app/actions/sync";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const configuredSecret = process.env.PRODUCT_SYNC_SECRET;
  if (configuredSecret) {
    const providedSecret = request.headers.get("x-sync-secret");
    if (providedSecret !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const supabase = await createClient();
  const summary = await runProductSyncForAdmin(supabase, profile.id);
  return NextResponse.json(summary, { status: summary.errors.length ? 500 : 200 });
}
