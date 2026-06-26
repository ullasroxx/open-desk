"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useToast, ToastContainer } from "@/components/ui/Toast";

const initialMessages = [
  { role: "ai", text: "Welcome back! I noticed you spent some time reviewing Graph Traversals yesterday. Are you ready to tackle the related assignment, or do you need a quick concept refresh?", time: "09:00 AM" },
  { role: "user", text: "I'm a bit stuck on the difference between BFS and DFS implementation.", time: "09:02 AM" },
  { role: "ai", text: "Great question! \n\nThe core difference lies in the data structure used to track the next nodes to visit:\n\n• **BFS uses a Queue** (FIFO). It visits all neighbors of a node before going deeper.\n• **DFS uses a Stack** (LIFO, or recursion which implicitly uses the call stack). It goes as deep as possible down one path before backtracking.\n\nShould we write out a quick pseudo-code comparison?", time: "09:02 AM" },
];

export default function MentorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const { toasts, show } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    
    const newHistory = [...messages, { role: "user", text: userMsg, time: now }];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          code: "", // General mentor chat, no specific code context yet
          language: "general",
          history: newHistory.slice(0, -1) // pass everything before the new user msg
        })
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, {
        role: "ai",
        text: data.reply || data.error || "I'm having trouble connecting to my knowledge base right now.",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: "ai",
        text: "Network error connecting to the AI Mentor.",
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-[calc(100vh-6rem)] gap-6 max-w-[1400px]">
      
      {/* Main Chat Area */}
      <div className="flex-1 glass-card flex flex-col overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-blue" />
        
        {/* Chat Header */}
        <div className="p-4 border-b border-border-default flex items-center justify-between bg-bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(79,143,255,0.2)]">
              🤖
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">Athena - AI Academic Mentor</h2>
              <p className="text-[10px] text-accent-green flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" /> Always Learning
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setMessages(initialMessages); show("Chat context cleared", "info"); }} className="px-3 py-1.5 rounded-lg bg-bg-hover text-xs font-medium text-text-secondary hover:text-text-primary transition-colors border border-border-default">
              Clear Context
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i < 3 ? i * 0.1 : 0 }}
              className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div className="shrink-0 mt-1">
                {msg.role === "ai" ? (
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-sm border border-accent-blue/30">🤖</div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center text-sm border border-border-default font-bold">U</div>
                )}
              </div>
              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-accent-blue text-white rounded-tr-sm" 
                    : "glass-card-sm border-border-default rounded-tl-sm text-text-secondary"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-text-muted mt-1 px-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[85%]">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center text-sm border border-accent-blue/30">🤖</div>
              </div>
              <div className="flex items-start">
                <div className="glass-card-sm border-border-default rounded-tl-sm p-4 rounded-2xl flex gap-1 items-center h-10">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-blue" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-blue" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-accent-blue" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-bg-secondary/50 border-t border-border-default">
          <div className="relative flex items-center">
            <button onClick={() => show("📎 File attachment coming soon", "info")} className="absolute left-3 text-text-muted hover:text-accent-blue transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Athena to explain a concept, debug your code, or review a past lab..." 
              className="w-full bg-bg-primary border border-border-default rounded-xl pl-10 pr-12 py-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent-blue/50 focus:shadow-[0_0_10px_rgba(79,143,255,0.1)] transition-all"
            />
            <button onClick={handleSend} className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan text-white shadow-md hover:opacity-90 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Behavioral Context */}
      <div className="w-80 hidden xl:flex flex-col gap-4">
        <div className="glass-card p-5">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"/> Active Context
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-bg-hover border border-border-default">
              <p className="text-[10px] text-text-muted mb-1">Current Focus Topic</p>
              <p className="text-xs font-medium text-accent-cyan">Graph Theory & Traversals</p>
            </div>
            <div className="p-3 rounded-lg bg-bg-hover border border-border-default">
              <p className="text-[10px] text-text-muted mb-1">Detected Emotion/State</p>
              <p className="text-xs font-medium text-text-primary flex items-center gap-1">🤔 Slightly Confused (Code Pauses)</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex-1">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Suggested Actions</h3>
          <div className="space-y-2">
            {[
              "Generate visual tree trace",
              "Review yesterday's mistake",
              "Give me a related mini-quiz",
              "Explain like I'm 5"
            ].map((action, i) => (
              <button key={i} onClick={() => { setInput(action); show(`Selected: ${action}`, "info"); }} className="w-full text-left p-3 rounded-lg bg-bg-hover border border-border-default hover:border-accent-blue/40 hover:bg-accent-blue/5 transition-colors text-xs text-text-secondary hover:text-accent-blue">
                → {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </motion.div>
  );
}
