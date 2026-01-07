import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, XIcon, Loader, Trash2, Copy, Check, ArrowLeft, Lightbulb } from 'lucide-react';
import { createLangChainService, SYSTEM_PROMPTS, ragChat } from '../services/langchainService';
import { LicenseRecommendationCard } from './LicenseRecommendationCard';
import { FeeInfoDisplay } from './FeeInfoDisplay';
import { StepsCarousel } from './StepsCarousel';
import { parseLicenseRecommendation } from '../utils/responseParser';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  copied?: boolean;
  quickOptions?: QuickOption[];
  userTypeOptions?: UserTypeOption[];
  firmTypeOptions?: FirmTypeOption[];
  licenseCards?: LicenseCard[];
  feeInfo?: FeeInfo[];
  steps?: Step[];
}

interface QuickOption {
  id: string;
  label: string;
  message: string;
  icon?: string;
  promptKey?: keyof typeof SYSTEM_PROMPTS;
}

interface UserTypeOption {
  id: string;
  label: string;
  value: string;
  description: string;
}

interface FirmTypeOption {
  id: string;
  label: string;
  value: string;
  description: string;
}

interface LicenseCard {
  id: string;
  title: string;
  description: string;
  minCapital?: string;
  eligibility: string[];
  nextSteps: string[];
}

interface FeeInfo {
  id: string;
  type: string;
  amount: string;
  description: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  details?: string[];
}

interface FullScreenChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  systemPrompt?: string;
  sectionPromptKey?: keyof typeof SYSTEM_PROMPTS;
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    id: '1',
    label: '🏢 Find Your License',
    message: 'I need help finding the right DFSA license for my business',
    icon: '🏢',
    promptKey: 'licenseRecommendation',
  },
  {
    id: '2',
    label: '📋 What Documents Do I Need?',
    message: 'What documents do I need to prepare for my DFSA application?',
    icon: '📋',
    promptKey: 'documentRequirements',
  },
  {
    id: '3',
    label: '⚖️ Regulations & Compliance',
    message: 'Tell me about compliance requirements and regulatory policies',
    icon: '⚖️',
    promptKey: 'compliancePolicy',
  },
  {
    id: '4',
    label: '✅ Check My Application',
    message: 'Can you review my application for potential issues?',
    icon: '✅',
    promptKey: 'applicationPreScreener',
  },
];

const USER_TYPE_OPTIONS: UserTypeOption[] = [
  {
    id: 'licensed',
    label: 'DFSA Licensed',
    value: 'DFSA Licensed',
    description: 'Already regulated by DFSA',
  },
  {
    id: 'aspiring',
    label: 'DFSA Aspiring',
    value: 'DFSA Aspiring',
    description: 'New applicant seeking authorization',
  },
  {
    id: 'other',
    label: 'Other',
    value: 'Other',
    description: 'General inquiries',
  },
];

const FIRM_TYPE_OPTIONS: FirmTypeOption[] = [
  {
    id: 'authorised',
    label: 'DFSA Authorised Firms',
    value: 'DFSA Authorised Firms',
    description: 'Licensed financial institutions',
  },
  {
    id: 'dnfbp',
    label: 'DFSA DNFBPs',
    value: 'DFSA DNFBPs',
    description: 'Designated Non-Financial Businesses and Professions',
  },
  {
    id: 'market',
    label: 'DFSA Market Institution',
    value: 'DFSA Market Institution',
    description: 'Stock exchanges and market operators',
  },
  {
    id: 'auditors',
    label: 'Auditors',
    value: 'Auditors',
    description: 'External auditors and audit firms',
  },
  {
    id: 'unsure',
    label: 'Unsure',
    value: 'Unsure',
    description: 'Not sure about firm type',
  },
];

export const FullScreenChat: React.FC<FullScreenChatProps> = ({
  isOpen,
  onClose,
  initialMessage = '',
  systemPrompt = SYSTEM_PROMPTS.support,
  sectionPromptKey,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! 👋 I\'m your DFSA Regulatory Advisor. I\'m here to help you navigate DFSA services and find the right guidance for your situation.\n\nLet\'s start by understanding what type of user you are.',
      sender: 'assistant',
      timestamp: new Date(),
      userTypeOptions: USER_TYPE_OPTIONS,
    },
  ]);
  const [inputValue, setInputValue] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [currentSection, setCurrentSection] = useState<string | null>(sectionPromptKey || null);
  const [conversationStep, setConversationStep] = useState<'greeting' | 'user-type' | 'firm-type' | 'services'>('greeting');
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const [selectedFirmType, setSelectedFirmType] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  
  // Store conversation history for each agent
  const agentConversationsRef = useRef<Record<string, {
    messages: ChatMessage[];
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
  }>>({});
  
  // Determine which prompt to use - default to Regulatory Advisor
  const effectivePrompt = sectionPromptKey 
    ? SYSTEM_PROMPTS[sectionPromptKey] 
    : (systemPrompt === SYSTEM_PROMPTS.support ? SYSTEM_PROMPTS.regulatoryAdvisor : systemPrompt);
  
  const chatServiceRef = useRef(createLangChainService(effectivePrompt));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // If there's an initial message, send it
      if (initialMessage && messages.length === 1) {
        setTimeout(() => {
          setInputValue(initialMessage);
        }, 100);
      }
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string, optionId?: string, optionType?: 'userType' | 'firmType' | 'quickOption') => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim() && !optionId) return;

    // If this is a quick option, switch to that section's prompt
    if (optionId && optionType === 'quickOption') {
      const selectedOption = QUICK_OPTIONS.find(opt => opt.id === optionId);
      if (selectedOption?.promptKey && selectedOption.promptKey !== currentSection) {
        // Save current agent's conversation
        if (currentSection) {
          agentConversationsRef.current[currentSection] = {
            messages,
            history: conversationHistoryRef.current,
          };
        }

        // Switch to new agent
        setCurrentSection(selectedOption.promptKey);
        setConversationStep('services');
        chatServiceRef.current = createLangChainService(SYSTEM_PROMPTS[selectedOption.promptKey]);
        
        // Restore or initialize conversation for new agent
        if (agentConversationsRef.current[selectedOption.promptKey]) {
          const savedConversation = agentConversationsRef.current[selectedOption.promptKey];
          setMessages(savedConversation.messages);
          conversationHistoryRef.current = savedConversation.history;
        } else {
          // First time visiting this agent
          const greetingMessage: ChatMessage = {
            id: (Date.now() + 0.5).toString(),
            content: `Great! I'm here to help you find the right DFSA license. You're a ${selectedUserType} interested in ${selectedFirmType}. Tell me more about your specific business activities and services.`,
            sender: 'assistant',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, greetingMessage]);
          conversationHistoryRef.current = [];
        }
      }
    }
    if (optionType === 'userType') {
      const selected = USER_TYPE_OPTIONS.find(opt => opt.id === optionId);
      if (selected) {
        setSelectedUserType(selected.value);
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content: selected.value,
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        
        // If DFSA Licensed is selected, show brief description and firm type options
        if (selected.id === 'licensed') {
          setCurrentSection('dfsa_licensed');
          setConversationStep('firm-type');
          chatServiceRef.current = createLangChainService(SYSTEM_PROMPTS.dfsa_licensed);
          
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: 'As a DFSA Licensed entity, you\'re already regulated by the Dubai Financial Services Authority. I can help you with license modifications, compliance updates, and regulatory guidance. Which type of firm are you?',
            sender: 'assistant',
            timestamp: new Date(),
            firmTypeOptions: FIRM_TYPE_OPTIONS,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          setConversationStep('firm-type');
          setIsLoading(true);

          try {
            const response = await chatServiceRef.current.sendMessage(
              `User selected: ${selected.value}. Now ask them about the type of firms they are enquiring about.`
            );
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              content: response,
              sender: 'assistant',
              timestamp: new Date(),
              firmTypeOptions: FIRM_TYPE_OPTIONS,
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
        }
        return;
      }
    }

    // Handle firm type selection
    if (optionType === 'firmType') {
      const selected = FIRM_TYPE_OPTIONS.find(opt => opt.id === optionId);
      if (selected) {
        setSelectedFirmType(selected.value);
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          content: selected.value,
          sender: 'user',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setConversationStep('services');

        // Create a brief description based on user type and firm type
        let briefDescription = '';
        if (selectedUserType === 'DFSA Licensed') {
          briefDescription = `You're a DFSA Licensed ${selected.value}. I can help you with compliance updates, license modifications, and regulatory guidance specific to your firm type.`;
        } else if (selectedUserType === 'DFSA Aspiring') {
          briefDescription = `You're looking to become a DFSA Aspiring ${selected.value}. I can guide you through the authorization process, requirements, and next steps.`;
        } else {
          briefDescription = `You're interested in ${selected.value}. I can provide information about DFSA services and regulatory requirements for your firm type.`;
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: briefDescription,
          sender: 'assistant',
          timestamp: new Date(),
          quickOptions: QUICK_OPTIONS,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowQuickOptions(false);
    setIsLoading(true);

    try {
      // Build context message if switching to license recommendation
      let messageToSend = textToSend;
      if (optionId === '1' && optionType === 'quickOption') {
        // "Find Your License" option - include user and firm type context
        messageToSend = `I'm a ${selectedUserType} entity interested in ${selectedFirmType}. ${textToSend}`;
      }

      let response: string;
      
      // Use RAG for license recommendation agent
      if (currentSection === 'licenseRecommendation') {
        const ragResult = await ragChat(
          messageToSend,
          conversationHistoryRef.current,
          true,
          'license_recommendation'
        );
        response = ragResult.content;
        // Update conversation history for RAG
        conversationHistoryRef.current.push({ role: 'user', content: messageToSend });
        conversationHistoryRef.current.push({ role: 'assistant', content: response });
        
        // Parse response for structured data
        const parsed = parseLicenseRecommendation(response);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: parsed.mainMessage,
          sender: 'assistant',
          timestamp: new Date(),
          licenseCards: parsed.licenseCards && parsed.licenseCards.length > 0 ? parsed.licenseCards : undefined,
          feeInfo: parsed.feeInfo && parsed.feeInfo.length > 0 ? parsed.feeInfo : undefined,
          steps: parsed.steps && parsed.steps.length > 0 ? parsed.steps : undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Use regular LangChain service for other agents
        response = await chatServiceRef.current.sendMessage(messageToSend);
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
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
        content: 'Hello! 👋 I\'m your DFSA Regulatory Advisor. I\'m here to help you navigate DFSA services and find the right guidance for your situation.\n\nLet\'s start by understanding what type of user you are.',
        sender: 'assistant',
        timestamp: new Date(),
        userTypeOptions: USER_TYPE_OPTIONS,
      },
    ]);
    setShowQuickOptions(false);
    setCurrentSection(null);
    setConversationStep('greeting');
    setSelectedUserType(null);
    setSelectedFirmType(null);
    conversationHistoryRef.current = [];
    agentConversationsRef.current = {}; // Clear all agent conversations
    chatServiceRef.current = createLangChainService(SYSTEM_PROMPTS.regulatoryAdvisor);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4">
      <div className="relative z-50 flex flex-col bg-white rounded-2xl shadow-2xl animate-in fade-in scale-in duration-300 w-full max-w-2xl h-[95vh] max-h-[700px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary-dark to-primary-dark text-white p-4 flex items-center justify-between flex-shrink-0 shadow-lg rounded-t-2xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-xl">DFSA Assistant</h2>
              <p className="text-sm text-primary-light">
                {currentSection ? `${QUICK_OPTIONS.find(opt => opt.promptKey === currentSection)?.label || 'General'} • Powered by AI` : 'Powered by AI'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-dark rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex flex-col gap-2 max-w-2xl">
                {/* Message Bubble */}
                <div
                  className={`px-6 py-4 rounded-2xl transition-all duration-200 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none border border-gray-200 hover:bg-gray-150'
                  }`}
                >
                  <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {/* User Type Options */}
                {message.userTypeOptions && message.userTypeOptions.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-xs font-medium text-gray-600 px-2">Select your user type:</div>
                    {message.userTypeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSendMessage(undefined, option.id, 'userType')}
                        disabled={isLoading}
                        className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Firm Type Options */}
                {message.firmTypeOptions && message.firmTypeOptions.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-xs font-medium text-gray-600 px-2">Select firm type:</div>
                    {message.firmTypeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSendMessage(undefined, option.id, 'firmType')}
                        disabled={isLoading}
                        className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Options - Show after agent understands user */}
                {message.quickOptions && message.quickOptions.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-medium">Available services:</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {message.quickOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSendMessage(option.message, option.id, 'quickOption')}
                          disabled={isLoading}
                          className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                {option.label}
                              </p>
                              <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                {option.message}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* License Recommendation Cards */}
                {message.licenseCards && message.licenseCards.length > 0 && (
                  <LicenseRecommendationCard
                    cards={message.licenseCards}
                    onSelect={(cardId) => {
                      const card = message.licenseCards?.find(c => c.id === cardId);
                      if (card) {
                        handleSendMessage(`I want to proceed with the ${card.title} license`);
                      }
                    }}
                  />
                )}

                {/* Fee Information Display */}
                {message.feeInfo && message.feeInfo.length > 0 && (
                  <FeeInfoDisplay fees={message.feeInfo} />
                )}

                {/* Steps Carousel */}
                {message.steps && message.steps.length > 0 && (
                  <StepsCarousel steps={message.steps} />
                )}

                {/* Message Actions */}
                <div className={`flex items-center gap-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.sender === 'assistant' && (
                    <>
                      <button
                        onClick={() => copyToClipboard(message.id, message.content)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copy message"
                      >
                        {message.copied ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Quick Options - Show only at start */}
          {showQuickOptions && messages.length === 1 && !isLoading && (
            <div className="flex flex-col gap-3 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="text-sm font-medium">Quick options:</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {QUICK_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSendMessage(option.message, option.id)}
                    disabled={isLoading}
                    className="text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{option.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                          {option.label}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                          {option.message}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex flex-col gap-2">
                <div className="bg-gray-100 text-gray-900 border border-gray-200 px-6 py-4 rounded-2xl rounded-bl-none flex items-center gap-3 shadow-sm">
                  <Loader className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-base">DFSA Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0 shadow-lg rounded-b-2xl">
          {/* Agent Switcher - Show after user classification */}
          {conversationStep === 'services' && (
            <div className="mb-2 pb-2 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-2 px-2">Switch Agent (conversations are saved):</div>
              <div className="flex justify-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleSendMessage(undefined, '1', 'quickOption')}
                  className={`px-3 py-2 text-xs rounded-full transition-all font-medium whitespace-nowrap flex items-center gap-1 ${
                    currentSection === 'licenseRecommendation'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Your conversation will be saved and restored when you return"
                >
                  📋 Find Your License
                  {currentSection === 'licenseRecommendation' && agentConversationsRef.current['licenseRecommendation'] && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
                <button
                  onClick={() => handleSendMessage(undefined, '2', 'quickOption')}
                  className={`px-3 py-2 text-xs rounded-full transition-all font-medium whitespace-nowrap flex items-center gap-1 ${
                    currentSection === 'documentRequirements'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Your conversation will be saved and restored when you return"
                >
                  📄 What Documents Do I Need?
                  {currentSection === 'documentRequirements' && agentConversationsRef.current['documentRequirements'] && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
                <button
                  onClick={() => handleSendMessage(undefined, '3', 'quickOption')}
                  className={`px-3 py-2 text-xs rounded-full transition-all font-medium whitespace-nowrap flex items-center gap-1 ${
                    currentSection === 'compliancePolicy'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Your conversation will be saved and restored when you return"
                >
                  ⚖️ Regulations & Compliance
                  {currentSection === 'compliancePolicy' && agentConversationsRef.current['compliancePolicy'] && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
                <button
                  onClick={() => handleSendMessage(undefined, '4', 'quickOption')}
                  className={`px-3 py-2 text-xs rounded-full transition-all font-medium whitespace-nowrap flex items-center gap-1 ${
                    currentSection === 'applicationPreScreener'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Your conversation will be saved and restored when you return"
                >
                  ✅ Check My Application
                  {currentSection === 'applicationPreScreener' && agentConversationsRef.current['applicationPreScreener'] && (
                    <span className="text-xs">✓</span>
                  )}
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              aria-label="Send message"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={clearChat}
            className="w-full text-xs text-gray-500 hover:text-gray-700 py-1 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
