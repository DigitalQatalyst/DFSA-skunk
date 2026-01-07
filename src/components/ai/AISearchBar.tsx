/**
 * AI Search Bar Component
 * Search bar with OpenAI-powered AI responses.
 */

import { useState, useRef } from "react";
import { Send, Loader2, X, MessageSquare, Trash2, Database } from "lucide-react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const OPENAI_API_URL =
  (import.meta as any).env?.VITE_OPENAI_API_URL || "http://localhost:3001";

async function openAIChat(
  message: string,
  conversationHistory: Message[] = [],
  systemPrompt?: string
): Promise<{ content: string }> {
  const messages: Message[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  
  messages.push(...conversationHistory, { role: "user", content: message });

  try {
    const response = await fetch(`${OPENAI_API_URL}/api/openai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      const errorMsg = error.detail || error.error || `HTTP ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return { content: data.content };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("[AISearchBar] Error:", errorMsg);
    throw new Error(`Failed to get response: ${errorMsg}`);
  }
}

interface AISearchBarProps {
  placeholder?: string;
  systemPrompt?: string;
  className?: string;
  onResponse?: (response: string) => void;
}

export function AISearchBar({
  placeholder = "Ask me anything...",
  systemPrompt,
  className = "",
  onResponse,
}: AISearchBarProps) {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [history, setHistory] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sourcesUsed, setSourcesUsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || isProcessing) return;

    const userPrompt = prompt;
    setPrompt("");
    setIsProcessing(true);
    setError(null);

    try {
      const result = await openAIChat(userPrompt, history, systemPrompt);

      setResponse(result.content);
      setSourcesUsed(false);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: userPrompt },
        { role: "assistant", content: result.content },
      ]);

      onResponse?.(result.content);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setResponse(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearConversation = () => {
    setHistory([]);
    setResponse(null);
    setError(null);
    inputRef.current?.focus();
  };

  const dismissResponse = () => {
    setResponse(null);
    setError(null);
  };

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {/* Input Area */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isProcessing}
          />
          {history.length > 0 && (
            <button
              onClick={clearConversation}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear conversation"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !prompt.trim()}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Conversation Count */}
      {history.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {history.length / 2} message{history.length > 2 ? "s" : ""} in
          conversation
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <X size={16} />
              <span className="font-medium">Error</span>
            </div>
            <button
              onClick={dismissResponse}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Response Display */}
      {response && !error && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-600" />
              <span className="font-medium text-gray-700">AI Response</span>
              {sourcesUsed && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                  <Database size={10} />
                  Knowledge Base
                </span>
              )}
            </div>
            <button
              onClick={dismissResponse}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
}

export default AISearchBar;
