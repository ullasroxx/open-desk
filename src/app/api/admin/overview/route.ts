import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/admin/overview — Institution-wide analytics for admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("profiles").select("role, institution_id").eq("id", user.id).single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Department health scores
    const { data: departments } = await supabase
      .from("departments")
      .select("*")
      .order("name");

    // Total students
    const { count: totalStudents } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    // Active labs
    const { count: activeLabs } = await supabase
      .from("labs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // Open risk alerts
    const { data: riskAlerts } = await supabase
      .from("risk_alerts")
      .select("*")
      .in("status", ["open", "investigating"])
      .order("created_at", { ascending: false })
      .limit(10);

    // AI incidents
    const { data: incidents } = await supabase
      .from("ai_incidents")
      .select("*, profiles(full_name, roll_number), departments(name, code)")
      .in("status", ["open", "investigating"])
      .order("created_at", { ascending: false })
      .limit(10);

    // Platform policies
    const { data: policies } = await supabase
      .from("platform_policies")
      .select("*")
      .eq("is_active", true);

    return NextResponse.json({
      departments: departments || [],
      totalStudents: totalStudents || 0,
      activeLabs: activeLabs || 0,
      riskAlerts: riskAlerts || [],
      incidents: incidents || [],
      policies: policies || [],
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
