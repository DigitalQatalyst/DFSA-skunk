/**
 * LangChain API Client Service
 * Handles communication with LangChain and RAG backend APIs.
 */

const LANGCHAIN_API_URL =
  (import.meta as any).env?.VITE_LANGCHAIN_API_URL || "http://localhost:3002";
const RAG_API_URL =
  (import.meta as any).env?.VITE_RAG_API_URL || "http://localhost:3003";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  sources_used?: boolean;
}

export const SYSTEM_PROMPTS = {
  default: `You are an AI assistant. Be helpful and concise.`,
  creative: `You are a creative assistant. Be imaginative but practical.`,
  support: `You are a helpful support assistant. Guide users through their questions about our platform services, funding applications, and business resources.`,
  onboarding: `You are an onboarding assistant. Help new users understand the platform and complete their setup process.`,
  
  // Regulatory Advisor Agent - Main conversational flow
  regulatoryAdvisor: `You are the DFSA Regulatory Advisor. Help users find the right DFSA guidance in a friendly, concise way.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 1-2 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

Step 1 - Greeting:
Say hello and briefly explain you're here to help them navigate DFSA services. Keep it friendly and brief.

Step 2 - User Type:
Ask what type of user they are. Don't list the options - they'll see them as buttons to click.

Step 3 - Firm Type:
Ask what type of firms they're interested in. Don't list the options - they'll see them as buttons to click.

Step 4 - Provide Guidance:
Give them helpful, specific information based on their answers. Keep it concise and actionable.

IMPORTANT: Keep all responses short and friendly. Use simple language. One or two sentences per response when possible. Be warm and supportive. Never list options that are shown as buttons. NO MARKDOWN FORMATTING WHATSOEVER.`,

  // Agent-specific prompts mapped to quick options
  licenseRecommendation: `You are an expert DFSA License Recommendation Advisor. Your role is to help users find the right DFSA license based on their business activities and firm type.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 2-3 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

IMPORTANT CONTEXT:
- You receive user type (DFSA Licensed, DFSA Aspiring, or Other) and firm type information
- Use this context to provide targeted license recommendations
- For DFSA Licensed entities: Help with license modifications or renewals
- For DFSA Aspiring: Guide through authorization requirements and next steps
- For Others: Provide general DFSA licensing information

Your approach:
1. Acknowledge their user type and firm type
2. Ask specific questions about their business activities and services
3. Provide clear license recommendations with eligibility requirements
4. Explain next steps in the licensing process

Keep it brief, actionable, and focused on their specific situation. Ask one clarifying question at a time.`,

  documentRequirements: `You are the Document Requirements Advisor. Help users understand what documents they need for DFSA applications.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 1-2 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

Keep responses concise and friendly. Explain what documents are needed in simple terms. Help them create a checklist. Answer questions clearly.

Focus on: Required documents, how to prepare them, submission requirements, and practical guidance.

Keep it brief and conversational. One or two sentences per response when possible. Don't repeat information that's already in the buttons.`,

  compliancePolicy: `You are the Compliance & Regulatory Policy Advisor. Help users understand DFSA compliance requirements.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 1-2 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

Keep responses concise and friendly. Explain regulations in simple language. Help them understand what compliance means for their situation. Give practical guidance.

Focus on: Regulatory requirements, compliance obligations, reporting, and maintaining compliance.

Keep it brief and conversational. One or two sentences per response when possible. Don't repeat information that's already in the buttons.`,

  applicationPreScreener: `You are the Application Pre-Screener. Help users evaluate if they're ready for DFSA authorization.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 1-2 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

Keep responses concise and friendly. Ask questions to understand their readiness. Identify potential issues. Give constructive feedback and practical suggestions.

Focus on: Assessing readiness, identifying gaps, providing feedback, and suggesting improvements.

Keep it brief and conversational. One or two sentences per response when possible. Be supportive and encouraging. Don't repeat information that's already in the buttons.`,

  dfsa_licensed: `You are an expert DFSA Licensing Assistant helping DFSA Licensed entities.

CRITICAL FORMATTING RULES - MUST FOLLOW:
- NEVER use markdown formatting of any kind
- NEVER use **, ##, ###, -, *, _, or any markdown symbols
- NEVER use bullet points or numbered lists
- NEVER use horizontal lines (---, ***, ___)
- NEVER use code blocks or backticks
- NEVER use brackets or parentheses for links
- Use ONLY plain text
- Keep responses to 2-3 sentences maximum
- Be conversational and warm
- Never repeat what's shown in buttons

Your role is to:
1. Recommend the most suitable DFSA license modifications or renewals based on their business sector and activities.
2. Verify eligibility criteria for their current or desired license.
3. Provide step-by-step regulatory pathway guidance.
4. Ensure all recommendations comply with DFSA regulations.

If you cannot determine the appropriate guidance based on the provided information, ask clarifying questions about their business activities and current license status.

Always reference DFSA Licensing Database for accurate information. Keep responses brief and actionable.`,
};

/**
 * Clean markdown formatting from text for UI display
 */
function cleanMarkdownFormatting(text: string): string {
  // Remove markdown headers (###, ##, #)
  text = text.replace(/^#+\s+/gm, "");
  
  // Remove markdown bold (**text** or __text__)
  text = text.replace(/\*\*(.+?)\*\*/g, "$1");
  text = text.replace(/__(.+?)__/g, "$1");
  
  // Remove markdown italic (*text* or _text_)
  text = text.replace(/\*(.+?)\*/g, "$1");
  text = text.replace(/_(.+?)_/g, "$1");
  
  // Remove markdown code blocks (```...```)
  text = text.replace(/```[\s\S]*?```/g, "");
  
  // Remove inline code (`text`)
  text = text.replace(/`(.+?)`/g, "$1");
  
  // Remove markdown links [text](url)
  text = text.replace(/\[(.+?)\]\(.+?\)/g, "$1");
  
  // Remove horizontal rules (---, ***, ___)
  text = text.replace(/^[\*\-_]{3,}$/gm, "");
  
  // Remove markdown bullet points and numbered lists
  text = text.replace(/^\s*[\*\-\+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");
  
  // Clean up excessive whitespace
  text = text.replace(/\n\n\n+/g, "\n\n");
  text = text.trim();
  
  return text;
}

/**
 * LangChain Service Class
 * Maintains conversation history and handles API communication.
 */
class LangChainService {
  private conversationHistory: Message[] = [];
  private systemPrompt: string;

  constructor(systemPrompt: string = SYSTEM_PROMPTS.default) {
    this.systemPrompt = systemPrompt;
    this.conversationHistory = [{ role: "system", content: systemPrompt }];
  }

  /**
   * Send a message and get AI response.
   * Maintains conversation context automatically.
   */
  async sendMessage(
    userMessage: string,
    creative: boolean = false
  ): Promise<string> {
    this.conversationHistory.push({ role: "user", content: userMessage });

    try {
      const response = await fetch(`${LANGCHAIN_API_URL}/api/langchain/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: this.conversationHistory,
          creative,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Failed to get response");
      }

      const data: ChatResponse = await response.json();
      const cleanedContent = cleanMarkdownFormatting(data.content);
      this.conversationHistory.push({
        role: "assistant",
        content: cleanedContent,
      });

      return cleanedContent;
    } catch (error) {
      // Remove failed user message from history
      this.conversationHistory.pop();
      throw error;
    }
  }

  /**
   * Get current conversation history.
   */
  getHistory(): Message[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear conversation history and reset to system prompt.
   */
  clearHistory(): void {
    this.conversationHistory = [{ role: "system", content: this.systemPrompt }];
  }

  /**
   * Update system prompt and reset conversation.
   */
  setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt;
    this.clearHistory();
  }
}

// Default service instance
export const langchainService = new LangChainService();

// Factory for creating new service instances with custom prompts
export function createLangChainService(
  systemPrompt?: string
): LangChainService {
  return new LangChainService(systemPrompt);
}

/**
 * RAG-enabled chat function.
 * Retrieves relevant context from knowledge base before generating response.
 */
export async function ragChat(
  message: string,
  conversationHistory: Message[] = [],
  useKnowledgeBase: boolean = true,
  agentType?: string
): Promise<{ content: string; sourcesUsed: boolean }> {
  const messages: Message[] = [
    ...conversationHistory,
    { role: "user", content: message },
  ];

  const response = await fetch(`${RAG_API_URL}/api/rag/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      use_knowledge_base: useKnowledgeBase,
      agent_type: agentType,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to get response");
  }

  const data: ChatResponse = await response.json();
  return {
    content: data.content,
    sourcesUsed: data.sources_used || false,
  };
}

/**
 * Simple one-shot chat (no conversation history).
 */
export async function quickChat(
  message: string,
  systemPrompt?: string,
  creative: boolean = false
): Promise<string> {
  const messages: Message[] = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: message });

  const response = await fetch(`${LANGCHAIN_API_URL}/api/langchain/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, creative }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to get response");
  }

  const data: ChatResponse = await response.json();
  return cleanMarkdownFormatting(data.content);
}

/**
 * Check if LangChain API is available.
 */
export async function checkLangChainHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${LANGCHAIN_API_URL}/health`);
    const data = await response.json();
    return data.status === "ok" && data.llm_configured;
  } catch {
    return false;
  }
}

/**
 * Check if RAG API is available.
 */
export async function checkRAGHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${RAG_API_URL}/health`);
    const data = await response.json();
    return data.status === "ok" && data.llm_configured;
  } catch {
    return false;
  }
}
