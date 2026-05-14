"use client";

import { createClient } from "@/lib/supabase/client";
import type { Database, LearningState } from "@/lib/database.types";

const supabase = createClient();

type Tables = Database["public"]["Tables"];

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════

export async function signUp(email: string, password: string, metadata: { full_name: string; role: string }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: Tables["profiles"]["Update"]) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ═══════════════════════════════════════
// LABS
// ═══════════════════════════════════════

export async function getLabs(subjectId?: string) {
  let query = supabase.from("labs").select("*, subjects(name, code)").order("lab_number");
  if (subjectId) query = query.eq("subject_id", subjectId);
  const { data, error } = await query;
  return { data, error };
}

export async function getLab(labId: string) {
  const { data, error } = await supabase
    .from("labs")
    .select("*, subjects(name, code), lab_variants(*)")
    .eq("id", labId)
    .single();
  return { data, error };
}

export async function createLab(lab: Tables["labs"]["Insert"]) {
  const { data, error } = await supabase.from("labs").insert(lab).select().single();
  return { data, error };
}

export async function updateLab(labId: string, updates: Tables["labs"]["Update"]) {
  const { data, error } = await supabase.from("labs").update(updates).eq("id", labId).select().single();
  return { data, error };
}

// ═══════════════════════════════════════
// LAB SUBMISSIONS
// ═══════════════════════════════════════

export async function getSubmission(labId: string, studentId: string) {
  const { data, error } = await supabase
    .from("lab_submissions")
    .select("*")
    .eq("lab_id", labId)
    .eq("student_id", studentId)
    .single();
  return { data, error };
}

export async function upsertSubmission(submission: Tables["lab_submissions"]["Insert"]) {
  const { data, error } = await supabase
    .from("lab_submissions")
    .upsert(submission, { onConflict: "lab_id,student_id" })
    .select()
    .single();
  return { data, error };
}

export async function autoSaveCode(labId: string, studentId: string, code: string) {
  return upsertSubmission({
    lab_id: labId,
    student_id: studentId,
    code,
    status: "in_progress",
    auto_saved_at: new Date().toISOString(),
  });
}

export async function submitLab(labId: string, studentId: string, code: string, output: string) {
  return upsertSubmission({
    lab_id: labId,
    student_id: studentId,
    code,
    output,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  });
}

// Faculty grading
export async function gradeLab(submissionId: string, grade: string, score: number, feedback: string, gradedBy: string) {
  const { data, error } = await supabase
    .from("lab_submissions")
    .update({ grade, score, faculty_feedback: feedback, graded_by: gradedBy, graded_at: new Date().toISOString(), status: "graded" as const })
    .eq("id", submissionId)
    .select()
    .single();
  return { data, error };
}

// ═══════════════════════════════════════
// BEHAVIORAL TRACKING
// ═══════════════════════════════════════

export async function logBehavioralEvent(event: {
  student_id: string;
  submission_id: string;
  event_type: string;
  data?: Record<string, unknown>;
}) {
  const { error } = await supabase.from("behavioral_events").insert(event);
  return { error };
}

export async function upsertBehavioralSession(session: Tables["behavioral_sessions"]["Insert"]) {
  const { data, error } = await supabase
    .from("behavioral_sessions")
    .upsert(session, { onConflict: "student_id,submission_id" as never })
    .select()
    .single();
  return { data, error };
}

export async function getStudentBehavioralState(studentId: string) {
  const { data, error } = await supabase
    .from("behavioral_sessions")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

// Faculty: get all active sessions for monitoring
export async function getActiveSessions() {
  const { data, error } = await supabase
    .from("behavioral_sessions")
    .select("*, profiles(full_name, roll_number)")
    .order("updated_at", { ascending: false });
  return { data, error };
}

// ═══════════════════════════════════════
// AI MESSAGES
// ═══════════════════════════════════════

export async function getAiMessages(studentId: string, context: string = "mentor", limit: number = 50) {
  const { data, error } = await supabase
    .from("ai_messages")
    .select("*")
    .eq("student_id", studentId)
    .eq("context", context)
    .order("created_at", { ascending: true })
    .limit(limit);
  return { data, error };
}

export async function saveAiMessage(message: Tables["ai_messages"]["Insert"]) {
  const { data, error } = await supabase.from("ai_messages").insert(message).select().single();
  return { data, error };
}

// ═══════════════════════════════════════
// ASSIGNMENTS
// ═══════════════════════════════════════

export async function getAssignments(subjectId?: string) {
  let query = supabase.from("assignments").select("*, subjects(name, code)").order("due_date");
  if (subjectId) query = query.eq("subject_id", subjectId);
  const { data, error } = await query;
  return { data, error };
}

export async function getStudentAssignments(studentId: string) {
  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("*, assignments(title, description, difficulty, due_date, subjects(name))")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function submitAssignment(submission: Tables["assignment_submissions"]["Insert"]) {
  const { data, error } = await supabase
    .from("assignment_submissions")
    .upsert(submission, { onConflict: "assignment_id,student_id" })
    .select()
    .single();
  return { data, error };
}

// ═══════════════════════════════════════
// VIVA
// ═══════════════════════════════════════

export async function createVivaSession(session: Tables["viva_sessions"]["Insert"]) {
  const { data, error } = await supabase.from("viva_sessions").insert(session).select().single();
  return { data, error };
}

export async function getVivaSessions(studentId?: string) {
  let query = supabase.from("viva_sessions").select("*, profiles(full_name, roll_number)").order("created_at", { ascending: false });
  if (studentId) query = query.eq("student_id", studentId);
  const { data, error } = await query;
  return { data, error };
}

// ═══════════════════════════════════════
// SKILLS & ANALYTICS
// ═══════════════════════════════════════

export async function getSkillProgress(studentId: string) {
  const { data, error } = await supabase
    .from("skill_progress")
    .select("*")
    .eq("student_id", studentId)
    .order("xp", { ascending: false });
  return { data, error };
}

export async function updateSkill(studentId: string, skillName: string, xpGain: number) {
  // Fetch current
  const { data: current } = await supabase
    .from("skill_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("skill_name", skillName)
    .single();

  const newXp = (current?.xp || 0) + xpGain;
  const newLevel = Math.floor(newXp / 100) + 1;

  const { data, error } = await supabase
    .from("skill_progress")
    .upsert({ student_id: studentId, skill_name: skillName, xp: newXp, level: newLevel }, { onConflict: "student_id,skill_name" })
    .select()
    .single();
  return { data, error };
}

export async function getDailyAnalytics(studentId: string, days: number = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  const { data, error } = await supabase
    .from("daily_analytics")
    .select("*")
    .eq("student_id", studentId)
    .gte("date", fromDate.toISOString().split("T")[0])
    .order("date");
  return { data, error };
}

// ═══════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return { data, error };
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);
  return { error };
}

// ═══════════════════════════════════════
// ADMIN: GOVERNANCE & RISK
// ═══════════════════════════════════════

export async function getAiIncidents(status?: string) {
  let query = supabase.from("ai_incidents").select("*, profiles(full_name, roll_number), departments(name, code)").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  return { data, error };
}

export async function getRiskAlerts(status?: string) {
  let query = supabase.from("risk_alerts").select("*, departments(name, code)").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  return { data, error };
}

export async function getDepartments(institutionId?: string) {
  let query = supabase.from("departments").select("*").order("name");
  if (institutionId) query = query.eq("institution_id", institutionId);
  const { data, error } = await query;
  return { data, error };
}

// ═══════════════════════════════════════
// REALTIME SUBSCRIPTIONS
// ═══════════════════════════════════════

export function subscribeToBehavioralUpdates(callback: (payload: unknown) => void) {
  return supabase
    .channel("behavioral_sessions")
    .on("postgres_changes", { event: "*", schema: "public", table: "behavioral_sessions" }, callback)
    .subscribe();
}

export function subscribeToNotifications(userId: string, callback: (payload: unknown) => void) {
  return supabase
    .channel(`notifications:${userId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, callback)
    .subscribe();
}

export function subscribeToLabSubmissions(labId: string, callback: (payload: unknown) => void) {
  return supabase
    .channel(`lab_submissions:${labId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "lab_submissions", filter: `lab_id=eq.${labId}` }, callback)
    .subscribe();
}
