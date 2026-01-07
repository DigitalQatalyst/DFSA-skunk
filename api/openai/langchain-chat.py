import os
import warnings
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_openai import AzureChatOpenAI

warnings.filterwarnings("ignore", category=UserWarning, module="langchain_core._api.deprecation")
load_dotenv()

app = FastAPI(title="LangChain Chat API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Config
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4-32k")
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

if not endpoint or not api_key:
    raise ValueError("Azure OpenAI credentials missing")

llm = AzureChatOpenAI(temperature=0.0, azure_deployment=deployment, azure_endpoint=endpoint, api_key=api_key, api_version=api_version)
creative_llm = AzureChatOpenAI(temperature=0.9, azure_deployment=deployment, azure_endpoint=endpoint, api_key=api_key, api_version=api_version)

# Models
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    creative: Optional[bool] = False

class ChatResponse(BaseModel):
    content: str
    model: str

# Routes
@app.post("/api/langchain/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        msg_map = {"system": SystemMessage, "user": HumanMessage, "assistant": AIMessage}
        lc_messages = [msg_map[msg.role](content=msg.content) for msg in request.messages]
        selected_llm = creative_llm if request.creative else llm
        response = selected_llm.invoke(lc_messages)
        return ChatResponse(content=response.content, model=deployment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok", "model": deployment}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("FASTAPI_PORT", os.getenv("PORT", 3002)))
    uvicorn.run(app, host="0.0.0.0", port=port)
