"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ParticleField from "@/components/ui/ParticleField";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary neural-grid relative overflow-hidden">
      <ParticleField count={80} />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <span className="text-lg font-bold gradient-text">OpenDesk</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Features</a>
          <a href="#dashboards" className="text-text-secondary hover:text-text-primary text-sm transition-colors">Dashboards</a>
          <a href="#ai" className="text-text-secondary hover:text-text-primary text-sm transition-colors">AI Engine</a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/student"
            className="text-sm font-medium bg-gradient-to-r from-accent-blue to-accent-purple text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-xs font-medium text-accent-blue">AI-Powered Academic Intelligence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-text-primary">The Future of</span>
            <br />
            <span className="gradient-text">Practical Learning</span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            An AI-native academic intelligence ecosystem that transforms labs, assignments, and assessments 
            into a behavior-aware, adaptive, measurable educational infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/student" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative flex items-center gap-2 bg-gradient-to-r from-accent-blue to-accent-purple text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
                <span>Student Dashboard</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
            <Link
              href="/faculty"
              className="flex items-center gap-2 glass-card-sm text-text-primary px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-bg-hover transition-all border border-border-default"
            >
              <span>Faculty Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <span>Admin Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Floating HUD Elements */}
        <motion.div
          className="absolute top-32 left-12 glass-card-sm px-4 py-3 hidden lg:block"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-[10px] text-accent-green font-semibold tracking-wider">LIVE TRACKING</span>
          </div>
          <p className="text-xs text-text-secondary">247 students in flow state</p>
        </motion.div>

        <motion.div
          className="absolute top-48 right-16 glass-card-sm px-4 py-3 hidden lg:block"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
            <span className="text-[10px] text-accent-purple font-semibold tracking-wider">AI MENTOR</span>
          </div>
          <p className="text-xs text-text-secondary">1,024 adaptive sessions today</p>
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-20 glass-card-sm px-4 py-3 hidden lg:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[10px] text-accent-cyan font-semibold tracking-wider">BEHAVIORAL AI</span>
          </div>
          <p className="text-xs text-text-secondary">Focus patterns analyzed</p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Intelligent Features</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Every feature is powered by behavioral intelligence and adaptive AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: "⚡",
              title: "Immersive Lab Workspace",
              desc: "VS Code-inspired coding battlestation with Monaco editor, live output, and AI assistance",
              color: "#4f8fff",
            },
            {
              icon: "🧠",
              title: "Behavioral Intelligence",
              desc: "Track focus, struggle patterns, typing rhythm, and cognitive load in real-time",
              color: "#8b5cf6",
            },
            {
              icon: "🤖",
              title: "AI Context Tutor",
              desc: "Adaptive AI that observes behavior, analyzes struggle patterns, and provides contextual guidance",
              color: "#00d4ff",
            },
            {
              icon: "📊",
              title: "Learning DNA Profile",
              desc: "Visual analytics for problem-solving, debugging persistence, AI dependency, and concept clarity",
              color: "#10b981",
            },
            {
              icon: "🎯",
              title: "AI Viva Simulation",
              desc: "Cinematic viva environment with AI interviewer, confidence meter, and live response analysis",
              color: "#ec4899",
            },
            {
              icon: "🏛️",
              title: "Institutional Intelligence",
              desc: "Command center for departments, faculty analytics, risk prediction, and compliance tracking",
              color: "#f59e0b",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, borderColor: feature.color + "40" }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-text-primary group-hover:text-accent-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              <div
                className="h-[1px] mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, ${feature.color}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboards" className="relative z-10 px-6 md:px-12 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Three Powerful Dashboards</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Role-specific intelligence centers designed for every stakeholder
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              role: "Student",
              desc: "Immersive learning environment with AI mentor, lab workspace, and behavioral analytics",
              href: "/student",
              gradient: "from-accent-blue to-accent-cyan",
              features: ["AI Mentor", "Lab Workspace", "Viva Practice", "Portfolio"],
            },
            {
              role: "Faculty",
              desc: "Academic intelligence command center with live monitoring and student analytics",
              href: "/faculty",
              gradient: "from-accent-purple to-accent-pink",
              features: ["Live Monitor", "Lab Management", "Viva Intelligence", "Grading"],
            },
            {
              role: "Admin",
              desc: "Institution-wide analytics, AI governance, compliance, and risk management",
              href: "/admin",
              gradient: "from-accent-amber to-accent-red",
              features: ["Dept Analytics", "AI Governance", "Compliance", "Risk Alerts"],
            },
          ].map((dash, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={dash.href} className="block group">
                <div className="glass-card p-8 text-center hover:border-border-active transition-all">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dash.gradient} mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                  >
                    {dash.role[0]}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{dash.role}</h3>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">{dash.desc}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {dash.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-3 py-1 rounded-full bg-bg-hover text-text-secondary border border-border-default"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 text-accent-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    Enter Dashboard →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="relative z-10 px-6 md:px-12 pb-32">
        <div className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🧠</div>
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Behavioral Intelligence Engine
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              Our AI doesn&apos;t just answer questions — it observes, adapts, and evolves with each student. 
              From focus detection to cognitive load analysis, every interaction is intelligent.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Focus Detection", value: "Real-time" },
                { label: "Cognitive Analysis", value: "Adaptive" },
                { label: "Struggle Patterns", value: "Predictive" },
                { label: "Learning DNA", value: "Personal" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="glass-card-sm p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-accent-blue text-sm font-bold mb-1">{item.value}</p>
                  <p className="text-xs text-text-muted">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border-default px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              </svg>
            </div>
            <span className="text-sm font-semibold gradient-text">OpenDesk</span>
          </div>
          <p className="text-xs text-text-muted">
            AI-Powered Academic Intelligence Ecosystem · Built for the future of education
          </p>
        </div>
      </footer>
    </div>
  );
}
