"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlowOrb from "@/components/ui/GlowOrb";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const students = [
  { id: "CS21045", name: "John Doe", focus: 42, mastery: 58, risk: "High", state: "struggling" as const, aiDep: 35, streak: 2 },
  { id: "CS21012", name: "Alice Smith", focus: 68, mastery: 72, risk: "Medium", state: "flow" as const, aiDep: 65, streak: 5 },
  { id: "CS21088", name: "Bob Wilson", focus: 55, mastery: 60, risk: "Medium", state: "idle" as const, aiDep: 90, streak: 0 },
  { id: "CS21034", name: "Priya Sharma", focus: 91, mastery: 88, risk: "Low", state: "flow" as const, aiDep: 15, streak: 12 },
  { id: "CS21056", name: "Rahul Verma", focus: 75, mastery: 70, risk: "Low", state: "flow" as const, aiDep: 30, streak: 3 },
  { id: "CS21023", name: "Meera Patel", focus: 82, mastery: 76, risk: "Low", state: "flow" as const, aiDep: 22, streak: 7 },
];

export default function StudentIntelligencePage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { toasts, show } = useToast();

  const filtered = filter === "All" ? students : students.filter(s =>
    filter === "At Risk" ? s.risk === "High" || s.risk === "Critical" :
    filter === "Flow" ? s.state === "flow" : s.state === "struggling" || s.state === "idle"
  );

  const selectedStudent = students.find(s => s.id === selected);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Student Intelligence</h1>
          <p className="text-sm text-text-muted">Behavioral profiles and learning analytics for all students</p>
        </div>
        <div className="flex gap-2">
          {["All", "Flow", "At Risk", "Struggling"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? "bg-accent-pink/15 text-accent-pink border border-accent-pink/30" : "bg-bg-hover text-text-muted border border-border-default hover:text-text-primary"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-2">
          <div className="glass-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-default text-[10px] text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4 font-medium">Student</th>
                  <th className="py-3 px-4 font-medium">State</th>
                  <th className="py-3 px-4 font-medium">Focus</th>
                  <th className="py-3 px-4 font-medium">Mastery</th>
                  <th className="py-3 px-4 font-medium">AI Dep.</th>
                  <th className="py-3 px-4 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((s) => (
                  <tr key={s.id} onClick={() => setSelected(s.id)}
                    className={`border-b border-border-default hover:bg-bg-hover/50 cursor-pointer transition-colors ${selected === s.id ? "bg-accent-pink/5" : ""}`}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-text-primary">{s.name}</p>
                        <p className="text-[10px] text-text-muted">{s.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4"><GlowOrb state={s.state} size={20} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s.focus}%`, background: s.focus > 70 ? "#10b981" : s.focus > 50 ? "#f59e0b" : "#ef4444" }} />
                        </div>
                        <span className="text-xs text-text-muted">{s.focus}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-text-secondary">{s.mastery}%</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${s.aiDep > 60 ? "text-accent-red" : s.aiDep > 30 ? "text-accent-amber" : "text-accent-green"}`}>{s.aiDep}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                        s.risk === "Critical" ? "bg-accent-red/20 text-accent-red" :
                        s.risk === "High" ? "bg-accent-amber/20 text-accent-amber" :
                        s.risk === "Medium" ? "bg-accent-blue/20 text-accent-blue" :
                        "bg-accent-green/20 text-accent-green"
                      }`}>{s.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Detail Panel */}
        <div className="glass-card p-6">
          {selectedStudent ? (
            <motion.div key={selectedStudent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-bold text-lg">
                  {selectedStudent.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-base font-bold">{selectedStudent.name}</h3>
                  <p className="text-xs text-text-muted">{selectedStudent.id}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-hover/50">
                  <span className="text-xs text-text-muted">Current State</span>
                  <GlowOrb state={selectedStudent.state} size={24} />
                </div>
                {[
                  { l: "Focus Score", v: `${selectedStudent.focus}%`, c: selectedStudent.focus > 70 ? "#10b981" : "#f59e0b" },
                  { l: "Concept Mastery", v: `${selectedStudent.mastery}%`, c: "#4f8fff" },
                  { l: "AI Dependency", v: `${selectedStudent.aiDep}%`, c: selectedStudent.aiDep > 60 ? "#ef4444" : "#10b981" },
                  { l: "Coding Streak", v: `${selectedStudent.streak} days`, c: "#8b5cf6" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-hover/50">
                    <span className="text-xs text-text-muted">{m.l}</span>
                    <span className="text-sm font-bold" style={{ color: m.c }}>{m.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <Link href={`/faculty/students/${selectedStudent.id}`}
                  className="w-full py-2.5 rounded-xl bg-accent-pink/15 text-accent-pink text-xs font-semibold hover:bg-accent-pink/25 transition-colors flex items-center justify-center gap-1">
                  View Full Profile →
                </Link>
                <button onClick={() => show(`💬 Nudge sent to ${selectedStudent.name}`, "success")}
                  className="w-full py-2.5 rounded-xl bg-bg-hover border border-border-default text-text-secondary text-xs font-semibold hover:text-text-primary transition-colors">
                  Send Intervention Message
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-sm text-text-muted">Select a student to view<br/>their intelligence profile</p>
            </div>
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
