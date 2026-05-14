"use client";

import { useState, useCallback } from "react";

interface AiChatOptions {
  context: "mentor" | "lab_assistant" | "viva" | "reflection_analysis";
  submissionId?: string;
  codeSnippet?: string;
  behavioralState?: Record<string, unknown>;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * Hook for interacting with the AI chat API.
 * Manages local message state and streaming.
 */
export function useAiChat(options: AiChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message to local state
    const userMsg: Message = { role: "user", content: userMessage, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: options.context,
          submissionId: options.submissionId,
          codeSnippet: options.codeSnippet,
          behavioralState: options.behavioralState,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to get AI response");
      }

      const data = await res.json();

      const aiMsg: Message = { role: "assistant", content: data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
