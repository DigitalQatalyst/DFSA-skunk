import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, XIcon, MessageCircleIcon, Loader, Trash2, Copy, Check } from 'lucide-react';
import { createLangChainService, SYSTEM_PROMPTS } from '../services/langchainService';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  copied?: boolean;
}

export const ConversationalChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! 👋 How can I help?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatServiceRef = useRef(createLangChainService(SYSTEM_PROMPTS.support));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatServiceRef.current.sendMessage(inputValue);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: 'Hello! 👋 How can I help?',
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
    chatServiceRef.current.clearHistory();
  };

  const copyToClipboard = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, copied: true } : msg
      )
    );
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, copied: false } : msg
        )
      );
    }, 2000);
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  return (
    <>
      {/* Floating Chat Button - Small Icon Size */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Open chat"
          title="Chat with DFSA Assistant"
        >
          <MessageCircleIcon className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Floating Chat Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">DFSA Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-primary-dark rounded transition-colors"
              aria-label="Close chat"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container - Compact */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-white max-h-64">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-1 duration-200`}
              >
                <div className="flex flex-col gap-0.5 max-w-xs">
                  {/* Message Bubble - Compact */}
                  <div
                    className={`px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-br-none shadow-sm'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="leading-relaxed break-words whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>

                  {/* Message Actions - Show on hover */}
                  <div className={`flex items-center gap-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'assistant' && (
                      <>
                        <button
                          onClick={() => copyToClipboard(message.id, message.content)}
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          title="Copy message"
                        >
                          {message.copied ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="flex flex-col gap-0.5">
                  <div className="bg-gray-100 text-gray-900 border border-gray-200 px-3 py-2 rounded-lg rounded-bl-none flex items-center gap-1 shadow-sm">
                    <Loader className="w-3 h-3 animate-spin text-primary" />
                    <span className="text-xs">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Compact Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
            <div className="flex gap-1.5 mb-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask..."
                disabled={isLoading}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-xs"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <SendIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={clearChat}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-0.5 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
};
