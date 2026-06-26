"use client";

import { motion } from "framer-motion";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const labs = [
  { id: 1, name: "Data Structures - BST", variants: 3, completion: "42%", ai: "Adaptive", status: "Active" },
  { id: 2, name: "OS - CPU Scheduling", variants: 4, completion: "0%", ai: "Strict", status: "Draft" },
  { id: 3, name: "Networks - TCP/IP", variants: 2, completion: "100%", ai: "Full Assist", status: "Completed" },
];

export default function LabManagementPage() {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

    const { toasts, show } = useToast();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Lab Management</h1>
          <p className="text-sm text-text-muted">Create adaptive practical labs with AI behavioral rules</p>
        </div>
        <button onClick={() => show("Create Lab dialog coming soon!", "info")} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-bold shadow-lg hover:opacity-90">
          + Create New Lab
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lab List */}
        <motion.div variants={item} className="lg:col-span-2 space-y-3">
          {labs.map((lab, i) => (
            <div key={lab.id} className="glass-card p-5 hover:border-border-active transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-accent-pink transition-colors">{lab.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{lab.variants} Dataset Variants • {lab.ai} AI Rules</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                  lab.status === 'Active' ? 'bg-accent-green/20 text-accent-green' :
                  lab.status === 'Draft' ? 'bg-bg-hover text-text-muted' : 'bg-accent-blue/20 text-accent-blue'
                }`}>
                  {lab.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Completion Rate</span>
                <span className="text-xs font-bold text-text-primary">{lab.completion}</span>
              </div>
              <div className="w-full h-1.5 bg-bg-hover rounded-full overflow-hidden mt-2">
                <div className="h-full bg-accent-pink" style={{ width: lab.completion }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* AI Rule Configuration */}
        <motion.div variants={item} className="glass-card p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">AI Rule Presets</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-secondary border border-border-default">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-accent-green">Adaptive (Recommended)</span>
                <input type="radio" checked readOnly className="accent-accent-green" />
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                AI provides conceptual hints only. Direct code solutions are blocked unless struggle index &gt; 85%.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-bg-hover border border-border-default opacity-60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-accent-amber">Strict Validation</span>
                <input type="radio" readOnly className="accent-accent-amber" />
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                AI only reports compilation errors and test case failures. Zero conceptual hints.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
