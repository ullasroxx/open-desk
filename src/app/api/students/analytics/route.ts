import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/students/analytics — Get student analytics data
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentId = req.nextUrl.searchParams.get("student_id") || user.id;
    const days = parseInt(req.nextUrl.searchParams.get("days") || "30");

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Fetch daily analytics
    const { data: analytics } = await supabase
      .from("daily_analytics")
      .select("*")
      .eq("student_id", studentId)
      .gte("date", fromDate.toISOString().split("T")[0])
      .order("date");

    // Fetch skill progress
    const { data: skills } = await supabase
      .from("skill_progress")
      .select("*")
      .eq("student_id", studentId)
      .order("xp", { ascending: false });

    // Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", studentId)
      .single();

    // Fetch recent behavioral sessions
    const { data: sessions } = await supabase
      .from("behavioral_sessions")
      .select("learning_state, focus_score, confusion_index, time_spent_seconds, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      profile,
      analytics: analytics || [],
      skills: skills || [],
      recentSessions: sessions || [],
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
