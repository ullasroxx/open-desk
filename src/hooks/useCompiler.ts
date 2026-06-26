"use client";

import { useState, useCallback, useRef } from "react";

export interface CompileResult {
  success: boolean;
  output: string;
  exitCode: number;
  signal: string | null;
  executionTimeMs: number;
  language: string;
  version: string;
  truncated: boolean;
}

export interface ExecutionRecord {
  id: number;
  timestamp: Date;
  language: string;
  success: boolean;
  exitCode: number;
  executionTimeMs: number;
  outputPreview: string;
}

export type CompilerState = "idle" | "compiling" | "success" | "error";

let recordId = 0;

export function useCompiler() {
  const [state, setState] = useState<CompilerState>("idle");
  const [result, setResult] = useState<CompileResult | null>(null);
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState<ExecutionRecord[]>([]);
  const [compilationCount, setCompilationCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (language: string, code: string, stdin?: string) => {
    // Abort any ongoing request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState("compiling");
    setOutput("");
    setResult(null);

    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, stdin }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        const errorOutput = data.error || "Unknown error occurred";
        setOutput(errorOutput);
        setResult({ success: false, output: errorOutput, exitCode: -1, signal: null, executionTimeMs: 0, language, version: "", truncated: false });
        return;
      }

      const compileResult: CompileResult = data;
      setResult(compileResult);
      setOutput(compileResult.output || "(No output)");
      setState(compileResult.success ? "success" : "error");
      setCompilationCount((c) => c + 1);

      // Add to history
      setHistory((prev) => [
        {
          id: ++recordId,
          timestamp: new Date(),
          language: compileResult.language,
          success: compileResult.success,
          exitCode: compileResult.exitCode,
          executionTimeMs: compileResult.executionTimeMs,
          outputPreview: (compileResult.output || "").substring(0, 80),
        },
        ...prev,
      ].slice(0, 20));
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setState("error");
      setOutput("Failed to connect to the compilation service.");
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setResult(null);
    setOutput("");
  }, []);

  return { state, result, output, history, compilationCount, execute, reset };
}
