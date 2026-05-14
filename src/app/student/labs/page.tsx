"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import GlowOrb from "@/components/ui/GlowOrb";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const defaultCode = `#include <stdio.h>

// Lab 5: Implement Binary Search Tree
typedef struct Node {
    int data;
    struct Node *left, *right;
} Node;

Node* createNode(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    node->data = data;
    node->left = node->right = NULL;
    return node;
}

Node* insert(Node* root, int data) {
    if (root == NULL) return createNode(data);
    if (data < root->data)
        root->left = insert(root->left, data);
    else if (data > root->data)
        root->right = insert(root->right, data);
    return root;
}

void inorder(Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    Node* root = NULL;
    root = insert(root, 50);
    insert(root, 30);
    insert(root, 70);
    insert(root, 20);
    insert(root, 40);
    
    printf("Inorder traversal: ");
    inorder(root);
    return 0;
}`;

const outputText = `$ gcc bst.c -o bst && ./bst
Inorder traversal: 20 30 40 50 70

[Process completed with exit code 0]
[Time: 0.003s | Memory: 1.2MB]`;

const tabs = ["Theory", "Code", "Output", "AI Assistant", "Timeline", "Analytics"];

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

const timelineEvents = [
  { time: "2:00 PM", event: "Session started", type: "start" },
  { time: "2:05 PM", event: "Completed struct definition", type: "code" },
  { time: "2:12 PM", event: "Paused for 45s on insert()", type: "pause" },
  { time: "2:15 PM", event: "AI hint requested", type: "ai" },
  { time: "2:18 PM", event: "Completed insert function", type: "code" },
  { time: "2:22 PM", event: "First successful compilation", type: "success" },
  { time: "2:25 PM", event: "Added inorder traversal", type: "code" },
  { time: "2:28 PM", event: "All test cases passed", type: "success" },
];

export default function LabWorkspace() {
  const [activeTab, setActiveTab] = useState("Code");
  const [code, setCode] = useState(defaultCode);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 -m-2 md:-m-4">
      {/* Lab Header */}
      <div className="glass-card p-4 mx-2 md:mx-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/15 border border-accent-blue/25 flex items-center justify-center text-accent-blue font-bold text-sm">05</div>
          <div>
            <h1 className="text-lg font-bold">Binary Search Tree Implementation</h1>
            <p className="text-xs text-text-muted">Data Structures Lab • Due: Today 5:00 PM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <GlowOrb state="flow" size={32} />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-muted">Auto-saved</span>
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
          </div>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity">
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
            <div className="lg:col-span-2 bg-[#0d0d1a] min-h-[500px]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-default bg-bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <span className="text-[10px] text-text-muted ml-2">bst.c</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-muted">
                  <span>C</span>
                  <span>UTF-8</span>
                  <span>Ln 1, Col 1</span>
                </div>
              </div>
              <MonacoEditor
                height="500px"
                language="c"
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
                }}
              />
            </div>
            {/* Output Panel */}
            <div className="border-l border-border-default bg-bg-secondary/30 flex flex-col">
              <div className="px-4 py-2 border-b border-border-default flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary">Console Output</span>
                <button className="text-[10px] text-accent-green px-2 py-1 rounded bg-accent-green/10 hover:bg-accent-green/20 transition-colors">▶ Run</button>
              </div>
              <pre className="flex-1 p-4 text-xs text-accent-green/80 font-mono overflow-auto">{outputText}</pre>
              <div className="px-4 py-2 border-t border-border-default">
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-accent-green">● Compiled</span>
                  <span className="text-text-muted">Tests: 5/5 ✓</span>
                  <span className="text-text-muted">Memory: 1.2MB</span>
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
            <div className="bg-[#0d0d1a] rounded-xl p-4 border border-border-default">
              <pre className="text-sm text-accent-green/80 font-mono">{outputText}</pre>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[{ l: "Exit Code", v: "0", c: "#10b981" }, { l: "Execution Time", v: "0.003s", c: "#4f8fff" }, { l: "Memory Used", v: "1.2 MB", c: "#8b5cf6" }].map((m, i) => (
                <div key={i} className="glass-card-sm p-3 text-center">
                  <p className="text-lg font-bold" style={{ color: m.c }}>{m.v}</p>
                  <p className="text-[10px] text-text-muted">{m.l}</p>
                </div>
              ))}
            </div>
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
            <div className="space-y-3 mb-4">
              {[
                { role: "ai", text: "I see you're implementing a BST. Your insert() function looks correct! Let me check the edge cases..." },
                { role: "ai", text: "⚠️ You haven't included <stdlib.h> for malloc(). This may cause a warning." },
                { role: "ai", text: "💡 Tip: Consider adding a search() function to complete the BST operations." },
              ].map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
                  className="glass-card-sm p-4 rounded-xl">
                  <p className="text-xs text-text-secondary leading-relaxed">{msg.text}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ask about your code..." className="flex-1 bg-bg-hover border border-border-default rounded-xl px-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent-purple/40" />
              <button className="px-4 py-2.5 rounded-xl bg-accent-purple text-white text-xs font-semibold">Send</button>
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Session Timeline</h3>
            <div className="space-y-0">
              {timelineEvents.map((evt, i) => (
                <div key={i} className="flex items-start gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      evt.type === "success" ? "bg-accent-green border-accent-green/50" :
                      evt.type === "ai" ? "bg-accent-purple border-accent-purple/50" :
                      evt.type === "pause" ? "bg-accent-amber border-accent-amber/50" :
                      "bg-accent-blue border-accent-blue/50"
                    }`} />
                    {i < timelineEvents.length - 1 && <div className="w-px h-8 bg-border-default mt-1" />}
                  </div>
                  <div>
                    <p className="text-xs text-text-primary font-medium">{evt.event}</p>
                    <p className="text-[10px] text-text-muted">{evt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Analytics" && (
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-text-secondary mb-4">Session Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { l: "Time Spent", v: "28 min", c: "#4f8fff" },
                { l: "Keystrokes", v: "1,247", c: "#8b5cf6" },
                { l: "Compilations", v: "6", c: "#10b981" },
                { l: "AI Hints Used", v: "2", c: "#f59e0b" },
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
        <GlowOrb state="flow" size={28} />
        <div className="text-[10px] text-text-muted">
          <p>Focus: <span className="text-accent-green font-semibold">92%</span></p>
          <p>Typing: <span className="text-accent-blue font-semibold">Active</span></p>
        </div>
      </motion.div>
    </motion.div>
  );
}
