"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/ui/MetricCard";
import GlowOrb from "@/components/ui/GlowOrb";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const classEngagementData = [
  { time: "10:00", active: 55, struggling: 5, idle: 2 },
  { time: "10:15", active: 60, struggling: 3, idle: 1 },
  { time: "10:30", active: 45, struggling: 12, idle: 5 }, // Concept introduced
  { time: "10:45", active: 50, struggling: 8, idle: 4 },
  { time: "11:00", active: 58, struggling: 4, idle: 2 },
];

const riskStudents = [
  { name: "John Doe", id: "CS21045", risk: "High", reason: "Persistent compilation errors (30+ mins)", lastActive: "2m ago" },
  { name: "Alice Smith", id: "CS21012", risk: "Medium", reason: "Frequent context switching", lastActive: "Just now" },
  { name: "Bob Wilson", id: "CS21088", risk: "Medium", reason: "High AI Dependency (90%)", lastActive: "5m ago" },
];

export default function FacultyDashboard() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Command Center</h1>
          <p className="text-sm text-text-muted">Academic Intelligence & Real-time Class Monitoring</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card-sm px-4 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs font-medium">CS302 Lab Active</span>
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-xs font-bold hover:opacity-90">
            Broadcast Message
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Class Engagement" value="85%" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} trend={{ value: 5, positive: true }} color="#ec4899" />
        <MetricCard title="Struggling Students" value="4" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>} color="#f59e0b" subtitle="Requires attention" />
        <MetricCard title="Lab Completion" value="42%" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} color="#10b981" subtitle="26/62 students done" />
        <MetricCard title="Avg. AI Interventions" value="3.2" icon={<span className="text-xl">🤖</span>} color="#8b5cf6" subtitle="Per student today" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Chart */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Live Class State</h3>
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-green"/> Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-amber"/> Struggling</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={classEngagementData}>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="strugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="time" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="active" stackId="1" stroke="#10b981" fill="url(#activeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="struggling" stackId="2" stroke="#f59e0b" fill="url(#strugGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Risk Alerts */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
              <span className="text-accent-red">⚠️</span> Intervention Required
            </h3>
          </div>
          <div className="flex-1 space-y-3">
            {riskStudents.map((student, i) => (
              <div key={i} className="glass-card-sm p-4 border border-accent-red/20 hover:border-accent-red/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-text-primary">{student.name}</span>
                    <span className="text-[10px] text-text-muted ml-2">{student.id}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${student.risk === 'High' ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-amber/20 text-accent-amber'}`}>
                    {student.risk} Risk
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-2 leading-relaxed">{student.reason}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] text-text-muted">Last active: {student.lastActive}</span>
                  <button className="text-[10px] bg-bg-hover hover:bg-accent-blue/20 text-accent-blue px-3 py-1 rounded transition-colors">
                    Join Session →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
