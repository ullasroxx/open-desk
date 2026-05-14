"use client";

import { useCallback, useRef, useEffect, useState } from "react";

interface BehavioralMetrics {
  totalKeystrokes: number;
  totalPauses: number;
  totalDeletions: number;
  totalPastes: number;
  totalTabSwitches: number;
  focusScore: number;
  confusionIndex: number;
  lastKeystrokeAt: number;
}

type LearningState = "flow" | "struggling" | "distracted" | "idle";

/**
 * Hook that tracks real-time behavioral signals during a lab session.
 * Buffers events and flushes to the server every `flushIntervalMs`.
 */
export function useBehavioralTracker(submissionId: string | null, flushIntervalMs: number = 10_000) {
  const metricsRef = useRef<BehavioralMetrics>({
    totalKeystrokes: 0,
    totalPauses: 0,
    totalDeletions: 0,
    totalPastes: 0,
    totalTabSwitches: 0,
    focusScore: 80,
    confusionIndex: 20,
    lastKeystrokeAt: Date.now(),
  });

  const eventsBuffer = useRef<Array<{ event_type: string; data: Record<string, unknown> }>>([]);
  const [learningState, setLearningState] = useState<LearningState>("idle");

  // Track keystrokes
  const trackKeystroke = useCallback((key: string) => {
    const now = Date.now();
    const gap = now - metricsRef.current.lastKeystrokeAt;

    metricsRef.current.totalKeystrokes++;
    metricsRef.current.lastKeystrokeAt = now;

    // Detect pause (> 5 seconds between keystrokes)
    if (gap > 5000) {
      metricsRef.current.totalPauses++;
      eventsBuffer.current.push({ event_type: "pause", data: { duration_ms: gap } });
    }

    // Detect deletion spikes
    if (key === "Backspace" || key === "Delete") {
      metricsRef.current.totalDeletions++;
    }

    // Update focus score (decays on pauses, increases on consistent typing)
    if (gap < 3000) {
      metricsRef.current.focusScore = Math.min(100, metricsRef.current.focusScore + 0.1);
    } else {
      metricsRef.current.focusScore = Math.max(0, metricsRef.current.focusScore - 2);
    }
  }, []);

  // Track paste events
  const trackPaste = useCallback(() => {
    metricsRef.current.totalPastes++;
    eventsBuffer.current.push({ event_type: "paste", data: { timestamp: Date.now() } });
  }, []);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        metricsRef.current.totalTabSwitches++;
        metricsRef.current.focusScore = Math.max(0, metricsRef.current.focusScore - 5);
        eventsBuffer.current.push({ event_type: "tab_switch", data: { hidden: true } });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Compute and update learning state
  const computeState = useCallback((): LearningState => {
    const m = metricsRef.current;
    if (m.totalTabSwitches > 10 || m.focusScore < 30) return "distracted";
    if (m.confusionIndex > 60 || (m.totalDeletions > 20 && m.totalPauses > 10)) return "struggling";
    if (m.focusScore > 70 && m.confusionIndex < 30) return "flow";
    return "idle";
  }, []);

  // Flush events to server
  const flush = useCallback(async () => {
    if (!submissionId) return;

    const state = computeState();
    setLearningState(state);

    const events = [...eventsBuffer.current];
    eventsBuffer.current = [];

    try {
      await fetch("/api/behavioral/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          events,
          sessionUpdate: {
            focus_score: Math.round(metricsRef.current.focusScore),
            confusion_index: metricsRef.current.confusionIndex,
            total_keystrokes: metricsRef.current.totalKeystrokes,
            total_pauses: metricsRef.current.totalPauses,
            total_deletions: metricsRef.current.totalDeletions,
            total_pastes: metricsRef.current.totalPastes,
            total_tab_switches: metricsRef.current.totalTabSwitches,
          },
        }),
      });
    } catch {
      // Silently fail — don't interrupt the student
    }
  }, [submissionId, computeState]);

  // Periodic flush
  useEffect(() => {
    const interval = setInterval(flush, flushIntervalMs);
    return () => clearInterval(interval);
  }, [flush, flushIntervalMs]);

  // Track compile/run events
  const trackCompile = useCallback((success: boolean, errorCount: number) => {
    eventsBuffer.current.push({
      event_type: "compile",
      data: { success, error_count: errorCount, timestamp: Date.now() },
    });
    if (!success) {
      metricsRef.current.confusionIndex = Math.min(100, metricsRef.current.confusionIndex + 5);
    } else {
      metricsRef.current.confusionIndex = Math.max(0, metricsRef.current.confusionIndex - 10);
    }
  }, []);

  // Track AI hint usage
  const trackAiHint = useCallback(() => {
    eventsBuffer.current.push({ event_type: "ai_hint", data: { timestamp: Date.now() } });
  }, []);

  return {
    learningState,
    metrics: metricsRef.current,
    trackKeystroke,
    trackPaste,
    trackCompile,
    trackAiHint,
    flush,
  };
}
