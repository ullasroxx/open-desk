"use client";

import { motion } from "framer-motion";

const riskAlerts = [
  { id: "RISK-001", type: "Academic Integrity", desc: "3 students in ECE show identical code DNA patterns in Lab 7", severity: "Critical", dept: "ECE", time: "2 hours ago", status: "Open" },
  { id: "RISK-002", type: "Engagement Drop", desc: "CSE Section B engagement dropped 25% this week", severity: "High", dept: "CSE", time: "6 hours ago", status: "Investigating" },
  { id: "RISK-003", type: "Faculty Delay", desc: "3 labs pending evaluation for > 7 days in MECH", severity: "Medium", dept: "MECH", time: "1 day ago", status: "Notified" },
  { id: "RISK-004", type: "AI Abuse Pattern", desc: "Cluster of high AI dependency detected in ISE Lab 4", severity: "High", dept: "ISE", time: "3 hours ago", status: "Open" },
];

const complianceChecks = [
  { item: "All labs have rubrics attached", status: "Pass", coverage: "100%" },
  { item: "Viva conducted for flagged students", status: "Pass", coverage: "100%" },
  { item: "Internal marks submitted on time", status: "Partial", coverage: "87%" },
  { item: "Faculty evaluation logs complete", status: "Partial", coverage: "92%" },
  { item: "Student reflection submissions", status: "Pass", coverage: "96%" },
  { item: "Academic audit trail integrity", status: "Pass", coverage: "100%" },
];

export default function RiskCompliancePage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Risk & Compliance</h1>
          <p className="text-sm text-text-muted">Proactive risk detection and accreditation-ready compliance tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 rounded-xl bg-bg-hover border border-border-default text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Export Audit Report
          </button>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Open Risks", v: "2", c: "#ef4444" },
          { l: "Investigating", v: "1", c: "#f59e0b" },
          { l: "Resolved (Week)", v: "8", c: "#10b981" },
          { l: "Compliance Score", v: "96%", c: "#4f8fff" },
        ].map((m, i) => (
          <motion.div key={i} variants={item} className="glass-card-sm p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: m.c }}>{m.v}</p>
            <p className="text-xs font-medium text-text-primary mt-1">{m.l}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Risk Alerts */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Active Risk Alerts</h3>
        <div className="space-y-3">
          {riskAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-xl border transition-colors hover:border-border-active ${
              alert.severity === "Critical" ? "border-accent-red/30 bg-accent-red/5" :
              alert.severity === "High" ? "border-accent-amber/30 bg-accent-amber/5" :
              "border-border-default bg-bg-hover/30"
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    alert.severity === "Critical" ? "bg-accent-red/20 text-accent-red" :
                    alert.severity === "High" ? "bg-accent-amber/20 text-accent-amber" :
                    "bg-accent-blue/20 text-accent-blue"
                  }`}>{alert.severity}</span>
                  <span className="text-sm font-bold text-text-primary">{alert.type}</span>
                  <span className="text-[10px] text-text-muted">{alert.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">{alert.time}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    alert.status === "Open" ? "bg-accent-red/10 text-accent-red" :
                    alert.status === "Investigating" ? "bg-accent-amber/10 text-accent-amber" :
                    "bg-accent-green/10 text-accent-green"
                  }`}>{alert.status}</span>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed ml-0 md:ml-16">{alert.desc}</p>
              <div className="flex items-center gap-3 mt-3 ml-0 md:ml-16">
                <span className="text-[10px] text-text-muted">Dept: {alert.dept}</span>
                <button className="text-[10px] text-accent-amber hover:underline">Investigate →</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Compliance Checklist */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Accreditation Compliance Checklist</h3>
        <div className="space-y-2">
          {complianceChecks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-hover/30 border border-border-default">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                  check.status === "Pass" ? "bg-accent-green/15 text-accent-green" : "bg-accent-amber/15 text-accent-amber"
                }`}>
                  {check.status === "Pass" ? "✓" : "!"}
                </div>
                <span className="text-sm text-text-primary">{check.item}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">{check.coverage}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  check.status === "Pass" ? "bg-accent-green/10 text-accent-green" : "bg-accent-amber/10 text-accent-amber"
                }`}>{check.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
