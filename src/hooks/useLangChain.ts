/**
 * React Hook for LangChain Chat
 * Provides stateful chat functionality with conversation history.
 */

import { useState, useCallback, useRef } from "react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface UseLangChainOptions {
  systemPrompt?: string;
  creative?: boolean;
  apiUrl?: string;
}

interface UseLangChainReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setSystemPrompt: (prompt: string) => void;
}

const DEFAULT_API_URL =
  (import.meta as any).env?.VITE_LANGCHAIN_API_URL || "http://localhost:3002";

export function useLangChain(
  options: UseLangChainOptions = {}
): UseLangChainReturn {
  const {
    systemPrompt: initialSystemPrompt,
    creative = false,
    apiUrl = DEFAULT_API_URL,
  } = options;

  const systemPromptRef = useRef(initialSystemPrompt);

  const [messages, setMessages] = useState<Message[]>(() =>
    initialSystemPrompt
      ? [{ role: "system", content: initialSystemPrompt }]
      : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = { role: "user", content };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}/api/langchain/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            creative,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Failed to get response");
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        // Remove failed user message
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, creative, apiUrl]
  );

  const clearMessages = useCallback(() => {
    setMessages(
      systemPromptRef.current
        ? [{ role: "system", content: systemPromptRef.current }]
        : []
    );
    setError(null);
  }, []);

  const setSystemPrompt = useCallback((prompt: string) => {
    systemPromptRef.current = prompt;
    setMessages(prompt ? [{ role: "system", content: prompt }] : []);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setSystemPrompt,
  };
}

export default useLangChain;
