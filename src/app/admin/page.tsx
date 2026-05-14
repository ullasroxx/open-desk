"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/ui/MetricCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const departmentData = [
  { name: "CSE", health: 92, students: 840 },
  { name: "ISE", health: 88, students: 420 },
  { name: "ECE", health: 75, students: 600 },
  { name: "AIML", health: 95, students: 300 },
];

const adoptionData = [
  { month: "Jan", adoption: 30 },
  { month: "Feb", adoption: 45 },
  { month: "Mar", adoption: 65 },
  { month: "Apr", adoption: 82 },
  { month: "May", adoption: 91 },
];

export default function AdminDashboard() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Global Intelligence Overview</h1>
          <p className="text-sm text-text-muted">VTU Autonomous Institution Platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-card-sm px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs font-medium text-accent-green">System Healthy</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-bg-hover border border-border-default text-xs font-bold hover:text-text-primary transition-colors">
            Generate Compliance Report
          </button>
        </div>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Institution Health" value="A+" icon={<span className="text-xl">🏛️</span>} trend={{ value: 2, positive: true }} color="#f59e0b" subtitle="Top 5% regionally" />
        <MetricCard title="AI Adoption" value="91%" icon={<span className="text-xl">🚀</span>} trend={{ value: 9, positive: true }} color="#00d4ff" />
        <MetricCard title="Active Labs" value="142" icon={<span className="text-xl">🔬</span>} color="#8b5cf6" subtitle="Across 8 departments" />
        <MetricCard title="Risk Alerts" value="3" icon={<span className="text-xl">⚠️</span>} trend={{ value: 12, positive: false }} color="#ef4444" subtitle="Plagiarism & AI Dependency" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Health Chart */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Department Health Scores</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="name" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'rgba(100,100,200,0.05)'}} contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="health" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Platform Adoption */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Platform AI Adoption Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adoptionData}>
                <defs>
                  <linearGradient id="adoptGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="month" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="adoption" stroke="#00d4ff" fill="url(#adoptGrad)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* AI Governance & Risk Table */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">AI Governance & Compliance Incidents</h3>
          <span className="text-xs text-text-muted">Last 7 days</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default text-[10px] text-text-muted uppercase tracking-wider">
                <th className="pb-3 px-4 font-medium">Incident Type</th>
                <th className="pb-3 px-4 font-medium">Department</th>
                <th className="pb-3 px-4 font-medium">Severity</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium">Action Taken</th>
              </tr>
            </thead>
            <tbody className="text-sm text-text-secondary">
              {[
                { type: "High AI Dependency (>95%)", dept: "CSE", sev: "Medium", status: "Review", action: "Flagged to Mentor" },
                { type: "Copy/Paste Anomaly", dept: "ECE", sev: "High", status: "Resolved", action: "Submission Voided" },
                { type: "Inconsistent Code DNA", dept: "ISE", sev: "High", status: "Open", action: "Viva Triggered" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border-default hover:bg-bg-hover/30 transition-colors">
                  <td className="py-3 px-4 text-text-primary font-medium">{row.type}</td>
                  <td className="py-3 px-4">{row.dept}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${row.sev === 'High' ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-amber/20 text-accent-amber'}`}>{row.sev}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px]">{row.status}</span>
                  </td>
                  <td className="py-3 px-4 text-accent-blue">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
