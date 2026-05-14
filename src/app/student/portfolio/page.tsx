"use client";

import { motion } from "framer-motion";

const projects = [
  { id: 1, title: "Distributed Key-Value Store", tech: ["Go", "Raft", "gRPC"], type: "Capstone", rating: "Outstanding", desc: "A fault-tolerant distributed datastore using the Raft consensus algorithm." },
  { id: 2, title: "Neural Network from Scratch", tech: ["Python", "NumPy", "Math"], type: "Lab Project", rating: "Excellent", desc: "Implemented a multi-layer perceptron without using ML frameworks like PyTorch or TensorFlow." },
  { id: 3, title: "Real-time Chat Protocol", tech: ["C", "Sockets", "Pthreads"], type: "Assignment", rating: "Good", desc: "Custom binary protocol over TCP for real-time messaging with multiplexing." },
];

const achievements = [
  { icon: "🏆", title: "Top 1% Debugger", desc: "Resolved 50+ complex segmentation faults" },
  { icon: "🔥", title: "30-Day Streak", desc: "Consistent coding for an entire month" },
  { icon: "🧠", title: "Algorithmic Master", desc: "Solved all DP problems on first attempt" },
  { icon: "⚡", title: "Flow State Expert", desc: "Maintained deep focus for 4+ hours" },
];

export default function PortfolioPage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-[1200px]">
      {/* Header Profile */}
      <motion.div variants={item} className="glass-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-accent-purple/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-1">
            <div className="w-full h-full rounded-xl bg-bg-secondary flex items-center justify-center text-3xl font-bold">
              SJ
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <h1 className="text-3xl font-bold gradient-text">Sarah Jenkins</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-blue/15 text-accent-blue border border-accent-blue/30">Computer Science &apos;25</span>
            </div>
            <p className="text-sm text-text-secondary max-w-xl mb-4">
              Passionate about distributed systems and low-level programming. Top performer in OS and Data Structures labs with a 98% concept mastery score.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-xs text-text-muted flex items-center gap-1">📍 VTU Autonomous</span>
              <span className="text-xs text-text-muted flex items-center gap-1">⭐ 9.4 CGPA</span>
              <span className="text-xs text-accent-green flex items-center gap-1">🟢 Placement Ready</span>
            </div>
          </div>
          <div className="shrink-0 flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-bg-hover border border-border-default hover:border-accent-blue/50 text-sm font-medium transition-colors">
              Export PDF
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(79,143,255,0.3)]">
              Share Profile
            </button>
          </div>
        </div>
      </motion.div>

      {/* GitHub Style Contribution & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">Verified Academic Contributions</h3>
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[700px]">
              <div className="flex gap-1">
                {Array.from({ length: 52 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, row) => {
                      const rand = Math.random();
                      const opacity = rand > 0.8 ? 0.8 : rand > 0.6 ? 0.6 : rand > 0.3 ? 0.3 : 0.05;
                      return (
                        <div
                          key={row}
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: `rgba(16, 185, 129, ${opacity})` }}
                          title={`${Math.floor(rand * 10)} contributions`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-text-muted mt-2">
            <span>843 verified commits / submissions in the last year</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              {[0.05, 0.3, 0.6, 0.8].map((op, i) => (
                <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: `rgba(16, 185, 129, ${op})` }} />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Behavioral Badges</h3>
          <div className="space-y-3">
            {achievements.map((ach, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-bg-hover/50 border border-border-default">
                <div className="w-10 h-10 rounded-lg bg-bg-secondary flex items-center justify-center text-xl shrink-0">
                  {ach.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{ach.title}</p>
                  <p className="text-[10px] text-text-muted leading-tight mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Projects */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Project Archives</h3>
          <button className="text-xs text-accent-blue hover:underline">View All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj.id} className="glass-card-sm p-5 flex flex-col h-full hover:border-accent-purple/40 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] px-2 py-1 rounded bg-bg-secondary text-text-secondary border border-border-default">{proj.type}</span>
                <span className="text-[10px] text-accent-green font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  {proj.rating}
                </span>
              </div>
              <h4 className="text-base font-bold text-text-primary mb-2 group-hover:text-accent-purple transition-colors">{proj.title}</h4>
              <p className="text-xs text-text-secondary mb-6 flex-1 leading-relaxed">{proj.desc}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {proj.tech.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
