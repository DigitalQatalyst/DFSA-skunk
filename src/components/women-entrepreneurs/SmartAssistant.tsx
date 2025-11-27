import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assistantData } from '../../data/womenEntrepreneurs/assistantData';
import { MessageCircleIcon, XIcon, SendIcon } from 'lucide-react';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}
const SmartAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Hello! How can I help you with your entrepreneurship journey today?'
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputValue
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    // Simulate assistant typing
    setIsTyping(true);
    // Find matching question or use default response
    const matchingQA = assistantData.find(qa => qa.question.toLowerCase().includes(inputValue.toLowerCase()));
    const responseContent = matchingQA ? matchingQA.answer : "I don't have specific information on that topic yet. Please try asking about funding, mentorship, networking, tech startups, or export assistance.";
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: responseContent
      }]);
    }, 1500);
  };
  return <>
      {/* Chat button */}
      <motion.button onClick={toggleAssistant} className={`fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg transition-all ${isOpen ? 'bg-red-500' : 'bg-primary'}`} whileHover={{
      scale: 1.1
    }} whileTap={{
      scale: 0.9
    }} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 1
    }}>
        {isOpen ? <XIcon className="h-6 w-6 text-white" /> : <MessageCircleIcon className="h-6 w-6 text-white" />}
      </motion.button>
      {/* Chat modal */}
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        y: 50,
        scale: 0.9
      }} animate={{
        opacity: 1,
        y: 0,
        scale: 1
      }} exit={{
        opacity: 0,
        y: 50,
        scale: 0.9
      }} className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-4 text-white">
              <h3 className="font-bold">Entrepreneurship Assistant</h3>
              <p className="text-xs opacity-80">
                Ask me about resources, funding, and support
              </p>
            </div>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm rounded-tl-none'}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>)}
              {isTyping && <div className="mb-4 flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg rounded-tl-none p-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{
                  animationDelay: '0.2s'
                }}></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{
                  animationDelay: '0.4s'
                }}></div>
                    </div>
                  </div>
                </div>}
              <div ref={messagesEndRef}></div>
            </div>
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex">
              <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Ask a question..." className="flex-1 py-2 px-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              <button type="submit" className={`bg-primary text-white p-2 rounded-r-lg transition-opacity ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'}`} disabled={!inputValue.trim()}>
                <SendIcon className="h-5 w-5" />
              </button>
            </form>
            {/* Footer */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Powered by Enterprise Journey
              </p>
            </div>
          </motion.div>}
      </AnimatePresence>
    </>;
};
export default SmartAssistant;