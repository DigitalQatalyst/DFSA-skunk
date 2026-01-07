/**
 * Floating Chat Widget Component
 * Expandable chat interface for AI assistance.
 */

import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Trash2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useLangChain } from "../../hooks/useLangChain";
import { SYSTEM_PROMPTS } from "../../services/langchainService";

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left";
  systemPrompt?: string;
  title?: string;
  subtitle?: string;
}

export function ChatWidget({
  position = "bottom-right",
  systemPrompt = SYSTEM_PROMPTS.support,
  title = "AI Assistant",
  subtitle = "How can I help you today?",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages } =
    useLangChain({
      systemPrompt,
      creative: false,
    });

  // Filter out system messages for display
  const displayMessages = messages.filter((m) => m.role !== "system");

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const positionClasses =
    position === "bottom-right" ? "right-4" : "left-4";

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 ${positionClasses} z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105`}
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 ${positionClasses} z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all ${
        isMinimized ? "h-14" : "h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            {!isMinimized && (
              <p className="text-xs text-blue-100">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-500 rounded"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-500 rounded"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {displayMessages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                <MessageSquare
                  size={32}
                  className="mx-auto mb-2 text-gray-300"
                />
                <p>Start a conversation!</p>
                <p className="text-xs mt-1">
                  Ask me anything about our services.
                </p>
              </div>
            )}

            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              {displayMessages.length > 0 && (
                <button
                  type="button"
                  onClick={clearMessages}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default ChatWidget;
