import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * POST /api/behavioral/track
 * Receives behavioral events from the frontend and stores them.
 * Also updates the aggregated behavioral session.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { submissionId, events, sessionUpdate } = await req.json();

    // Batch insert behavioral events
    if (events && events.length > 0) {
      const eventsWithUser = events.map((e: Record<string, unknown>) => ({
        ...e,
        student_id: user.id,
        submission_id: submissionId,
      }));
      await supabase.from("behavioral_events").insert(eventsWithUser);
    }

    // Update aggregated session
    if (sessionUpdate) {
      // Compute learning state from metrics
      const learningState = computeLearningState(sessionUpdate);

      await supabase
        .from("behavioral_sessions")
        .upsert(
          {
            student_id: user.id,
            submission_id: submissionId,
            learning_state: learningState,
            ...sessionUpdate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,submission_id" as never }
        );

      return NextResponse.json({ learningState });
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Behavioral Track Error:", error);
    return NextResponse.json({ error: "Failed to track behavior" }, { status: 500 });
  }
}

function computeLearningState(session: Record<string, number>): string {
  const { focus_score = 0, confusion_index = 0, total_pauses = 0, total_tab_switches = 0, error_count = 0 } = session;

  // Distracted: high tab switches or very low focus
  if (total_tab_switches > 10 || focus_score < 30) return "distracted";

  // Struggling: high confusion, many errors, many pauses
  if (confusion_index > 60 || (error_count > 8 && total_pauses > 15)) return "struggling";

  // Flow: high focus, low confusion
  if (focus_score > 70 && confusion_index < 30) return "flow";

  return "idle";
}
