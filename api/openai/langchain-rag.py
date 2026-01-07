import os
import warnings
import re
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_openai import AzureChatOpenAI
from kb_loader import get_kb

warnings.filterwarnings("ignore", category=UserWarning, module="langchain_core._api.deprecation")
load_dotenv()

app = FastAPI(title="LangChain RAG API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Config
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4-32k")
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

if not endpoint or not api_key:
    raise ValueError("Azure OpenAI credentials missing")

llm = AzureChatOpenAI(temperature=0.0, azure_deployment=deployment, azure_endpoint=endpoint, api_key=api_key, api_version=api_version)

# Load knowledge base (PDFs + defaults)
KB = get_kb()

# Models
class Message(BaseModel):
    role: str
    content: str

class RAGRequest(BaseModel):
    messages: List[Message]
    use_knowledge_base: Optional[bool] = True
    agent_type: Optional[str] = None  # e.g., "license_recommendation", "regulatory_advisor"

class RAGResponse(BaseModel):
    content: str
    model: str
    sources_used: bool

def search_kb(query: str, top_k: int = 3, agent_type: Optional[str] = None) -> tuple[str, bool]:
    """Search knowledge base by keyword matching"""
    query_lower = query.lower()
    results = [(sum(1 for word in query_lower.split() if word in doc["content"].lower()), doc) for doc in KB]
    results = sorted([r for r in results if r[0] > 0], key=lambda x: x[0], reverse=True)
    
    # For license recommendation agent, prioritize DFSA Fee Module Reference Guide
    if agent_type == "license_recommendation":
        fee_docs = [r for r in results if "fee" in r[1]["topic"].lower() or "fee" in r[1]["source"].lower()]
        other_docs = [r for r in results if r not in fee_docs]
        results = fee_docs + other_docs
    
    if not results:
        return "", False
    context = "\n\n".join([f"[{doc['topic']}] {doc['content']}" for _, doc in results[:top_k]])
    return context, True

# Routes
def clean_markdown(text: str) -> str:
    """Remove markdown formatting from text"""
    # Remove markdown headers (###, ##, #)
    text = text.replace("###", "").replace("##", "").replace("#", "")
    
    # Remove markdown bold (**text** or __text__)
    import re
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'__(.+?)__', r'\1', text)
    
    # Remove markdown italic (*text* or _text_)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    text = re.sub(r'_(.+?)_', r'\1', text)
    
    # Remove markdown code blocks (```...```)
    text = re.sub(r'```[\s\S]*?```', '', text)
    
    # Remove inline code (`text`)
    text = re.sub(r'`(.+?)`', r'\1', text)
    
    # Remove markdown links [text](url)
    text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
    
    # Remove horizontal rules (---, ***, ___)
    text = re.sub(r'^[\*\-_]{3,}$', '', text, flags=re.MULTILINE)
    
    # Remove markdown bullet points and numbered lists
    text = re.sub(r'^\s*[\*\-\+]\s+', '', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+', '', text, flags=re.MULTILINE)
    
    # Clean up excessive whitespace
    text = re.sub(r'\n\n\n+', '\n\n', text)
    text = text.strip()
    
    return text

@app.post("/api/rag/chat", response_model=RAGResponse)
async def rag_chat(request: RAGRequest):
    try:
        context, sources_used = "", False
        if request.use_knowledge_base and request.messages:
            last_msg = next((msg.content for msg in reversed(request.messages) if msg.role == "user"), None)
            if last_msg:
                context, sources_used = search_kb(last_msg, agent_type=request.agent_type)
        
        system_content = "You are a helpful AI assistant."
        
        # Customize system prompt based on agent type
        if request.agent_type == "license_recommendation":
            system_content = """You are an expert DFSA Licensing Assistant. Your role is to:
1. Recommend the most suitable DFSA license based on the applicant's business sector and activities.
2. Verify eligibility criteria for the recommended license.
3. Provide step-by-step regulatory pathway guidance.
4. Include relevant fee information from the DFSA Fee Module Reference Guide.
5. Ensure all recommendations comply with DFSA regulations.

CRITICAL: Never use markdown formatting. Use only plain text. No **, ##, ###, -, *, _, or any markdown symbols.

RESPONSE FORMAT:
When recommending licenses, structure your response as follows:

RECOMMENDED LICENSE: [License Name]
Description: [Brief description of the license]
Minimum Capital: [Amount in AED]

ELIGIBILITY CRITERIA:
• [Criterion 1]
• [Criterion 2]
• [Criterion 3]

FEES:
Application Fee: [Amount]
Annual License Fee: [Amount]

NEXT STEPS:
Step 1: [First step description]
Step 2: [Second step description]
Step 3: [Third step description]

If you cannot determine the appropriate license based on the provided information, ask clarifying questions about the applicant's business activities and sector.

Always reference the DFSA Licensing Database and Fee Module for accurate information."""
        elif request.agent_type == "regulatory_advisor":
            system_content = """You are an expert DFSA Regulatory Advisor. Your role is to:
1. Provide guidance on DFSA regulatory requirements and compliance.
2. Explain regulatory frameworks and their implications.
3. Offer strategic advice on regulatory matters.
4. Ensure all guidance complies with current DFSA regulations."""
        
        if context:
            system_content += f"\n\nContext from Knowledge Base:\n{context}"
        
        msg_map = {"system": SystemMessage, "user": HumanMessage, "assistant": AIMessage}
        lc_messages = [SystemMessage(content=system_content)] + [msg_map[msg.role](content=msg.content) for msg in request.messages if msg.role != "system"]
        
        response = llm.invoke(lc_messages)
        
        # Clean markdown for license recommendation agent
        content = response.content
        if request.agent_type == "license_recommendation":
            content = clean_markdown(content)
        
        return RAGResponse(content=content, model=deployment, sources_used=sources_used)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model": deployment}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3003)))
