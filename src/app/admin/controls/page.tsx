"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const platformSettings = [
  { id: "realtime", label: "Realtime Behavioral Tracking", desc: "Enable live focus, struggle, and engagement detection", enabled: true, category: "Intelligence" },
  { id: "aiTutor", label: "AI Context Tutor", desc: "Allow AI to observe and guide students during labs", enabled: true, category: "Intelligence" },
  { id: "vivaAuto", label: "Auto-Viva Triggers", desc: "Automatically schedule viva for flagged students", enabled: true, category: "Automation" },
  { id: "pasteDetect", label: "Paste Detection", desc: "Flag large clipboard pastes in lab environments", enabled: true, category: "Integrity" },
  { id: "tabMonitor", label: "Tab-Switch Monitoring", desc: "Track context switches during active lab sessions", enabled: false, category: "Integrity" },
  { id: "codeCompare", label: "Cross-Student Code DNA", desc: "Compare code patterns across student submissions", enabled: true, category: "Integrity" },
  { id: "portfolio", label: "Student Portfolio Export", desc: "Allow students to export their portfolio publicly", enabled: true, category: "Features" },
  { id: "parentAccess", label: "Parent/Guardian Access", desc: "Allow guardians to view student progress reports", enabled: false, category: "Features" },
];

export default function PlatformControlsPage() {
  const [settings, setSettings] = useState(platformSettings);

  const toggle = (id: string) => {
    setSettings(settings.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const categories = [...new Set(settings.map(s => s.category))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Platform Controls</h1>
        <p className="text-sm text-text-muted">Manage institution-wide platform features and behavioral intelligence settings</p>
      </div>

      {/* System Status */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">System Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "API Status", v: "Operational", c: "#10b981" },
            { l: "Database", v: "Healthy", c: "#10b981" },
            { l: "AI Engine", v: "Active", c: "#4f8fff" },
            { l: "Uptime", v: "99.97%", c: "#8b5cf6" },
          ].map((m, i) => (
            <div key={i} className="glass-card-sm p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.c }} />
                <span className="text-sm font-bold" style={{ color: m.c }}>{m.v}</span>
              </div>
              <p className="text-[10px] text-text-muted">{m.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Toggles by Category */}
      {categories.map((cat) => (
        <div key={cat} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">{cat}</h3>
          <div className="space-y-3">
            {settings.filter(s => s.category === cat).map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-bg-hover/50 border border-border-default hover:border-border-active transition-colors">
                <div>
                  <p className="text-sm font-medium text-text-primary">{setting.label}</p>
                  <p className="text-xs text-text-muted">{setting.desc}</p>
                </div>
                <button
                  onClick={() => toggle(setting.id)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${setting.enabled ? "bg-accent-amber" : "bg-bg-hover border border-border-default"}`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white absolute top-1"
                    animate={{ left: setting.enabled ? 24 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
