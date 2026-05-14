-- ═══════════════════════════════════════════════════════════════
-- OpenDesk — Complete Database Schema
-- AI-Powered Academic Intelligence Ecosystem
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ══════════════════════════════════════
-- 1. ENUMS
-- ══════════════════════════════════════

CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE learning_state AS ENUM ('flow', 'struggling', 'distracted', 'idle');
CREATE TYPE assignment_status AS ENUM ('not_started', 'in_progress', 'submitted', 'graded');
CREATE TYPE lab_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE mood_type AS ENUM ('confident', 'confused', 'frustrated', 'curious');
CREATE TYPE ai_rule_mode AS ENUM ('adaptive', 'strict', 'full_assist', 'disabled');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'dismissed');

-- ══════════════════════════════════════
-- 2. CORE TABLES
-- ══════════════════════════════════════

-- Institutions
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'autonomous', -- vtu, autonomous, university
  health_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  health_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(institution_id, code)
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  roll_number TEXT,
  semester INTEGER,
  department_id UUID REFERENCES departments(id),
  institution_id UUID REFERENCES institutions(id),
  avatar_url TEXT,
  focus_score INTEGER DEFAULT 0,
  mastery_score INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 3. LAB SYSTEM
-- ══════════════════════════════════════

-- Subjects / Courses
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  semester INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Labs
CREATE TABLE labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  lab_number INTEGER NOT NULL,
  theory_content JSONB DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  status lab_status DEFAULT 'draft',
  ai_rule_mode ai_rule_mode DEFAULT 'adaptive',
  max_ai_hints INTEGER DEFAULT 10,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lab Variants (different datasets per student)
CREATE TABLE lab_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  variant_label TEXT NOT NULL, -- e.g. "Dataset A", "Dataset B"
  dataset JSONB DEFAULT '{}',
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pre-lab tasks
CREATE TABLE prelab_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- fill_blank, output_predict, bug_find, concept_check
  question TEXT NOT NULL,
  answer JSONB NOT NULL,
  difficulty INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 4. STUDENT LAB SESSIONS
-- ══════════════════════════════════════

-- Lab submissions
CREATE TABLE lab_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES lab_variants(id),
  code TEXT DEFAULT '',
  language TEXT DEFAULT 'c',
  output TEXT DEFAULT '',
  status assignment_status DEFAULT 'not_started',
  auto_saved_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  grade TEXT,
  score NUMERIC(5,2),
  faculty_feedback TEXT,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lab_id, student_id)
);

-- Pre-lab completion
CREATE TABLE prelab_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id UUID REFERENCES labs(id) ON DELETE CASCADE,
  readiness_score INTEGER DEFAULT 0,
  responses JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, lab_id)
);

-- Code snapshots (auto-save timeline)
CREATE TABLE code_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES lab_submissions(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  event_type TEXT DEFAULT 'autosave', -- autosave, compile, run, submit
  output TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 5. BEHAVIORAL TRACKING
-- ══════════════════════════════════════

-- Real-time behavioral events
CREATE TABLE behavioral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES lab_submissions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- keystroke, pause, tab_switch, paste, delete_spike, ai_hint, compile, run
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Behavioral session summaries (aggregated per lab session)
CREATE TABLE behavioral_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES lab_submissions(id) ON DELETE CASCADE,
  learning_state learning_state DEFAULT 'idle',
  focus_score INTEGER DEFAULT 0,
  confusion_index INTEGER DEFAULT 0,
  momentum_score INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  typing_rhythm JSONB DEFAULT '{}',
  total_keystrokes INTEGER DEFAULT 0,
  total_pauses INTEGER DEFAULT 0,
  total_deletions INTEGER DEFAULT 0,
  total_pastes INTEGER DEFAULT 0,
  total_tab_switches INTEGER DEFAULT 0,
  ai_hints_used INTEGER DEFAULT 0,
  compile_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  session_start TIMESTAMPTZ,
  session_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 6. AI INTERACTIONS
-- ══════════════════════════════════════

-- AI chat messages
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES lab_submissions(id),
  context TEXT DEFAULT 'mentor', -- mentor, lab_assistant, viva
  role TEXT NOT NULL, -- user, assistant, system
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  model TEXT DEFAULT 'gpt-4o',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 7. ASSIGNMENTS
-- ══════════════════════════════════════

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  dataset_variants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  solution TEXT DEFAULT '',
  ai_followup_responses JSONB DEFAULT '[]',
  reflection TEXT,
  reflection_mood mood_type,
  reflection_depth_score INTEGER DEFAULT 0,
  voice_explanation_url TEXT,
  status assignment_status DEFAULT 'not_started',
  score NUMERIC(5,2),
  feedback TEXT,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- ══════════════════════════════════════
-- 8. VIVA SYSTEM
-- ══════════════════════════════════════

CREATE TABLE viva_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id),
  type TEXT DEFAULT 'practice', -- practice, official, auto_triggered
  overall_score INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  depth_rating TEXT,
  duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE viva_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES viva_sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  student_answer TEXT,
  ai_evaluation JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  hesitation_ms INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Question bank for faculty
CREATE TABLE viva_question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  question TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  times_asked INTEGER DEFAULT 0,
  avg_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 9. REFLECTIONS
-- ══════════════════════════════════════

CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id UUID REFERENCES labs(id),
  assignment_id UUID REFERENCES assignments(id),
  mood mood_type,
  content TEXT NOT NULL,
  depth_score INTEGER DEFAULT 0,
  clarity_score INTEGER DEFAULT 0,
  authenticity_score INTEGER DEFAULT 0,
  ai_analysis JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 10. LEARNING ANALYTICS / SKILLS
-- ══════════════════════════════════════

CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  category TEXT, -- problem_solving, debugging, focus, concept_clarity, ai_independence, code_quality
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, skill_name)
);

CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  focus_score INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  consistency_score INTEGER DEFAULT 0,
  debug_quality INTEGER DEFAULT 0,
  ai_dependency INTEGER DEFAULT 0,
  cognitive_load INTEGER DEFAULT 0,
  mastery_rate NUMERIC(5,2) DEFAULT 0,
  deep_work_minutes INTEGER DEFAULT 0,
  contributions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, date)
);

-- ══════════════════════════════════════
-- 11. PORTFOLIO
-- ══════════════════════════════════════

CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  project_type TEXT, -- capstone, lab_project, assignment, personal
  rating TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB DEFAULT '{}'
);

CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- ══════════════════════════════════════
-- 12. AI GOVERNANCE & COMPLIANCE
-- ══════════════════════════════════════

CREATE TABLE ai_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id),
  department_id UUID REFERENCES departments(id),
  type TEXT NOT NULL, -- high_ai_dependency, copy_paste_anomaly, code_dna_mismatch, suspicious_timing, excess_queries
  detail TEXT,
  severity incident_severity DEFAULT 'medium',
  status incident_status DEFAULT 'open',
  action_taken TEXT,
  reported_by UUID REFERENCES profiles(id),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE platform_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'integrity', -- integrity, intelligence, automation, features
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 13. NOTIFICATIONS / RISK ALERTS
-- ══════════════════════════════════════

CREATE TABLE risk_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity risk_level DEFAULT 'medium',
  status incident_status DEFAULT 'open',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info', -- info, warning, success, ai_insight
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════
-- 14. ROW LEVEL SECURITY
-- ══════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE viva_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own, faculty/admin can read all
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Faculty and admin can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Lab submissions: students own, faculty can read all
CREATE POLICY "Students own their submissions" ON lab_submissions
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Faculty can read all submissions" ON lab_submissions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
  );

-- Behavioral data: students own, faculty can read
CREATE POLICY "Students own behavioral data" ON behavioral_sessions
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Faculty can read behavioral data" ON behavioral_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
  );

-- AI Messages: students own their conversations
CREATE POLICY "Students own AI messages" ON ai_messages
  FOR ALL USING (auth.uid() = student_id);

-- Notifications: users see only their own
CREATE POLICY "Users see own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Skill progress: students own, faculty can view
CREATE POLICY "Students own skill progress" ON skill_progress
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Faculty can view skill progress" ON skill_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
  );

-- Daily analytics: students own, faculty can view
CREATE POLICY "Students own daily analytics" ON daily_analytics
  FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Faculty can view daily analytics" ON daily_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('faculty', 'admin'))
  );

-- ══════════════════════════════════════
-- 15. INDEXES
-- ══════════════════════════════════════

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_department ON profiles(department_id);
CREATE INDEX idx_labs_subject ON labs(subject_id);
CREATE INDEX idx_labs_status ON labs(status);
CREATE INDEX idx_lab_submissions_student ON lab_submissions(student_id);
CREATE INDEX idx_lab_submissions_lab ON lab_submissions(lab_id);
CREATE INDEX idx_behavioral_events_student ON behavioral_events(student_id);
CREATE INDEX idx_behavioral_events_submission ON behavioral_events(submission_id);
CREATE INDEX idx_behavioral_sessions_student ON behavioral_sessions(student_id);
CREATE INDEX idx_ai_messages_student ON ai_messages(student_id);
CREATE INDEX idx_ai_messages_context ON ai_messages(context);
CREATE INDEX idx_daily_analytics_student_date ON daily_analytics(student_id, date);
CREATE INDEX idx_skill_progress_student ON skill_progress(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_ai_incidents_status ON ai_incidents(status);
CREATE INDEX idx_risk_alerts_status ON risk_alerts(status);

-- ══════════════════════════════════════
-- 16. FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON labs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON lab_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON behavioral_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════
-- 17. REALTIME
-- ══════════════════════════════════════

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE behavioral_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE lab_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_messages;
