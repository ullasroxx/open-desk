"use client";

import { motion } from "framer-motion";

interface SkillRadarProps {
  skills: { name: string; value: number; color: string }[];
  size?: number;
}

export default function SkillRadar({ skills, size = 220 }: SkillRadarProps) {
  const center = size / 2;
  const maxRadius = size / 2 - 30;
  const levels = 5;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {Array.from({ length: levels }).map((_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="rgba(100,100,200,0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {skills.map((_, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * maxRadius}
              y2={center + Math.sin(angle) * maxRadius}
              stroke="rgba(100,100,200,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          points={skills
            .map((skill, i) => {
              const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
              const r = (skill.value / 100) * maxRadius;
              return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
            })
            .join(" ")}
          fill="rgba(79, 143, 255, 0.12)"
          stroke="rgba(79, 143, 255, 0.6)"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Data points */}
        {skills.map((skill, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
          const r = (skill.value / 100) * maxRadius;
          return (
            <motion.circle
              key={i}
              cx={center + Math.cos(angle) * r}
              cy={center + Math.sin(angle) * r}
              r={4}
              fill={skill.color}
              stroke="#0a0a0f"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          );
        })}

        {/* Labels */}
        {skills.map((skill, i) => {
          const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
          const labelR = maxRadius + 18;
          const x = center + Math.cos(angle) * labelR;
          const y = center + Math.sin(angle) * labelR;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8888aa"
              fontSize={9}
              fontWeight={500}
            >
              {skill.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
