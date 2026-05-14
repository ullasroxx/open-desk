"use client";

import { motion } from "framer-motion";

interface HeatmapProps {
  data: number[][]; // 7 rows (days) x N columns (weeks)
  label?: string;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ActivityHeatmap({ data, label = "Activity" }: HeatmapProps) {
  const maxVal = Math.max(...data.flat());

  function getColor(val: number) {
    if (val === 0) return "rgba(100,100,200,0.05)";
    const intensity = val / maxVal;
    if (intensity < 0.25) return "rgba(79, 143, 255, 0.15)";
    if (intensity < 0.5) return "rgba(79, 143, 255, 0.3)";
    if (intensity < 0.75) return "rgba(79, 143, 255, 0.55)";
    return "rgba(79, 143, 255, 0.85)";
  }

  return (
    <div>
      <p className="text-text-secondary text-xs font-medium mb-3">{label}</p>
      <div className="flex gap-1">
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((d) => (
            <div key={d} className="text-[9px] text-text-muted h-[14px] flex items-center">
              {d}
            </div>
          ))}
        </div>
        {data[0]?.map((_, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {data.map((_, dayIdx) => (
              <motion.div
                key={dayIdx}
                className="heatmap-cell"
                style={{
                  width: 14,
                  height: 14,
                  background: getColor(data[dayIdx]?.[weekIdx] || 0),
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: (weekIdx * 7 + dayIdx) * 0.008,
                  duration: 0.2,
                }}
                title={`${dayLabels[dayIdx]}: ${data[dayIdx]?.[weekIdx] || 0} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-text-muted">Less</span>
        {[0.05, 0.15, 0.3, 0.55, 0.85].map((op, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{
              background:
                i === 0
                  ? "rgba(100,100,200,0.05)"
                  : `rgba(79, 143, 255, ${op})`,
            }}
          />
        ))}
        <span className="text-[10px] text-text-muted">More</span>
      </div>
    </div>
  );
}
