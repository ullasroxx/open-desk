import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/labs — List labs (optionally filtered by subject)
 * POST /api/labs — Create a new lab (faculty only)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subjectId = req.nextUrl.searchParams.get("subject_id");

    let query = supabase.from("labs").select("*, subjects(name, code), lab_variants(id, variant_label)").order("lab_number");
    if (subjectId) query = query.eq("subject_id", subjectId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ labs: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify faculty role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "faculty" && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Faculty access required" }, { status: 403 });
    }

    const body = await req.json();
    const { data, error } = await supabase.from("labs").insert({
      ...body,
      created_by: user.id,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ lab: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
