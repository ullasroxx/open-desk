"use client";

import { motion } from "framer-motion";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const vivaRecords = [
  { student: "Aarav Sharma", id: "CS21001", topic: "BST Operations", score: 92, confidence: 88, depth: "Excellent", date: "May 12" },
  { student: "Priya Nair", id: "CS21012", topic: "Graph Traversal", score: 78, confidence: 65, depth: "Good", date: "May 12" },
  { student: "Rahul Verma", id: "CS21024", topic: "Dynamic Programming", score: 45, confidence: 32, depth: "Needs Review", date: "May 11" },
  { student: "Meera Reddy", id: "CS21033", topic: "Sorting Algorithms", score: 95, confidence: 91, depth: "Outstanding", date: "May 11" },
];

const questionBank = [
  { q: "Explain time complexity of quicksort", topic: "Sorting", difficulty: "Medium", timesAsked: 24, avgScore: 72 },
  { q: "Difference between BFS and DFS", topic: "Graphs", difficulty: "Easy", timesAsked: 45, avgScore: 84 },
  { q: "When does BST degenerate?", topic: "Trees", difficulty: "Hard", timesAsked: 18, avgScore: 58 },
];

export default function VivaIntelligencePage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

    const { toasts, show } = useToast();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Viva Intelligence</h1>
          <p className="text-sm text-text-muted">AI-powered viva analytics and question bank management</p>
        </div>
        <button onClick={() => show("Launching AI Viva Session...", "info")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-bold hover:opacity-90">
          + Schedule New Viva
        </button>
      </div>

      {/* Viva Results Table */}
      <motion.div variants={item} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border-default">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Recent Viva Sessions</h3>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-default text-[10px] text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4 font-medium">Student</th>
              <th className="py-3 px-4 font-medium">Topic</th>
              <th className="py-3 px-4 font-medium">Score</th>
              <th className="py-3 px-4 font-medium">Confidence</th>
              <th className="py-3 px-4 font-medium">Depth</th>
              <th className="py-3 px-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vivaRecords.map((r, i) => (
              <tr key={i} className="border-b border-border-default hover:bg-bg-hover/30 transition-colors cursor-pointer">
                <td className="py-3 px-4">
                  <p className="font-medium text-text-primary">{r.student}</p>
                  <p className="text-[10px] text-text-muted">{r.id}</p>
                </td>
                <td className="py-3 px-4 text-text-secondary">{r.topic}</td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-bold ${r.score >= 80 ? "text-accent-green" : r.score >= 60 ? "text-accent-amber" : "text-accent-red"}`}>{r.score}%</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-accent-purple" style={{ width: `${r.confidence}%` }} />
                    </div>
                    <span className="text-xs text-text-muted">{r.confidence}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                    r.depth === "Outstanding" ? "bg-accent-green/15 text-accent-green" :
                    r.depth === "Excellent" ? "bg-accent-blue/15 text-accent-blue" :
                    r.depth === "Good" ? "bg-accent-amber/15 text-accent-amber" :
                    "bg-accent-red/15 text-accent-red"
                  }`}>{r.depth}</span>
                </td>
                <td className="py-3 px-4 text-xs text-text-muted">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Question Bank */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">AI Question Bank Analytics</h3>
          <button onClick={() => show("Opening Question Bank Manager...", "info")} className="text-xs text-accent-pink hover:underline">Manage Bank →</button>
        </div>
        <div className="space-y-3">
          {questionBank.map((q, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-bg-hover/50 border border-border-default hover:border-border-active transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">{q.q}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-text-muted">{q.topic}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    q.difficulty === "Easy" ? "bg-green-500/10 text-green-400" :
                    q.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{q.difficulty}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-sm font-bold text-accent-blue">{q.timesAsked}</p>
                  <p className="text-[9px] text-text-muted">Times Asked</p>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: q.avgScore >= 70 ? "#10b981" : "#f59e0b" }}>{q.avgScore}%</p>
                  <p className="text-[9px] text-text-muted">Avg Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
