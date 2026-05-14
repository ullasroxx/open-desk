"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const assignments = [
  { id: 1, title: "BST Operations Analysis", subject: "Data Structures", due: "Today 11:59 PM", status: "in-progress", progress: 65, variant: "Dataset A", difficulty: "Medium" },
  { id: 2, title: "Process Scheduling Simulation", subject: "Operating Systems", due: "Tomorrow 5:00 PM", status: "not-started", progress: 0, variant: "Dataset C", difficulty: "Hard" },
  { id: 3, title: "SQL Query Optimization", subject: "DBMS", due: "May 18", status: "submitted", progress: 100, variant: "Dataset B", difficulty: "Easy" },
  { id: 4, title: "Network Packet Analysis", subject: "Computer Networks", due: "May 20", status: "not-started", progress: 0, variant: "Dataset A", difficulty: "Medium" },
];

const workflowSteps = ["Question", "Solution", "AI Follow-up", "Reflection", "Submission"];

export default function AssignmentsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [reflectionMood, setReflectionMood] = useState("");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-sm text-text-muted">Dynamic assignment engine with AI follow-ups</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green">1 Submitted</span>
          <span className="px-3 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue">1 In Progress</span>
          <span className="px-3 py-1.5 rounded-full bg-text-muted/10 text-text-muted">2 Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignment List */}
        <div className="lg:col-span-2 space-y-3">
          {assignments.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(a.id)}
              className={`glass-card p-5 cursor-pointer transition-all hover:border-border-active ${selected === a.id ? "border-accent-blue/30" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    a.status === "submitted" ? "bg-accent-green/15 text-accent-green" :
                    a.status === "in-progress" ? "bg-accent-blue/15 text-accent-blue" :
                    "bg-bg-hover text-text-muted"
                  }`}>{a.id.toString().padStart(2, "0")}</div>
                  <div>
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    <p className="text-xs text-text-muted">{a.subject} • {a.variant}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                    a.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                    a.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{a.difficulty}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>Due: {a.due}</span>
                  <span className={`font-medium ${
                    a.status === "submitted" ? "text-accent-green" :
                    a.status === "in-progress" ? "text-accent-blue" : "text-text-muted"
                  }`}>{a.status === "submitted" ? "✓ Submitted" : a.status === "in-progress" ? "In Progress" : "Not Started"}</span>
                </div>
                <div className="w-24 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: a.status === "submitted" ? "#10b981" : "#4f8fff" }}
                    initial={{ width: 0 }} animate={{ width: `${a.progress}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow & Details */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Submission Workflow</h3>
            <div className="space-y-3">
              {workflowSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                    i < 2 ? "bg-accent-blue/15 text-accent-blue" : "bg-bg-hover text-text-muted"
                  }`}>{i + 1}</div>
                  <span className={`text-xs ${i < 2 ? "text-text-primary" : "text-text-muted"}`}>{step}</span>
                  {i < 2 && <span className="ml-auto text-[10px] text-accent-green">✓</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Reflection</h3>
            <p className="text-xs text-text-muted mb-3">How do you feel about this assignment?</p>
            <div className="flex gap-2 mb-3">
              {[
                { emoji: "🙂", label: "Confident" },
                { emoji: "😕", label: "Confused" },
                { emoji: "😤", label: "Frustrated" },
                { emoji: "🤔", label: "Curious" },
              ].map((m) => (
                <button key={m.label} onClick={() => setReflectionMood(m.label)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    reflectionMood === m.label ? "border-accent-blue/40 bg-accent-blue/10" : "border-border-default hover:border-border-active"
                  }`}>
                  <span className="text-lg">{m.emoji}</span>
                  <span className="text-[9px] text-text-muted">{m.label}</span>
                </button>
              ))}
            </div>
            <textarea placeholder="What did you learn? What was challenging?" className="w-full h-20 bg-bg-hover border border-border-default rounded-xl p-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/40 resize-none" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
