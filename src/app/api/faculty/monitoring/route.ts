import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/faculty/monitoring — Get all active behavioral sessions for live monitoring grid
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify faculty role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "faculty" && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const labId = req.nextUrl.searchParams.get("lab_id");

    // Get all active sessions with student profiles
    let query = supabase
      .from("behavioral_sessions")
      .select("*, profiles(full_name, roll_number, avatar_url)")
      .order("updated_at", { ascending: false });

    // Optionally filter by lab
    if (labId) {
      const { data: submissions } = await supabase
        .from("lab_submissions")
        .select("id")
        .eq("lab_id", labId);
      const submissionIds = (submissions || []).map((s: { id: string }) => s.id);
      if (submissionIds.length > 0) {
        query = query.in("submission_id", submissionIds);
      }
    }

    const { data: sessions, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ sessions: sessions || [] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
