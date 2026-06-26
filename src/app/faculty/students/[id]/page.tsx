"use client";

import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SkillRadar from "@/components/ui/SkillRadar";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import GlowOrb from "@/components/ui/GlowOrb";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

// Demo student data indexed by ID
const studentsDB: Record<string, {
  name: string; id: string; roll: string; semester: string; department: string;
  email: string; focus: number; mastery: number; streak: number; xp: number;
  state: "flow" | "struggling" | "idle"; risk: string; aiDependency: number;
  labsCompleted: number; labsTotal: number; vivaAvg: number; attendance: number;
}> = {
  "CS21045": { name: "John Doe", id: "CS21045", roll: "CS21045", semester: "6th", department: "CSE", email: "john.doe@vtu.edu", focus: 42, mastery: 58, streak: 2, xp: 1240, state: "struggling", risk: "High", aiDependency: 35, labsCompleted: 4, labsTotal: 8, vivaAvg: 52, attendance: 78 },
  "CS21012": { name: "Alice Smith", id: "CS21012", roll: "CS21012", semester: "6th", department: "CSE", email: "alice.smith@vtu.edu", focus: 68, mastery: 72, streak: 5, xp: 2850, state: "flow", risk: "Medium", aiDependency: 65, labsCompleted: 6, labsTotal: 8, vivaAvg: 71, attendance: 92 },
  "CS21088": { name: "Bob Wilson", id: "CS21088", roll: "CS21088", semester: "6th", department: "CSE", email: "bob.wilson@vtu.edu", focus: 55, mastery: 60, streak: 0, xp: 1680, state: "idle", risk: "Medium", aiDependency: 90, labsCompleted: 5, labsTotal: 8, vivaAvg: 48, attendance: 85 },
  "CS21034": { name: "Priya Sharma", id: "CS21034", roll: "CS21034", semester: "6th", department: "CSE", email: "priya.s@vtu.edu", focus: 91, mastery: 88, streak: 12, xp: 4200, state: "flow", risk: "Low", aiDependency: 15, labsCompleted: 8, labsTotal: 8, vivaAvg: 92, attendance: 98 },
  "CS21056": { name: "Rahul Verma", id: "CS21056", roll: "CS21056", semester: "6th", department: "CSE", email: "rahul.v@vtu.edu", focus: 75, mastery: 70, streak: 3, xp: 2100, state: "flow", risk: "Low", aiDependency: 30, labsCompleted: 7, labsTotal: 8, vivaAvg: 78, attendance: 90 },
  "CS21023": { name: "Meera Patel", id: "CS21023", roll: "CS21023", semester: "6th", department: "CSE", email: "meera.p@vtu.edu", focus: 82, mastery: 76, streak: 7, xp: 3100, state: "flow", risk: "Low", aiDependency: 22, labsCompleted: 7, labsTotal: 8, vivaAvg: 85, attendance: 95 },
};

const focusHistory = [
  { day: "Mon", focus: 72, momentum: 65 },
  { day: "Tue", focus: 85, momentum: 78 },
  { day: "Wed", focus: 68, momentum: 60 },
  { day: "Thu", focus: 91, momentum: 88 },
  { day: "Fri", focus: 82, momentum: 79 },
];

const labScores = [
  { lab: "Lab 1", score: 85 },
  { lab: "Lab 2", score: 72 },
  { lab: "Lab 3", score: 90 },
  { lab: "Lab 4", score: 65 },
  { lab: "Lab 5", score: 88 },
  { lab: "Lab 6", score: 78 },
  { lab: "Lab 7", score: 92 },
  { lab: "Lab 8", score: 0 },
];

const behavioralLog = [
  { time: "09:15", event: "Session started — Lab 5: BST Implementation", type: "start" },
  { time: "09:22", event: "Paused for 2 min on insert() function", type: "pause" },
  { time: "09:25", event: "AI Hint requested: BST insertion logic", type: "ai" },
  { time: "09:30", event: "Resumed coding after hint", type: "code" },
  { time: "09:42", event: "First successful compilation", type: "success" },
  { time: "09:48", event: "Tab switch detected (3 times in 5 min)", type: "warning" },
  { time: "09:55", event: "All test cases passed", type: "success" },
  { time: "10:00", event: "Lab submitted", type: "success" },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 20 }, () => Math.floor(Math.random() * 8))
);

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const student = studentsDB[id];
  const { toasts, show } = useToast();
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <span className="text-5xl">🔍</span>
        <h2 className="text-xl font-bold text-text-primary">Student Not Found</h2>
        <p className="text-sm text-text-muted">No student with ID &quot;{id}&quot; exists.</p>
        <Link href="/faculty/students" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-semibold hover:opacity-90">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const skills = [
    { name: "Problem Solving", value: Math.round(student.mastery * 0.9), color: "#4f8fff" },
    { name: "Debugging", value: Math.round(student.focus * 0.85), color: "#8b5cf6" },
    { name: "Concept Clarity", value: student.vivaAvg, color: "#00d4ff" },
    { name: "Focus", value: student.focus, color: "#10b981" },
    { name: "AI Independence", value: 100 - student.aiDependency, color: "#f59e0b" },
    { name: "Code Quality", value: Math.round(student.mastery * 0.95), color: "#ec4899" },
  ];

  const riskColor = student.risk === "High" ? "#ef4444" : student.risk === "Medium" ? "#f59e0b" : "#10b981";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      {/* Breadcrumb + Header */}
      <motion.div variants={item} className="flex flex-col gap-4">
        <Link href="/faculty/students" className="text-xs text-text-muted hover:text-accent-blue transition-colors flex items-center gap-1 w-fit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Students
        </Link>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent-purple/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {student.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <p className="text-sm text-text-muted">{student.roll} • {student.department} • Sem {student.semester}</p>
                <p className="text-xs text-text-muted">{student.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <GlowOrb state={student.state} size={40} />
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: riskColor }}>{student.risk}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Risk Level</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-blue">{student.xp.toLocaleString()}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent-green">{student.streak}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Focus Score", value: `${student.focus}%`, color: "#4f8fff" },
          { label: "Mastery Score", value: `${student.mastery}%`, color: "#8b5cf6" },
          { label: "AI Dependency", value: `${student.aiDependency}%`, color: student.aiDependency > 70 ? "#ef4444" : "#f59e0b" },
          { label: "Labs Completed", value: `${student.labsCompleted}/${student.labsTotal}`, color: "#10b981" },
          { label: "Viva Average", value: `${student.vivaAvg}%`, color: "#00d4ff" },
          { label: "Attendance", value: `${student.attendance}%`, color: "#ec4899" },
        ].map((m, i) => (
          <motion.div key={i} variants={item} className="glass-card p-4 text-center">
            <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{m.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus Trend */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Weekly Focus & Momentum</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusHistory}>
                <defs>
                  <linearGradient id="sdFocusG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f8fff" stopOpacity={0.3}/><stop offset="95%" stopColor="#4f8fff" stopOpacity={0}/></linearGradient>
                  <linearGradient id="sdMomG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="day" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="focus" stroke="#4f8fff" fill="url(#sdFocusG)" strokeWidth={2} />
                <Area type="monotone" dataKey="momentum" stroke="#8b5cf6" fill="url(#sdMomG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Learning DNA */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 self-start">Learning DNA</h3>
          <SkillRadar skills={skills} size={200} />
        </motion.div>
      </div>

      {/* Lab Scores + Behavioral Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lab Scores */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Lab Scores</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={labScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="lab" stroke="#555577" fontSize={10} tickLine={false} />
                <YAxis stroke="#555577" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="score" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Behavioral Log */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Recent Behavioral Log</h3>
          <div className="space-y-0 max-h-56 overflow-y-auto">
            {behavioralLog.map((evt, i) => (
              <div key={i} className="flex items-start gap-3 pb-3">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 ${
                    evt.type === "success" ? "bg-accent-green" :
                    evt.type === "ai" ? "bg-accent-purple" :
                    evt.type === "warning" ? "bg-accent-amber" :
                    evt.type === "pause" ? "bg-accent-amber" :
                    "bg-accent-blue"
                  }`} />
                  {i < behavioralLog.length - 1 && <div className="w-px h-6 bg-border-default mt-1" />}
                </div>
                <div>
                  <p className="text-xs text-text-primary">{evt.event}</p>
                  <p className="text-[10px] text-text-muted">{evt.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Engagement Heatmap */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Engagement Heatmap (Last 20 weeks)</h3>
        <ActivityHeatmap data={heatmapData} label="Weeks" />
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={item} className="flex flex-wrap gap-3">
        <button onClick={() => show("📢 Scheduling viva for " + student.name, "success")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-semibold hover:opacity-90">
          Schedule Viva
        </button>
        <button onClick={() => show("💬 Sending nudge to " + student.name, "info")} className="px-5 py-2.5 rounded-xl bg-bg-hover border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
          Send Nudge
        </button>
        <button onClick={() => show("📊 Exporting report for " + student.name, "success")} className="px-5 py-2.5 rounded-xl bg-bg-hover border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
          Export Report
        </button>
        <button onClick={() => show("🚨 Flagging " + student.name + " for review", "warning")} className="px-5 py-2.5 rounded-xl border border-accent-red/30 text-accent-red text-sm font-semibold hover:bg-accent-red/10 transition-colors">
          Flag for Review
        </button>
      </motion.div>

      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
