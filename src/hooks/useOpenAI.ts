/**
 * Basic OpenAI Hook
 * Simple hook for one-shot AI queries without conversation history.
 */

import { useState, useCallback } from "react";

interface UseOpenAIOptions {
  systemPrompt?: string;
  creative?: boolean;
  apiUrl?: string;
}

interface UseOpenAIReturn {
  response: string | null;
  isLoading: boolean;
  error: string | null;
  query: (prompt: string) => Promise<string | null>;
  reset: () => void;
}

const DEFAULT_API_URL =
  (import.meta as any).env?.VITE_LANGCHAIN_API_URL || "http://localhost:3002";

export function useOpenAI(options: UseOpenAIOptions = {}): UseOpenAIReturn {
  const {
    systemPrompt,
    creative = false,
    apiUrl = DEFAULT_API_URL,
  } = options;

  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(
    async (prompt: string): Promise<string | null> => {
      if (!prompt.trim()) return null;

      setIsLoading(true);
      setError(null);
      setResponse(null);

      try {
        const messages: Array<{ role: string; content: string }> = [];
        if (systemPrompt) {
          messages.push({ role: "system", content: systemPrompt });
        }
        messages.push({ role: "user", content: prompt });

        const res = await fetch(`${apiUrl}/api/langchain/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, creative }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Failed to get response");
        }

        setResponse(data.content);
        return data.content;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [systemPrompt, creative, apiUrl]
  );

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  return {
    response,
    isLoading,
    error,
    query,
    reset,
  };
}

export default useOpenAI;
