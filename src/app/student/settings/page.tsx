"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const settings = {
  profile: { name: "Sarah Jenkins", email: "sarah.jenkins@vtu.edu", roll: "CS21045", semester: "6th", department: "Computer Science" },
  preferences: [
    { id: "darkMode", label: "Dark Mode", desc: "Always-on dark interface", enabled: true },
    { id: "aiMentor", label: "AI Mentor Suggestions", desc: "Context-aware AI prompts during labs", enabled: true },
    { id: "focusAlerts", label: "Focus Break Alerts", desc: "Notify when distracted for > 2 minutes", enabled: false },
    { id: "soundEffects", label: "Sound Effects", desc: "Play sounds for achievements and alerts", enabled: true },
    { id: "analytics", label: "Share Analytics with Faculty", desc: "Allow faculty to view your behavioral data", enabled: true },
  ],
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState(settings.preferences);

  const toggle = (id: string) => {
    setPrefs(prefs.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-text-muted">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.profile).map(([key, value]) => (
            <div key={key}>
              <label className="text-[10px] text-text-muted uppercase tracking-wider">{key}</label>
              <input
                type="text"
                defaultValue={value}
                className="w-full mt-1 bg-bg-hover border border-border-default rounded-xl px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/40 transition-colors"
              />
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Save Changes
        </button>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Preferences</h2>
        <div className="space-y-4">
          {prefs.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between p-4 rounded-xl bg-bg-hover/50 border border-border-default">
              <div>
                <p className="text-sm font-medium text-text-primary">{pref.label}</p>
                <p className="text-xs text-text-muted">{pref.desc}</p>
              </div>
              <button
                onClick={() => toggle(pref.id)}
                className={`w-11 h-6 rounded-full relative transition-colors ${pref.enabled ? "bg-accent-blue" : "bg-bg-hover border border-border-default"}`}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white absolute top-1"
                  animate={{ left: pref.enabled ? 24 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-accent-red/20">
        <h2 className="text-sm font-semibold text-accent-red uppercase tracking-wider mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between p-4 rounded-xl border border-accent-red/20 bg-accent-red/5">
          <div>
            <p className="text-sm font-medium text-text-primary">Delete All Learning Data</p>
            <p className="text-xs text-text-muted">Permanently remove all analytics, submissions, and history</p>
          </div>
          <button className="px-4 py-2 rounded-xl border border-accent-red/30 text-accent-red text-xs font-semibold hover:bg-accent-red/10 transition-colors">
            Delete Data
          </button>
        </div>
      </div>
    </motion.div>
  );
}
