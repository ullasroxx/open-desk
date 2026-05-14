/* ═══════════════════════════════════════════════════════
   OpenDesk — Auto-generated Database Types
   Matches supabase/schema.sql
   ═══════════════════════════════════════════════════════ */

export type UserRole = "student" | "faculty" | "admin";
export type LearningState = "flow" | "struggling" | "distracted" | "idle";
export type AssignmentStatus = "not_started" | "in_progress" | "submitted" | "graded";
export type LabStatus = "draft" | "active" | "completed" | "archived";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type MoodType = "confident" | "confused" | "frustrated" | "curious";
export type AiRuleMode = "adaptive" | "strict" | "full_assist" | "disabled";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "investigating" | "resolved" | "dismissed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          roll_number: string | null;
          semester: number | null;
          department_id: string | null;
          institution_id: string | null;
          avatar_url: string | null;
          focus_score: number;
          mastery_score: number;
          streak_days: number;
          xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      institutions: {
        Row: {
          id: string;
          name: string;
          code: string;
          type: string;
          health_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["institutions"]["Row"]> & { name: string; code: string };
        Update: Partial<Database["public"]["Tables"]["institutions"]["Row"]>;
      };
      departments: {
        Row: {
          id: string;
          institution_id: string;
          name: string;
          code: string;
          health_score: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["departments"]["Row"]> & { name: string; code: string };
        Update: Partial<Database["public"]["Tables"]["departments"]["Row"]>;
      };
      subjects: {
        Row: {
          id: string;
          department_id: string;
          name: string;
          code: string;
          semester: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subjects"]["Row"]> & { name: string; code: string; semester: number };
        Update: Partial<Database["public"]["Tables"]["subjects"]["Row"]>;
      };
      labs: {
        Row: {
          id: string;
          subject_id: string;
          created_by: string;
          title: string;
          description: string | null;
          lab_number: number;
          theory_content: Record<string, unknown>;
          objectives: string[];
          status: LabStatus;
          ai_rule_mode: AiRuleMode;
          max_ai_hints: number;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["labs"]["Row"]> & { title: string; lab_number: number };
        Update: Partial<Database["public"]["Tables"]["labs"]["Row"]>;
      };
      lab_submissions: {
        Row: {
          id: string;
          lab_id: string;
          student_id: string;
          variant_id: string | null;
          code: string;
          language: string;
          output: string;
          status: AssignmentStatus;
          auto_saved_at: string | null;
          submitted_at: string | null;
          grade: string | null;
          score: number | null;
          faculty_feedback: string | null;
          graded_by: string | null;
          graded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lab_submissions"]["Row"]> & { lab_id: string; student_id: string };
        Update: Partial<Database["public"]["Tables"]["lab_submissions"]["Row"]>;
      };
      behavioral_sessions: {
        Row: {
          id: string;
          student_id: string;
          submission_id: string;
          learning_state: LearningState;
          focus_score: number;
          confusion_index: number;
          momentum_score: number;
          confidence_score: number;
          typing_rhythm: Record<string, unknown>;
          total_keystrokes: number;
          total_pauses: number;
          total_deletions: number;
          total_pastes: number;
          total_tab_switches: number;
          ai_hints_used: number;
          compile_count: number;
          error_count: number;
          time_spent_seconds: number;
          session_start: string | null;
          session_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["behavioral_sessions"]["Row"]> & { student_id: string; submission_id: string };
        Update: Partial<Database["public"]["Tables"]["behavioral_sessions"]["Row"]>;
      };
      ai_messages: {
        Row: {
          id: string;
          student_id: string;
          submission_id: string | null;
          context: string;
          role: string;
          content: string;
          tokens_used: number;
          model: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_messages"]["Row"]> & { student_id: string; role: string; content: string };
        Update: Partial<Database["public"]["Tables"]["ai_messages"]["Row"]>;
      };
      assignments: {
        Row: {
          id: string;
          subject_id: string;
          created_by: string;
          title: string;
          description: string | null;
          difficulty: string;
          due_date: string | null;
          dataset_variants: unknown[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["assignments"]["Row"]> & { title: string };
        Update: Partial<Database["public"]["Tables"]["assignments"]["Row"]>;
      };
      assignment_submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          solution: string;
          ai_followup_responses: unknown[];
          reflection: string | null;
          reflection_mood: MoodType | null;
          reflection_depth_score: number;
          voice_explanation_url: string | null;
          status: AssignmentStatus;
          score: number | null;
          feedback: string | null;
          submitted_at: string | null;
          graded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["assignment_submissions"]["Row"]> & { assignment_id: string; student_id: string };
        Update: Partial<Database["public"]["Tables"]["assignment_submissions"]["Row"]>;
      };
      viva_sessions: {
        Row: {
          id: string;
          student_id: string;
          subject_id: string | null;
          type: string;
          overall_score: number;
          confidence_score: number;
          depth_rating: string | null;
          duration_seconds: number;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["viva_sessions"]["Row"]> & { student_id: string };
        Update: Partial<Database["public"]["Tables"]["viva_sessions"]["Row"]>;
      };
      skill_progress: {
        Row: {
          id: string;
          student_id: string;
          skill_name: string;
          level: number;
          xp: number;
          category: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["skill_progress"]["Row"]> & { student_id: string; skill_name: string };
        Update: Partial<Database["public"]["Tables"]["skill_progress"]["Row"]>;
      };
      daily_analytics: {
        Row: {
          id: string;
          student_id: string;
          date: string;
          focus_score: number;
          engagement_score: number;
          consistency_score: number;
          debug_quality: number;
          ai_dependency: number;
          cognitive_load: number;
          mastery_rate: number;
          deep_work_minutes: number;
          contributions: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["daily_analytics"]["Row"]> & { student_id: string };
        Update: Partial<Database["public"]["Tables"]["daily_analytics"]["Row"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string | null;
          type: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & { user_id: string; title: string };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
      };
      ai_incidents: {
        Row: {
          id: string;
          student_id: string | null;
          department_id: string | null;
          type: string;
          detail: string | null;
          severity: IncidentSeverity;
          status: IncidentStatus;
          action_taken: string | null;
          reported_by: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["ai_incidents"]["Row"]> & { type: string };
        Update: Partial<Database["public"]["Tables"]["ai_incidents"]["Row"]>;
      };
      risk_alerts: {
        Row: {
          id: string;
          institution_id: string | null;
          department_id: string | null;
          type: string;
          description: string;
          severity: RiskLevel;
          status: IncidentStatus;
          metadata: Record<string, unknown>;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["risk_alerts"]["Row"]> & { type: string; description: string };
        Update: Partial<Database["public"]["Tables"]["risk_alerts"]["Row"]>;
      };
    };
  };
}
