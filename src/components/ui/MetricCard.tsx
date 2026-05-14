"use client";

import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
  glowColor?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = "#4f8fff",
  glowColor,
}: MetricCardProps) {
  return (
    <motion.div
      className="metric-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-2.5 rounded-xl"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}25`,
          }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend.positive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-text-muted text-xs">{subtitle}</p>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </motion.div>
  );
}
