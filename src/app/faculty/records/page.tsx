"use client";

import { motion } from "framer-motion";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const records = [
  { student: "Aarav Sharma", id: "CS21001", labs: "12/12", assignments: "8/8", viva: "95%", internal: "48/50", grade: "O" },
  { student: "Priya Nair", id: "CS21012", labs: "12/12", assignments: "7/8", viva: "82%", internal: "42/50", grade: "A+" },
  { student: "Rahul Verma", id: "CS21024", labs: "10/12", assignments: "5/8", viva: "55%", internal: "30/50", grade: "B" },
  { student: "Meera Reddy", id: "CS21033", labs: "12/12", assignments: "8/8", viva: "98%", internal: "49/50", grade: "O" },
  { student: "John Doe", id: "CS21045", labs: "8/12", assignments: "4/8", viva: "42%", internal: "22/50", grade: "C" },
  { student: "Ananya Iyer", id: "CS21051", labs: "11/12", assignments: "6/8", viva: "72%", internal: "38/50", grade: "A" },
];

export default function AcademicRecordsPage() {
    const { toasts, show } = useToast();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Academic Records</h1>
          <p className="text-sm text-text-muted">Audit-ready records with timestamps and compliance logs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => show("Downloading report...", "info")} className="px-4 py-2.5 rounded-xl bg-bg-hover border border-border-default text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Export CSV
          </button>
          <button onClick={() => show("Exporting all records...", "info")} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs font-semibold hover:opacity-90">
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Total Students", v: "62", c: "#ec4899" },
          { l: "Lab Completion", v: "89%", c: "#10b981" },
          { l: "Avg Internal", v: "38.4/50", c: "#4f8fff" },
          { l: "At Risk", v: "4", c: "#ef4444" },
        ].map((m, i) => (
          <div key={i} className="glass-card-sm p-4 text-center">
            <p className="text-xl font-bold" style={{ color: m.c }}>{m.v}</p>
            <p className="text-[10px] text-text-muted mt-1">{m.l}</p>
          </div>
        ))}
      </div>

      {/* Records Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border-default flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">CS302 — Data Structures Lab Records</h3>
          <input
            type="text"
            placeholder="Search students..."
            className="bg-bg-hover border border-border-default rounded-xl px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent-pink/40 w-48"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-default text-[10px] text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Student</th>
                <th className="py-3 px-4 font-medium">Labs</th>
                <th className="py-3 px-4 font-medium">Assignments</th>
                <th className="py-3 px-4 font-medium">Viva</th>
                <th className="py-3 px-4 font-medium">Internal Marks</th>
                <th className="py-3 px-4 font-medium">Grade</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {records.map((r, i) => (
                <tr key={i} className="border-b border-border-default hover:bg-bg-hover/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-text-primary">{r.student}</p>
                    <p className="text-[10px] text-text-muted">{r.id}</p>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">{r.labs}</td>
                  <td className="py-3 px-4 text-text-secondary">{r.assignments}</td>
                  <td className="py-3 px-4 text-text-secondary">{r.viva}</td>
                  <td className="py-3 px-4 text-text-secondary font-medium">{r.internal}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      r.grade === "O" ? "bg-accent-green/15 text-accent-green" :
                      r.grade.startsWith("A") ? "bg-accent-blue/15 text-accent-blue" :
                      r.grade === "B" ? "bg-accent-amber/15 text-accent-amber" :
                      "bg-accent-red/15 text-accent-red"
                    }`}>{r.grade}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => show("Opening student details...", "info")} className="text-[10px] text-accent-pink hover:underline">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
