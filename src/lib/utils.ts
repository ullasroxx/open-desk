import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getRandomMotivation() {
  const motivations = [
    "Your consistency is building neural pathways. Keep going! 🧠",
    "Every debug session makes you 1% better. Compound that! 📈",
    "Flow state detected 3 times this week. You're leveling up! ⚡",
    "Your problem-solving index rose 12% this month. Impressive! 🎯",
    "Top 15% in debugging persistence. That's rare talent! 💎",
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}
