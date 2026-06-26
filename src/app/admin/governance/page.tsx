"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const aiUsageTrend = [
  { week: "W1", hints: 320, solutions: 45, flagged: 8 },
  { week: "W2", hints: 380, solutions: 52, flagged: 12 },
  { week: "W3", hints: 410, solutions: 38, flagged: 5 },
  { week: "W4", hints: 450, solutions: 30, flagged: 3 },
  { week: "W5", hints: 490, solutions: 25, flagged: 2 },
];

const incidents = [
  { type: "High AI Dependency", dept: "CSE", student: "CS21045", detail: "Used AI for 92% of code in Lab 5", severity: "Critical", action: "Viva triggered" },
  { type: "Copy-Paste Anomaly", dept: "ECE", student: "EC21034", detail: "Code DNA mismatch with known solution", severity: "High", action: "Submission flagged" },
  { type: "Suspicious Timing", dept: "ISE", student: "IS21022", detail: "Lab completed in 4 min (avg: 45 min)", severity: "High", action: "Under review" },
  { type: "Excess AI Queries", dept: "AIML", student: "AI21008", detail: "180 AI queries in single session", severity: "Medium", action: "Rate-limited" },
];

const policies = [
  { name: "Max AI Hints per Lab", value: "10", status: "Active" },
  { name: "Code Similarity Threshold", value: "75%", status: "Active" },
  { name: "Auto-Viva on AI Dependency", value: "> 80%", status: "Active" },
  { name: "Paste Detection", value: "Enabled", status: "Active" },
  { name: "Tab-Switch Monitoring", value: "Enabled", status: "Active" },
];

export default function GovernancePage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

    const { toasts, show } = useToast();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Governance</h1>
          <p className="text-sm text-text-muted">Track AI dependency, transparency, suspicious behavior, and ethical usage</p>
        </div>
        <button onClick={() => show("Add Policy dialog coming soon!", "info")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-amber to-accent-red text-white text-sm font-bold hover:opacity-90">
          Configure Policies
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Avg AI Dependency", v: "28%", c: "#10b981", sub: "Within safe limits" },
          { l: "Flagged Sessions", v: "7", c: "#ef4444", sub: "This week" },
          { l: "Auto-Vivas Triggered", v: "3", c: "#f59e0b", sub: "From AI flags" },
          { l: "Policy Compliance", v: "96%", c: "#4f8fff", sub: "Institution-wide" },
        ].map((m, i) => (
          <div key={i} className="glass-card-sm p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: m.c }}>{m.v}</p>
            <p className="text-xs text-text-primary font-medium mt-1">{m.l}</p>
            <p className="text-[9px] text-text-muted">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Usage Trend */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">AI Usage Trend (Institution-wide)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aiUsageTrend}>
                <defs>
                  <linearGradient id="hintGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8fff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f8fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="week" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="hints" stroke="#4f8fff" fill="url(#hintGrad)" strokeWidth={2} name="Hints Used" />
                <Area type="monotone" dataKey="flagged" stroke="#ef4444" fill="url(#flagGrad)" strokeWidth={2} name="Flagged" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Active Policies */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Active Policies</h3>
          <div className="space-y-3">
            {policies.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-hover/50 border border-border-default">
                <div>
                  <p className="text-xs font-medium text-text-primary">{p.name}</p>
                  <p className="text-[10px] text-accent-amber font-semibold">{p.value}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent-green/15 text-accent-green">{p.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Incident Log */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border-default">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">AI Integrity Incident Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-default text-[10px] text-text-muted uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Incident</th>
                <th className="py-3 px-4 font-medium">Dept</th>
                <th className="py-3 px-4 font-medium">Student</th>
                <th className="py-3 px-4 font-medium">Detail</th>
                <th className="py-3 px-4 font-medium">Severity</th>
                <th className="py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-text-secondary">
              {incidents.map((inc, i) => (
                <tr key={i} className="border-b border-border-default hover:bg-bg-hover/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-text-primary">{inc.type}</td>
                  <td className="py-3 px-4">{inc.dept}</td>
                  <td className="py-3 px-4 font-mono text-xs">{inc.student}</td>
                  <td className="py-3 px-4 text-xs max-w-xs truncate">{inc.detail}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      inc.severity === "Critical" ? "bg-accent-red/20 text-accent-red" :
                      inc.severity === "High" ? "bg-accent-amber/20 text-accent-amber" :
                      "bg-accent-blue/20 text-accent-blue"
                    }`}>{inc.severity}</span>
                  </td>
                  <td className="py-3 px-4 text-accent-amber text-xs">{inc.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
