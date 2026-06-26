"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const vivaQuestions = [
  { q: "Explain the time complexity of BST insertion in the worst case.", difficulty: "Medium", topic: "BST" },
  { q: "What is the difference between a BST and a balanced BST?", difficulty: "Easy", topic: "Trees" },
  { q: "How would you convert a BST to a sorted doubly linked list?", difficulty: "Hard", topic: "BST" },
  { q: "Explain inorder traversal without recursion.", difficulty: "Medium", topic: "Traversal" },
];

export default function VivaPage() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState(72);

  if (!started) {
      const { toasts, show } = useToast();

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-lg">
          <motion.div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center"
            animate={{ boxShadow: ["0 0 30px rgba(139,92,246,0.3)", "0 0 60px rgba(139,92,246,0.5)", "0 0 30px rgba(139,92,246,0.3)"] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <span className="text-4xl">🎙️</span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 gradient-text">AI Viva Simulation</h1>
          <p className="text-text-secondary mb-2">Prepare for your practical viva with our AI interviewer</p>
          <p className="text-text-muted text-sm mb-8">Personalized questions based on your lab work and learning patterns</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[{ l: "Questions", v: "4", c: "#4f8fff" }, { l: "Duration", v: "~15 min", c: "#8b5cf6" }, { l: "Difficulty", v: "Adaptive", c: "#10b981" }].map((m, i) => (
              <div key={i} className="glass-card-sm p-3">
                <p className="text-lg font-bold" style={{ color: m.c }}>{m.v}</p>
                <p className="text-[10px] text-text-muted">{m.l}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setStarted(true)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold hover:opacity-90 transition-opacity">
            Begin Viva Session
          </button>
        </div>
      </motion.div>
    );
  }

  const q = vivaQuestions[currentQ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">AI Viva Session</h1>
          <p className="text-xs text-text-muted">Question {currentQ + 1} of {vivaQuestions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(100,100,200,0.1)" strokeWidth="4" />
                <motion.circle cx="28" cy="28" r="24" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={150} initial={{ strokeDashoffset: 150 }} animate={{ strokeDashoffset: 150 - (confidence / 100) * 150 }}
                  transition={{ duration: 1 }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-accent-purple">{confidence}%</span>
            </div>
            <p className="text-[9px] text-text-muted mt-1">Confidence</p>
          </div>
          <div className="glass-card-sm px-3 py-1.5 rounded-full">
            <span className="text-xs text-accent-green">● Recording</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {vivaQuestions.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-bg-hover">
            <motion.div className="h-full rounded-full" style={{ background: i <= currentQ ? "#8b5cf6" : "transparent" }}
              initial={{ width: 0 }} animate={{ width: i <= currentQ ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
          </div>
        ))}
      </div>

      {/* Question Card */}
      <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-purple to-accent-pink" />
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-[10px] px-3 py-1 rounded-full font-semibold ${
            q.difficulty === "Easy" ? "bg-green-500/15 text-green-400" :
            q.difficulty === "Medium" ? "bg-amber-500/15 text-amber-400" :
            "bg-red-500/15 text-red-400"
          }`}>{q.difficulty}</span>
          <span className="text-[10px] px-3 py-1 rounded-full bg-accent-blue/15 text-accent-blue">{q.topic}</span>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center text-lg shrink-0">🤖</div>
          <p className="text-lg font-medium leading-relaxed">{q.q}</p>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-32 bg-bg-hover border border-border-default rounded-xl p-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-purple/40 resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button onClick={() => show("Recording paused", "info")} className="p-2.5 rounded-xl bg-bg-hover border border-border-default text-text-secondary hover:text-text-primary transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
            </button>
            <span className="text-[10px] text-text-muted">Voice answer</span>
          </div>
          <button
            onClick={() => { setCurrentQ(Math.min(currentQ + 1, vivaQuestions.length - 1)); setAnswer(""); setConfidence(Math.min(confidence + 5, 100)); }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {currentQ < vivaQuestions.length - 1 ? "Next Question →" : "Finish Viva"}
          </button>
        </div>
      </motion.div>

      {/* Live Analysis */}
      <div className="grid grid-cols-3 gap-4">
        {[{ l: "Response Quality", v: "Good", c: "#10b981" }, { l: "Depth Score", v: "7/10", c: "#4f8fff" }, { l: "Hesitation", v: "Low", c: "#8b5cf6" }].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
            className="glass-card-sm p-3 text-center">
            <p className="text-sm font-bold" style={{ color: m.c }}>{m.v}</p>
            <p className="text-[10px] text-text-muted">{m.l}</p>
          </motion.div>
        ))}
      </div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
