"use client";

import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const departments = [
  { name: "Computer Science", code: "CSE", health: 92, students: 840, faculty: 42, labCompletion: 91, engagement: 88, topStruggle: "Dynamic Programming" },
  { name: "Information Science", code: "ISE", health: 88, students: 420, faculty: 21, labCompletion: 85, engagement: 82, topStruggle: "Graph Theory" },
  { name: "Electronics & Comm.", code: "ECE", health: 75, students: 600, faculty: 30, labCompletion: 72, engagement: 68, topStruggle: "Signal Processing" },
  { name: "AI & Machine Learning", code: "AIML", health: 95, students: 300, faculty: 18, labCompletion: 94, engagement: 92, topStruggle: "Neural Architectures" },
  { name: "Mechanical Engg.", code: "MECH", health: 70, students: 520, faculty: 28, labCompletion: 65, engagement: 60, topStruggle: "Thermodynamics" },
  { name: "Civil Engineering", code: "CIVIL", health: 78, students: 380, faculty: 20, labCompletion: 74, engagement: 70, topStruggle: "Structural Analysis" },
];

const chartData = departments.map(d => ({ name: d.code, health: d.health, engagement: d.engagement }));

export default function DepartmentsPage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold mb-1">Department Analytics</h1>
        <p className="text-sm text-text-muted">Cross-department performance, engagement, and learning quality</p>
      </div>

      {/* Chart */}
      <motion.div variants={item} className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Health vs Engagement by Department</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,200,0.06)" />
              <XAxis dataKey="name" stroke="#555577" fontSize={11} tickLine={false} />
              <YAxis stroke="#555577" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#141425", border: "1px solid rgba(100,100,200,0.15)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="health" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Health Score" />
              <Bar dataKey="engagement" fill="#00d4ff" radius={[4, 4, 0, 0]} name="Engagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, i) => (
          <motion.div key={i} variants={item} className="glass-card p-5 hover:border-border-active transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-text-primary group-hover:text-accent-amber transition-colors">{dept.name}</h3>
                <p className="text-[10px] text-text-muted">{dept.code} • {dept.students} students • {dept.faculty} faculty</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: dept.health >= 85 ? "#10b981" : dept.health >= 70 ? "#f59e0b" : "#ef4444" }}>{dept.health}</p>
                <p className="text-[9px] text-text-muted">Health</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Lab Completion</span>
                <span className="text-text-primary font-medium">{dept.labCompletion}%</span>
              </div>
              <div className="w-full h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-accent-amber" style={{ width: `${dept.labCompletion}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-text-muted">Top Struggle Area</span>
                <span className="text-accent-red text-[10px]">{dept.topStruggle}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
