"use client";

import { motion } from "framer-motion";
import GlowOrb from "@/components/ui/GlowOrb";

// Mock 30 students in a lab grid
const studentGrid = Array.from({ length: 30 }, (_, i) => {
  const rand = Math.random();
  let state: "flow" | "struggling" | "distracted" | "idle" = "flow";
  if (rand > 0.85) state = "struggling";
  else if (rand > 0.75) state = "distracted";
  else if (rand > 0.95) state = "idle";

  return {
    id: `WS-${(i + 1).toString().padStart(2, "0")}`,
    name: `Student ${i + 1}`,
    state,
    progress: Math.floor(Math.random() * 60) + 40,
    errors: state === "struggling" ? Math.floor(Math.random() * 5) + 1 : 0
  };
});

export default function LiveMonitoringPage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Live Classroom Grid</h1>
          <p className="text-sm text-text-muted">CS302 - Data Structures Lab</p>
        </div>
        <div className="flex items-center gap-6 glass-card-sm px-6 py-3">
          <div className="flex items-center gap-2"><GlowOrb state="flow" size={16}/> <span className="text-xs text-text-muted">22 Flow</span></div>
          <div className="flex items-center gap-2"><GlowOrb state="struggling" size={16}/> <span className="text-xs text-text-muted">5 Struggling</span></div>
          <div className="flex items-center gap-2"><GlowOrb state="distracted" size={16}/> <span className="text-xs text-text-muted">2 Distracted</span></div>
          <div className="flex items-center gap-2"><GlowOrb state="idle" size={16}/> <span className="text-xs text-text-muted">1 Idle</span></div>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {studentGrid.map((student) => (
          <motion.div 
            key={student.id} 
            variants={item}
            className={`glass-card p-4 flex flex-col items-center text-center relative overflow-hidden transition-all hover:-translate-y-1 cursor-pointer ${
              student.state === 'struggling' ? 'border-accent-amber/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
              student.state === 'distracted' ? 'border-accent-red/40' : 'hover:border-border-active'
            }`}
          >
            {/* Background progress bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-bg-hover w-full">
              <div className="h-full bg-accent-blue/50" style={{ width: `${student.progress}%` }} />
            </div>

            <GlowOrb state={student.state} size={32} />
            <h4 className="text-sm font-bold text-text-primary mt-3">{student.id}</h4>
            <p className="text-[10px] text-text-muted mb-2">{student.name}</p>
            
            {student.errors > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-amber/20 text-accent-amber font-medium">
                {student.errors} Errors
              </span>
            ) : (
              <span className="text-[10px] text-text-muted">Active</span>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-accent-blue text-white shadow-lg">
                View Screen
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
