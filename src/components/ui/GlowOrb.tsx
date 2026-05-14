"use client";

import { motion } from "framer-motion";

type OrbState = "flow" | "struggling" | "distracted" | "idle";

const stateConfig: Record<OrbState, { color: string; label: string; glow: string; emoji: string }> = {
  flow: {
    color: "#10b981",
    label: "FLOW STATE",
    glow: "rgba(16, 185, 129, 0.4)",
    emoji: "🟢",
  },
  struggling: {
    color: "#f59e0b",
    label: "STRUGGLING",
    glow: "rgba(245, 158, 11, 0.4)",
    emoji: "🟡",
  },
  distracted: {
    color: "#ef4444",
    label: "DISTRACTED",
    glow: "rgba(239, 68, 68, 0.4)",
    emoji: "🔴",
  },
  idle: {
    color: "#6366f1",
    label: "IDLE",
    glow: "rgba(99, 102, 241, 0.4)",
    emoji: "🔵",
  },
};

export default function GlowOrb({
  state = "flow",
  size = 48,
}: {
  state?: OrbState;
  size?: number;
}) {
  const config = stateConfig[state];

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: config.color }}
          animate={{
            boxShadow: [
              `0 0 ${size * 0.3}px ${config.glow}, 0 0 ${size * 0.6}px ${config.glow}`,
              `0 0 ${size * 0.5}px ${config.glow}, 0 0 ${size * 0.9}px ${config.glow}`,
              `0 0 ${size * 0.3}px ${config.glow}, 0 0 ${size * 0.6}px ${config.glow}`,
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${config.color}ee, ${config.color}88)`,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: config.color + "44" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
      <div>
        <div
          className="text-xs font-bold tracking-wider"
          style={{ color: config.color }}
        >
          {config.emoji} {config.label}
        </div>
      </div>
    </div>
  );
}
