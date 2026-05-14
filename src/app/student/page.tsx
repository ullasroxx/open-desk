"use client";

import { motion } from "framer-motion";
import MetricCard from "@/components/ui/MetricCard";
import GlowOrb from "@/components/ui/GlowOrb";
import SkillRadar from "@/components/ui/SkillRadar";
import ActivityHeatmap from "@/components/ui/ActivityHeatmap";
import { getGreeting, getRandomMotivation } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const focusData = [
  { time: "9AM", focus: 72, momentum: 65 },
  { time: "10AM", focus: 85, momentum: 78 },
  { time: "11AM", focus: 91, momentum: 88 },
  { time: "12PM", focus: 68, momentum: 60 },
  { time: "1PM", focus: 45, momentum: 42 },
  { time: "2PM", focus: 78, momentum: 72 },
  { time: "3PM", focus: 88, momentum: 85 },
  { time: "4PM", focus: 82, momentum: 79 },
];

const weeklyData = [
  { day: "Mon", score: 78 }, { day: "Tue", score: 85 },
  { day: "Wed", score: 72 }, { day: "Thu", score: 91 },
  { day: "Fri", score: 88 }, { day: "Sat", score: 65 },
  { day: "Sun", score: 45 },
];

const skills = [
  { name: "Problem Solving", value: 82, color: "#4f8fff" },
  { name: "Debugging", value: 75, color: "#8b5cf6" },
  { name: "Concept Clarity", value: 88, color: "#00d4ff" },
  { name: "Focus", value: 70, color: "#10b981" },
  { name: "AI Independence", value: 65, color: "#f59e0b" },
  { name: "Code Quality", value: 78, color: "#ec4899" },
];

const heatmapData = Array.from({ length: 7 }, () =>
  Array.from({ length: 20 }, () => Math.floor(Math.random() * 8))
);

const journeySteps = [
  { label: "Pre-Lab", status: "done", color: "#10b981" },
  { label: "Lab Session", status: "active", color: "#4f8fff" },
  { label: "Reflection", status: "pending", color: "#555577" },
  { label: "Assignment", status: "pending", color: "#555577" },
  { label: "Viva Prep", status: "pending", color: "#555577" },
];

const aiMessages = [
  { text: "You struggled with recursion yesterday. Want a quick adaptive revision?", type: "insight" },
  { text: "Your debugging persistence rose 15% this week — great improvement!", type: "praise" },
  { text: "I noticed you paused on linked list traversal. Here's a visual guide.", type: "help" },
];

export default function StudentDashboard() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      {/* Welcome */}
      <motion.div variants={item} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent-blue/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-text-muted text-sm mb-1">{getGreeting()}</p>
            <h1 className="text-2xl font-bold mb-2">Welcome back, <span className="gradient-text">Student</span> 👋</h1>
            <p className="text-text-secondary text-sm max-w-md">{getRandomMotivation()}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-blue">87</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Focus Score</p>
            </div>
            <div className="w-px h-10 bg-border-default" />
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-green">A+</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Strongest</p>
            </div>
            <div className="w-px h-10 bg-border-default" />
            <GlowOrb state="flow" size={40} />
          </div>
        </div>
      </motion.div>

      {/* Today's Journey */}
      <motion.div variants={item} className="glass-card p-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Today&apos;s Academic Journey</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {journeySteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{
                borderColor: step.color + "40",
                background: step.status === "active" ? step.color + "15" : "transparent",
              }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{
                  background: step.color,
                  boxShadow: step.status === "active" ? `0 0 8px ${step.color}` : "none",
                }} />
                <span className="text-xs font-medium" style={{ color: step.color === "#555577" ? "#555577" : "#e8e8f0" }}>
                  {step.label}
                </span>
              </div>
              {i < journeySteps.length - 1 && (
                <div className="w-6 h-px" style={{ background: step.color + "40" }} />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Focus Score" value="87%" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>} trend={{ value: 12, positive: true }} color="#4f8fff" />
        <MetricCard title="Confusion Index" value="23%" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} trend={{ value: 8, positive: true }} color="#f59e0b" />
        <MetricCard title="Momentum" value="High" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} subtitle="3-day streak" color="#10b981" />
        <MetricCard title="Confidence" value="78%" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>} trend={{ value: 5, positive: true }} color="#8b5cf6" />
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Focus Chart */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Focus & Momentum Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusData}>
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f8fff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f8fff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="time" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="focus" stroke="#4f8fff" fill="url(#focusGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="momentum" stroke="#8b5cf6" fill="url(#momentumGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Mentor */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">AI Mentor</h3>
              <p className="text-[10px] text-accent-green">Online • Context-aware</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 mb-4">
            {aiMessages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.2 }}
                className="glass-card-sm p-3 rounded-xl text-xs text-text-secondary leading-relaxed">
                {msg.text}
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Ask your AI mentor..." className="flex-1 bg-bg-hover border border-border-default rounded-xl px-3 py-2 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent-purple/40" />
            <button className="p-2 rounded-xl bg-accent-purple/20 text-accent-purple hover:bg-accent-purple/30 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning DNA */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 self-start">Learning DNA</h3>
          <SkillRadar skills={skills} size={220} />
        </motion.div>

        {/* Weekly Performance */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Weekly Performance</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
                <XAxis dataKey="day" stroke="#555577" fontSize={11} tickLine={false} />
                <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="score" fill="#4f8fff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Engagement Heatmap</h3>
          <ActivityHeatmap data={heatmapData} label="Last 20 weeks" />
        </motion.div>
      </div>

      {/* Skill Evolution */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Skill Evolution Map</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Arrays", level: 8, xp: 850, color: "#4f8fff" },
            { name: "Recursion", level: 5, xp: 520, color: "#8b5cf6" },
            { name: "Trees", level: 6, xp: 630, color: "#00d4ff" },
            { name: "Sorting", level: 9, xp: 920, color: "#10b981" },
            { name: "Graphs", level: 3, xp: 310, color: "#f59e0b" },
            { name: "DP", level: 4, xp: 440, color: "#ec4899" },
          ].map((skill, i) => (
            <motion.div key={i} className="glass-card-sm p-4 text-center group hover:border-border-active transition-all cursor-pointer"
              whileHover={{ y: -2 }}>
              <div className="text-2xl font-bold mb-1" style={{ color: skill.color }}>Lv.{skill.level}</div>
              <p className="text-xs font-medium text-text-primary mb-1">{skill.name}</p>
              <div className="w-full h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: skill.color }}
                  initial={{ width: 0 }} animate={{ width: `${(skill.xp % 100)}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
              </div>
              <p className="text-[10px] text-text-muted mt-1">{skill.xp} XP</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
