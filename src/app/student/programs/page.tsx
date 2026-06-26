"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { labPrograms, LabProgram } from "@/lib/data/lab-programs";
import Link from "next/link";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const languages = [
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "python", name: "Python" }
];

export default function LabProgramsPage() {
  const [activeLang, setActiveLang] = useState("java");
  const [selectedProgram, setSelectedProgram] = useState<LabProgram | null>(null);
  const { toasts, show } = useToast();

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  const currentPrograms = labPrograms.filter(p => p.lang === activeLang);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    show("Code copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-2">VTU <span className="gradient-text">Lab Programs</span> 📘</h1>
          <p className="text-text-secondary text-sm">Browse, learn, and execute standard university lab programs.</p>
        </div>
      </motion.div>

      {/* Language Selector */}
      <div className="flex gap-2 p-1.5 bg-bg-secondary/50 border border-border-default rounded-xl w-fit">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => { setActiveLang(lang.id); setSelectedProgram(null); }}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeLang === lang.id
                ? "bg-accent-blue text-white shadow-md"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program List */}
        <motion.div variants={container} initial="hidden" animate="show" className="glass-card p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2 ml-2">Available Programs ({currentPrograms.length})</h2>
          {currentPrograms.map((program) => (
            <motion.button
              variants={item}
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedProgram?.id === program.id
                  ? "bg-accent-blue/10 border-accent-blue/50"
                  : "bg-bg-primary border-border-default hover:border-accent-blue/30 hover:bg-bg-hover"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-accent-blue">Program {program.id.replace(/[a-zA-Z]+/, '')}</span>
              </div>
              <h3 className="text-sm font-medium text-text-primary truncate">{program.title}</h3>
            </motion.button>
          ))}
        </motion.div>

        {/* Program Viewer */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[70vh]">
          {selectedProgram ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProgram.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary mb-2">{selectedProgram.title}</h2>
                    <p className="text-sm text-text-secondary">{selectedProgram.description}</p>
                  </div>
                  <Link href="/student/labs" className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Open in Compiler
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
                  {/* Code Block */}
                  <div className="flex flex-col h-full bg-bg-secondary rounded-xl border border-border-default overflow-hidden relative group">
                    <div className="flex justify-between items-center px-4 py-2 bg-bg-primary/50 border-b border-border-default">
                      <span className="text-[10px] uppercase font-bold text-text-muted">Source Code</span>
                      <button onClick={() => copyToClipboard(selectedProgram.code)} className="text-text-muted hover:text-accent-blue transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </div>
                    <pre className="p-4 overflow-auto text-xs text-text-secondary flex-1 font-mono leading-relaxed">
                      <code>{selectedProgram.code}</code>
                    </pre>
                  </div>

                  {/* YouTube Video Reference */}
                  <div className="flex flex-col h-full">
                    <h3 className="text-[10px] uppercase font-bold text-text-muted mb-2">Reference Tutorial</h3>
                    <div className="flex-1 bg-black rounded-xl border border-border-default overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${selectedProgram.videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted opacity-50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
              <p className="text-sm">Select a program from the left to view its code and video tutorial.</p>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer toasts={toasts} />
    </div>
  );
}
