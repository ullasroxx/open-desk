import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/labs/submissions — Get student's submission for a lab
 * POST /api/labs/submissions — Create or update a submission (autosave / submit)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const labId = req.nextUrl.searchParams.get("lab_id");
    const studentId = req.nextUrl.searchParams.get("student_id") || user.id;

    if (!labId) return NextResponse.json({ error: "lab_id required" }, { status: 400 });

    const { data, error } = await supabase
      .from("lab_submissions")
      .select("*, code_snapshots(id, event_type, created_at)")
      .eq("lab_id", labId)
      .eq("student_id", studentId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submission: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lab_id, code, output, action } = await req.json();

    if (!lab_id) return NextResponse.json({ error: "lab_id required" }, { status: 400 });

    const isSubmit = action === "submit";

    // Upsert the submission
    const { data: submission, error } = await supabase
      .from("lab_submissions")
      .upsert({
        lab_id,
        student_id: user.id,
        code: code || "",
        output: output || "",
        status: isSubmit ? "submitted" : "in_progress",
        auto_saved_at: new Date().toISOString(),
        ...(isSubmit ? { submitted_at: new Date().toISOString() } : {}),
      }, { onConflict: "lab_id,student_id" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Save code snapshot
    if (submission) {
      await supabase.from("code_snapshots").insert({
        submission_id: submission.id,
        code: code || "",
        event_type: isSubmit ? "submit" : "autosave",
        output: output || "",
      });
    }

    return NextResponse.json({ submission });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
