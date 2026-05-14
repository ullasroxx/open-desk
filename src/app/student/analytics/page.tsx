"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import MetricCard from "@/components/ui/MetricCard";

const cognitiveLoadData = [
  { time: "Week 1", load: 30, mastery: 45 },
  { time: "Week 2", load: 50, mastery: 55 },
  { time: "Week 3", load: 85, mastery: 65 }, // Struggle zone
  { time: "Week 4", load: 60, mastery: 80 },
  { time: "Week 5", load: 45, mastery: 88 },
  { time: "Week 6", load: 55, mastery: 92 },
];

const struggleAreas = [
  { topic: "Dynamic Programming", timeSpent: "14h", severity: "High", resolved: false },
  { topic: "Graph Traversal", timeSpent: "8h", severity: "Medium", resolved: true },
  { topic: "Memory Management", timeSpent: "5h", severity: "Low", resolved: true },
];

const behaviorStats = [
  { label: "Deep Work Sessions", value: "24", trend: "+3", desc: "> 45 mins of uninterrupted coding" },
  { label: "Avg. Debug Time", value: "14m", trend: "-2m", desc: "Time taken to resolve compile errors" },
  { label: "AI Dependency", value: "Low", trend: "-12%", desc: "Ratio of AI hints to raw keystrokes" },
  { label: "Code Deletion Spike", value: "Rare", trend: "0", desc: "Frequent rewriting indicator" },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 10))
);

export default function AnalyticsPage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-bold mb-1">Learning Analytics</h1>
        <p className="text-sm text-text-muted">Behavioral intelligence and cognitive progression</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Cognitive Momentum" value="84/100" icon={<span className="text-xl">🧠</span>} trend={{ value: 5, positive: true }} color="#00d4ff" />
        <MetricCard title="Focus Continuity" value="92%" icon={<span className="text-xl">⚡</span>} trend={{ value: 2, positive: true }} color="#10b981" />
        <MetricCard title="Struggle Index" value="Low" icon={<span className="text-xl">🧗</span>} color="#f59e0b" subtitle="Optimal difficulty zone" />
        <MetricCard title="Mastery Rate" value="1.4x" icon={<span className="text-xl">📈</span>} trend={{ value: 0.2, positive: true }} color="#8b5cf6" subtitle="Compared to cohort" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Cognitive Load vs. Concept Mastery</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cognitiveLoadData}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="masteryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="time" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="load" stroke="#ef4444" fill="url(#loadGrad)" strokeWidth={2} name="Cognitive Load" />
                <Area type="monotone" dataKey="mastery" stroke="#10b981" fill="url(#masteryGrad)" strokeWidth={2} name="Concept Mastery" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Active Struggle Zones</h3>
          <div className="flex-1 space-y-3">
            {struggleAreas.map((area, i) => (
              <div key={i} className="glass-card-sm p-4 border border-border-default hover:border-border-active transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{area.topic}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${area.resolved ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                    {area.resolved ? "Resolved" : "Needs Review"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>⏱️ {area.timeSpent} spent</span>
                  <span>🔥 {area.severity} severity</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Behavioral Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {behaviorStats.map((stat, i) => (
              <div key={i} className="glass-card-sm p-4">
                <p className="text-text-muted text-xs mb-1">{stat.label}</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-xl font-bold text-accent-blue">{stat.value}</span>
                  <span className={`text-[10px] font-medium ${stat.trend.startsWith('+') || stat.trend === '0' || stat.trend.includes('-12%') ? 'text-accent-green' : 'text-accent-red'}`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-[9px] text-text-secondary leading-tight">{stat.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Daily Engagement Distribution</h3>
          <ActivityHeatmap data={heatmapData} label="Hours vs Days (Last 24 Weeks)" />
        </motion.div>
      </div>
    </motion.div>
  );
}
