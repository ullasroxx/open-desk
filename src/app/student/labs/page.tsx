"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import GlowOrb from "@/components/ui/GlowOrb";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { useCompiler, CompilerState } from "@/hooks/useCompiler";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

/* ── Language Configurations ────────────────────────────── */
interface LangConfig {
  id: string;
  label: string;
  monaco: string;
  icon: string;
  template: string;
}

const LANGUAGES: LangConfig[] = [
  {
    id: "c", label: "C", monaco: "c", icon: "🔵",
    template: `#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Hello, World!\\n");
    
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    printf("You entered: %d\\n", n);
    
    return 0;
}`,
  },
  {
    id: "cpp", label: "C++", monaco: "cpp", icon: "🟣",
    template: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    vector<int> v = {5, 3, 8, 1, 9, 2};
    sort(v.begin(), v.end());
    
    cout << "Sorted: ";
    for (int x : v) cout << x << " ";
    cout << endl;
    
    return 0;
}`,
  },
  {
    id: "python", label: "Python", monaco: "python", icon: "🟡",
    template: `# Python Program
def fibonacci(n):
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

name = input("Enter your name: ")
print(f"Hello, {name}!")

n = int(input("Fibonacci up to: "))
print(f"Fibonacci sequence: {fibonacci(n)}")`,
  },
  {
    id: "java", label: "Java", monaco: "java", icon: "🟠",
    template: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Hello, World!");
        
        int[] arr = {64, 25, 12, 22, 11};
        Arrays.sort(arr);
        System.out.println("Sorted: " + Arrays.toString(arr));
        
        sc.close();
    }
}`,
  },
  {
    id: "javascript", label: "JavaScript", monaco: "javascript", icon: "🟢",
    template: `// JavaScript Program
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const mid = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

const data = [38, 27, 43, 3, 9, 82, 10];
console.log("Original:", data);
console.log("Sorted:", quickSort(data));
console.log("Hello from OpenDesk!");`,
  },
];

/* ── Tabs ───────────────────────────────────────────────── */
const tabs = ["Code", "Theory", "Output", "AI Assistant", "Timeline", "Analytics"];

const theoryContent = {
  title: "Binary Search Tree (BST)",
  objectives: [
    "Understand BST properties and operations",
    "Implement insertion, deletion, and traversal",
    "Analyze time complexity of BST operations",
    "Compare BST with other tree structures",
  ],
  concepts: [
    { name: "BST Property", desc: "Left subtree < Root < Right subtree" },
    { name: "Insertion", desc: "O(log n) average, O(n) worst case" },
    { name: "Traversal", desc: "Inorder gives sorted sequence" },
  ],
};

/* ── Status Indicator Component ─────────────────────────── */
function StatusIndicator({ state }: { state: CompilerState }) {
  const config = {
    idle: { color: "bg-text-muted", label: "Ready", pulse: false },
    compiling: { color: "bg-accent-amber", label: "Compiling...", pulse: true },
    success: { color: "bg-accent-green", label: "Compiled", pulse: false },
    error: { color: "bg-red-500", label: "Error", pulse: false },
  };
  const c = config[state];
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <div className={`w-2 h-2 rounded-full ${c.color} ${c.pulse ? "animate-pulse" : ""}`} />
      <span className={state === "success" ? "text-accent-green" : state === "error" ? "text-red-400" : "text-text-muted"}>
        {c.label}
      </span>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function LabWorkspace() {
  const [activeTab, setActiveTab] = useState("Code");
  const [lang, setLang] = useState<LangConfig>(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [stdin, setStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{role: string; text: string}[]>([
    { role: "ai", text: "Hi! I'm your AI Mentor. I have real-time access to your code. How can I help you today?" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { toasts, show } = useToast();
  const compiler = useCompiler();
  const outputRef = useRef<HTMLPreElement>(null);
  const [autoSaveLabel, setAutoSaveLabel] = useState("Auto-saved");
  const [realtimeCompile, setRealtimeCompile] = useState(false);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [compiler.output]);

  // Realtime Compilation & Auto-save indicator
  useEffect(() => {
    setAutoSaveLabel("Saving...");
    const saveTimer = setTimeout(() => setAutoSaveLabel("Auto-saved"), 1000);
    
    let compileTimer: NodeJS.Timeout;
    if (realtimeCompile) {
      compileTimer = setTimeout(() => {
        compiler.execute(lang.id, code, stdin);
      }, 1500); // Wait 1.5s after typing stops to auto-compile
    }

    return () => {
      clearTimeout(saveTimer);
      if (compileTimer) clearTimeout(compileTimer);
    };
  }, [code, lang.id, stdin, realtimeCompile, compiler]);

  const handleLanguageChange = useCallback((newLang: LangConfig) => {
    setLang(newLang);
    setCode(newLang.template);
    compiler.reset();
  }, [compiler]);

  const handleRun = useCallback(async () => {
    show("▶ Compiling and running...", "info");
    await compiler.execute(lang.id, code, stdin);
  }, [lang.id, code, stdin, compiler, show]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  // Timeline from execution history
  const timelineEvents = compiler.history.map((r) => ({
    time: r.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    event: r.success ? `Successful run (${r.language})` : `Compilation error (${r.language})`,
    type: r.success ? "success" as const : "error" as const,
    exitCode: r.exitCode,
    duration: r.executionTimeMs,
  }));

  const handleSendAiMessage = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          code: code,
          language: lang.id,
          history: aiMessages
        })
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: "ai", text: data.reply || data.error }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "ai", text: "Network error connecting to AI." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 -m-2 md:-m-4">
      {/* Lab Header */}
      <div className="glass-card p-4 mx-2 md:mx-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/15 border border-accent-blue/25 flex items-center justify-center text-accent-blue font-bold text-sm">05</div>
          <div>
            <h1 className="text-lg font-bold">Lab Workspace — Live Compiler</h1>
            <p className="text-xs text-text-muted">Data Structures Lab • <span className="text-accent-cyan">⌘+Enter to run</span></p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <GlowOrb state={compiler.state === "compiling" ? "struggling" : compiler.state === "error" ? "distracted" : "flow"} size={32} />
          <StatusIndicator state={compiler.state} />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">{autoSaveLabel}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          </div>
          <button onClick={() => show("✅ Lab submitted successfully!", "success")} className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity">
            Submit Lab
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 md:px-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-bg-card text-accent-blue border border-border-default border-b-transparent"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mx-2 md:mx-4">
        {activeTab === "Code" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border-default rounded-xl overflow-hidden">
            {/* Editor Panel */}
            <div className="lg:col-span-2 bg-[#0d0d1a] min-h-[500px] flex flex-col">
              {/* Editor toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  {/* Language selector */}
                  <div className="ml-3 flex items-center gap-1">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => handleLanguageChange(l)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          lang.id === l.id
                            ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/30"
                            : "text-text-muted hover:text-text-secondary hover:bg-bg-hover"
                        }`}
                      >
                        <span className="mr-1">{l.icon}</span>{l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>{lang.label}</span>
                  <span>UTF-8</span>
                </div>
              </div>
              {/* Monaco Editor */}
              <div className="flex-1">
                <MonacoEditor
                  height="500px"
                  language={lang.monaco}
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  options={{
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono), monospace",
                    minimap: { enabled: true, scale: 1 },
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    renderLineHighlight: "gutter",
                    lineNumbers: "on",
                    tabSize: 4,
                    automaticLayout: true,
                  }}
                />
              </div>
              {/* Stdin toggle */}
              <AnimatePresence>
                {showStdin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border-default overflow-hidden"
                  >
                    <div className="px-4 py-1.5 text-[10px] text-text-muted bg-bg-secondary/30">Standard Input (stdin)</div>
                    <textarea
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Enter input values here, one per line..."
                      className="w-full bg-[#0d0d1a] text-xs text-text-primary font-mono p-4 outline-none resize-none placeholder:text-text-muted/40"
                      rows={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Output Panel */}
            <div className="border-l border-border-default bg-bg-secondary/30 flex flex-col">
              <div className="px-4 py-2 border-b border-border-default flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Console Output</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[10px] text-text-muted cursor-pointer hover:text-text-primary transition-colors border-r border-border-default pr-3 mr-1">
                    <input type="checkbox" checked={realtimeCompile} onChange={(e) => setRealtimeCompile(e.target.checked)} className="rounded border-border-default bg-bg-primary text-accent-blue focus:ring-accent-blue/50 w-3 h-3" />
                    Auto-Compile
                  </label>
                  <button
                    onClick={() => setShowStdin(!showStdin)}
                    className={`text-[10px] px-2 py-1 rounded transition-colors ${
                      showStdin ? "text-accent-cyan bg-accent-cyan/10" : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    ⌨ stdin
                  </button>
                  <button
                    onClick={() => { compiler.reset(); setCode(code); }}
                    className="text-[10px] text-text-muted px-2 py-1 rounded hover:bg-bg-hover transition-colors"
                  >
                    ✕ Clear
                  </button>
                  <button
                    onClick={handleRun}
                    disabled={compiler.state === "compiling"}
                    className="text-[10px] text-accent-green px-3 py-1 rounded bg-accent-green/10 hover:bg-accent-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-1.5"
                  >
                    {compiler.state === "compiling" ? (
                      <>
                        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block">⟳</motion.span>
                        Running...
                      </>
                    ) : (
                      <>▶ Run</>
                    )}
                  </button>
                </div>
              </div>

              {/* Output area */}
              <pre
                ref={outputRef}
                className={`flex-1 p-4 text-xs font-mono overflow-auto min-h-[400px] ${
                  compiler.state === "error" ? "text-red-400/90" : "text-accent-green/80"
                }`}
              >
                {compiler.state === "idle" && !compiler.output && (
                  <span className="text-text-muted/50">
                    {`Click ▶ Run or press ⌘+Enter to compile and execute your code.\n\nSupported languages: C, C++, Python, Java, JavaScript\n\nTip: Click "⌨ stdin" to provide input for scanf/cin/input()`}
                  </span>
                )}
                {compiler.state === "compiling" && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-accent-amber/80"
                  >
                    {`$ Compiling ${lang.label} code...\n`}
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                      ⣾ Please wait...
                    </motion.span>
                  </motion.span>
                )}
                {compiler.state !== "idle" && compiler.state !== "compiling" && compiler.output && (
                  <>
                    <span className="text-text-muted/60">{`$ ${lang.label.toLowerCase()} main.${lang.id === "python" ? "py" : lang.id === "javascript" ? "js" : lang.id === "java" ? "java" : lang.id === "cpp" ? "cpp" : "c"}\n\n`}</span>
                    {compiler.output}
                  </>
                )}
              </pre>

              {/* Status bar */}
              <div className="px-4 py-2 border-t border-border-default">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-4">
                    <StatusIndicator state={compiler.state} />
                    {compiler.result && (
                      <>
                        <span className="text-text-muted">Exit: <span className={compiler.result.exitCode === 0 ? "text-accent-green" : "text-red-400"}>{compiler.result.exitCode}</span></span>
                        <span className="text-text-muted">Time: <span className="text-accent-blue">{(compiler.result.executionTimeMs / 1000).toFixed(2)}s</span></span>
                      </>
                    )}
                  </div>
                  <span className="text-text-muted">Runs: {compiler.compilationCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Theory" && (
          <div className="glass-card p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold gradient-text mb-2">{theoryContent.title}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">Objectives</h3>
                  <ul className="space-y-2">
                    {theoryContent.objectives.map((obj, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                        <div className="w-5 h-5 rounded-md bg-accent-blue/15 flex items-center justify-center text-accent-blue text-[10px] font-bold">{i + 1}</div>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-secondary mb-2">Key Concepts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {theoryContent.concepts.map((c, i) => (
                      <div key={i} className="glass-card-sm p-4">
                        <p className="text-sm font-semibold text-accent-cyan mb-1">{c.name}</p>
                        <p className="text-xs text-text-muted">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Output" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Execution Results</h3>
            {compiler.result ? (
              <>
                <div className={`rounded-xl p-4 border ${compiler.result.success ? "bg-[#0d0d1a] border-accent-green/20" : "bg-red-950/20 border-red-500/20"}`}>
                  <pre className={`text-sm font-mono whitespace-pre-wrap ${compiler.result.success ? "text-accent-green/80" : "text-red-400/90"}`}>{compiler.output}</pre>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {[
                    { l: "Exit Code", v: String(compiler.result.exitCode), c: compiler.result.exitCode === 0 ? "#10b981" : "#ef4444" },
                    { l: "Execution Time", v: `${(compiler.result.executionTimeMs / 1000).toFixed(3)}s`, c: "#4f8fff" },
                    { l: "Language", v: `${compiler.result.language} ${compiler.result.version}`, c: "#8b5cf6" },
                  ].map((m, i) => (
                    <div key={i} className="glass-card-sm p-3 text-center">
                      <p className="text-lg font-bold" style={{ color: m.c }}>{m.v}</p>
                      <p className="text-[10px] text-text-muted">{m.l}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-text-muted text-sm">
                <p className="text-2xl mb-2">📭</p>
                <p>No execution results yet. Run your code first.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "AI Assistant" && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center text-xl">🧠</div>
              <div>
                <h3 className="text-sm font-semibold">Context-Aware AI Tutor</h3>
                <p className="text-[10px] text-accent-green">Analyzing your code in real-time</p>
              </div>
            </div>
            <div className="space-y-3 mb-4 overflow-y-auto max-h-[400px] pr-2">
              {aiMessages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className={`glass-card-sm p-4 rounded-xl border ${msg.role === "user" ? "border-accent-blue/20 bg-accent-blue/5" : "border-accent-purple/20 bg-accent-purple/5"}`}>
                  <p className="text-[10px] font-bold mb-1" style={{ color: msg.role === "user" ? "#4f8fff" : "#8b5cf6" }}>
                    {msg.role === "user" ? "You" : "AI Mentor"}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </motion.div>
              ))}
              {isAiTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-sm p-4 rounded-xl border border-accent-purple/20 bg-accent-purple/5">
                  <div className="flex gap-1 items-center h-4">
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-purple" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-purple" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-purple" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()} placeholder="Ask about your code..." className="flex-1 bg-bg-hover border border-border-default rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent-purple/40" disabled={isAiTyping} />
              <button onClick={handleSendAiMessage} disabled={isAiTyping || !aiInput.trim()} className="px-4 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold disabled:opacity-50 transition-opacity">Send</button>
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Execution History</h3>
            {timelineEvents.length > 0 ? (
              <div className="space-y-0">
                {timelineEvents.map((evt, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        evt.type === "success" ? "bg-accent-green border-accent-green/50" : "bg-red-500 border-red-500/50"
                      }`} />
                      {i < timelineEvents.length - 1 && <div className="w-px h-8 bg-border-default mt-1" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-primary font-medium">{evt.event}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-[10px] text-text-muted">{evt.time}</p>
                        <p className="text-[10px] text-text-muted">Exit: {evt.exitCode}</p>
                        <p className="text-[10px] text-text-muted">{(evt.duration / 1000).toFixed(2)}s</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-text-muted text-sm">
                <p className="text-2xl mb-2">⏱</p>
                <p>Run your code to see execution history here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Analytics" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Session Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Compilations", v: String(compiler.compilationCount), c: "#10b981" },
                { l: "Successful", v: String(compiler.history.filter((h) => h.success).length), c: "#4f8fff" },
                { l: "Errors", v: String(compiler.history.filter((h) => !h.success).length), c: "#ef4444" },
                { l: "Avg Time", v: compiler.history.length ? `${(compiler.history.reduce((a, h) => a + h.executionTimeMs, 0) / compiler.history.length / 1000).toFixed(2)}s` : "—", c: "#f59e0b" },
              ].map((m, i) => (
                <div key={i} className="glass-card-sm p-4 text-center">
                  <p className="text-xl font-bold" style={{ color: m.c }}>{m.v}</p>
                  <p className="text-[10px] text-text-muted">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Behavioral Tracker */}
      <motion.div className="fixed bottom-6 right-6 glass-card p-3 rounded-2xl z-30 hidden lg:flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
        <GlowOrb state={compiler.state === "compiling" ? "struggling" : "flow"} size={28} />
        <div className="text-[10px] text-text-muted">
          <p>Runs: <span className="text-accent-green font-semibold">{compiler.compilationCount}</span></p>
          <p>Lang: <span className="text-accent-blue font-semibold">{lang.label}</span></p>
        </div>
      </motion.div>
      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
